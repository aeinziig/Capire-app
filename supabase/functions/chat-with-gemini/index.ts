// @ts-ignore
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { rateLimitMiddleware } from '../middleware/rateLimiter.ts'

const geminiApiKey = Deno.env.get('GEMINI_API_KEY') || ''
// @ts-ignore
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
// @ts-ignore
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseServiceKey)
const MAX_MESSAGE_LENGTH = 1500
const MAX_HISTORY_TURNS = 8

type ChatTurn = {
  text: string
  isUser: boolean
}

type CapstoneHit = {
  id: string
  title: string | null
  author: string | null
  year: number | null
  department: string | null
  abstract: string | null
  keywords: string[] | null
  similarity?: number | null
}

const checkRateLimit = rateLimitMiddleware((req: any) => {
  const ip = req.headers.get('x-forwarded-for') ||
    req.headers.get('x-real-ip') ||
    req.headers.get('remote-addr') ||
    'unknown-ip'
  const authKey = (req.headers.get('authorization') || 'anon').slice(0, 32)
  return `${ip}:${authKey}`
})

// @ts-ignore
serve(async (req: any) => {
  const rateLimitResponse = checkRateLimit(req)
  if (rateLimitResponse) {
    return rateLimitResponse
  }

  try {
    if (!geminiApiKey) {
      return json({ error: 'GEMINI_API_KEY is not configured.' }, 500)
    }

    const { message, history, role } = await req.json()

    if (!message || typeof message !== 'string' || !message.trim()) {
      return json({ error: 'message is required.' }, 400)
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return json({ error: `message must not exceed ${MAX_MESSAGE_LENGTH} characters.` }, 400)
    }

    const sanitizedMessage = sanitizeChatText(message)
    if (!sanitizedMessage) {
      return json({ error: 'message is empty after sanitization.' }, 400)
    }

    const safeHistory = Array.isArray(history)
      ? history
        .filter((item) => item && typeof item.text === 'string' && typeof item.isUser === 'boolean')
        .slice(-MAX_HISTORY_TURNS)
        .map((item) => ({
          text: sanitizeChatText(item.text).slice(0, MAX_MESSAGE_LENGTH),
          isUser: item.isUser,
        }))
        .filter((item) => item.text.length > 0) as ChatTurn[]
      : []

    const safeRole = sanitizeRole(role)
    const capstoneContext = await findRelevantCapstones(sanitizedMessage)

    const contents = [
      ...safeHistory.map((item) => ({
        role: item.isUser ? 'user' : 'model',
        parts: [{ text: item.text }],
      })),
      {
        role: 'user',
        parts: [{ text: sanitizedMessage }],
      },
    ]

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': geminiApiKey,
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [
            {
              text: [
                'You are the CAPIRE research assistant for a capstone archive app.',
                `Current user role: ${safeRole}.`,
                'Help with capstone topics, abstract refinement, originality advice, keyword suggestions, citations, research framing, and next steps.',
                'Keep answers concise, practical, and supportive.',
                'If asked about originality, do not claim a database match unless the app already provided one.',
                'Do not invent citations or fake database records.',
                'If capstone context is provided below, use only that real archive data when mentioning specific capstones.',
                capstoneContext,
              ].join(' '),
            },
          ],
        },
        contents,
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          maxOutputTokens: 800,
          thinkingConfig: {
            thinkingBudget: 0,
          },
        },
      }),
    })

    const payload = await response.json()
    if (!response.ok) {
      throw new Error(payload?.error?.message || 'Gemini request failed.')
    }

    const reply = payload?.candidates?.[0]?.content?.parts
      ?.map((part: { text?: string }) => part.text || '')
      .join('')
      .trim()

    if (!reply) {
      throw new Error('Gemini returned an empty response.')
    }

    return json({ reply })
  } catch (error) {
    return json({ error: (error as any).message }, 500)
  }
})

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function sanitizeChatText(value: string) {
  return value
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/[<>`]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function sanitizeRole(value: unknown) {
  const normalized = typeof value === 'string' ? value.trim().toLowerCase() : ''
  return ['student', 'faculty', 'administrator', 'researcher'].includes(normalized)
    ? normalized
    : 'student'
}

async function findRelevantCapstones(message: string) {
  if (wantsArchiveListing(message)) {
    const { data, error } = await supabase
      .from('capstone_projects')
      .select('id, title, author, year, department')
      .order('year', { ascending: false })
      .order('title', { ascending: true })
      .limit(50)

    if (error || !Array.isArray(data) || data.length === 0) {
      return 'Live capstone archive inventory: no capstones found in the archive.'
    }

    return buildCapstoneInventoryContext(data as CapstoneHit[])
  }

  const semanticMatches = await findSemanticCapstones(message)
  if (semanticMatches.length > 0) {
    return buildCapstoneContext(
      'Live semantic capstone context from the archive',
      semanticMatches
    )
  }

  const keywords = extractKeywords(message)
  if (keywords.length === 0) {
    return 'Live capstone context: none requested.'
  }

  let query = supabase
    .from('capstone_projects')
    .select('id, title, author, year, department, abstract, keywords')
    .limit(5)

  const searchClauses = keywords.flatMap((keyword) => ([
    `title.ilike.%${escapeLike(keyword)}%`,
    `abstract.ilike.%${escapeLike(keyword)}%`,
  ]))

  if (searchClauses.length > 0) {
    query = query.or(searchClauses.join(','))
  }

  const { data, error } = await query
  if (error || !Array.isArray(data) || data.length === 0) {
    return 'Live capstone context: no matching capstones found in the archive.'
  }

  return buildCapstoneContext('Live keyword capstone context from the archive', data as CapstoneHit[])
}

function extractKeywords(message: string) {
  const stopWords = new Set([
    'a', 'about', 'an', 'and', 'are', 'can', 'capstone', 'for', 'from', 'give', 'ideas', 'in', 'is',
    'list', 'me', 'need', 'of', 'on', 'project', 'research', 'search', 'show', 'the', 'to', 'with',
  ])

  return [...new Set(
    message
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((word) => word.length > 2 && !stopWords.has(word))
  )].slice(0, 6)
}

function escapeLike(value: string) {
  return value.replace(/[%_]/g, '')
}

function wantsArchiveListing(message: string) {
  const normalized = message.toLowerCase()
  return (
    (normalized.includes('all capstone') || normalized.includes('all 24 capstone') || normalized.includes('list all capstone')) &&
    (normalized.includes('title') || normalized.includes('titles') || normalized.includes('archive'))
  )
}

async function findSemanticCapstones(message: string) {
  const { count } = await supabase
    .from('capstone_projects')
    .select('*', { count: 'exact', head: true })
    .not('embedding', 'is', null)

  if (!count || count < 3) {
    return []
  }

  const embedding = await embedQuery(message)
  if (!embedding) {
    return []
  }

  const { data: matches, error: matchError } = await supabase.rpc('match_capstone_projects', {
    query_embedding: `[${embedding.join(',')}]`,
    match_count: 5,
  })

  if (matchError || !Array.isArray(matches) || matches.length === 0) {
    return []
  }

  const strongMatches = matches.filter((match: { similarity?: number | null }) => (match.similarity || 0) >= 0.6)
  if (strongMatches.length === 0) {
    return []
  }

  const ids = strongMatches.map((match: { id: string }) => match.id)
  const { data: capstones, error: capstoneError } = await supabase
    .from('capstone_projects')
    .select('id, title, author, year, department, abstract, keywords')
    .in('id', ids)

  if (capstoneError || !Array.isArray(capstones)) {
    return []
  }

  const byId = new Map((capstones as CapstoneHit[]).map((capstone) => [capstone.id, capstone]))
  return strongMatches
    .map((match: { id: string; similarity?: number | null }) => {
      const capstone = byId.get(match.id)
      return capstone ? { ...capstone, similarity: match.similarity || null } : null
    })
    .filter(Boolean) as CapstoneHit[]
}

async function embedQuery(message: string) {
  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2:embedContent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': geminiApiKey,
    },
    body: JSON.stringify({
      model: 'models/gemini-embedding-2',
      content: {
        parts: [{ text: message }],
      },
      output_dimensionality: 768,
    }),
  })

  const payload = await response.json()
  if (!response.ok) {
    return null
  }

  const values = payload?.embedding?.values || payload?.embeddings?.[0]?.values
  return Array.isArray(values) && values.length === 768 ? values : null
}

function buildCapstoneContext(prefix: string, capstones: CapstoneHit[]) {
  const context = capstones.map((capstone, index) => {
    const keywordsText = Array.isArray(capstone.keywords) && capstone.keywords.length > 0
      ? ` Keywords: ${capstone.keywords.join(', ')}.`
      : ''
    const abstractText = capstone.abstract?.trim()
      ? ` Abstract: ${capstone.abstract.trim().slice(0, 280)}${capstone.abstract.trim().length > 280 ? '...' : ''}`
      : ''
    const similarityText = typeof capstone.similarity === 'number'
      ? ` Similarity: ${Math.round(capstone.similarity * 100)}%.`
      : ''

    return `${index + 1}. Title: ${capstone.title || 'Untitled'}. Author: ${capstone.author || 'Unknown'}. Year: ${capstone.year || 'Unknown'}. Department: ${capstone.department || 'Unknown'}.${similarityText}${keywordsText}${abstractText}`
  })

  return `${prefix}: ${context.join(' ')}`
}

function buildCapstoneInventoryContext(capstones: CapstoneHit[]) {
  const titles = capstones.map((capstone, index) => (
    `${index + 1}. ${capstone.title || 'Untitled'} (${capstone.year || 'Unknown'}, ${capstone.department || 'Unknown'})`
  ))

  return `Live capstone archive inventory (${capstones.length} total): ${titles.join(' ')}`
}
