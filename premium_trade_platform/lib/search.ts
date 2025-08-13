// Algolia search service for content indexing and searching

export interface SearchConfig {
  appId: string
  apiKey: string
  indexName: string
}

export interface ContentItem {
  objectID: string
  title: string
  description?: string
  content?: string
  url?: string
  type: 'page' | 'product' | 'user' | 'post'
  tags?: string[]
  category?: string
  publishedAt?: string
  updatedAt?: string
  builderModel?: string
  builderEntry?: string
  metadata?: Record<string, any>
}

export interface SearchQuery {
  query: string
  filters?: string
  facetFilters?: string[][]
  page?: number
  hitsPerPage?: number
  attributesToRetrieve?: string[]
  attributesToHighlight?: string[]
}

export interface SearchResult {
  hits: ContentItem[]
  nbHits: number
  page: number
  nbPages: number
  hitsPerPage: number
  processingTimeMS: number
  query: string
  facets?: Record<string, Record<string, number>>
}

class AlgoliaSearchService {
  private config: SearchConfig | null = null
  private client: any = null
  private index: any = null

  constructor() {
    this.initializeClient()
  }

  private async initializeClient() {
    try {
      const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || process.env.ALGOLIA_APP_ID
      const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_API_KEY || process.env.ALGOLIA_API_KEY
      const indexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX || process.env.ALGOLIA_INDEX || 'dealsmarket_content'

      if (!appId || !apiKey) {
        console.warn('Algolia credentials not found. Search functionality will use fallback.')
        return
      }

      this.config = { appId, apiKey, indexName }

      // Dynamic import to avoid client-side issues
      if (typeof window !== 'undefined') {
        const algoliasearch = (await import('algoliasearch')).default
        this.client = algoliasearch(appId, apiKey)
        this.index = this.client.initIndex(indexName)
      } else {
        // Server-side
        const algoliasearch = (await import('algoliasearch')).default
        this.client = algoliasearch(appId, apiKey)
        this.index = this.client.initIndex(indexName)
      }

      console.log('✅ Algolia search initialized successfully')
    } catch (error) {
      console.warn('⚠️ Algolia initialization failed:', error)
    }
  }

  // Index content for searching
  async indexContent(content: ContentItem | ContentItem[]): Promise<boolean> {
    try {
      if (!this.index) {
        console.warn('Algolia not initialized, skipping indexing')
        return false
      }

      const items = Array.isArray(content) ? content : [content]
      
      // Prepare items for indexing
      const objectsToIndex = items.map(item => ({
        ...item,
        _tags: item.tags || [],
        _geoloc: item.metadata?.location ? {
          lat: item.metadata.location.lat,
          lng: item.metadata.location.lng
        } : undefined
      }))

      await this.index.saveObjects(objectsToIndex)
      console.log(`✅ Indexed ${items.length} items to Algolia`)
      return true
    } catch (error) {
      console.error('❌ Algolia indexing failed:', error)
      return false
    }
  }

  // Search content
  async searchContent(query: SearchQuery): Promise<SearchResult> {
    try {
      if (!this.index) {
        console.warn('Algolia not initialized, using fallback search')
        return this.fallbackSearch(query)
      }

      const searchOptions: any = {
        page: query.page || 0,
        hitsPerPage: query.hitsPerPage || 20,
        attributesToRetrieve: query.attributesToRetrieve || ['*'],
        attributesToHighlight: query.attributesToHighlight || ['title', 'description', 'content'],
        facets: ['type', 'category', 'tags'],
      }

      if (query.filters) {
        searchOptions.filters = query.filters
      }

      if (query.facetFilters) {
        searchOptions.facetFilters = query.facetFilters
      }

      const result = await this.index.search(query.query, searchOptions)
      
      return {
        hits: result.hits,
        nbHits: result.nbHits,
        page: result.page,
        nbPages: result.nbPages,
        hitsPerPage: result.hitsPerPage,
        processingTimeMS: result.processingTimeMS,
        query: result.query,
        facets: result.facets
      }
    } catch (error) {
      console.error('❌ Algolia search failed:', error)
      return this.fallbackSearch(query)
    }
  }

  // Fallback search for when Algolia is not available
  private async fallbackSearch(query: SearchQuery): Promise<SearchResult> {
    console.log('🔍 Using fallback search for:', query.query)
    
    // In a real app, this would search your database
    // For now, return empty results
    return {
      hits: [],
      nbHits: 0,
      page: 0,
      nbPages: 0,
      hitsPerPage: 20,
      processingTimeMS: 0,
      query: query.query
    }
  }

