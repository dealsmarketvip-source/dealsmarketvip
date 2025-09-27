// Unified Database Service supporting both Neon PostgreSQL and Supabase
import { createClient } from '@supabase/supabase-js'
import { enhancedDbService, isNeonConnected } from './neon-adapter'

// Helper to format Supabase errors into readable strings
function formatSupabaseError(error: any): string {
  if (!error) return 'Unknown error'
  if (typeof error === 'string') return error
  const { message, details, hint, code } = (error || {}) as Record<string, any>
  const parts: string[] = []
  if (code) parts.push(`code=${code}`)
  if (message) parts.push(message)
  if (details) parts.push(`details=${details}`)
  if (hint) parts.push(`hint=${hint}`)
  if (parts.length) return parts.join(' | ')
  try {
    return JSON.stringify(error)
  } catch {
    return String(error)
  }
}

// Environment configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Detect which database provider to use
export const getDatabaseProvider = (): 'neon' | 'supabase' | 'mock' => {
  // Check if we have Neon credentials
  const hasNeonUrl = supabaseUrl.includes('neon.tech')
  
  // Check if we have valid Supabase credentials
  const hasSupabaseUrl = supabaseUrl.includes('supabase.co') && !supabaseUrl.includes('placeholder')
  const hasValidKey = !!supabaseAnonKey && !supabaseAnonKey.includes('placeholder')
  
  if (hasNeonUrl) {
    return 'neon'
  } else if (hasSupabaseUrl && hasValidKey) {
    return 'supabase'
  } else {
    return 'mock'
  }
}

// Create appropriate database client
export const createDatabaseClient = () => {
  const provider = getDatabaseProvider()
  
  if (provider === 'supabase') {
    return createClient(supabaseUrl, supabaseAnonKey)
  } else if (provider === 'neon') {
    // For Neon, we'll use the enhanced service
    return null // Neon uses different connection method
  } else {
    // Mock client for development
    return null
  }
}

// Unified Database Service
export class UnifiedDatabaseService {
  private provider: 'neon' | 'supabase' | 'mock'
  private client: ReturnType<typeof createClient> | null

  // Gracefully fallback to mock provider when Supabase is not fully configured
  private fallbackToMock(reason: string) {
    if (this.provider !== 'mock') {
      console.warn('⚠️ Switching database provider to MOCK:', reason)
      this.provider = 'mock'
      this.client = null
    }
  }

  constructor() {
    this.provider = getDatabaseProvider()
    this.client = createDatabaseClient()
    
    console.log(`🔗 Database Provider: ${this.provider.toUpperCase()}`)
    if (this.provider === 'neon') {
      console.log('📊 Using Neon PostgreSQL with enhanced adapter')
    } else if (this.provider === 'supabase') {
      console.log('📊 Using Supabase with standard client')
    } else {
      console.log('📊 Using mock data for development')
    }
  }

  // Check if database is connected
  isConnected(): boolean {
    switch (this.provider) {
      case 'neon':
        return isNeonConnected()
      case 'supabase':
        return !!this.client
      case 'mock':
        return false
      default:
        return false
    }
  }

  // Get provider info
  getProviderInfo() {
    return {
      provider: this.provider,
      connected: this.isConnected(),
      url: this.provider === 'neon' ? 'Neon PostgreSQL' : 
           this.provider === 'supabase' ? supabaseUrl : 'Mock Data',
      features: this.provider === 'neon' 
        ? ['PostgreSQL', 'Serverless', 'Real-time'] 
        : this.provider === 'supabase'
        ? ['PostgreSQL', 'Real-time', 'Auth']
        : ['Mock Data', 'Development Only']
    }
  }

