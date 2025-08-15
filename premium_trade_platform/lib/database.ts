import { createClient } from '@supabase/supabase-js'

// Database configuration for Neon/Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Check if database is properly configured
export const isDatabaseConnected = () => {
  const hasUrl = !!supabaseUrl
  const hasKey = !!supabaseAnonKey
  const urlNotPlaceholder = !supabaseUrl.includes('placeholder')
  const keyNotPlaceholder = !supabaseAnonKey.includes('placeholder')

  const result = hasUrl && hasKey && urlNotPlaceholder && keyNotPlaceholder

  console.log('🔍 Database connection check:', {
    hasUrl,
    hasKey,
    urlNotPlaceholder,
    keyNotPlaceholder,
    url: supabaseUrl?.substring(0, 30) + '...',
    key: supabaseAnonKey?.substring(0, 20) + '...',
    finalResult: result
  })

  return result
}

export const database = createClient(supabaseUrl, supabaseAnonKey)

// Database types and interfaces
export interface User {
  id: string
  email: string
  full_name: string
  phone?: string
  created_at: string
  updated_at: string
  email_verified: boolean
  phone_verified: boolean
  status: 'active' | 'suspended' | 'banned' | 'pending'
  last_login?: string
  is_admin: boolean
  role: 'user' | 'admin' | 'moderator'
  avatar_url?: string
  timezone: string
  language: string
}

export interface Company {
  id: string
  user_id: string
  company_name: string
  legal_name?: string
  tax_id?: string
  registration_number?: string
  company_type: string
  industry?: string
  description?: string
  website?: string
  founded_year?: number
  employee_count?: string
  annual_revenue_range?: string
  headquarters_address?: string
  country: string
  city?: string
  verification_status: 'pending' | 'verified' | 'rejected' | 'suspended'
  verification_date?: string
  verification_documents?: any
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  seller_id: string
  company_id?: string
  title: string
  description: string
  category: string
  subcategory?: string
  price?: number
  currency: string
  price_type: 'fixed' | 'negotiable' | 'auction' | 'quote_required'
  minimum_order_value?: number
  quantity_available?: number
  unit_type?: string
  images: string[]
  specifications: any
  terms_and_conditions?: string
  delivery_time?: string
  payment_terms?: string
  geographic_coverage: string[]
  certifications: string[]
  tags: string[]
  status: 'draft' | 'active' | 'paused' | 'sold' | 'expired' | 'removed'
  featured: boolean
  featured_until?: string
  views_count: number
  inquiries_count: number
  created_at: string
  updated_at: string
  published_at?: string
  expires_at?: string
}

export interface WantedPost {
  id: string
  buyer_id: string
  company_id?: string
  title: string
  description: string
  category: string
  subcategory?: string
  budget_min?: number
  budget_max?: number
  currency: string
  quantity_needed?: number
  unit_type?: string
  required_by?: string
  requirements: any
  preferred_suppliers: string[]
  geographic_preferences: string[]
  payment_terms?: string
  tags: string[]
  status: 'active' | 'fulfilled' | 'expired' | 'cancelled'
  responses_count: number
  created_at: string
  updated_at: string
  expires_at?: string
}

export interface Inquiry {
  id: string
  product_id?: string
  wanted_post_id?: string
  buyer_id: string
  seller_id: string
  subject: string
  message: string
  inquiry_type: 'product' | 'wanted_post' | 'general'
  quantity?: number
  proposed_price?: number
  currency: string
  delivery_requirements?: string
  status: 'pending' | 'responded' | 'negotiating' | 'accepted' | 'rejected' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  created_at: string
  updated_at: string
  responded_at?: string
}

export interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  message: string
  data: any
  read: boolean
  read_at?: string
  related_entity_type?: string
  related_entity_id?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  delivery_method: 'in_app' | 'email' | 'sms' | 'push'
  scheduled_for?: string
  sent_at?: string
  created_at: string
}

