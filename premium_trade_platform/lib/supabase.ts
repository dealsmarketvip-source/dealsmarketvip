import { createClientComponentClient, createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { Database } from "./types/database"

// Get environment variables with fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables')
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
  // Sign up new user with access code
  async signUp(email: string, password: string, accessCode?: string, metadata?: Record<string, any>) {
    try {
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
      return { data, error }
    } catch (error: any) {
      return { data: null, error: { message: error.message || 'Sign up failed' } }
    }
  },

  // Sign in with access code only
  async signInWithCode(accessCode: string) {
    try {
      // For now, create a mock successful response for testing
      // In production, this would validate against the invitation_codes table
      return { 
        data: { 
          user: { 
            email: 'test@dealsmarket.vip',
            id: 'test-user-id'
          } 
        }, 
        error: null 
      }
    } catch (error: any) {
      return { data: null, error: { message: error.message || 'Authentication failed' } }
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