  // Delete content from index
  async deleteContent(objectIDs: string | string[]): Promise<boolean> {
    try {
      if (!this.index) {
        console.warn('Algolia not initialized, skipping deletion')
        return false
      }

      const ids = Array.isArray(objectIDs) ? objectIDs : [objectIDs]
      await this.index.deleteObjects(ids)
      console.log(`✅ Deleted ${ids.length} items from Algolia`)
      return true
    } catch (error) {
      console.error('❌ Algolia deletion failed:', error)
      return false
    }
  }

  // Clear entire index
  async clearIndex(): Promise<boolean> {
    try {
      if (!this.index) {
        console.warn('Algolia not initialized, skipping clear')
        return false
      }

      await this.index.clearObjects()
      console.log('✅ Cleared Algolia index')
      return true
    } catch (error) {
      console.error('❌ Algolia clear failed:', error)
      return false
    }
  }

  // Configure index settings
  async configureIndex(): Promise<boolean> {
    try {
      if (!this.index) {
        console.warn('Algolia not initialized, skipping configuration')
        return false
      }

      await this.index.setSettings({
        searchableAttributes: [
          'title',
          'description',
          'content',
          'tags'
        ],
        attributesForFaceting: [
          'type',
          'category',
          'tags',
          'builderModel'
        ],
        ranking: [
          'typo',
          'geo',
          'words',
          'filters',
          'proximity',
          'attribute',
          'exact',
          'custom'
        ],
        customRanking: [
          'desc(publishedAt)',
          'desc(updatedAt)'
        ],
        highlightPreTag: '<mark class="bg-primary/20">',
        highlightPostTag: '</mark>',
        snippetEllipsisText: '...'
      })

      console.log('✅ Algolia index configured')
      return true
    } catch (error) {
      console.error('❌ Algolia configuration failed:', error)
      return false
    }
  }

  // Get search analytics
  async getAnalytics(startDate: string, endDate: string) {
    try {
      if (!this.client) {
        console.warn('Algolia not initialized')
        return null
      }

      // This would require the Analytics API
      console.log('📊 Getting search analytics from', startDate, 'to', endDate)
      return null
    } catch (error) {
      console.error('❌ Analytics retrieval failed:', error)
      return null
    }
  }
}

// Singleton instance
export const searchService = new AlgoliaSearchService()

// Convenience functions
export const indexContent = (content: ContentItem | ContentItem[]) => searchService.indexContent(content)
export const searchContent = (query: SearchQuery) => searchService.searchContent(query)
export const deleteContent = (objectIDs: string | string[]) => searchService.deleteContent(objectIDs)
export const clearSearchIndex = () => searchService.clearIndex()
export const configureSearchIndex = () => searchService.configureIndex()

// Builder.io webhook handler for automatic indexing
export async function handleBuilderWebhook(data: any) {
  try {
    const { type, model, data: contentData } = data

    if (type === 'publish' || type === 'update') {
      // Convert Builder content to search format
      const searchItem: ContentItem = {
        objectID: contentData.id,
        title: contentData.data?.title || contentData.name || 'Untitled',
        description: contentData.data?.description || '',
        content: extractTextFromBuilder(contentData.data),
        url: contentData.data?.url || `/${model}/${contentData.id}`,
        type: 'page',
        tags: contentData.data?.tags || [],
        category: contentData.data?.category || model,
        publishedAt: contentData.firstPublished,
        updatedAt: contentData.lastUpdated,
        builderModel: model,
        builderEntry: contentData.id,
        metadata: {
          model,
          variation: contentData.data?.variation,
          priority: contentData.data?.priority || 0
        }
      }

      await indexContent(searchItem)
      console.log('✅ Indexed Builder content:', contentData.id)
    }

    if (type === 'unpublish' || type === 'delete') {
      await deleteContent(contentData.id)
      console.log('✅ Removed Builder content from index:', contentData.id)
    }

    return { success: true }
  } catch (error) {
    console.error('❌ Builder webhook handling failed:', error)
    return { success: false, error: error.message }
  }
}

// Extract text content from Builder.io blocks for indexing
function extractTextFromBuilder(data: any): string {
  if (!data || !data.blocks) return ''

  const extractText = (blocks: any[]): string => {
    return blocks.map(block => {
      let text = ''
      
      // Extract text from common components
      if (block.component?.options?.text) {
        text += block.component.options.text + ' '
      }
      
      if (block.component?.options?.content) {
        text += block.component.options.content + ' '
      }

      if (block.component?.options?.title) {
        text += block.component.options.title + ' '
      }

      // Recursively extract from children
      if (block.children && block.children.length > 0) {
        text += extractText(block.children)
      }

      return text
    }).join(' ')
  }

  return extractText(data.blocks).trim()
}