export interface Deal {
  id: string
  inquiry_id?: string
  buyer_id: string
  seller_id: string
  product_id?: string
  title: string
  description?: string
  quantity: number
  unit_price: number
  total_amount: number
  currency: string
  payment_terms?: string
  delivery_terms?: string
  delivery_date?: string
  status: string
  escrow_required: boolean
  escrow_amount?: number
  commission_rate: number
  platform_fee?: number
  contract_document?: string
  terms_accepted_buyer?: string
  terms_accepted_seller?: string
  payment_due_date?: string
  created_at: string
  updated_at: string
  completed_at?: string
}

// Database service class for common operations
export class DatabaseService {
  private client = database

  // User operations
  async getUser(id: string): Promise<User | null> {
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching user:', error)
      return null
    }

    return data
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error) {
      console.error('Error fetching user by email:', error)
      return null
    }

    return data
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const { data, error } = await this.client
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating user:', error)
      return null
    }

    return data
  }

  // Company operations
  async getCompany(userId: string): Promise<Company | null> {
    const { data, error } = await this.client
      .from('companies')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error fetching company:', error)
      return null
    }

    return data
  }

  async updateCompany(id: string, updates: Partial<Company>): Promise<Company | null> {
    const { data, error } = await this.client
      .from('companies')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating company:', error)
      return null
    }

    return data
  }

  // Product operations
  async getProducts(filters?: {
    category?: string
    status?: string
    seller_id?: string
    featured?: boolean
    limit?: number
    offset?: number
  }): Promise<Product[]> {
    let query = this.client
      .from('products')
      .select(`
        *,
        companies(company_name, verification_status),
        users(full_name)
      `)

    if (filters?.category) {
      query = query.eq('category', filters.category)
    }
    if (filters?.status) {
      query = query.eq('status', filters.status)
    }
    if (filters?.seller_id) {
      query = query.eq('seller_id', filters.seller_id)
    }
    if (filters?.featured !== undefined) {
      query = query.eq('featured', filters.featured)
    }

    query = query.order('created_at', { ascending: false })

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }
    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching products:', error)
      return []
    }

    return data || []
  }

  async getProduct(id: string): Promise<Product | null> {
    const { data, error } = await this.client
      .from('products')
      .select(`
        *,
        companies(company_name, verification_status, country, city),
        users(full_name, email)
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching product:', error)
      return null
    }

    return data
  }

  async incrementProductViews(productId: string): Promise<void> {
    const { error } = await this.client
      .from('products')
      .update({ 
        views_count: database.sql`views_count + 1`,
        updated_at: new Date().toISOString()
      })
      .eq('id', productId)

    if (error) {
      console.error('Error incrementing product views:', error)
    }
  }

  // Wanted posts operations
  async getWantedPosts(filters?: {
    category?: string
    status?: string
    buyer_id?: string
    limit?: number
    offset?: number
  }): Promise<WantedPost[]> {
    let query = this.client
      .from('wanted_posts')
      .select(`
        *,
        companies(company_name, verification_status),
        users(full_name)
      `)

    if (filters?.category) {
      query = query.eq('category', filters.category)
    }
    if (filters?.status) {
      query = query.eq('status', filters.status)
    }
    if (filters?.buyer_id) {
      query = query.eq('buyer_id', filters.buyer_id)
    }

    query = query.order('created_at', { ascending: false })

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }
    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching wanted posts:', error)
      return []
    }

    return data || []
  }

  // Notification operations
  async getNotifications(userId: string, options?: {
    unreadOnly?: boolean
    limit?: number
    offset?: number
  }): Promise<Notification[]> {
    // Check if database is connected
    if (!isDatabaseConnected()) {
      console.warn('Database not connected, returning mock notifications')
      return this.getMockNotifications(userId, options)
    }

    try {
      let query = this.client
        .from('notifications')
        .select('*')
        .eq('user_id', userId)

      if (options?.unreadOnly) {
        query = query.eq('read', false)
      }

      query = query.order('created_at', { ascending: false })

      if (options?.limit) {
        query = query.limit(options.limit)
      }
      if (options?.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 20) - 1)
      }

      const { data, error } = await query

      if (error) {
        // Properly log Supabase errors
        const errorInfo = {
          message: error.message || 'Unknown database error',
          details: error.details || 'No details available',
          hint: error.hint || 'No hint available',
          code: error.code || 'NO_CODE'
        }
        console.error('Database error fetching notifications:', errorInfo)
        return this.getMockNotifications(userId, options)
      }

      return data || []
    } catch (error: any) {
      // Handle different types of errors properly
      const errorInfo = {
        message: error?.message || error?.error?.message || String(error) || 'Unknown error',
        name: error?.name || 'UnknownError',
        details: error?.details || error?.error?.details || 'No details available',
        code: error?.code || error?.error?.code || 'NO_CODE',
        originalError: error
      }
      console.error('Catch block - Error fetching notifications:', errorInfo)
      return this.getMockNotifications(userId, options)
    }
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    const { error } = await this.client
      .from('notifications')
      .update({
        read: true,
        read_at: new Date().toISOString()
      })
      .eq('id', notificationId)

    if (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    const { error } = await this.client
      .from('notifications')
      .update({
        read: true,
        read_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('read', false)

    if (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  async createNotification(notification: Omit<Notification, 'id' | 'created_at'>): Promise<Notification | null> {
    const { data, error } = await this.client
      .from('notifications')
      .insert({
        ...notification,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating notification:', error)
      return null
    }

    return data
  }

  async getUnreadNotificationCount(userId: string): Promise<number> {
    // Check if database is connected
    if (!isDatabaseConnected()) {
      console.warn('Database not connected, returning mock unread count')
      return this.getMockNotifications(userId, { unreadOnly: true }).length
    }

    try {
      const { count, error } = await this.client
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false)

      if (error) {
        const errorInfo = {
          message: error.message || 'Unknown database error',
          details: error.details || 'No details available',
          hint: error.hint || 'No hint available',
          code: error.code || 'NO_CODE'
        }
        console.error('Database error getting unread notification count:', errorInfo)
        return 3 // Return mock count as fallback
      }

      return count || 0
    } catch (error: any) {
      const errorInfo = {
        message: error?.message || error?.error?.message || String(error) || 'Unknown error',
        name: error?.name || 'UnknownError',
        details: error?.details || error?.error?.details || 'No details available',
        code: error?.code || error?.error?.code || 'NO_CODE',
        originalError: error
      }
      console.error('Catch block - Error getting unread notification count:', errorInfo)
      return 3 // Return mock count as fallback
    }
  }

  // Mock notifications for when database is not connected
  private getMockNotifications(userId: string, options?: {
    unreadOnly?: boolean
    limit?: number
    offset?: number
  }): Notification[] {
    const mockNotifications: Notification[] = [
      {
        id: 'mock-1',
        user_id: userId,
        type: 'system_announcement',
        title: '🎉 Bienvenido a DealsMarket Premium',
        message: 'Tu plataforma B2B está lista. Conecta a Neon database para acceder a todas las funciones.',
        data: { platform: 'DealsMarket', setup_required: true },
        read: false,
        related_entity_type: 'system',
        related_entity_id: 'setup',
        priority: 'high',
        delivery_method: 'in_app',
        created_at: new Date().toISOString()
      },
      {
        id: 'mock-2',
        user_id: userId,
        type: 'product_viewed',
        title: '👀 Configuración pendiente',
        message: 'Para ver notificaciones reales, conecta tu base de datos Neon en el panel MCP.',
        data: { setup_step: 'database' },
        read: false,
        priority: 'medium',
        delivery_method: 'in_app',
        created_at: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'mock-3',
        user_id: userId,
        type: 'inquiry_received',
        title: '💼 Demo: Nueva consulta B2B',
        message: 'Ejemplo de notificación de consulta - aparecerá cuando conectes la base de datos.',
        data: { demo: true },
        read: true,
        priority: 'low',
        delivery_method: 'in_app',
        created_at: new Date(Date.now() - 7200000).toISOString()
      }
    ]

    let filtered = mockNotifications
    if (options?.unreadOnly) {
      filtered = filtered.filter(n => !n.read)
    }

    const limit = options?.limit || 20
    const offset = options?.offset || 0
    return filtered.slice(offset, offset + limit)
  }

  // Inquiry operations
  async createInquiry(inquiry: Omit<Inquiry, 'id' | 'created_at' | 'updated_at'>): Promise<Inquiry | null> {
    const { data, error } = await this.client
      .from('inquiries')
      .insert({
        ...inquiry,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating inquiry:', error)
      return null
    }

    // Create notification for seller
    await this.createNotification({
      user_id: inquiry.seller_id,
      type: 'inquiry_received',
      title: '💼 Nueva consulta recibida',
      message: `Has recibido una nueva consulta: "${inquiry.subject}"`,
      data: {
        inquiry_id: data.id,
        buyer_id: inquiry.buyer_id,
        product_id: inquiry.product_id,
        proposed_price: inquiry.proposed_price
      },
      read: false,
      related_entity_type: 'inquiry',
      related_entity_id: data.id,
      priority: inquiry.priority,
      delivery_method: 'in_app'
    })

    return data
  }

  async getInquiries(userId: string, type: 'sent' | 'received'): Promise<Inquiry[]> {
    const column = type === 'sent' ? 'buyer_id' : 'seller_id'
    
    const { data, error } = await this.client
      .from('inquiries')
      .select(`
        *,
        products(title, images),
        buyer:users!buyer_id(full_name, email),
        seller:users!seller_id(full_name, email)
      `)
      .eq(column, userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching inquiries:', error)
      return []
    }

    return data || []
  }

  // Deal operations
  async getDeals(userId: string): Promise<Deal[]> {
    const { data, error } = await this.client
      .from('deals')
      .select(`
        *,
        buyer:users!buyer_id(full_name, email),
        seller:users!seller_id(full_name, email),
        products(title, images)
      `)
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching deals:', error)
      return []
    }

    return data || []
  }

  // Categories
  async getCategories(): Promise<any[]> {
    const { data, error } = await this.client
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')

    if (error) {
      console.error('Error fetching categories:', error)
      return []
    }

    return data || []
  }

  // Search functionality
  async searchProducts(query: string, filters?: {
    category?: string
    minPrice?: number
    maxPrice?: number
    country?: string
  }): Promise<Product[]> {
    let dbQuery = this.client
      .from('products')
      .select(`
        *,
        companies(company_name, verification_status, country),
        users(full_name)
      `)
      .eq('status', 'active')

    if (query) {
      dbQuery = dbQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`)
    }

    if (filters?.category) {
      dbQuery = dbQuery.eq('category', filters.category)
    }

    if (filters?.minPrice) {
      dbQuery = dbQuery.gte('price', filters.minPrice)
    }

    if (filters?.maxPrice) {
      dbQuery = dbQuery.lte('price', filters.maxPrice)
    }

    if (filters?.country) {
      dbQuery = dbQuery.eq('companies.country', filters.country)
    }

    dbQuery = dbQuery.order('featured', { ascending: false })
                   .order('created_at', { ascending: false })
                   .limit(50)

    const { data, error } = await dbQuery

    if (error) {
      console.error('Error searching products:', error)
      return []
    }

    return data || []
  }
}

// Create singleton instance
export const dbService = new DatabaseService()

// Utility functions
export const formatCurrency = (amount: number, currency: string = 'EUR'): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount)
}

export const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date))
}

export const formatDateTime = (date: string): string => {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}
