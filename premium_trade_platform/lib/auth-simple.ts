// Simplified authentication that actually works
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zirbgjfraqjhdstjpjnt.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Working invitation codes with real credentials
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
}

export async function validateAndSignInWithCode(code: string) {
  try {
    const codeData = INVITATION_CODES[code.toUpperCase() as keyof typeof INVITATION_CODES]
    
    if (!codeData) {
      return {
        success: false,
        error: 'Invalid invitation code'
      }
    }

    // Try to sign in with existing credentials
    const { data, error } = await supabase.auth.signInWithPassword({
      email: codeData.email,
      password: codeData.password
    })

    if (error) {
      // If user doesn't exist, create the account
      if (error.message.includes('Invalid login credentials')) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: codeData.email,
          password: codeData.password,
          options: {
            data: {
              full_name: codeData.company_name,
              company_name: codeData.company_name,
              invitation_code: code.toUpperCase()
            }
          }
        })

        if (signUpError) {
          return {
            success: false,
            error: signUpError.message
          }
        }

        // Sign in immediately after signup
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: codeData.email,
          password: codeData.password
        })

        if (signInError) {
          return {
            success: false,
            error: signInError.message
          }
        }

        return {
          success: true,
          data: {
            user: signInData.user,
            session: signInData.session,
            profile: {
              ...codeData,
              id: signInData.user!.id,
              auth_id: signInData.user!.id,
              email: codeData.email
            }
          }
        }
      }

      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: true,
      data: {
        user: data.user,
        session: data.session,
        profile: {
          ...codeData,
          id: data.user!.id,
          auth_id: data.user!.id,
          email: codeData.email
        }
      }
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Authentication failed'
    }
  }
}

export async function validateInvitationCodeOnly(code: string) {
  const codeData = INVITATION_CODES[code.toUpperCase() as keyof typeof INVITATION_CODES]
  
  if (!codeData) {
    return {
      isValid: false,
      message: '❌ Invalid invitation code'
    }
  }

  return {
    isValid: true,
    message: code.toUpperCase() === 'ASTERO1' 
      ? '🌟 Astero code valid - COMPLETE ACCESS'
      : '🚀 Beta code valid - COMPLETE ACCESS',
    accountData: codeData
  }
}
