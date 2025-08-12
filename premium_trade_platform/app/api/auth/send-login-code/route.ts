import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'
import { headers } from 'next/headers'

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY)

// Initialize Supabase with service role key for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Generate a random 6-digit code
function generateLoginCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Rate limiting storage (in production, use Redis or database)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(email: string): boolean {
  const now = Date.now()
  const userRateLimit = rateLimitMap.get(email)
  
  if (!userRateLimit || now > userRateLimit.resetTime) {
    // Reset rate limit
    rateLimitMap.set(email, { count: 1, resetTime: now + 15 * 60 * 1000 }) // 15 minutes
    return true
  }
  
  if (userRateLimit.count >= 5) {
    return false // Rate limit exceeded
  }
  
  userRateLimit.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email válido requerido' },
        { status: 400 }
      )
    }

    // Check rate limit
    if (!checkRateLimit(email)) {
      return NextResponse.json(
        { error: 'Demasiados intentos. Intenta de nuevo en 15 minutos.' },
        { status: 429 }
      )
    }

    // Get request headers for security logging
    const headersList = headers()
    const userAgent = headersList.get('user-agent') || ''
    const forwardedFor = headersList.get('x-forwarded-for')
    const realIp = headersList.get('x-real-ip')
    const ipAddress = forwardedFor?.split(',')[0] || realIp || 'unknown'

    // Generate login code
    const code = generateLoginCode()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now

    // Store code in database
    const { data, error: dbError } = await supabaseAdmin
      .from('login_codes')
      .insert({
        email: email.toLowerCase(),
        code,
        expires_at: expiresAt.toISOString(),
        ip_address: ipAddress,
        user_agent: userAgent
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Error interno del servidor' },
        { status: 500 }
      )
    }

    // Send email with Resend
    try {
      const { data: emailData, error: emailError } = await resend.emails.send({
        from: process.env.RESEND_FROM!,
        to: [email],
        subject: 'Tu código de acceso a DealsMarket',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Código de Acceso - DealsMarket</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0A1628;">
              <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF;">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #0A1628 0%, #1F2937 100%); padding: 40px 20px; text-align: center;">
                  <h1 style="color: #FFD700; margin: 0; font-size: 28px; font-weight: bold;">
                    🏆 DEALSMARKET
                  </h1>
                  <p style="color: #E5E7EB; margin: 10px 0 0 0; font-size: 16px;">
                    Premium B2B Marketplace
                  </p>
                </div>
                
                <!-- Content -->
                <div style="padding: 40px 20px;">
                  <h2 style="color: #1F2937; margin: 0 0 20px 0; font-size: 24px;">
                    Tu Código de Acceso
                  </h2>
                  
                  <p style="color: #4B5563; margin: 0 0 30px 0; font-size: 16px; line-height: 1.5;">
                    Hemos recibido una solicitud para acceder a tu cuenta de DealsMarket. 
                    Utiliza el siguiente código para completar tu inicio de sesión:
                  </p>
                  
                  <!-- Code Box -->
                  <div style="text-align: center; margin: 30px 0;">
                    <div style="
                      display: inline-block;
                      background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
                      color: #1F2937;
                      font-size: 32px;
                      font-weight: bold;
                      padding: 20px 40px;
                      border-radius: 12px;
                      letter-spacing: 8px;
                      box-shadow: 0 8px 32px rgba(255, 215, 0, 0.3);
                    ">
                      ${code}
                    </div>
                  </div>
                  
                  <div style="background-color: #FEF3C7; border: 1px solid #FFD700; border-radius: 8px; padding: 16px; margin: 30px 0;">
                    <p style="color: #92400E; margin: 0; font-size: 14px;">
                      <strong>⚠️ Importante:</strong> Este código expira en 10 minutos y solo puede usarse una vez.
                    </p>
                  </div>
                  
                  <p style="color: #6B7280; margin: 20px 0 0 0; font-size: 14px; line-height: 1.5;">
                    Si no solicitaste este código, puedes ignorar este email de forma segura. 
                    Tu cuenta permanece protegida.
                  </p>
                </div>
                
                <!-- Footer -->
                <div style="background-color: #F9FAFB; padding: 30px 20px; text-align: center; border-top: 1px solid #E5E7EB;">
                  <p style="color: #6B7280; margin: 0 0 10px 0; font-size: 14px;">
                    © 2024 DealsMarket. Conectando empresas verificadas globalmente.
                  </p>
                  <p style="color: #9CA3AF; margin: 0; font-size: 12px;">
                    Este email fue enviado a ${email}
                  </p>
                </div>
              </div>
            </body>
          </html>
        `,
        text: `
Tu código de acceso a DealsMarket: ${code}

Este código expira en 10 minutos y solo puede usarse una vez.

Si no solicitaste este código, puedes ignorar este email.

© 2024 DealsMarket
        `.trim()
      })

      if (emailError) {
        console.error('Email error:', emailError)
        // Delete the code from database if email failed
        await supabaseAdmin
          .from('login_codes')
          .delete()
          .eq('id', data.id)
        
        return NextResponse.json(
          { error: 'Error al enviar el email' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Código enviado correctamente',
        expiresIn: 600 // 10 minutes in seconds
      })

    } catch (emailError) {
      console.error('Resend error:', emailError)
      
      // Delete the code from database if email failed
      await supabaseAdmin
        .from('login_codes')
        .delete()
        .eq('id', data.id)
      
      return NextResponse.json(
        { error: 'Error al enviar el email' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Send login code error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
