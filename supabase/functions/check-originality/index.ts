// @ts-ignore
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
// @ts-ignore
import { unzlibSync } from 'https://esm.sh/fflate@0.8.2'
import { rateLimitMiddleware } from '../middleware/rateLimiter.ts'

// @ts-ignore
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
// @ts-ignore
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'have', 'in', 'into',
  'is', 'it', 'of', 'on', 'or', 'that', 'the', 'their', 'this', 'to', 'using', 'was', 'were',
  'while', 'with',
])

const checkRateLimit = rateLimitMiddleware((req: any) => {
  return req.headers.get('x-forwarded-for') ||
    req.headers.get('x-real-ip') ||
    req.headers.get('remote-addr') ||
    'unknown-ip'
})

type CapstoneRow = {
  id: string
  title: string | null
  author: string | null
  year: number | null
  abstract: string | null
}

type SimilaritySource = {
  id: number
  title: string
  author: string
  year: string
  similarityPercentage: number
  matchedText: string
  sourceText: string
}

// @ts-ignore
serve(async (req: any) => {
  const rateLimitResponse = checkRateLimit(req)
  if (rateLimitResponse) {
    return rateLimitResponse
  }

  try {
    const { text, file_path, user_id } = await req.json()

    if (!text && !file_path) {
      return json({ error: 'Either text or file_path must be provided' }, 400)
    }

    if (text !== undefined && text !== null) {
      if (typeof text !== 'string') {
        return json({ error: 'Text must be a string' }, 400)
      }
      if (text.length > 10000) {
        return json({ error: 'Text too long (max 10,000 characters)' }, 400)
      }
    }

    if (file_path !== undefined && file_path !== null) {
      if (typeof file_path !== 'string') {
        return json({ error: 'File path must be a string' }, 400)
      }
      if (file_path.length > 2048) {
        return json({ error: 'File path too long (max 2,048 characters)' }, 400)
      }
      if (file_path.includes('..')) {
        return json({ error: 'File path must not contain directory traversal sequences' }, 400)
      }
    }

    if (!user_id || typeof user_id !== 'string') {
      return json({ error: 'User ID is required and must be a string' }, 400)
    }
    if (user_id.includes('/') || user_id.includes('\\')) {
      return json({ error: 'User ID must not contain path separators' }, 400)
    }

    const contentToCheck = await resolveContentToCheck(text, file_path)
    if (!contentToCheck.trim()) {
      return json({ error: 'No readable text was found in the provided content.' }, 400)
    }

    const { data: capstones, error: capstoneError } = await supabase
      .from('capstone_projects')
      .select('id, title, author, year, abstract')
      .not('abstract', 'is', null)

    if (capstoneError) {
      throw capstoneError
    }

    const analysisResult = analyzeAgainstCapstones(
      contentToCheck,
      ((capstones ?? []) as CapstoneRow[]).filter((item) => (item.abstract || item.title)?.trim())
    )

    return json({
      originalityScore: analysisResult.originalityScore,
      similaritySources: analysisResult.similaritySources,
      highlightedText: contentToCheck,
    })
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

async function resolveContentToCheck(text?: string, filePath?: string): Promise<string> {
  if (text?.trim()) {
    return text.trim()
  }

  if (!filePath) {
    return ''
  }

  const { data: fileData, error: fileError } = await supabase
    .storage
    .from('originality-checks')
    .download(filePath)

  if (fileError) {
    throw fileError
  }

  const extension = filePath.split('.').pop()?.toLowerCase() || ''
  if (extension === 'txt') {
    return (await fileData.text()).trim()
  }

  if (extension === 'pdf') {
    return (await extractPdfText(await fileData.arrayBuffer())).trim()
  }

  throw new Error('Only TXT and text-based PDF files are supported for originality checks right now.')
}

function analyzeAgainstCapstones(text: string, capstones: CapstoneRow[]) {
  const inputTokens = tokenize(text)
  const inputUnique = new Set(inputTokens)
  const inputShingles = createShingles(inputTokens, 4)
  const inputSentences = splitSentences(text)

  const matches = capstones
    .map((capstone, index) => scoreCapstone(index, capstone, text, inputUnique, inputShingles, inputSentences))
    .filter((item) => item.similarityPercentage >= 10)
    .sort((a, b) => b.similarityPercentage - a.similarityPercentage)
    .slice(0, 5)

  const coveredTokens = new Set<string>()
  matches.forEach((match) => match.coveredTokens.forEach((token) => coveredTokens.add(token)))

  const aggregateRatio = inputUnique.size === 0 ? 0 : coveredTokens.size / inputUnique.size
  const topSimilarity = matches[0]?.similarityPercentage ?? 0
  const overallSimilarity = matches.length === 0
    ? 0
    : Math.min(95, Math.round((aggregateRatio * 55) + (topSimilarity * 0.45)))

  return {
    originalityScore: Math.max(5, 100 - overallSimilarity),
    similaritySources: matches.map(({ coveredTokens, ...match }) => match),
  }
}

function scoreCapstone(
  index: number,
  capstone: CapstoneRow,
  inputText: string,
  inputUnique: Set<string>,
  inputShingles: Set<string>,
  inputSentences: string[]
) {
  const sourceText = [capstone.title || '', capstone.abstract || ''].join('. ').trim()
  const sourceTokens = tokenize(sourceText)
  const sourceUnique = new Set(sourceTokens)
  const sourceShingles = createShingles(sourceTokens, 4)
  const sourceSentences = splitSentences(sourceText)

  const overlappingTokens = intersectSets(inputUnique, sourceUnique)
  const overlappingShingles = intersectSets(inputShingles, sourceShingles)
  const tokenScore = inputUnique.size === 0 ? 0 : overlappingTokens.size / inputUnique.size
  const shingleScore = inputShingles.size === 0 ? 0 : overlappingShingles.size / inputShingles.size
  const sentenceMatch = findBestSentenceMatch(inputSentences, sourceSentences)
  const titleScore = normalizedIncludes(inputText, capstone.title || '') ? 0.2 : 0

  const similarityPercentage = Math.min(
    95,
    Math.round((tokenScore * 35) + (shingleScore * 45) + (sentenceMatch.score * 20) + (titleScore * 100))
  )

  return {
    id: index + 1,
    title: capstone.title || 'Untitled research',
    author: capstone.author || 'Unknown author',
    year: capstone.year ? String(capstone.year) : 'Unknown year',
    similarityPercentage,
    matchedText: sentenceMatch.inputSentence || buildFallbackPhrase(inputText, overlappingTokens),
    sourceText: sentenceMatch.sourceSentence || buildFallbackPhrase(sourceText, overlappingTokens),
    coveredTokens: overlappingTokens,
  }
}

function findBestSentenceMatch(inputSentences: string[], sourceSentences: string[]) {
  let best = { score: 0, inputSentence: '', sourceSentence: '' }

  for (const inputSentence of inputSentences) {
    const inputTokens = new Set(tokenize(inputSentence))
    if (inputTokens.size < 4) {
      continue
    }

    for (const sourceSentence of sourceSentences) {
      const sourceTokens = new Set(tokenize(sourceSentence))
      const overlap = intersectSets(inputTokens, sourceTokens)
      const score = inputTokens.size === 0 ? 0 : overlap.size / inputTokens.size

      if (score > best.score && overlap.size >= 4) {
        best = {
          score,
          inputSentence: inputSentence.trim(),
          sourceSentence: sourceSentence.trim(),
        }
      }
    }
  }

  return best
}

function buildFallbackPhrase(text: string, overlappingTokens: Set<string>) {
  const sentences = splitSentences(text)
  const tokenList = [...overlappingTokens]

  for (const sentence of sentences) {
    const normalized = normalizeText(sentence)
    if (tokenList.some((token) => normalized.includes(token))) {
      return sentence.trim()
    }
  }

  return sentences[0]?.trim() || text.slice(0, 180).trim()
}

function tokenize(text: string) {
  return normalizeText(text)
    .split(' ')
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word))
}

function normalizeText(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function splitSentences(text: string) {
  return text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
}

function createShingles(tokens: string[], size: number) {
  const shingles = new Set<string>()
  if (tokens.length < size) {
    if (tokens.length > 0) {
      shingles.add(tokens.join(' '))
    }
    return shingles
  }

  for (let index = 0; index <= tokens.length - size; index += 1) {
    shingles.add(tokens.slice(index, index + size).join(' '))
  }

  return shingles
}

function intersectSets<T>(left: Set<T>, right: Set<T>) {
  const result = new Set<T>()
  left.forEach((value) => {
    if (right.has(value)) {
      result.add(value)
    }
  })
  return result
}

function normalizedIncludes(left: string, right: string) {
  const normalizedRight = normalizeText(right)
  return Boolean(normalizedRight) && normalizeText(left).includes(normalizedRight)
}

async function extractPdfText(buffer: ArrayBuffer) {
  return extractPdfTextFallback(buffer)
}

async function extractPdfTextFallback(buffer: ArrayBuffer) {
  const binary = new Uint8Array(buffer)
  const rawContent = new TextDecoder('latin1').decode(binary)
  const decodedStreams = await extractInflatedPdfStreams(binary)
  const candidateContents = [rawContent, ...decodedStreams]
  const fontMaps = extractFontUnicodeMaps(rawContent)

  const extracted = candidateContents.flatMap((content) => extractTextOperators(content, fontMaps))

  return extracted
    .join(' ')
    .replace(/[\u0000-\u001f]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

async function extractInflatedPdfStreams(binary: Uint8Array) {
  const streamMarker = new TextEncoder().encode('stream')
  const endStreamMarker = new TextEncoder().encode('endstream')
  const contents: string[] = []
  let cursor = 0

  while (cursor < binary.length) {
    const streamStart = indexOfBytes(binary, streamMarker, cursor)
    if (streamStart === -1) {
      break
    }

    let dataStart = streamStart + streamMarker.length
    if (binary[dataStart] === 0x0d && binary[dataStart + 1] === 0x0a) {
      dataStart += 2
    } else if (binary[dataStart] === 0x0a || binary[dataStart] === 0x0d) {
      dataStart += 1
    }

    const streamEnd = indexOfBytes(binary, endStreamMarker, dataStart)
    if (streamEnd === -1) {
      break
    }

    const streamBytes = binary.slice(dataStart, streamEnd)
    const inflatedText = await inflatePdfStream(streamBytes)
    if (inflatedText?.trim()) {
      contents.push(inflatedText)
    }

    cursor = streamEnd + endStreamMarker.length
  }

  return contents
}

async function inflatePdfStream(streamBytes: Uint8Array) {
  try {
    return new TextDecoder('latin1').decode(unzlibSync(streamBytes))
  } catch {
    // Fall through to native attempts.
  }

  for (const format of ['deflate', 'deflate-raw'] as const) {
    try {
      const decompressedStream = new Blob([streamBytes]).stream().pipeThrough(new DecompressionStream(format))
      const inflated = await new Response(decompressedStream).arrayBuffer()
      return new TextDecoder('latin1').decode(new Uint8Array(inflated))
    } catch {
      // Try the next format.
    }
  }

  return null
}

function extractFontUnicodeMaps(content: string) {
  const fontRefs = new Map<string, string>()
  const objectToUnicode = new Map<string, string>()
  const unicodeMaps = new Map<string, Map<string, string>>()

  for (const match of content.matchAll(/\/(F\d+)\s+(\d+)\s+(\d+)\s+R/g)) {
    fontRefs.set(match[1], `${match[2]} ${match[3]}`)
  }

  for (const match of content.matchAll(/(\d+)\s+(\d+)\s+obj([\s\S]*?)endobj/g)) {
    const objectKey = `${match[1]} ${match[2]}`
    const body = match[3]
    const toUnicodeMatch = body.match(/\/ToUnicode\s+(\d+)\s+(\d+)\s+R/)
    if (toUnicodeMatch) {
      objectToUnicode.set(objectKey, `${toUnicodeMatch[1]} ${toUnicodeMatch[2]}`)
    }

    if (body.includes('beginbfchar')) {
      unicodeMaps.set(objectKey, parseUnicodeCMap(body))
    }
  }

  const fontMaps = new Map<string, Map<string, string>>()
  fontRefs.forEach((fontObjectKey, fontName) => {
    const unicodeObjectKey = objectToUnicode.get(fontObjectKey)
    const unicodeMap = unicodeObjectKey ? unicodeMaps.get(unicodeObjectKey) : undefined
    if (unicodeMap?.size) {
      fontMaps.set(fontName, unicodeMap)
    }
  })

  return fontMaps
}

function parseUnicodeCMap(content: string) {
  const unicodeMap = new Map<string, string>()

  for (const section of content.matchAll(/beginbfchar([\s\S]*?)endbfchar/g)) {
    for (const match of section[1].matchAll(/<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>/g)) {
      unicodeMap.set(match[1].toUpperCase(), decodeUtf16Hex(match[2]))
    }
  }

  for (const section of content.matchAll(/beginbfrange([\s\S]*?)endbfrange/g)) {
    for (const match of section[1].matchAll(/<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>/g)) {
      const start = parseInt(match[1], 16)
      const end = parseInt(match[2], 16)
      let current = parseInt(match[3], 16)

      for (let code = start; code <= end; code += 1) {
        unicodeMap.set(code.toString(16).toUpperCase().padStart(match[1].length, '0'), decodeUtf16Hex(current.toString(16)))
        current += 1
      }
    }
  }

  return unicodeMap
}

function extractTextOperators(content: string, fontMaps: Map<string, Map<string, string>>) {
  const extracted: string[] = []
  const tokenPattern = /\/(F\d+)\s+[\d.]+\s+Tf|\[(.*?)\]\s*TJ|<([0-9A-Fa-f]+)>\s*Tj|\(([^()]*)\)\s*Tj/gs
  let currentFont: Map<string, string> | undefined

  for (const match of content.matchAll(tokenPattern)) {
    if (match[1]) {
      currentFont = fontMaps.get(match[1])
      continue
    }

    if (match[2] !== undefined) {
      const parts = [
        ...match[2].matchAll(/<([0-9A-Fa-f]+)>|\(([^()]*)\)/g),
      ].map((part) => {
        if (part[1]) {
          return decodeHexGlyphText(part[1], currentFont)
        }
        return decodePdfString(part[2] || '')
      })
      const joined = parts.join('')
      if (joined.trim()) {
        extracted.push(joined)
      }
      continue
    }

    if (match[3]) {
      const decoded = decodeHexGlyphText(match[3], currentFont)
      if (decoded.trim()) {
        extracted.push(decoded)
      }
      continue
    }

    if (match[4]) {
      const decoded = decodePdfString(match[4])
      if (decoded.trim()) {
        extracted.push(decoded)
      }
    }
  }

  return extracted
}

function indexOfBytes(source: Uint8Array, pattern: Uint8Array, fromIndex: number) {
  outer: for (let index = fromIndex; index <= source.length - pattern.length; index += 1) {
    for (let offset = 0; offset < pattern.length; offset += 1) {
      if (source[index + offset] !== pattern[offset]) {
        continue outer
      }
    }

    return index
  }

  return -1
}

function decodePdfString(value: string) {
  return value
    .replace(/\\\)/g, ')')
    .replace(/\\\(/g, '(')
    .replace(/\\\\/g, '\\')
}

function decodeHexGlyphText(value: string, glyphMap?: Map<string, string>) {
  if (glyphMap?.size) {
    const glyphWidth = inferGlyphWidth(glyphMap)
    const decoded = chunkHex(value, glyphWidth)
      .map((chunk) => glyphMap.get(chunk.toUpperCase()) || '')
      .join('')
    if (decoded.trim()) {
      return decoded
    }
  }

  return decodeUtf16Hex(value)
}

function inferGlyphWidth(glyphMap: Map<string, string>) {
  const firstKey = glyphMap.keys().next().value
  return typeof firstKey === 'string' ? firstKey.length : 4
}

function chunkHex(value: string, chunkSize: number) {
  const chunks: string[] = []
  for (let index = 0; index < value.length; index += chunkSize) {
    chunks.push(value.slice(index, index + chunkSize))
  }
  return chunks
}

function decodeUtf16Hex(value: string) {
  const normalized = value.length % 4 === 0 ? value : value.padStart(value.length + (4 - (value.length % 4)), '0')
  const chars: string[] = []

  for (const chunk of chunkHex(normalized, 4)) {
    const codePoint = parseInt(chunk, 16)
    if (!Number.isNaN(codePoint)) {
      chars.push(String.fromCharCode(codePoint))
    }
  }

  return chars.join('')
}
