"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LoadingSpinner, LoadingOverlay } from "@/components/loading-spinner"
import { analytics } from "@/lib/analytics"
import { PageHeader } from "@/components/page-header"
import { EnhancedLoading, PageLoading } from "@/components/ui/enhanced-loading"
import { 
  Search, 
  Filter, 
  Heart, 
  Eye, 
  Star, 
  MapPin, 
  Package, 
  ShoppingCart,
  SlidersHorizontal,
  Grid3X3,
  List,
  Truck,
  Shield,
  TrendingUp,
  Clock
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth-instant"
import { getMockProducts } from "@/lib/mock-data"
import { toast } from "sonner"
import { ProductWithImages, ProductFilters, User } from "@/lib/types/database"
import Link from "next/link"

const CATEGORIES = [
  { value: 'electronics', label: 'Electrónicos' },
  { value: 'fashion', label: 'Moda' },
  { value: 'home', label: 'Hogar' },
  { value: 'vehicles', label: 'Vehículos' },
  { value: 'sports', label: 'Deportes' },
  { value: 'books', label: 'Libros' },
  { value: 'music', label: 'Música' },
  { value: 'art', label: 'Arte' },
  { value: 'business', label: 'Negocios' },
  { value: 'other', label: 'Otros' }
]

const SORT_OPTIONS = [
  { value: 'created_at-desc', label: 'Más recientes' },
  { value: 'created_at-asc', label: 'Más antiguos' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
  { value: 'views_count-desc', label: 'Más vistos' },
  { value: 'favorites_count-desc', label: 'Más favoritos' }
]

interface ExtendedProduct extends ProductWithImages {
  seller?: Pick<User, 'id' | 'full_name' | 'verification_status' | 'profile_image_url'>
}

export default function MarketplacePage() {
  const { user, userProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [products, setProducts] = useState<ExtendedProduct[]>([])
  const [totalProducts, setTotalProducts] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState<string | null>(null)
  
  const [filters, setFilters] = useState<ProductFilters>({
    sort_by: 'created_at',
    sort_order: 'desc'
  })
  
  const [searchQuery, setSearchQuery] = useState('')
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedCondition, setSelectedCondition] = useState('all')
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false)
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)

  const itemsPerPage = 20

  // Track page view
  useEffect(() => {
    analytics.trackView('marketplace', {
      total_products: totalProducts,
      view_mode: viewMode,
      filters_applied: Object.keys(filters).length > 0
    });
  }, []);

  useEffect(() => {
    fetchProducts()
  }, [filters, currentPage, searchQuery])

  const fetchProducts = async () => {
    try {
      setLoading(true)

      // Use instant mock data - no database calls
      const searchFilters = {
        ...filters,
        ...(selectedCategory && { category: selectedCategory }),
        ...(selectedCondition && { condition: selectedCondition }),
        ...(showVerifiedOnly && { seller_verified: true }),
        ...(showFeaturedOnly && { featured: true }),
        ...(priceRange[0] > 0 && { min_price: priceRange[0] }),
        ...(priceRange[1] < 10000 && { max_price: priceRange[1] }),
        ...(searchQuery && { q: searchQuery })
      }

      const { data, error, count } = getMockProducts(
        searchFilters,
        currentPage,
        itemsPerPage
      )

      // Mock data should never have errors, but handle just in case
      if (error) {
        console.error('Mock data error:', error)
        setProducts([])
        setTotalProducts(0)
        return
      }

      setProducts(data || [])
      setTotalProducts(count || 0)

    } catch (error) {
      console.error('Error loading products:', error)
      // Set empty state for any unexpected errors
      setProducts([])
      setTotalProducts(0)
    } finally {
      setLoading(false)
      setInitialLoading(false)
    }
  }

  const handleAddToFavorites = async (productId: string) => {
    if (!userProfile) {
      toast.error("Please sign in to add favorites")
      return
    }

    setFavoriteLoading(productId)

    // Simulate adding to favorites
    setTimeout(() => {
      toast.success("Added to favorites!")

      // Update the favorites count in the current products
      setProducts(prev => prev.map(product =>
        product.id === productId
          ? { ...product, favorites_count: product.favorites_count + 1 }
          : product
      ))

      setFavoriteLoading(null)
    }, 500)
  }

  const handleProductClick = async (productId: string) => {
    // Mock tracking for product view - no database calls
    try {
      // Update view count in local state
      setProducts(prev => prev.map(product =>
        product.id === productId
          ? { ...product, views_count: product.views_count + 1 }
          : product
      ))

      // Log analytics (mock)
      console.log('Product view tracked:', {
        productId,
        searchQuery,
        totalResults: totalProducts,
        user: userProfile?.email
      })
    } catch (error) {
      console.error('Error tracking product view:', error)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price)
  }

  const totalPages = Math.ceil(totalProducts / itemsPerPage)

  if (initialLoading) {
    return <LoadingOverlay isLoading={true} text="Cargando marketplace..." variant="shopping" />
  }

  // Show loading screen if not authenticated
  // Allow access to marketplace for demo purposes
  // if (!user) {
  //   return <PageLoading message="Please log in to access the marketplace" />
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <motion.div
                  className="w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center"
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(245, 158, 11, 0.3)",
                      "0 0 40px rgba(245, 158, 11, 0.6)",
                      "0 0 20px rgba(245, 158, 11, 0.3)"
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <ShoppingCart className="h-6 w-6 text-primary-foreground" />
                </motion.div>
                Marketplace
              </h1>
              <p className="text-gray-300">
                Discover unique products from verified sellers
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Link href="/sell">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className="bg-primary hover:bg-primary/90 relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                      animate={{
                        x: ['-100%', '100%']
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                    <Package className="h-4 w-4 mr-2" />
                    Sell Product
                  </Button>
                </motion.div>
              </Link>
              <Button
                variant="outline"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="border-gray-600"
              >
                {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Search and Stats Bar */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && fetchProducts()}
                  className="bg-gray-800 border-gray-600 text-white pl-10 h-12"
                  placeholder="Buscar productos..."
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="border-gray-600 flex-1"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filtros
              </Button>
              <Button
                onClick={fetchProducts}
                className="bg-primary hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? (
                  <LoadingSpinner size="sm" variant="default" />
                ) : (
                  'Buscar'
                )}
              </Button>
            </div>

            <div className="text-right">
              <p className="text-gray-300">
                {totalProducts.toLocaleString()} productos encontrados
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className={`lg:col-span-1 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  Filtros
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setSearchQuery('')
                      setPriceRange([0, 10000])
                      setSelectedCategory('all')
                      setSelectedCondition('all')
                      setShowVerifiedOnly(false)
                      setShowFeaturedOnly(false)
                      setFilters({
                        sort_by: 'created_at',
                        sort_order: 'desc'
                      })
                      setCurrentPage(1)
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    Limpiar
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Category Filter */}
                <div>
                  <Label className="text-gray-300 mb-3 block">Categoría</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Todas las categorías" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las categorías</SelectItem>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div>
                  <Label className="text-gray-300 mb-3 block">
                    Rango de precio: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                  </Label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={10000}
                    step={50}
                    className="w-full"
                  />
                </div>

                {/* Sort Options */}
                <div>
                  <Label className="text-gray-300 mb-3 block">Ordenar por</Label>
                  <Select 
                    value={`${filters.sort_by}-${filters.sort_order}`}
                    onValueChange={(value) => {
                      const [sortBy, sortOrder] = value.split('-')
                      setFilters(prev => ({
                        ...prev,
                        sort_by: sortBy as any,
                        sort_order: sortOrder as any
                      }))
                    }}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SORT_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products Grid/List */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="bg-gray-800 border-gray-700">
                    <CardContent className="pt-12 pb-12 text-center">
                      <LoadingSpinner size="sm" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : products.length === 0 ? (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="pt-12 pb-12 text-center">
                  <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No se encontraron productos
                  </h3>
                  <p className="text-gray-400 mb-6">
                    {process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder') || !process.env.NEXT_PUBLIC_SUPABASE_URL
                      ? 'La base de datos no está configurada. Necesitas configurar Supabase para ver productos.'
                      : 'Intenta ajustar tus filtros de búsqueda o explora otras categorías'
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Products Display */}
                <div className={
                  viewMode === 'grid' 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                    : "space-y-4"
                }>
                  {products.map((product) => (
                    <Link 
                      key={product.id} 
                      href={`/product/${product.id}`}
                      onClick={() => handleProductClick(product.id)}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card className="bg-gray-800 border-gray-700 hover:border-primary/50 transition-all cursor-pointer group">
                          <CardContent className="p-0">
                            {viewMode === 'grid' ? (
                              // Grid View
                              <>
                                <div className="relative aspect-square overflow-hidden rounded-t-lg">
                                  {product.images?.length > 0 ? (
                                    <img 
                                      src={product.images[0]} 
                                      alt={product.title}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                                      <Package className="h-12 w-12 text-gray-400" />
                                    </div>
                                  )}
                                  
                                  {/* Badges */}
                                  <div className="absolute top-3 left-3 flex gap-2">
                                    {product.featured && (
                                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                                        <Star className="h-3 w-3 mr-1" />
                                        Destacado
                                      </Badge>
                                    )}
                                    {product.seller?.verification_status === 'verified' && (
                                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                                        <Shield className="h-3 w-3 mr-1" />
                                      </Badge>
                                    )}
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="absolute top-3 right-3">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="bg-black/50 hover:bg-black/70 text-white"
                                      onClick={(e) => {
                                        e.preventDefault()
                                        handleAddToFavorites(product.id)
                                      }}
                                      disabled={favoriteLoading === product.id}
                                    >
                                      {favoriteLoading === product.id ? (
                                        <LoadingSpinner size="sm" variant="default" />
                                      ) : (
                                        <Heart className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </div>
                                </div>
                                
                                <div className="p-4">
                                  <h3 className="text-white font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                    {product.title}
                                  </h3>
                                  
                                  <div className="flex items-center gap-2 mb-2">
                                    <Avatar className="h-6 w-6">
                                      <AvatarImage src={product.seller?.profile_image_url} />
                                      <AvatarFallback className="text-xs">
                                        {product.seller?.full_name?.charAt(0) || 'V'}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="text-gray-400 text-sm">
                                      {product.seller?.full_name || 'Vendedor'}
                                    </span>
                                  </div>

                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-2xl font-bold text-primary">
                                        {formatPrice(product.price)}
                                      </p>
                                      {product.shipping_included ? (
                                        <p className="text-xs text-green-400">Envío incluido</p>
                                      ) : (
                                        <p className="text-xs text-gray-400">+ envío</p>
                                      )}
                                    </div>
                                    
                                    <div className="text-right">
                                      <div className="flex items-center gap-1 text-gray-400 text-sm">
                                        <Eye className="h-3 w-3" />
                                        {product.views_count}
                                      </div>
                                      <div className="flex items-center gap-1 text-gray-400 text-sm">
                                        <Heart className="h-3 w-3" />
                                        {product.favorites_count}
                                      </div>
                                    </div>
                                  </div>

                                  {product.location && (
                                    <div className="flex items-center gap-1 text-gray-400 text-sm mt-2">
                                      <MapPin className="h-3 w-3" />
                                      {product.location}
                                    </div>
                                  )}
                                </div>
                              </>
                            ) : (
                              // List View
                              <div className="flex gap-4 p-4">
                                <div className="w-32 h-32 flex-shrink-0">
                                  {product.images?.length > 0 ? (
                                    <img 
                                      src={product.images[0]} 
                                      alt={product.title}
                                      className="w-full h-full object-cover rounded-lg"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-gray-700 flex items-center justify-center rounded-lg">
                                      <Package className="h-8 w-8 text-gray-400" />
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex-1">
                                  <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-white font-semibold text-lg group-hover:text-primary transition-colors">
                                      {product.title}
                                    </h3>
                                    <div className="flex gap-2">
                                      {product.featured && (
                                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                                          Destacado
                                        </Badge>
                                      )}
                                      {product.seller?.verification_status === 'verified' && (
                                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                                          Verificado
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                                    {product.description}
                                  </p>
                                  
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                      <div className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6">
                                          <AvatarImage src={product.seller?.profile_image_url} />
                                          <AvatarFallback className="text-xs">
                                            {product.seller?.full_name?.charAt(0) || 'V'}
                                          </AvatarFallback>
                                        </Avatar>
                                        <span className="text-gray-400 text-sm">
                                          {product.seller?.full_name || 'Vendedor'}
                                        </span>
                                      </div>
                                      
                                      {product.location && (
                                        <div className="flex items-center gap-1 text-gray-400 text-sm">
                                          <MapPin className="h-3 w-3" />
                                          {product.location}
                                        </div>
                                      )}
                                    </div>
                                    
                                    <div className="text-right">
                                      <p className="text-2xl font-bold text-primary">
                                        {formatPrice(product.price)}
                                      </p>
                                      <div className="flex items-center gap-3 text-gray-400 text-sm">
                                        <div className="flex items-center gap-1">
                                          <Eye className="h-3 w-3" />
                                          {product.views_count}
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <Heart className="h-3 w-3" />
                                          {product.favorites_count}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="border-gray-600"
                    >
                      Anterior
                    </Button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          onClick={() => setCurrentPage(page)}
                          className={currentPage === page ? "bg-primary" : "border-gray-600"}
                        >
                          {page}
                        </Button>
                      )
                    })}
                    
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="border-gray-600"
                    >
                      Siguiente
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
