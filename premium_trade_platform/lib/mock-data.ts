// Mock data for instant marketplace functionality
export const MOCK_PRODUCTS = [
  {
    id: 'prod-1',
    title: 'iPhone 15 Pro Max 1TB',
    description: 'Brand new iPhone 15 Pro Max with 1TB storage. Includes all original accessories and 1-year warranty.',
    price: 1299,
    currency: 'EUR',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1695048010755-ea90e6dd8fe6?w=800&h=600&fit=crop'
    ],
    seller_id: 'seller-1',
    status: 'active',
    condition: 'new',
    category: 'electronics',
    subcategory: 'smartphones',
    views_count: 245,
    favorites_count: 18,
    shipping_included: true,
    shipping_cost: 0,
    location: 'Madrid, Spain',
    featured: true,
    verified: true,
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z',
    specifications: {
      storage: '1TB',
      color: 'Natural Titanium',
      warranty: '1 year'
    },
    seller: {
      id: 'seller-1',
      full_name: 'Tech Innovations SL',
      verification_status: 'verified' as const,
      profile_image_url: undefined
    }
  },
  {
    id: 'prod-2',
    title: 'MacBook Pro 14" M3 Pro',
    description: 'Latest MacBook Pro with M3 Pro chip, 18GB RAM, 1TB SSD. Perfect for professionals.',
    price: 2399,
    currency: 'EUR',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&h=600&fit=crop'
    ],
    seller_id: 'seller-2',
    status: 'active',
    condition: 'like_new',
    category: 'electronics',
    subcategory: 'laptops',
    views_count: 189,
    favorites_count: 23,
    shipping_included: false,
    shipping_cost: 25,
    location: 'Barcelona, Spain',
    featured: true,
    verified: true,
    created_at: '2024-01-14T15:20:00Z',
    updated_at: '2024-01-14T15:20:00Z',
    specifications: {
      processor: 'M3 Pro',
      ram: '18GB',
      storage: '1TB SSD',
      screen: '14-inch Liquid Retina XDR'
    },
    seller: {
      id: 'seller-2',
      full_name: 'Digital Solutions Corp',
      verification_status: 'verified' as const,
      profile_image_url: undefined
    }
  },
  {
    id: 'prod-3',
    title: 'Tesla Model S Plaid 2023',
    description: 'High-performance electric vehicle with autopilot. Low mileage, excellent condition.',
    price: 89999,
    currency: 'EUR',
    images: [
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop'
    ],
    seller_id: 'seller-3',
    status: 'active',
    condition: 'excellent',
    category: 'vehicles',
    subcategory: 'electric',
    views_count: 567,
    favorites_count: 45,
    shipping_included: false,
    shipping_cost: 500,
    location: 'Valencia, Spain',
    featured: true,
    verified: true,
    created_at: '2024-01-13T09:15:00Z',
    updated_at: '2024-01-13T09:15:00Z',
    seller: {
      id: 'seller-3',
      full_name: 'Premium Motors SA',
      verification_status: 'verified' as const,
      profile_image_url: undefined
    }
  },
  {
    id: 'prod-4',
    title: 'Luxury Swiss Watch Collection',
    description: 'Authentic Rolex Submariner, mint condition with box and papers. Investment grade timepiece.',
    price: 12500,
    currency: 'EUR',
    images: [
      'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=800&h=600&fit=crop'
    ],
    seller_id: 'seller-4',
    status: 'active',
    condition: 'excellent',
    category: 'luxury',
    subcategory: 'watches',
    views_count: 334,
    favorites_count: 67,
    shipping_included: true,
    shipping_cost: 0,
    location: 'Marbella, Spain',
    featured: true,
    verified: true,
    created_at: '2024-01-12T14:45:00Z',
    updated_at: '2024-01-12T14:45:00Z',
    seller: {
      id: 'seller-4',
      full_name: 'Luxury Timepieces Ltd',
      verification_status: 'verified' as const,
      profile_image_url: undefined
    }
  },
  {
    id: 'prod-5',
    title: 'Professional Camera Equipment',
    description: 'Canon EOS R5 with 24-70mm f/2.8 lens. Professional photography package with accessories.',
    price: 3299,
    currency: 'EUR',
    images: [
      'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop'
    ],
    seller_id: 'seller-5',
    status: 'active',
    condition: 'like_new',
    category: 'electronics',
    subcategory: 'cameras',
    views_count: 156,
    favorites_count: 29,
    shipping_included: true,
    shipping_cost: 0,
    location: 'Seville, Spain',
    featured: false,
    verified: true,
    created_at: '2024-01-11T11:30:00Z',
    updated_at: '2024-01-11T11:30:00Z',
    seller: {
      id: 'seller-5',
      full_name: 'Photo Pro Studios',
      verification_status: 'verified' as const,
      profile_image_url: undefined
    }
  },
  {
    id: 'prod-6',
    title: 'Exclusive Art Collection',
    description: 'Contemporary painting by emerging artist. Certificate of authenticity included.',
    price: 8500,
    currency: 'EUR',
    images: [
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'
    ],
    seller_id: 'seller-6',
    status: 'active',
    condition: 'new',
    category: 'art',
    subcategory: 'paintings',
    views_count: 89,
    favorites_count: 15,
    shipping_included: false,
    shipping_cost: 50,
    location: 'Bilbao, Spain',
    featured: false,
    verified: true,
    created_at: '2024-01-10T16:20:00Z',
    updated_at: '2024-01-10T16:20:00Z',
    seller: {
      id: 'seller-6',
      full_name: 'Modern Art Gallery',
      verification_status: 'verified' as const,
      profile_image_url: undefined
    }
  }
]

