import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { Database } from "./types/database"

// Client-side Supabase client
export const createClient = () => createClientComponentClient<Database>()

// Server-side Supabase client
export const createServerClient = () => createServerComponentClient<Database>({ cookies })

// Direct Supabase client for server-side operations
export const supabase = createSupabaseClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Admin client for administrative operations (use service role key)
export const supabaseAdmin = createSupabaseClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Authentication utilities
export const auth = {
  // Sign up new user
  async signUp(email: string, password: string, metadata?: Record<string, any>) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
    return { data, error }
  },

  // Sign in user
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
      redirectTo: `${window.location.origin}/auth/reset-password`
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
