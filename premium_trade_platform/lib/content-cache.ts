// Content caching utilities for Builder.io and other API calls

export interface CacheConfig {
  revalidate: number // seconds
  tags?: string[]
}

export const CacheConfigs = {
  // Static content - cache for 5 minutes
  static: { revalidate: 300 } as CacheConfig,
  
  // Dynamic content - cache for 1 minute
  dynamic: { revalidate: 60 } as CacheConfig,
  
  // Real-time content - cache for 30 seconds
  realtime: { revalidate: 30 } as CacheConfig,
  
  // User-specific content - cache for 15 seconds
  userSpecific: { revalidate: 15 } as CacheConfig,
} as const

// Enhanced fetch with caching for Builder.io Content API
export async function fetchWithCache<T>(
  url: string, 
  options: RequestInit & { next?: CacheConfig } = {}
): Promise<T> {
  const { next = CacheConfigs.dynamic, ...fetchOptions } = options
  
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      next: {
        revalidate: next.revalidate,
        tags: next.tags,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Fetch with cache error:', error)
    throw error
  }
}

// Builder.io specific content fetching with caching
export class BuilderContentCache {
  private static readonly API_BASE = 'https://cdn.builder.io/api/v1'
  
  static async getContent(
    model: string, 
    options: {
      apiKey: string
      userAttributes?: Record<string, any>
      limit?: number
      offset?: number
      query?: Record<string, any>
      cacheTtl?: number
    }
  ) {
    const { 
      apiKey, 
      userAttributes = {}, 
      limit = 1, 
      offset = 0, 
      query = {},
      cacheTtl = 60 
    } = options

    const searchParams = new URLSearchParams({
      apiKey,
      limit: limit.toString(),
      offset: offset.toString(),
      userAttributes: JSON.stringify(userAttributes),
      ...Object.entries(query).reduce((acc, [key, value]) => {
        acc[`query.${key}`] = value
        return acc
      }, {} as Record<string, string>)
    })

    const url = `${this.API_BASE}/content/${model}?${searchParams}`
    
    return fetchWithCache(url, {
      next: { 
        revalidate: cacheTtl,
        tags: [`builder-${model}`, `builder-content`]
      }
    })
  }

  static async getPage(
    model: string,
    slug: string,
    options: {
      apiKey: string
      userAttributes?: Record<string, any>
      cacheTtl?: number
    }
  ) {
    const { apiKey, userAttributes = {}, cacheTtl = 300 } = options

    const searchParams = new URLSearchParams({
      apiKey,
      userAttributes: JSON.stringify(userAttributes),
      'query.urlPath': slug
    })

    const url = `${this.API_BASE}/content/${model}?${searchParams}`
    
    return fetchWithCache(url, {
      next: { 
        revalidate: cacheTtl,
        tags: [`builder-${model}`, `builder-page-${slug}`]
      }
    })
  }

  // Clear specific cache tags
  static async revalidateTag(tag: string) {
    if (typeof window === 'undefined') {
      // Server-side cache revalidation
      try {
        const { revalidateTag } = await import('next/cache')
        revalidateTag(tag)
      } catch (error) {
        console.warn('Cache revalidation failed:', error)
      }
    }
  }

  // Clear all builder content cache
  static async revalidateBuilderContent() {
    await this.revalidateTag('builder-content')
  }

  // Clear specific model cache
  static async revalidateModel(model: string) {
    await this.revalidateTag(`builder-${model}`)
  }
}

// Database content caching
export class DatabaseCache {
  static async getProducts(filters: any = {}, options: { cacheTtl?: number } = {}) {
    const { cacheTtl = 60 } = options
    
    // In a real app, this would fetch from your database with caching
    return fetchWithCache('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filters),
      next: { 
        revalidate: cacheTtl,
        tags: ['products', 'marketplace']
      }
    })
  }

  static async getUser(userId: string, options: { cacheTtl?: number } = {}) {
    const { cacheTtl = 300 } = options
    
    return fetchWithCache(`/api/users/${userId}`, {
      next: { 
        revalidate: cacheTtl,
        tags: [`user-${userId}`, 'users']
      }
    })
  }

  static async revalidateProducts() {
    await BuilderContentCache.revalidateTag('products')
  }

  static async revalidateUser(userId: string) {
    await BuilderContentCache.revalidateTag(`user-${userId}`)
  }
}

// Memory cache for client-side
class MemoryCache {
  private cache = new Map<string, { data: any; expires: number }>()

  set(key: string, data: any, ttl: number = 60000) {
    this.cache.set(key, {
      data,
      expires: Date.now() + ttl
    })
  }

  get(key: string) {
    const item = this.cache.get(key)
    
    if (!item) return null
    
    if (Date.now() > item.expires) {
      this.cache.delete(key)
      return null
    }
    
    return item.data
  }

  clear(prefix?: string) {
    if (prefix) {
      for (const key of this.cache.keys()) {
        if (key.startsWith(prefix)) {
          this.cache.delete(key)
        }
      }
    } else {
      this.cache.clear()
    }
  }
}

export const memoryCache = new MemoryCache()

// React hook for cached data fetching
export function useCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 60000
) {
  const cachedData = memoryCache.get(key)
  
  if (cachedData) {
    return cachedData
  }

  // This is a simplified version - in practice you'd use SWR or React Query
  fetcher().then(data => {
    memoryCache.set(key, data, ttl)
  })

  return null
}
