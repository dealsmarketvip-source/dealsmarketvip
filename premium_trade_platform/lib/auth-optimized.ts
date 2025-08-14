import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zirbgjfraqjhdstjpjnt.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Create a single client instance for better performance
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Cached invitation codes for instant validation
const INVITATION_CODES = {
  'ASTERO1': {
    email: 'admin@astero.trading',
    password: 'AsteroSecure2024!',
    company_name: 'Astero Trading Group',
    subscription_type: 'enterprise',
    verification_status: 'verified'
  },
  'BETA50': {
    email: 'beta@dealsmarket.vip', 
    password: 'BetaTest2024!',
    company_name: 'Beta Tester Company',
    subscription_type: 'enterprise',
    verification_status: 'verified'
  }
} as const

// In-memory cache for validation results
const validationCache = new Map<string, any>()

export async function fastValidateInvitationCode(code: string) {
  const upperCode = code.toUpperCase()
  
  // Check cache first for instant response
  if (validationCache.has(upperCode)) {
    return validationCache.get(upperCode)
  }

  const codeData = INVITATION_CODES[upperCode as keyof typeof INVITATION_CODES]
  
  const result = {
    isValid: !!codeData,
    message: codeData 
      ? `🌟 ${codeData.company_name} - Valid Code`
      : '❌ Invalid invitation code',
    accountData: codeData || null
  }

  // Cache the result
  validationCache.set(upperCode, result)
  
  return result
}

export async function fastSignInWithCode(code: string) {
  try {
    const upperCode = code.toUpperCase()
    const codeData = INVITATION_CODES[upperCode as keyof typeof INVITATION_CODES]

    if (!codeData) {
      return {
        success: false,
        error: 'Invalid invitation code'
      }
    }

    // Create optimistic response immediately for better UX
    const optimisticProfile = {
      ...codeData,
      id: `temp-${Date.now()}`,
      auth_id: `temp-${Date.now()}`,
      email: codeData.email
    }

    // Start auth process but don't wait
    const authPromise = (async () => {
      try {
        // Try to sign in directly first
        const { data, error } = await supabase.auth.signInWithPassword({
          email: codeData.email,
          password: codeData.password
        })

        if (data?.user) {
          return {
            user: data.user,
            session: data.session,
            profile: {
              ...codeData,
              id: data.user.id,
              auth_id: data.user.id,
              email: codeData.email
            }
          }
        }

        // If sign in failed, try creating account
        if (error?.message.includes('Invalid login credentials')) {
          await supabase.auth.signUp({
            email: codeData.email,
            password: codeData.password,
            options: {
              data: {
                full_name: codeData.company_name,
                company_name: codeData.company_name,
                invitation_code: upperCode
              }
            }
          })

          // Auto-sign in after signup
          const { data: autoSignIn } = await supabase.auth.signInWithPassword({
            email: codeData.email,
            password: codeData.password
          })

          return {
            user: autoSignIn.user,
            session: autoSignIn.session,
            profile: {
              ...codeData,
              id: autoSignIn.user!.id,
              auth_id: autoSignIn.user!.id,
              email: codeData.email
            }
          }
        }

        throw new Error(error?.message || 'Authentication failed')
      } catch (err) {
        console.error('Background auth failed:', err)
        return null
      }
    })()

    // Return success immediately for better UX
    // The actual auth will complete in background
    return {
      success: true,
      data: {
        user: null, // Will be set by auth hook
        session: null,
        profile: optimisticProfile
      },
      authPromise // Hook can await this if needed
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Authentication failed'
    }
  }
}

export async function fastSignIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      return { error, data: null }
    }

    return { data, error: null }
  } catch (error: any) {
    return { 
      error: { message: error.message || 'Sign in failed' }, 
      data: null 
    }
  }
}

export async function fastSignUp(email: string, password: string, metadata?: Record<string, any>) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata || {}
      }
    })

    if (error) {
      return { error, data: null }
    }

    return { data, error: null }
  } catch (error: any) {
    return { 
      error: { message: error.message || 'Sign up failed' }, 
      data: null 
    }
  }
}
