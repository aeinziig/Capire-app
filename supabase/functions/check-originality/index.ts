// @ts-ignore
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { sanitizeHtml, isValidEmail, validatePassword, validateName } from './middleware/sanitizeInput.ts'
import { rateLimitMiddleware } from './middleware/rateLimiter.ts'

// @ts-ignore
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
// @ts-ignore
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Rate limiter middleware using IP address as key
const checkRateLimit = rateLimitMiddleware((req: any) => {
  // Try to get IP from various headers (common in cloud environments)
  return req.headers.get('x-forwarded-for') ||
         req.headers.get('x-real-ip') ||
         req.headers.get('remote-addr') ||
         'unknown-ip'
})

/**
 * Check originality of text using plagiarism detection logic
 * In a production environment, this would integrate with a service like:
 * - Copyleaks API
 * - Turnitin API
 * - Grammarly Business API
 * - Or open-source alternatives like PlagiarismCheck.org, etc.
 */
// @ts-ignore
serve(async (req: any) => {
  // Apply rate limiting
  const rateLimitResponse = checkRateLimit(req)
  if (rateLimitResponse) {
    return rateLimitResponse
  }

  try {
    const { text, file_path, user_id } = await req.json()

    // Validate input
    if (!text && !file_path) {
      return new Response(
        JSON.stringify({ error: 'Either text or file_path must be provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Validate text if provided
    if (text !== undefined && text !== null) {
      if (typeof text !== 'string') {
        return new Response(
          JSON.stringify({ error: 'Text must be a string' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        )
      }
      if (text.length > 10000) {
        return new Response(
          JSON.stringify({ error: 'Text too long (max 10,000 characters)' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        )
      }
    }

    // Validate file_path if provided
    if (file_path !== undefined && file_path !== null) {
      if (typeof file_path !== 'string') {
        return new Response(
          JSON.stringify({ error: 'File path must be a string' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        )
      }
      if (file_path.length > 2048) {
        return new Response(
          JSON.stringify({ error: 'File path too long (max 2,048 characters)' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        )
      }
      if (file_path.includes('..')) {
        return new Response(
          JSON.stringify({ error: 'File path must not contain directory traversal sequences' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        )
      }
    }

    // Validate user_id
    if (!user_id || typeof user_id !== 'string') {
      return new Response(
        JSON.stringify({ error: 'User ID is required and must be a string' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }
    if (user_id.includes('/') || user_id.includes('\\')) {
      return new Response(
        JSON.stringify({ error: 'User ID must not contain path separators' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // If file_path is provided, we would download and extract text from the file
    // For this implementation, we'll work with the provided text parameter
    // In a complete implementation, you would:
    // 1. If file_path exists, download file from Supabase Storage
    // 2. Extract text based on file type (PDF, DOC, TXT, etc.)
    // 3. Use that extracted text for originality checking
    let contentToCheck = text || ''

    // TODO: Implement file text extraction when file_path is provided
    // Example:
    // if (file_path) {
    //   const { data: fileData, error: fileError } = await supabase
    //     .storage
    //     .from('originality-checks')
    //     .download(file_path)
    //
    //   if (fileError) throw fileError
    //
    //   // Extract text based on file extension
    //   const fileExtension = file_path.split('.').pop()?.toLowerCase()
    //   switch (fileExtension) {
    //     case 'pdf':
    //       // Use PDF text extraction library
    //       contentToCheck = await extractTextFromPDF(fileData)
    //       break
    //     case 'doc':
    //     case 'docx':
    //       // Use DOC text extraction
    //       contentToCheck = await extractTextFromDoc(fileData)
    //       break
    //     case 'txt':
    //       contentToCheck = await fileData.text()
    //       break
    //     default:
    //       throw new Error('Unsupported file type')
    //   }
    // }

    // Simulate processing delay for realism
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Analyze the text to generate a more realistic originality score
    // This is a simplified mock - in reality, you'd send to plagiarism service
    const analysisResult = analyzeTextForOriginality(contentToCheck)

    return new Response(
      JSON.stringify({
        originalityScore: analysisResult.originalityScore,
        similaritySources: analysisResult.similaritySources,
        highlightedText: analysisResult.highlightedText
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as any).message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})

/**
 * Analyze text and return originality assessment
 * This is a mock implementation that simulates what a real plagiarism checker would do
 * @param text The text to analyze
 * @returns Object with originalityScore, similaritySources, and highlightedText
 */
function analyzeTextForOriginality(text: string) {
  // Handle empty text
  if (!text || text.trim() === '') {
    return {
      originalityScore: 0,
      similaritySources: [],
      highlightedText: ''
    }
  }

  // Calculate basic text statistics
  const words = text.split(/\s+/).filter(word => word.length > 0)
  const wordCount = words.length
  const sentenceCount = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).length

  // Base originality score (inverse of plagiarism likelihood)
  // In a real implementation, this would come from actual plagiarism detection
  let originalityScore = 85 // Start with good score

  // Adjust based on various factors (simplified mock logic)

  // Very short texts are often flagged as potentially plagiarized
  if (wordCount < 50) {
    originalityScore = Math.max(60, originalityScore - 15)
  }

  // Very long texts might have more opportunities for matches
  if (wordCount > 2000) {
    originalityScore = Math.max(70, originalityScore - 10)
  }

  // Texts with repetitive content might score lower
  const uniqueWords = new Set(words.map(w => w.toLowerCase())).size
  const repetitionRatio = uniqueWords / Math.max(words.length, 1)
  if (repetitionRatio < 0.5) { // Very repetitive
    originalityScore = Math.max(50, originalityScore - 20)
  } else if (repetitionRatio > 0.8) { // Good variety
    originalityScore = Math.min(95, originalityScore + 5)
  }

  // Ensure score is in valid range
  originalityScore = Math.max(0, Math.min(100, Math.round(originalityScore)))

  // Generate similarity sources based on text analysis
  // In reality, these would come from the plagiarism detection service
  const similaritySources = generateMockSimilaritySources(text, originalityScore)

  // Generate highlighted text showing potential matches
  const highlightedText = generateHighlightedText(text, similaritySources)

  return {
    originalityScore,
    similaritySources,
    highlightedText
  }
}

/**
 * Generate mock similarity sources based on text analysis
 * In reality, these would come from actual plagiarism database matches
 */
function generateMockSimilaritySources(text: string, originalityScore: number) {
  const sources = []

  // Number of sources inversely related to originality score
  const sourceCount = Math.max(0, Math.floor((100 - originalityScore) / 15))

  // Common academic topics that might be "matched" against
  const commonTopics = [
    { title: "Machine Learning in Education", author: "Dr. Sarah Chen", year: "2023" },
    { title: "Artificial Intelligence Applications", author: "Prof. James Wilson", year: "2022" },
    { title: "Data Science Methods", author: "Dr. Lisa Rodriguez", year: "2023" },
    { title: "Cloud Computing Architecture", author: "Prof. David Kim", year: "2022" },
    { title: "Cybersecurity Fundamentals", author: "Dr. Emily Davis", year: "2023" },
    { title: "Software Engineering Practices", author: "Prof. Robert Taylor", year: "2022" },
    { title: "Database Management Systems", author: "Dr. Maria Garcia", year: "2023" },
    { title: "Web Development Technologies", author: "Prof. James Anderson", year: "2022" }
  ]

  // Extract key terms from text to make matches more relevant
  const words = text.toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, " ")
    .split(/\s+/)
    .filter(word => word.length > 3)

  const wordFreq = {}
  words.forEach(word => {
    (wordFreq as Record<string, number>)[word] = ((wordFreq as Record<string, number>)[word] || 0) + 1
  })

  // Sort words by frequency
  const sortedWords = Object.entries(wordFreq)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 10)
    .map(([word]) => word)

  // Create similarity sources
  for (let i = 0; i < Math.min(sourceCount, commonTopics.length); i++) {
    const topic = commonTopics[i]
    const similarity = Math.max(5, Math.min(30, 100 - originalityScore + Math.random() * 10))

    // Find a relevant term from the text to "match"
    const matchedTerm = sortedWords[Math.floor(Math.random() * sortedWords.length)] || "the"
    const sourceTerm = matchedTerm === "the" && sortedWords.length > 1 ?
                      sortedWords[1] : matchedTerm

    sources.push({
      id: i + 1,
      title: topic.title,
      author: topic.author,
      year: topic.year,
      similarityPercentage: Math.round(similarity),
      matchedText: sourceTerm,
      sourceText: `This concept of ${sourceTerm} is fundamental to understanding ${topic.title.toLowerCase()}...`
    })
  }

  return sources
}

/**
 * Generate highlighted text showing where matches were found
 * In reality, this would come from the plagiarism detection service
 */
function generateHighlightedText(text: string, similaritySources: any[]) {
  if (!text || similaritySources.length === 0) {
    return text
  }

  let highlighted = text

  // Sort by index descending to avoid messing up indices when replacing
  const matches = similaritySources
    .map(source => ({
      term: source.matchedText.toLowerCase(),
      similarity: source.similarityPercentage
    }))
    .filter(source => source.term.length > 2 && source.term !== "the") // Avoid highlighting super common words
    .sort((a, b) => b.similarity - a.similarity) // Higher similarity first

  // Apply highlighting for each match (simplified)
  highlighted = text.replace(
    new RegExp(`\\b(${matches.map(m => m.term).join('|')})\\b`, 'gi'),
    '<span class="bg-primary-200">$1</span>'
  )

  return highlighted
}