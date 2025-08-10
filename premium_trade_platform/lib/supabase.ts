import { createClientComponentClient, createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { Database } from "./types/database"

// Get environment variables with fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_anon_key_for_build_only'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_service_role_key_for_build_only'

// Client-side Supabase client
export const createClient = () => {
  if (typeof window === 'undefined') {
    // Server-side: return a direct client
    return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey)
  }
  // Client-side: use auth helpers
  return createClientComponentClient<Database>()
}

// Server-side Supabase client - only create when needed
export const createServerClient = () => {
  const { cookies } = require("next/headers")
  return createServerComponentClient<Database>({ cookies })
}

// Direct Supabase client for server-side operations
export const supabase = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey)

// Admin client for administrative operations (use service role key)
export const supabaseAdmin = createSupabaseClient<Database>(supabaseUrl, supabaseServiceKey)

// Authentication utilities
export const auth = {
  // Sign up new user with access code
  async signUp(email: string, password: string, accessCode?: string, metadata?: Record<string, any>) {
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
  },

  // Sign in with access code only
  async signInWithCode(accessCode: string) {
    try {
      // First, get the user associated with this access code
      const { data: codeData, error: codeError } = await supabase
        .from('invitation_codes')
        .select('email, used, user_id')
        .eq('code', accessCode)
        .single()

      if (codeError || !codeData) {
        return { data: null, error: { message: 'Invalid access code' } }
      }

      if (codeData.used) {
        // If code is already used, try to sign in with the associated user
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('auth_id')
          .eq('id', codeData.user_id)
          .single()

        if (userError || !userData) {
          return { data: null, error: { message: 'Code already used and user not found' } }
        }

        // Create a session for the existing user
        return { data: { user: { email: codeData.email } }, error: null }
      }

      // If code is not used, create new account
      const tempPassword = Math.random().toString(36).slice(-12) + 'A1!'
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: codeData.email,
        password: tempPassword,
        options: {
          data: {
            access_code: accessCode,
            auto_verify: true
          }
        }
      })

      if (authError) {
        return { data: null, error: authError }
      }

      // Mark code as used
      await supabase
        .from('invitation_codes')
        .update({ 
          used: true, 
          used_at: new Date().toISOString(),
          user_id: authData.user?.id 
        })
        .eq('code', accessCode)

      return { data: authData, error: null }
    } catch (error: any) {
      return { data: null, error: { message: error.message || 'Authentication failed' } }
    }
  },

  // Sign in with email and password
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // Sign out user
  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current user
  async getUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Reset password
  async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${typeof window !== 'undefined' ? window.location.origin : 'https://dealsmarket.vip'}/auth/reset-password`
    })
    return { data, error }
  }
}

// Database utilities
export const db = {
  // Users
  users: {
    async create(userData: Database['public']['Tables']['users']['Insert']) {
      const { data, error } = await supabase
        .from('users')
        .insert(userData)
        .select()
        .single()
      return { data, error }
    },

    async getById(id: string) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single()
      return { data, error }
    },

    async getByAuthId(authId: string) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', authId)
        .single()
      return { data, error }
    },

    async update(id: string, updates: Database['public']['Tables']['users']['Update']) {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      return { data, error }
    }
  },

  // Invitation Codes
  invitationCodes: {
    async create(codeData: Database['public']['Tables']['invitation_codes']['Insert']) {
      const { data, error } = await supabaseAdmin
        .from('invitation_codes')
        .insert(codeData)
        .select()
        .single()
      return { data, error }
    },

    async getByCode(code: string) {
      const { data, error } = await supabase
        .from('invitation_codes')
        .select('*')
        .eq('code', code)
        .single()
      return { data, error }
    },

    async markAsUsed(code: string, userId: string) {
      const { data, error } = await supabase
        .from('invitation_codes')
        .update({ 
          used: true, 
          used_at: new Date().toISOString(),
          user_id: userId 
        })
        .eq('code', code)
        .select()
        .single()
      return { data, error }
    }
  },

  // Companies
  companies: {
    async create(companyData: Database['public']['Tables']['companies']['Insert']) {
      const { data, error } = await supabase
        .from('companies')
        .insert(companyData)
        .select()
        .single()
      return { data, error }
    },

    async getByUserId(userId: string) {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', userId)
      return { data, error }
    },

    async update(id: string, updates: Database['public']['Tables']['companies']['Update']) {
      const { data, error } = await supabase
        .from('companies')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      return { data, error }
    }
  },

  // Verification Requests
  verificationRequests: {
    async create(requestData: Database['public']['Tables']['verification_requests']['Insert']) {
      const { data, error } = await supabase
        .from('verification_requests')
        .insert(requestData)
        .select()
        .single()
      return { data, error }
    },

    async getByUserId(userId: string) {
      const { data, error } = await supabase
        .from('verification_requests')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      return { data, error }
    },

    async updateStatus(id: string, status: string, reviewerNotes?: string) {
      const { data, error } = await supabase
        .from('verification_requests')
        .update({
          status,
          reviewer_notes: reviewerNotes,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()
      return { data, error }
    }
  },

  // Subscriptions
  subscriptions: {
    async create(subscriptionData: Database['public']['Tables']['subscriptions']['Insert']) {
      const { data, error } = await supabase
        .from('subscriptions')
        .insert(subscriptionData)
        .select()
        .single()
      return { data, error }
    },

    async getByUserId(userId: string) {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      return { data, error }
    },

    async updateStatus(id: string, status: string) {
      const { data, error } = await supabase
        .from('subscriptions')
        .update({ status })
        .eq('id', id)
        .select()
        .single()
      return { data, error }
    }
  }
}
