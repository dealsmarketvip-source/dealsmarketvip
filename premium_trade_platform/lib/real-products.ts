// Real Product Management System with localStorage persistence
import { unifiedDb } from './unified-database'

export interface RealProduct {
  id: string
  title: string
  description: string
  price: number
  currency: string
  images: string[]
  seller_id: string
  seller_name: string
  seller_email: string
  status: 'active' | 'sold' | 'paused' | 'draft'
  condition: 'new' | 'used' | 'refurbished'
  category: string
  subcategory?: string
  location?: string
  views_count: number
  favorites_count: number
  shipping_included: boolean
  shipping_cost: number
  featured: boolean
  verified: boolean
  created_at: string
  updated_at: string
  specifications: Record<string, any>
  tags: string[]
}

export interface UserProductActivity {
  user_id: string
  products_sold: string[]
  products_bought: string[]
  active_deals: {
    id: string
    product_id: string
    type: 'buying' | 'selling'
    status: 'negotiating' | 'pending' | 'completed' | 'cancelled'
    created_at: string
  }[]
  total_sales: number
  total_purchases: number
}

class RealProductManager {
  private products: RealProduct[] = []
  private userActivities: Map<string, UserProductActivity> = new Map()

  constructor() {
    this.loadFromStorage()
  }

  // Load data from localStorage
  private loadFromStorage() {
    try {
      const stored = localStorage.getItem('dealsmarket_products')
      if (stored) {
        this.products = JSON.parse(stored)
      }

      const storedActivities = localStorage.getItem('dealsmarket_user_activities')
      if (storedActivities) {
        const activities = JSON.parse(storedActivities)
        this.userActivities = new Map(Object.entries(activities))
      }
    } catch (error) {
      console.warn('Error loading from localStorage:', error)
    }
  }

  // Save data to localStorage
  private saveToStorage() {
    try {
      localStorage.setItem('dealsmarket_products', JSON.stringify(this.products))
      
      const activitiesObj = Object.fromEntries(this.userActivities)
      localStorage.setItem('dealsmarket_user_activities', JSON.stringify(activitiesObj))
    } catch (error) {
      console.warn('Error saving to localStorage:', error)
    }
  }

  // Create a new product
  async createProduct(productData: Omit<RealProduct, 'id' | 'created_at' | 'updated_at' | 'views_count' | 'favorites_count'>): Promise<RealProduct> {
    const product: RealProduct = {
      ...productData,
      id: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      views_count: 0,
      favorites_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    this.products.unshift(product) // Add to beginning for newest first
    this.saveToStorage()

    // Update user activity
    this.updateUserActivity(product.seller_id, 'product_created', product.id)

    console.log('✅ Product created:', product.id, product.title)
    return product
  }

  // Get all products (for marketplace)
  getAllProducts(filters?: {
    category?: string
    minPrice?: number
    maxPrice?: number
    searchQuery?: string
    status?: string
  }): RealProduct[] {
    let filteredProducts = [...this.products]

    // Only show active products in marketplace
    filteredProducts = filteredProducts.filter(p => p.status === 'active')

    if (filters?.category && filters.category !== 'all') {
      filteredProducts = filteredProducts.filter(p => p.category === filters.category)
    }

    if (filters?.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.price >= filters.minPrice!)
    }

    if (filters?.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.price <= filters.maxPrice!)
    }

    if (filters?.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      filteredProducts = filteredProducts.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    return filteredProducts
  }

  // Get product by ID
  getProductById(id: string): RealProduct | null {
    return this.products.find(p => p.id === id) || null
  }

  // Get products by seller
  getProductsBySeller(sellerId: string): RealProduct[] {
    return this.products.filter(p => p.seller_id === sellerId)
  }

  // Update product views
  incrementViews(productId: string): void {
    const product = this.products.find(p => p.id === productId)
    if (product) {
      product.views_count++
      product.updated_at = new Date().toISOString()
      this.saveToStorage()
    }
  }

  // Toggle favorite
  toggleFavorite(productId: string, userId: string): boolean {
    const product = this.products.find(p => p.id === productId)
    if (!product) return false

    const favorites = this.getUserFavorites(userId)
    const isFavorite = favorites.includes(productId)

    if (isFavorite) {
      const updatedFavorites = favorites.filter(id => id !== productId)
      localStorage.setItem(`favorites_${userId}`, JSON.stringify(updatedFavorites))
      product.favorites_count = Math.max(0, product.favorites_count - 1)
    } else {
      const updatedFavorites = [...favorites, productId]
      localStorage.setItem(`favorites_${userId}`, JSON.stringify(updatedFavorites))
      product.favorites_count++
    }

    product.updated_at = new Date().toISOString()
    this.saveToStorage()
    return !isFavorite
  }

  // Get user favorites
  getUserFavorites(userId: string): string[] {
    try {
      const stored = localStorage.getItem(`favorites_${userId}`)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  // Update user activity
  updateUserActivity(userId: string, action: string, productId: string) {
    let activity = this.userActivities.get(userId)
    
    if (!activity) {
      activity = {
        user_id: userId,
        products_sold: [],
        products_bought: [],
        active_deals: [],
        total_sales: 0,
        total_purchases: 0
      }
    }

    switch (action) {
      case 'product_created':
        if (!activity.products_sold.includes(productId)) {
          activity.products_sold.push(productId)
        }
        break
      case 'product_bought':
        if (!activity.products_bought.includes(productId)) {
          activity.products_bought.push(productId)
          activity.total_purchases++
        }
        break
      case 'product_sold':
        activity.total_sales++
        break
    }

    this.userActivities.set(userId, activity)
    this.saveToStorage()
  }

  // Get user activity
  getUserActivity(userId: string): UserProductActivity | null {
    return this.userActivities.get(userId) || null
  }

  // Get user's products with details
  getUserProductsWithDetails(userId: string): {
    sold: RealProduct[]
    bought: RealProduct[]
    selling: RealProduct[]
  } {
    const activity = this.getUserActivity(userId)
    
    return {
      sold: activity ? activity.products_sold.map(id => this.getProductById(id)).filter(Boolean) as RealProduct[] : [],
      bought: activity ? activity.products_bought.map(id => this.getProductById(id)).filter(Boolean) as RealProduct[] : [],
      selling: this.getProductsBySeller(userId).filter(p => p.status === 'active')
    }
  }

  // Search products
  searchProducts(query: string, filters?: any): RealProduct[] {
    return this.getAllProducts({
      ...filters,
      searchQuery: query
    })
  }

  // Get marketplace stats
  getMarketplaceStats() {
    const activeProducts = this.products.filter(p => p.status === 'active')
    const totalViews = this.products.reduce((sum, p) => sum + p.views_count, 0)
    const totalSellers = new Set(this.products.map(p => p.seller_id)).size

    return {
      totalProducts: activeProducts.length,
      totalViews,
      totalSellers,
      averagePrice: activeProducts.length > 0 
        ? activeProducts.reduce((sum, p) => sum + p.price, 0) / activeProducts.length 
        : 0
    }
  }

  // Clear all data (for development)
  clearAllData() {
    this.products = []
    this.userActivities.clear()
    localStorage.removeItem('dealsmarket_products')
    localStorage.removeItem('dealsmarket_user_activities')
    // Clear all user favorites
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('favorites_')) {
        localStorage.removeItem(key)
      }
    })
  }
}

// Singleton instance
export const realProductManager = new RealProductManager()

// Utility functions
export const formatPrice = (price: number, currency: string = 'EUR'): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
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
