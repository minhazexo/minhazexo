import { NextRequest, NextResponse } from 'next/server'

// Rate limiting: simple in-memory store
// Note: On serverless (Netlify/Vercel), this resets on cold starts.
// For production-grade limiting, use Upstash Redis with @upstash/ratelimit.
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 5 // max requests
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute window

interface ContactFormData {
  name: string
  email: string
  message: string
}

function validateFormData(data: unknown): { valid: boolean; errors: Record<string, string>; sanitized?: ContactFormData } {
  const errors: Record<string, string> = {}
  
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: { form: 'Invalid form data' } }
  }

  const { name, email, message } = data as Record<string, unknown>
  const sanitized: ContactFormData = {
    name: '',
    email: '',
    message: '',
  }

  // Validate name
  if (!name || typeof name !== 'string') {
    errors.name = 'Name is required'
  } else {
    const trimmed = name.trim()
    if (trimmed.length < 2) {
      errors.name = 'Name must be at least 2 characters'
    } else if (trimmed.length > 100) {
      errors.name = 'Name must be less than 100 characters'
    } else if (!/^[a-zA-Z\s\-'.]+$/.test(trimmed)) {
      errors.name = 'Name contains invalid characters'
    } else {
      sanitized.name = trimmed
    }
  }

  // Validate email
  if (!email || typeof email !== 'string') {
    errors.email = 'Email is required'
  } else {
    const trimmed = email.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      errors.email = 'Please enter a valid email address'
    } else if (trimmed.length > 254) {
      errors.email = 'Email is too long'
    } else {
      sanitized.email = trimmed
    }
  }

  // Validate message
  if (!message || typeof message !== 'string') {
    errors.message = 'Message is required'
  } else {
    const trimmed = message.trim()
    if (trimmed.length < 10) {
      errors.message = 'Message must be at least 10 characters'
    } else if (trimmed.length > 5000) {
      errors.message = 'Message must be less than 5000 characters'
    } else {
      sanitized.message = trimmed
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    sanitized: Object.keys(errors).length === 0 ? sanitized : undefined,
  }
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }

  if (record.count >= RATE_LIMIT) {
    return false
  }

  record.count++
  return true
}

async function sendEmail(data: ContactFormData): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const toEmail = process.env.CONTACT_EMAIL || 'mehrabhossain7102@gmail.com'

  if (!apiKey) {
    // In development or if key not configured, just log a warning
    console.warn('[Contact] RESEND_API_KEY not set — email not delivered. Form data:', {
      name: data.name,
      email: data.email,
      messageLength: data.message.length,
    })
    return
  }

  const { Resend } = await import('resend')
  const resend = new Resend(apiKey)

  const { error } = await resend.emails.send({
    from: 'Portfolio Contact <onboarding@resend.dev>',
    to: toEmail,
    replyTo: data.email,
    subject: `New Portfolio Message from ${data.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A0F; color: #ffffff; padding: 32px; border-radius: 12px; border: 1px solid rgba(99,102,241,0.2);">
        <h2 style="color: #818cf8; font-size: 20px; margin-bottom: 24px;">&#128236; New message from your portfolio</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05); color: #9ca3af; width: 100px;">Name</td>
            <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05); color: #ffffff; font-weight: bold;">${data.name}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05); color: #9ca3af;">Email</td>
            <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
              <a href="mailto:${data.email}" style="color: #818cf8;">${data.email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #9ca3af; vertical-align: top;">Message</td>
            <td style="padding: 12px 0; color: #e5e7eb; line-height: 1.6;">${data.message.replace(/\n/g, '<br/>')}</td>
          </tr>
        </table>
        <p style="margin-top: 24px; color: #6b7280; font-size: 12px;">Sent from <a href="https://mehrabhossain.dev" style="color: #818cf8;">mehrabhossain.dev</a> at ${new Date().toUTCString()}</p>
      </div>
    `,
  })

  if (error) {
    throw new Error(`Failed to send email: ${error.message}`)
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
               request.headers.get('x-real-ip') || 
               '127.0.0.1'

    // Rate limiting check
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Too many requests. Please try again later.',
          retryAfter: '60 seconds',
        },
        { 
          status: 429,
          headers: {
            'Retry-After': '60',
            'X-RateLimit-Limit': String(RATE_LIMIT),
            'X-RateLimit-Reset': String(Date.now() + RATE_LIMIT_WINDOW),
          },
        }
      )
    }

    // Parse request body
    const body: unknown = await request.json()

    // Validate form data
    const { valid, errors, sanitized } = validateFormData(body)
    
    if (!valid || !sanitized) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', errors },
        { status: 400 }
      )
    }

    // Send email via Resend
    await sendEmail(sanitized)

    // Artificial minimum response time to prevent timing attacks
    const elapsed = Date.now() - startTime
    if (elapsed < 500) {
      await new Promise((resolve) => setTimeout(resolve, 500 - elapsed))
    }

    return NextResponse.json(
      {
        success: true,
        message: "Thank you! Your message has been received. I'll get back to you soon.",
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'An unexpected error occurred. Please try again later.',
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to submit the contact form.' },
    { status: 405 }
  )
}