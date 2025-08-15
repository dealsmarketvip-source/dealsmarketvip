"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LoadingSpinner, LoadingOverlay } from "@/components/ui/loading-spinner"
import { analytics } from "@/lib/analytics"
import { PageHeader } from "@/components/page-header"
import { EnhancedLoading, PageLoading } from "@/components/ui/enhanced-loading"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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
  Clock,
  X
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth-instant"
import { getMockProductsArray } from "@/lib/mock-data"
import { realProductManager, type RealProduct } from "@/lib/real-products"
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

// Filter Modal Component
function FilterModal({ 
  isOpen, 
  onClose, 
  searchQuery,
  setSearchQuery,
  priceRange,
  setPriceRange,
  selectedCategory,
  setSelectedCategory,
  filters,
  setFilters,
  onApplyFilters,
  formatPrice
}: {
  isOpen: boolean
  onClose: () => void
  searchQuery: string
  setSearchQuery: (value: string) => void
  priceRange: number[]
  setPriceRange: (value: number[]) => void
  selectedCategory: string
  setSelectedCategory: (value: string) => void
  filters: ProductFilters
  setFilters: (value: any) => void
  onApplyFilters: () => void
  formatPrice: (price: number) => string
}) {
  const clearFilters = () => {
    setSearchQuery('')
    setPriceRange([0, 10000])
    setSelectedCategory('all')
    setFilters({
      sort_by: 'created_at',
      sort_order: 'desc'
    })
  }

  const applyAndClose = () => {
    onApplyFilters()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-gray-800 border-gray-700 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold text-white">Filtros</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-gray-400 hover:text-white px-3 py-1 text-sm"
          >
            Limpiar
          </Button>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Search */}
          <div>
            <Label className="text-gray-300 mb-3 block text-sm font-medium">Buscar</Label>
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white h-11"
              placeholder="Buscar productos..."
            />
          </div>

          {/* Category Filter */}
          <div>
            <Label className="text-gray-300 mb-3 block text-sm font-medium">Categoría</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white h-11">
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
            <Label className="text-gray-300 mb-3 block text-sm font-medium">
              Rango de precio: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
            </Label>
            <div className="px-2">
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                max={10000}
                step={50}
                className="w-full"
              />
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <Label className="text-gray-300 mb-3 block text-sm font-medium">Ordenar por</Label>
            <Select 
              value={`${filters.sort_by}-${filters.sort_order}`}
              onValueChange={(value) => {
                const [sortBy, sortOrder] = value.split('-')
                setFilters((prev: any) => ({
                  ...prev,
                  sort_by: sortBy as any,
                  sort_order: sortOrder as any
                }))
              }}
            >
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white h-11">
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

          {/* Apply Button */}
          <div className="pt-4">
            <Button 
              onClick={applyAndClose}
              className="w-full bg-primary hover:bg-primary/90 h-11 text-base font-medium"
            >
              Aplicar Filtros
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function MarketplacePage() {
  const { user, userProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [products, setProducts] = useState<ExtendedProduct[]>([])
  const [totalProducts, setTotalProducts] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState<string | null>(null)
  
  const [filters, setFilters] = useState<ProductFilters>({
    sort_by: 'created_at',
    sort_order: 'desc'
  })
  
  const [searchQuery, setSearchQuery] = useState('')
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [selectedCategory, setSelectedCategory] = useState('all')

  const itemsPerPage = 20

  // Track page view
  useEffect(() => {
    analytics.trackView({
      page: 'marketplace',
      userId: user?.id
    });
  }, []);

  useEffect(() => {
    fetchProducts()
  }, [currentPage, filters])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 600)) // Reduced loading time

      // Get real products created by users
      const realProducts = realProductManager.getAllProducts({
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        searchQuery: searchQuery.trim() || undefined,
        minPrice: priceRange[0],
        maxPrice: priceRange[1]
      })

      // Get mock products with error handling
      let mockProducts = []
      try {
        mockProducts = getMockProductsArray()
      } catch (error) {
        console.error('Error getting mock products:', error)
        mockProducts = []
      }

      // Combine real and mock products
      const allProducts = [...realProducts, ...mockProducts]

      // Ensure we have a valid array
      let filteredProducts = Array.isArray(allProducts) ? [...allProducts] : []

      console.log(`📦 Loaded ${realProducts.length} real products + ${mockProducts.length} mock products`)

      // Apply search filter
      if (searchQuery.trim()) {
        filteredProducts = filteredProducts.filter(product => {
          try {
            return product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   product.description?.toLowerCase().includes(searchQuery.toLowerCase())
          } catch {
            return false
          }
        })
      }

      // Apply category filter
      if (selectedCategory !== 'all') {
        filteredProducts = filteredProducts.filter(product =>
          product.category === selectedCategory
        )
      }

      // Apply price range filter
      filteredProducts = filteredProducts.filter(product => {
        const price = product.price || 0
        return price >= priceRange[0] && price <= priceRange[1]
      })

      // Apply sorting with error handling
      filteredProducts.sort((a, b) => {
        try {
          switch (filters.sort_by) {
            case 'price':
              return filters.sort_order === 'asc'
                ? (a.price || 0) - (b.price || 0)
                : (b.price || 0) - (a.price || 0)
            case 'views_count':
              return filters.sort_order === 'asc'
                ? (a.views_count || 0) - (b.views_count || 0)
                : (b.views_count || 0) - (a.views_count || 0)
            case 'created_at':
            default:
              const dateA = new Date(a.created_at || 0).getTime()
              const dateB = new Date(b.created_at || 0).getTime()
              return filters.sort_order === 'asc' ? dateA - dateB : dateB - dateA
          }
        } catch {
          return 0
        }
      })

      // Apply pagination
      const startIndex = (currentPage - 1) * itemsPerPage
      const endIndex = startIndex + itemsPerPage
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

      setProducts(paginatedProducts)
      setTotalProducts(filteredProducts.length)

      console.log(`✅ Loaded ${paginatedProducts.length} products of ${filteredProducts.length} total`)

    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Error al cargar productos')
      // Set empty array as fallback
      setProducts([])
      setTotalProducts(0)
    } finally {
      setLoading(false)
      setInitialLoading(false)
    }
  }

  const handleProductClick = (productId: string) => {
    // Increment view count (mock)
    console.log('Product viewed:', productId)
  }

  const handleAddToFavorites = async (productId: string) => {
    if (!userProfile) {
      toast.error('You must sign in to add favorites')
      return
    }

    setFavoriteLoading(productId)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      toast.success('Added to favorites')
    } catch (error) {
      toast.error('Error adding to favorites')
    } finally {
      setFavoriteLoading(null)
    }
  }

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  if (initialLoading) {
    return <PageLoading />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Mobile-First Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 md:mb-8"
        >
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-4">
            Marketplace
          </h1>
          <p className="text-sm md:text-base text-gray-300 px-4">
            Descubre productos únicos de vendedores verificados
          </p>
        </motion.div>

        {/* Mobile-Optimized Search and Filter Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 md:mb-8"
        >
          <div className="space-y-4">
            {/* Search Bar - Full width on mobile */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 md:h-5 md:w-5" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white pl-10 h-11 md:h-12 text-base"
                placeholder="Buscar productos..."
                onKeyDown={(e) => e.key === 'Enter' && fetchProducts()}
              />
            </div>
            
            {/* Filter and Search Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowFilterModal(true)}
                className="border-gray-600 flex-1 h-11 md:h-12 text-sm md:text-base"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filtros
              </Button>
              <Button
                onClick={fetchProducts}
                className="bg-primary hover:bg-primary/90 px-6 md:px-8 h-11 md:h-12 text-sm md:text-base font-medium"
                disabled={loading}
              >
                {loading ? (
                  <LoadingSpinner size="sm" variant="default" />
                ) : (
                  'Buscar'
                )}
              </Button>
            </div>

            {/* Results Count and View Toggle */}
            <div className="flex justify-between items-center">
              <p className="text-sm md:text-base text-gray-300">
                {totalProducts.toLocaleString()} productos
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="border-gray-600 h-9 px-3"
              >
                {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Products Display */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {loading ? (
            <div className={`grid gap-4 md:gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={`marketplace-skeleton-${i}`} className="bg-gray-800 border-gray-700">
                  <CardContent className="pt-8 pb-8 md:pt-12 md:pb-12 text-center">
                    <LoadingSpinner size="sm" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : products.length === 0 ? (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="pt-12 pb-12 text-center">
                <Package className="h-12 w-12 md:h-16 md:w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
                  No se encontraron productos
                </h3>
                <p className="text-sm md:text-base text-gray-400 mb-6 px-4">
                  Intenta ajustar tus filtros de búsqueda o explora otras categorías
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Products Grid */}
              <div className={`grid gap-4 md:gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
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
                      <Card className="bg-gray-800 border-gray-700 hover:border-primary/50 transition-all cursor-pointer group h-full">
                        <CardContent className="p-0">
                          {viewMode === 'grid' ? (
                            // Grid View - Mobile Optimized
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
                                    <Package className="h-8 w-8 md:h-12 md:w-12 text-gray-400" />
                                  </div>
                                )}
                                
                                {/* Badges */}
                                <div className="absolute top-2 md:top-3 left-2 md:left-3 flex gap-1 md:gap-2">
                                  {product.featured && (
                                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                                      <Star className="h-2 w-2 md:h-3 md:w-3 mr-1" />
                                      Destacado
                                    </Badge>
                                  )}
                                  {product.seller?.verification_status === 'verified' && (
                                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                                      <Shield className="h-2 w-2 md:h-3 md:w-3 mr-1" />
                                    </Badge>
                                  )}
                                </div>

                                {/* Favorite Button */}
                                <div className="absolute top-2 md:top-3 right-2 md:right-3">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="bg-black/50 hover:bg-black/70 text-white h-8 w-8 md:h-9 md:w-9 p-0"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      handleAddToFavorites(product.id)
                                    }}
                                    disabled={favoriteLoading === product.id}
                                  >
                                    {favoriteLoading === product.id ? (
                                      <LoadingSpinner size="sm" variant="default" />
                                    ) : (
                                      <Heart className="h-3 w-3 md:h-4 md:w-4" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="p-3 md:p-4">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <h3 className="font-semibold text-white text-sm md:text-base line-clamp-2 flex-1">
                                    {product.title}
                                  </h3>
                                </div>
                                
                                <p className="text-xs md:text-sm text-gray-400 mb-3 line-clamp-2">
                                  {product.description}
                                </p>
                                
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-lg md:text-xl font-bold text-primary">
                                      {formatPrice(product.price || 0)}
                                    </p>
                                    <p className="text-xs md:text-sm text-gray-400">
                                      {product.seller?.full_name || 'Vendedor verificado'}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                                      <Eye className="h-3 w-3" />
                                      <span>{product.views_count || 0}</span>
                                    </div>
                                    <Badge variant="secondary" className="text-xs">
                                      {CATEGORIES.find(cat => cat.value === product.category)?.label || 'General'}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : (
                            // List View - Mobile Optimized
                            <div className="flex gap-3 md:gap-4 p-3 md:p-4">
                              <div className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 overflow-hidden rounded-lg">
                                {product.images?.length > 0 ? (
                                  <img 
                                    src={product.images[0]} 
                                    alt={product.title}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                                    <Package className="h-6 w-6 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <h3 className="font-semibold text-white text-sm md:text-base line-clamp-1">
                                    {product.title}
                                  </h3>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-gray-400 hover:text-white h-6 w-6 p-0 flex-shrink-0"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      handleAddToFavorites(product.id)
                                    }}
                                    disabled={favoriteLoading === product.id}
                                  >
                                    <Heart className="h-3 w-3" />
                                  </Button>
                                </div>
                                
                                <p className="text-xs md:text-sm text-gray-400 mb-2 line-clamp-2">
                                  {product.description}
                                </p>
                                
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-base md:text-lg font-bold text-primary mb-1">
                                      {formatPrice(product.price || 0)}
                                    </p>
                                    <div className="flex items-center gap-2">
                                      <p className="text-xs text-gray-400">
                                        {product.seller?.full_name || 'Vendedor verificado'}
                                      </p>
                                      {product.seller?.verification_status === 'verified' && (
                                        <Shield className="h-3 w-3 text-green-400" />
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                                      <Eye className="h-3 w-3" />
                                      <span>{product.views_count || 0}</span>
                                    </div>
                                    <Badge variant="secondary" className="text-xs">
                                      {CATEGORIES.find(cat => cat.value === product.category)?.label || 'General'}
                                    </Badge>
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

              {/* Pagination - Mobile Optimized */}
              {totalProducts > itemsPerPage && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="border-gray-600 text-sm"
                  >
                    Anterior
                  </Button>
                  <span className="text-sm text-gray-400 px-3">
                    Página {currentPage} de {Math.ceil(totalProducts / itemsPerPage)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={currentPage >= Math.ceil(totalProducts / itemsPerPage)}
                    className="border-gray-600 text-sm"
                  >
                    Siguiente
                  </Button>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        filters={filters}
        setFilters={setFilters}
        onApplyFilters={fetchProducts}
        formatPrice={formatPrice}
      />
    </div>
  )
}
