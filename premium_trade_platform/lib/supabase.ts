import { createClientComponentClient, createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { Database } from "./types/database"

// Get environment variables with fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Validate environment variables
const isSupabaseConfigured = supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseUrl.includes('demo') &&
  !supabaseAnonKey.includes('placeholder') &&
  !supabaseAnonKey.includes('demo')

if (!isSupabaseConfigured) {
  console.warn('Supabase is not properly configured. Using fallback configuration.')
}

// Client-side Supabase client
export const createClient = () => {
  try {
    if (typeof window === 'undefined') {
      // Server-side: return a direct client
      return createSupabaseClient<Database>(
        supabaseUrl || 'https://placeholder.supabase.co',
        supabaseAnonKey || 'placeholder_key'
      )
    }
    // Client-side: use auth helpers
    return createClientComponentClient<Database>()
  } catch (error) {
    console.error('Error creating Supabase client:', error)
    // Return a fallback client that won't crash
    return createSupabaseClient<Database>(
      'https://placeholder.supabase.co',
      'placeholder_key'
    )
  }
}

// Server-side Supabase client - only create when needed
export const createServerClient = () => {
  try {
    const { cookies } = require("next/headers")
    return createServerComponentClient<Database>({ cookies })
  } catch (error) {
    console.error('Error creating server client:', error)
    return createSupabaseClient<Database>(
      supabaseUrl || 'https://placeholder.supabase.co',
      supabaseAnonKey || 'placeholder_key'
    )
  }
}

// Direct Supabase client for server-side operations
export const supabase = createSupabaseClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder_key'
)

// Admin client for administrative operations (use service role key)
export const supabaseAdmin = createSupabaseClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseServiceKey || 'placeholder_key'
)

// Authentication utilities
export const auth = {
  // Sign up new user with access code - with real validation
  async signUp(email: string, password: string, accessCode?: string, metadata?: Record<string, any>) {
    if (!isSupabaseConfigured) {
      return {
        data: null,
        error: { message: 'Supabase is not properly configured. Please check environment variables.' }
      }
    }

    try {
      // First validate the access code if provided
      if (accessCode) {
        const { data: validationResult, error: validationError } = await supabase
          .rpc('validate_invitation_code', { code_input: accessCode })

        if (validationError || !validationResult) {
          return {
            data: null,
            error: { message: 'Código de invitación inválido o expirado' }
          }
        }
      }

      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            ...metadata,
            access_code: accessCode
          }
        }
      })

      // If signup successful and access code provided, use the code
      if (data.user && accessCode) {
        const { data: codeResult } = await supabase
          .rpc('use_invitation_code', {
            code_input: accessCode,
            user_id_input: data.user.id
          })

        // Store code benefits in user metadata for profile creation
        if (codeResult?.success) {
          await supabase.auth.updateUser({
            data: {
              ...metadata,
              code_benefits: codeResult
            }
          })
        }
      }

      return { data, error }
    } catch (error: any) {
      return { data: null, error: { message: error.message || 'Sign up failed' } }
    }
  },

  // Sign in with access code only - REAL validation
  async signInWithCode(accessCode: string) {
    if (!isSupabaseConfigured) {
      return {
        data: null,
        error: { message: 'Supabase is not properly configured. Please check environment variables.' }
      }
    }

    try {
      // Validate the invitation code using the database function
      const { data: validationResult, error: validationError } = await supabase
        .rpc('validate_invitation_code', { code_input: accessCode })

      if (validationError || !validationResult) {
        return {
          data: null,
          error: { message: 'Código de invitación inválido o expirado' }
        }
      }

      // If code is valid, return success response
      // Note: In a real app, you might want to create a temporary session
      // or redirect to a signup form with the validated code
      return {
        data: {
          user: null, // No actual user yet, just code validation
          codeValid: true,
          accessCode: accessCode
        },
        error: null
      }
    } catch (error: any) {
      return { data: null, error: { message: error.message || 'Error validating invitation code' } }
    }
  },

  // Sign in with email and password
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      return { data, error }
    } catch (error: any) {
      return { data: null, error: { message: error.message || 'Sign in failed' } }
    }
  },

  // Sign out user
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (error: any) {
      return { error: { message: error.message || 'Sign out failed' } }
    }
  },

  // Get current user
  async getUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      return { user, error }
    } catch (error: any) {
      return { user: null, error: { message: error.message || 'Get user failed' } }
    }
  },

  // Reset password
  async resetPassword(email: string) {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${typeof window !== 'undefined' ? window.location.origin : 'https://dealsmarket.vip'}/auth/reset-password`
      })
      return { data, error }
    } catch (error: any) {
      return { data: null, error: { message: error.message || 'Reset password failed' } }
    }
  }
}

// Database utilities with better error handling
export const db = {
  // Users
  users: {
    async create(userData: any) {
      try {
        const { data, error } = await supabase
          .from('users')
          .insert(userData)
          .select()
          .single()
        return { data, error }
      } catch (error: any) {
        return { data: null, error: { message: error.message || 'Create user failed' } }
      }
    },

    async getById(id: string) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', id)
          .single()
        return { data, error }
      } catch (error: any) {
        return { data: null, error: { message: error.message || 'Get user failed' } }
      }
    },

    async getByAuthId(authId: string) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('auth_id', authId)
          .single()
        return { data, error }
      } catch (error: any) {
        return { data: null, error: { message: error.message || 'Get user by auth ID failed' } }
      }
    },

    async update(id: string, updates: any) {
      try {
        const { data, error } = await supabase
          .from('users')
          .update(updates)
          .eq('id', id)
          .select()
          .single()
        return { data, error }
      } catch (error: any) {
        return { data: null, error: { message: error.message || 'Update user failed' } }
      }
    }
  }
}
