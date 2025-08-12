import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { SignJWT } from 'jose'
import { cookies } from 'next/headers'

// Initialize Supabase with service role key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// JWT secret
const JWT_SECRET = new TextEncoder().encode(process.env.AUTH_SECRET!)

// Create JWT token
async function createToken(payload: any): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // 7 days
    .sign(JWT_SECRET)
}

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json()

    // Validate input
    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email y código requeridos' },
        { status: 400 }
      )
    }

    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { error: 'Código debe tener 6 dígitos' },
        { status: 400 }
      )
    }

    // Find the login code
    const { data: loginCode, error: findError } = await supabaseAdmin
      .from('login_codes')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('code', code)
      .is('used_at', null)
      .single()

    if (findError || !loginCode) {
      // Increment attempts for security logging
      await supabaseAdmin
        .from('login_codes')
        .update({ 
          attempts: supabaseAdmin.sql`attempts + 1`
        })
        .eq('email', email.toLowerCase())
        .eq('code', code)

      return NextResponse.json(
        { error: 'Código inválido o expirado' },
        { status: 400 }
      )
    }

    // Check if code is expired
    const now = new Date()
    const expiresAt = new Date(loginCode.expires_at)
    
    if (now > expiresAt) {
      return NextResponse.json(
        { error: 'Código expirado' },
        { status: 400 }
      )
    }

    // Mark code as used
    const { error: markUsedError } = await supabaseAdmin
      .from('login_codes')
      .update({ 
        used_at: now.toISOString(),
        attempts: loginCode.attempts + 1
      })
      .eq('id', loginCode.id)

    if (markUsedError) {
      console.error('Error marking code as used:', markUsedError)
      return NextResponse.json(
        { error: 'Error interno del servidor' },
        { status: 500 }
      )
    }

    // Check if user exists, if not create them
    let { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single()

    if (userError && userError.code === 'PGRST116') {
      // User doesn't exist, create them
      const { data: newUser, error: createError } = await supabaseAdmin
        .from('users')
        .insert({
          email: email.toLowerCase(),
          full_name: email.split('@')[0], // Default name from email
          role: 'user',
          verification_status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (createError) {
        console.error('Error creating user:', createError)
        return NextResponse.json(
          { error: 'Error creando usuario' },
          { status: 500 }
        )
      }

      user = newUser
    } else if (userError) {
      console.error('Error fetching user:', userError)
      return NextResponse.json(
        { error: 'Error interno del servidor' },
        { status: 500 }
      )
    }

    // Create JWT token
    const token = await createToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      iat: Math.floor(Date.now() / 1000)
    })

    // Set authentication cookie
    const cookieStore = cookies()
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        verification_status: user.verification_status,
        profile_image_url: user.profile_image_url
      },
      message: 'Inicio de sesión exitoso'
    })

    // Set secure HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    })

    // Also set a client-readable cookie for auth state
    response.cookies.set('auth-state', 'authenticated', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    })

    return response

  } catch (error) {
    console.error('Verify login code error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