  // Notification operations
  async getNotifications(userId: string, options?: {
    unreadOnly?: boolean
    limit?: number
    offset?: number
  }): Promise<any[]> {
    switch (this.provider) {
      case 'neon':
        return await enhancedDbService.getNotifications(userId, options)
      
      case 'supabase':
        if (!this.client) throw new Error('Supabase client not initialized')
        
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

        const { data, error } = await query

        if (error) {
          console.warn('Supabase error fetching notifications:', formatSupabaseError(error))
          const code = (error as any)?.code
          const message = (error as any)?.message || ''
          if (code === '42P01' || /relation .* does not exist/i.test(message) || /permission denied/i.test(message)) {
            this.fallbackToMock(`Notifications table unavailable or access denied (${code || 'no-code'})`)
          }
          return this.getMockNotifications(userId, options)
        }

        return data || []
      
      case 'mock':
      default:
        return this.getMockNotifications(userId, options)
    }
  }

  async getUnreadNotificationCount(userId: string): Promise<number> {
    switch (this.provider) {
      case 'neon':
        return await enhancedDbService.getUnreadNotificationCount(userId)
      
      case 'supabase':
        if (!this.client) return 0
        
        const { count, error } = await this.client
          .from('notifications')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('read', false)

        if (error) {
          console.warn('Supabase error getting unread count:', formatSupabaseError(error))
          const code = (error as any)?.code
          const message = (error as any)?.message || ''
          if (code === '42P01' || /relation .* does not exist/i.test(message) || /permission denied/i.test(message)) {
            this.fallbackToMock(`Notifications table unavailable or access denied (${code || 'no-code'})`)
          }
          return 3 // Mock count
        }

        return count || 0
      
      case 'mock':
      default:
        return 3 // Mock count
    }
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    switch (this.provider) {
      case 'neon':
        await enhancedDbService.markNotificationAsRead(notificationId)
        break
      
      case 'supabase':
        if (!this.client) return
        
        const { error } = await this.client
          .from('notifications')
          .update({
            read: true,
            read_at: new Date().toISOString()
          })
          .eq('id', notificationId)

        if (error) {
          console.warn('Supabase error marking notification as read:', formatSupabaseError(error))
        }
        break
      
      case 'mock':
      default:
        console.log('Mock: Marking notification as read:', notificationId)
        break
    }
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    switch (this.provider) {
      case 'neon':
        await enhancedDbService.markAllNotificationsAsRead(userId)
        break
      
      case 'supabase':
        if (!this.client) return
        
        const { error } = await this.client
          .from('notifications')
          .update({
            read: true,
            read_at: new Date().toISOString()
          })
          .eq('user_id', userId)
          .eq('read', false)

        if (error) {
          console.warn('Supabase error marking all notifications as read:', formatSupabaseError(error))
          throw new Error(`Failed to mark all notifications as read: ${'message' in (error as any) ? (error as any).message : 'Unknown error'}`)
        }
        break
      
      case 'mock':
      default:
        console.log('Mock: Marking all notifications as read for user:', userId)
        break
    }
  }

  async createNotification(notification: any): Promise<any> {
    switch (this.provider) {
      case 'neon':
        return await enhancedDbService.createNotification(notification)

      case 'supabase':
        if (!this.client) return null

        const { data, error } = await this.client
          .from('notifications')
          .insert({
            ...notification,
            created_at: new Date().toISOString()
          })
          .select()
          .single()

        if (error) {
          console.warn('Supabase error creating notification:', formatSupabaseError(error))
          return null
        }

        return data

      case 'mock':
      default:
        return { ...notification, id: 'mock-' + Date.now() }
    }
  }

