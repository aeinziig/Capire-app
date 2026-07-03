// @ts-ignore
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { sanitizeHtml, isValidBase64, validateName } from './middleware/sanitizeInput.ts'
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

// @ts-ignore
serve(async (req: any) => {
  // Apply rate limiting
  const rateLimitResponse = checkRateLimit(req)
  if (rateLimitResponse) {
    return rateLimitResponse
  }

  try {
    const { fileContentBase64, fileName, userId, bucket } = await req.json()

    // Validate Base64 content (do NOT sanitize as it corrupts the data)
    if (!isValidBase64(fileContentBase64)) {
      return new Response(
        JSON.stringify({ error: 'Invalid Base64 file content' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Validate fileName
    if (!fileName || typeof fileName !== 'string') {
      return new Response(
        JSON.stringify({ error: 'File name is required and must be a string' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }
    if (fileName.length > 255) {
      return new Response(
        JSON.stringify({ error: 'File name too long (max 255 characters)' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }
    if (fileName.includes('/') || fileName.includes('\\')) {
      return new Response(
        JSON.stringify({ error: 'File name must not contain path separators' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Validate userId
    if (!userId || typeof userId !== 'string') {
      return new Response(
        JSON.stringify({ error: 'User ID is required and must be a string' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }
    if (userId.includes('/') || userId.includes('\\')) {
      return new Response(
        JSON.stringify({ error: 'User ID must not contain path separators' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Validate bucket
    if (!bucket || typeof bucket !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Bucket is required and must be a string' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }
    if (bucket.length < 3) {
      return new Response(
        JSON.stringify({ error: 'Bucket name must be at least 3 characters' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }
    if (bucket.includes('/') || bucket.includes('\\')) {
      return new Response(
        JSON.stringify({ error: 'Bucket name must not contain path separators' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Generate storage path
    const storageFileName = `${userId}/${Date.now()}_${fileName}`

    // Decode base64 file content
    const binaryString = atob(fileContentBase64)
    const len = binaryString.length
    const bytes = new Uint8Array(len)
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    const fileBlob = new Blob([bytes])

    // Determine content type based on file extension
    const fileExtension = fileName.split('.').pop()?.toLowerCase() || ''
    const contentTypeMap: Record<string, string> = {
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'txt': 'text/plain',
    }
    const contentType = contentTypeMap[fileExtension] || 'application/octet-stream'

    // Upload to Supabase Storage
    const { data, error } = await supabase
      .storage
      .from(bucket)
      .upload(storageFileName, fileBlob, { contentType })

    if (error) {
      throw error
    }

    // Get public URL for the uploaded file (optional)
    const { data: urlData } = supabase
      .storage
      .from(bucket)
      .getPublicUrl(storageFileName)

    return new Response(
      JSON.stringify({
        storagePath: storageFileName,
        publicUrl: urlData.publicUrl,
        message: 'File uploaded successfully'
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