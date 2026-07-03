// @ts-ignore
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { rateLimitMiddleware } from '../middleware/rateLimiter.ts'

// @ts-ignore
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
// @ts-ignore
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const geminiApiKey = Deno.env.get('GEMINI_API_KEY') || ''

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const checkRateLimit = rateLimitMiddleware((req: any) => {
  return req.headers.get('x-forwarded-for') ||
    req.headers.get('x-real-ip') ||
    req.headers.get('remote-addr') ||
    'unknown-ip'
})

type CapstoneRow = {
  id: string
  title: string | null
  abstract: string | null
  author: string | null
  year: number | null
  keywords: string[] | null
}

// @ts-ignore
serve(async (req: any) => {
  const rateLimitResponse = checkRateLimit(req)
  if (rateLimitResponse) {
    return rateLimitResponse
  }

  try {
    const { capstone_id } = await req.json()

    if (!capstone_id || typeof capstone_id !== 'string') {
      return json({ error: 'capstone_id is required.' }, 400)
    }

    if (!geminiApiKey) {
      return json({ error: 'GEMINI_API_KEY is not configured in Supabase Edge Functions.' }, 500)
    }

    const { data: capstone, error: capstoneError } = await supabase
      .from('capstone_projects')
      .select('id, title, abstract, author, year, keywords')
      .eq('id', capstone_id)
      .single()

    if (capstoneError || !capstone) {
      throw capstoneError || new Error('Capstone not found.')
    }

    const embeddingInput = buildEmbeddingInput(capstone as CapstoneRow)
    if (!embeddingInput.trim()) {
      return json({ error: 'Capstone has no content to embed.' }, 400)
    }

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2:embedContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': geminiApiKey,
      },
      body: JSON.stringify({
        model: 'models/gemini-embedding-2',
        content: {
          parts: [
            {
              text: `title: ${capstone.title || 'none'} | text: ${embeddingInput}`,
            },
          ],
        },
        output_dimensionality: 768,
      }),
    })

    const payload = await response.json()
    if (!response.ok) {
      throw new Error(payload?.error?.message || 'Gemini embedding request failed.')
    }

    const values = payload?.embedding?.values || payload?.embeddings?.[0]?.values
    if (!Array.isArray(values) || values.length !== 768) {
      throw new Error('Gemini returned an invalid embedding payload.')
    }

    const embeddingLiteral = `[${values.join(',')}]`
    const { error: updateError } = await supabase
      .from('capstone_projects')
      .update({
        embedding_input: embeddingInput,
        embedding_model: 'gemini-embedding-2:768',
        embedding_generated_at: new Date().toISOString(),
        embedding: embeddingLiteral,
      })
      .eq('id', capstone_id)

    if (updateError) {
      throw updateError
    }

    return json({
      capstone_id,
      embedding_model: 'gemini-embedding-2:768',
      embedding_length: values.length,
      updated: true,
    })
  } catch (error) {
    return json({ error: (error as any).message }, 500)
  }
})

function buildEmbeddingInput(capstone: CapstoneRow) {
  return [
    capstone.title?.trim(),
    capstone.abstract?.trim(),
    capstone.author ? `Author: ${capstone.author}` : null,
    capstone.year ? `Year: ${capstone.year}` : null,
    capstone.keywords && capstone.keywords.length > 0
      ? `Keywords: ${capstone.keywords.join(', ')}`
      : null,
  ]
    .filter(Boolean)
    .join('\n\n')
}

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