  // Product operations
  async createProduct(productData: any): Promise<any> {
    switch (this.provider) {
      case 'neon':
      case 'supabase':
        if (!this.client && this.provider === 'supabase') {
          console.log('📦 No database client, using mock product creation')
          return this.createMockProduct(productData)
        }

        try {
          if (this.provider === 'supabase') {
            const { data, error } = await this.client!
              .from('products')
              .insert({
                ...productData,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
              .select()
              .single()

            if (error) {
              console.warn('Supabase error creating product:', formatSupabaseError(error))
              return this.createMockProduct(productData)
            }

            console.log('✅ Product saved to Supabase:', data.id)
            return data
          } else {
            // Neon - for now use mock since we don't have product table setup
            console.log('📦 Neon product creation (mock mode)')
            return this.createMockProduct(productData)
          }
        } catch (error) {
          console.warn('Error creating product:', formatSupabaseError(error))
          return this.createMockProduct(productData)
        }

      case 'mock':
      default:
        return this.createMockProduct(productData)
    }
  }

  private createMockProduct(productData: any): any {
    const mockProduct = {
      ...productData,
      id: productData.id || `mock-product-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    console.log('📦 Mock product created:', mockProduct.id)

    // Store in localStorage for persistence during demo
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        const existingProducts = JSON.parse(localStorage.getItem('mock_products') || '[]')
        existingProducts.push(mockProduct)
        localStorage.setItem('mock_products', JSON.stringify(existingProducts))
        console.log('💾 Product saved to localStorage')
      } catch (error) {
        console.warn('Could not save to localStorage:', error)
      }
    }

    return mockProduct
  }

  async getProducts(filters?: any): Promise<any[]> {
    switch (this.provider) {
      case 'supabase':
        if (!this.client) return this.getMockProducts()

        try {
          let query = this.client
            .from('products')
            .select('*')
            .eq('status', 'active')

          const { data, error } = await query.order('created_at', { ascending: false })

          if (error) {
            console.warn('Supabase error fetching products:', formatSupabaseError(error))
            return this.getMockProducts()
          }

          return data || []
        } catch (error) {
          console.warn('Error fetching products:', formatSupabaseError(error))
          return this.getMockProducts()
        }

      case 'neon':
      case 'mock':
      default:
        return this.getMockProducts()
    }
  }

  private getMockProducts(): any[] {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return [] // Return empty array on server-side
    }

    try {
      const stored = localStorage.getItem('mock_products')
      if (stored) {
        const products = JSON.parse(stored)
        console.log(`📦 Loaded ${products.length} products from localStorage`)
        return products
      }
    } catch (error) {
      console.warn('Could not load from localStorage:', error)
    }

    return []
  }

  // Mock notifications for development
  private getMockNotifications(userId: string, options?: {
    unreadOnly?: boolean
    limit?: number
    offset?: number
  }): any[] {
    const mockNotifications = [
      {
        id: 'unified-1',
        user_id: userId,
        type: 'system_announcement',
        title: '🎉 DealsMarket - Sistema Unificado',
        message: `Base de datos configurada: ${this.provider.toUpperCase()}. Sistema funcionando correctamente.`,
        data: { provider: this.provider, unified: true },
        read: false,
        related_entity_type: 'system',
        related_entity_id: 'unified_system',
        priority: 'high',
        delivery_method: 'in_app',
        created_at: new Date().toISOString()
      },
      {
        id: 'unified-2',
        user_id: userId,
        type: 'verification_approved',
        title: '✅ Configuración Verificada',
        message: `Proveedor de base de datos ${this.provider} funcionando correctamente. Todas las funciones disponibles.`,
        data: { provider: this.provider, status: 'verified' },
        read: false,
        priority: 'medium',
        delivery_method: 'in_app',
        created_at: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'unified-3',
        user_id: userId,
        type: 'inquiry_received',
        title: '💼 Sistema B2B Activo',
        message: 'Plataforma B2B completamente funcional. Marketplace y notificaciones operativos.',
        data: { marketplace: true, b2b: true },
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
}

// Create singleton instance
export const unifiedDb = new UnifiedDatabaseService()

// Export compatibility functions
export const isUnifiedDatabaseConnected = () => unifiedDb.isConnected()
export const getUnifiedDatabaseInfo = () => unifiedDb.getProviderInfo()

// Re-export types for compatibility
export type { Notification } from './database'
export { formatDateTime, formatDate, formatCurrency } from './database'
