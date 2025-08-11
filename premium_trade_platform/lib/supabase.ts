import { createClientComponentClient, createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { Database } from "./types/database"

// Conditional email import to prevent client-side issues
let emailModule: any = null
if (typeof window === 'undefined') {
  try {
    emailModule = require('./email')
  } catch (error) {
    console.warn('Email module not available:', error)
  }
}

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

      // If signup successful, handle post-signup tasks
      if (data.user) {
        // Use invitation code if provided
        if (accessCode) {
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

        // Send welcome email (async, don't wait) - only on server side
        if (typeof window === 'undefined' && emailModule) {
          try {
            await emailModule.sendNotificationEmail(emailModule.EMAIL_TEMPLATES.WELCOME, email, {
              userName: metadata?.full_name || email.split('@')[0],
              userType: metadata?.user_type || 'individual'
            })
          } catch (emailError) {
            console.error('Failed to send welcome email:', emailError)
            // Don't fail the signup if email fails
          }
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
          .select(`
            *,
            user_limits(*),
            verification_documents(*),
            subscriptions(*)
          `)
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
          .select(`
            *,
            user_limits(*),
            verification_documents(*),
            subscriptions(*)
          `)
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
    },

    async getDashboard(userId: string) {
      try {
        const [userResult, productsResult, ordersResult, transactionsResult] = await Promise.all([
          this.getById(userId),
          db.products.getByUserId(userId),
          db.orders.getByUserId(userId),
          db.transactions.getByUserId(userId)
        ])

        return {
          data: {
            user: userResult.data,
            products: productsResult.data || [],
            orders: ordersResult.data || [],
            transactions: transactionsResult.data || []
          },
          error: userResult.error
        }
      } catch (error: any) {
        return { data: null, error: { message: error.message || 'Get dashboard failed' } }
      }
    }
  },

  // Products
  products: {
    async create(productData: any) {
      try {
        const { data, error } = await supabase
          .from('products')
          .insert(productData)
          .select()
          .single()
        return { data, error }
      } catch (error: any) {
        return { data: null, error: { message: error.message || 'Create product failed' } }
      }
    },

    async getById(id: string) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            product_images(*),
            users!seller_id(id, full_name, verification_status, profile_image_url)
          `)
          .eq('id', id)
          .single()
        return { data, error }
      } catch (error: any) {
        return { data: null, error: { message: error.message || 'Get product failed' } }
      }
    },

    async getByUserId(userId: string) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('seller_id', userId)
          .order('created_at', { ascending: false })
        return { data, error }
      } catch (error: any) {
        return { data: null, error: { message: error.message || 'Get user products failed' } }
      }
    },

    async search(filters: any = {}, page = 1, limit = 20) {
      try {
        let query = supabase
          .from('products')
          .select(`
            *,
            users!seller_id(id, full_name, verification_status, profile_image_url)
          `, { count: 'exact' })
          .eq('status', 'active')

        // Apply filters
        if (filters.category && filters.category !== 'all') query = query.eq('category', filters.category)
        if (filters.subcategory && filters.subcategory !== 'all') query = query.eq('subcategory', filters.subcategory)
        if (filters.min_price) query = query.gte('price', filters.min_price)
        if (filters.max_price) query = query.lte('price', filters.max_price)
        if (filters.condition && filters.condition !== 'all') query = query.eq('condition', filters.condition)
        if (filters.location) query = query.ilike('location', `%${filters.location}%`)
        if (filters.seller_verified) query = query.eq('users.verification_status', 'verified')
        if (filters.featured) query = query.eq('featured', true)
        if (filters.q) {
          query = query.or(`title.ilike.%${filters.q}%,description.ilike.%${filters.q}%`)
        }

        // Sorting
        const sortBy = filters.sort_by || 'created_at'
        const sortOrder = filters.sort_order === 'asc' ? true : false
        query = query.order(sortBy, { ascending: sortOrder })

        // Pagination
        const offset = (page - 1) * limit
        query = query.range(offset, offset + limit - 1)

        const { data, error, count } = await query
        return { data, error, count }
      } catch (error: any) {
        return { data: null, error: { message: error.message || 'Search products failed' }, count: 0 }
      }
    },

    async update(id: string, updates: any) {
      try {
        const { data, error } = await supabase
          .from('products')
          .update(updates)
          .eq('id', id)
          .select()
          .single()
        return { data, error }
      } catch (error: any) {
        return { data: null, error: { message: error.message || 'Update product failed' } }
      }
    },

    async delete(id: string) {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id)
        return { error }
      } catch (error: any) {
        return { error: { message: error.message || 'Delete product failed' } }
      }
    }
  },

  // Orders
  orders: {
    async create(orderData: any) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .insert(orderData)
          .select()
          .single()
        return { data, error }
      } catch (error: any) {
        return { data: null, error: { message: error.message || 'Create order failed' } }
      }
    },

    async getById(id: string) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            products(*),
            buyer:users!buyer_id(id, full_name, email),
            seller:users!seller_id(id, full_name, email),
            transactions(*)
          `)
          .eq('id', id)
          .single()
        return { data, error }
      } catch (error: any) {
        return { data: null, error: { message: error.message || 'Get order failed' } }
      }
    },

    async getByUserId(userId: string) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            products(*),
            buyer:users!buyer_id(id, full_name, email),
            seller:users!seller_id(id, full_name, email)
          `)
          .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
          .order('created_at', { ascending: false })
        return { data, error }
      } catch (error: any) {
        return { data: null, error: { message: error.message || 'Get user orders failed' } }
      }
    },

    async update(id: string, updates: any) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .update(updates)
          .eq('id', id)
          .select()
          .single()
        return { data, error }
      } catch (error: any) {
        return { data: null, error: { message: error.message || 'Update order failed' } }
      }
    }
  },

  // Transactions
  transactions: {
    async create(transactionData: any) {
      try {
        const { data, error } = await supabase
          .from('transactions')
          .insert(transactionData)
          .select()
          .single()
        return { data, error }
      } catch (error: any) {
        return { data: null, error: { message: error.message || 'Create transaction failed' } }
      }
    },

    async getByUserId(userId: string) {
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select(`
            *,
            orders(id, product_id, products(title))
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
        return { data, error }
      } catch (error: any) {
        return { data: null, error: { message: error.message || 'Get user transactions failed' } }
      }
    }
  },

  // Favorites
  favorites: {
    async add(userId: string, productId: string) {
      try {
        const { data, error } = await supabase
          .from('user_favorites')
          .insert({ user_id: userId, product_id: productId })
          .select()
          .single()
        return { data, error }
      } catch (error: any) {
        return { data: null, error: { message: error.message || 'Add favorite failed' } }
      }
    },

    async remove(userId: string, productId: string) {
      try {
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', userId)
          .eq('product_id', productId)
        return { error }
      } catch (error: any) {
        return { error: { message: error.message || 'Remove favorite failed' } }
      }
    },

    async getByUserId(userId: string) {
      try {
        const { data, error } = await supabase
          .from('user_favorites')
          .select(`
            *,
            products(*,
              users!seller_id(id, full_name, verification_status, profile_image_url)
            )
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
        return { data, error }
      } catch (error: any) {
        return { data: null, error: { message: error.message || 'Get user favorites failed' } }
      }
    }
  },

  // Invitation Codes
  invitationCodes: {
    async validate(code: string) {
      try {
        const { data, error } = await supabase
          .rpc('validate_invitation_code', { code_input: code })
        return { data, error }
      } catch (error: any) {
        return { data: null, error: { message: error.message || 'Validate code failed' } }
      }
    },

    async use(code: string, userId?: string) {
      try {
        const { data, error } = await supabase
          .rpc('use_invitation_code', { code_input: code, user_id_input: userId })
        return { data, error }
      } catch (error: any) {
        return { data: null, error: { message: error.message || 'Use code failed' } }
      }
    }
  },

  // User Limits
  limits: {
    async check(userId: string, limitType: 'products' | 'purchases') {
      try {
        const { data, error } = await supabase
          .rpc('check_user_limit', { user_id_input: userId, limit_type: limitType })
        return { data, error }
      } catch (error: any) {
        return { data: null, error: { message: error.message || 'Check limit failed' } }
      }
    },

    async update(userId: string, updates: any) {
      try {
        const { data, error } = await supabase
          .from('user_limits')
          .update(updates)
          .eq('user_id', userId)
          .select()
          .single()
        return { data, error }
      } catch (error: any) {
        return { data: null, error: { message: error.message || 'Update limits failed' } }
      }
    }
  }
}