// Simple function to get all products as array (for marketplace use)
export function getMockProductsArray() {
  return MOCK_PRODUCTS.map(product => ({
    ...product,
    specifications: product.specifications || {}
  }))
}

export function getMockProducts(filters: any = {}, page: number = 1, itemsPerPage: number = 20) {
  // Ensure all products have specifications property
  let filteredProducts = MOCK_PRODUCTS.map(product => ({
    ...product,
    specifications: product.specifications || {}
  }))

  // Apply search filter
  if (filters.q) {
    const query = filters.q.toLowerCase()
    filteredProducts = filteredProducts.filter(product =>
      product.title.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    )
  }

  // Apply category filter
  if (filters.category && filters.category !== 'all') {
    filteredProducts = filteredProducts.filter(product =>
      product.category === filters.category
    )
  }

  // Apply price range filter
  if (filters.min_price) {
    filteredProducts = filteredProducts.filter(product =>
      product.price >= filters.min_price
    )
  }
  
  if (filters.max_price) {
    filteredProducts = filteredProducts.filter(product =>
      product.price <= filters.max_price
    )
  }

  // Apply condition filter
  if (filters.condition && filters.condition !== 'all') {
    filteredProducts = filteredProducts.filter(product =>
      product.condition === filters.condition
    )
  }

  // Apply verified seller filter
  if (filters.seller_verified) {
    filteredProducts = filteredProducts.filter(product =>
      product.seller?.verification_status === 'verified'
    )
  }

  // Apply featured filter
  if (filters.featured) {
    filteredProducts = filteredProducts.filter(product =>
      product.featured === true
    )
  }

  // Apply sorting
  const sortBy = filters.sort_by || 'created_at'
  const sortOrder = filters.sort_order === 'asc' ? 1 : -1

  filteredProducts.sort((a, b) => {
    let aValue, bValue
    
    switch (sortBy) {
      case 'price':
        aValue = a.price
        bValue = b.price
        break
      case 'views_count':
        aValue = a.views_count
        bValue = b.views_count
        break
      case 'favorites_count':
        aValue = a.favorites_count
        bValue = b.favorites_count
        break
      case 'created_at':
      default:
        aValue = new Date(a.created_at).getTime()
        bValue = new Date(b.created_at).getTime()
        break
    }
    
    return (aValue - bValue) * sortOrder
  })

  // Apply pagination
  const startIndex = (page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

  return {
    data: paginatedProducts,
    count: filteredProducts.length,
    error: null
  }
}

export function getMockProductById(id: string) {
  const product = MOCK_PRODUCTS.find(p => p.id === id)
  const productWithSpecs = product ? {
    ...product,
    specifications: product.specifications || {}
  } : null

  return {
    data: productWithSpecs,
    error: productWithSpecs ? null : { message: 'Product not found' }
  }
}
