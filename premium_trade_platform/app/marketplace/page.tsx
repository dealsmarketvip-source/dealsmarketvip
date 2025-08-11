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
import { useAuth } from "@/hooks/use-auth"
import { createClient, db } from "@/lib/supabase"
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
  const [products, setProducts] = useState<ExtendedProduct[]>([])
  const [totalProducts, setTotalProducts] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  
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

  useEffect(() => {
    fetchProducts()
  }, [filters, currentPage, searchQuery])

  const fetchProducts = async () => {
    try {
      setLoading(true)

      // Early check for Supabase configuration to prevent all database errors
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      if (!supabaseUrl || supabaseUrl.includes('placeholder') || supabaseUrl.includes('demo')) {
        console.warn('Supabase not configured, showing demo products directly')
        const demoProducts = [
          {
            id: 'demo-1',
            title: 'iPhone 14 Pro Max 256GB',
            description: 'Producto de demostración. Configure Supabase para ver productos reales.',
            price: 1200,
            currency: 'EUR',
            images: [],
            seller_id: 'demo-seller',
            status: 'active',
            condition: 'new',
            category: 'electronics',
            views_count: 125,
            favorites_count: 8,
            shipping_included: true,
            shipping_cost: 0,
            location: 'Madrid, España',
            featured: true,
            verified: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            seller: {
              id: 'demo-seller',
              full_name: 'Vendedor Demo',
              verification_status: 'verified' as const,
              profile_image_url: undefined
            }
          },
          {
            id: 'demo-2',
            title: 'MacBook Pro 14" M3',
            description: 'Producto de demostración. Configure Supabase para ver productos reales.',
            price: 2200,
            currency: 'EUR',
            images: [],
            seller_id: 'demo-seller-2',
            status: 'active',
            condition: 'like_new',
            category: 'electronics',
            views_count: 89,
            favorites_count: 12,
            shipping_included: false,
            shipping_cost: 15,
            location: 'Barcelona, España',
            featured: false,
            verified: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            seller: {
              id: 'demo-seller-2',
              full_name: 'TechStore Demo',
              verification_status: 'verified' as const,
              profile_image_url: undefined
            }
          }
        ]
        setProducts(demoProducts as any)
        setTotalProducts(2)
        return
      }
      
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

      const { data, error, count } = await db.products.search(
        searchFilters,
        currentPage,
        itemsPerPage
      )

      if (error) {
        // If error is an object with message property, throw the message
        const errorMessage = typeof error === 'object' && error.message ? error.message : String(error)
        throw new Error(errorMessage)
      }

      setProducts(data || [])
      setTotalProducts(count || 0)

      // Track search analytics
      if (userProfile && searchQuery) {
        const supabase = createClient()
        await supabase
          .from('user_searches')
          .insert({
            user_id: userProfile.id,
            search_query: searchQuery,
            filters_applied: searchFilters,
            results_count: count || 0
          })
      }

    } catch (error) {
      // Improve error logging to avoid [object Object]
      const logError = error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : {
        type: typeof error,
        value: String(error),
        raw: error
      }
      console.error('Error fetching products:', logError)

      // Check if it's a Supabase configuration issue
      let errorMessage: string
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = String(error.message)
      } else {
        errorMessage = String(error)
      }
      const isConfigIssue = errorMessage.includes('placeholder') ||
                           errorMessage.includes('not properly configured') ||
                           errorMessage.includes('Database not configured') ||
                           !process.env.NEXT_PUBLIC_SUPABASE_URL ||
                           process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')

      if (isConfigIssue) {
        console.warn('Database not configured, using demo mode')
        // Show demo products when database is not configured
        const demoProducts = [
          {
            id: 'demo-1',
            title: 'iPhone 14 Pro Max 256GB',
            description: 'Producto de demostración. Configure Supabase para ver productos reales.',
            price: 1200,
            currency: 'EUR',
            images: [],
            seller_id: 'demo-seller',
            status: 'active',
            condition: 'new',
            category: 'electronics',
            views_count: 125,
            favorites_count: 8,
            shipping_included: true,
            shipping_cost: 0,
            location: 'Madrid, España',
            featured: true,
            verified: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            seller: {
              id: 'demo-seller',
              full_name: 'Vendedor Demo',
              verification_status: 'verified' as const,
              profile_image_url: undefined
            }
          },
          {
            id: 'demo-2',
            title: 'MacBook Pro 14" M3',
            description: 'Producto de demostración. Configure Supabase para ver productos reales.',
            price: 2200,
            currency: 'EUR',
            images: [],
            seller_id: 'demo-seller-2',
            status: 'active',
            condition: 'like_new',
            category: 'electronics',
            views_count: 89,
            favorites_count: 12,
            shipping_included: false,
            shipping_cost: 15,
            location: 'Barcelona, España',
            featured: false,
            verified: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            seller: {
              id: 'demo-seller-2',
              full_name: 'TechStore Demo',
              verification_status: 'verified' as const,
              profile_image_url: undefined
            }
          }
        ]
        setProducts(demoProducts as any)
        setTotalProducts(2)
      } else {
        const userFriendlyMessage = error instanceof Error ? error.message : 'Error desconocido'
        toast.error(`Error al cargar los productos: ${userFriendlyMessage}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAddToFavorites = async (productId: string) => {
    if (!userProfile) {
      toast.error("Debes iniciar sesión para agregar favoritos")
      return
    }

    try {
      const { error } = await db.favorites.add(userProfile.id, productId)
      if (error) throw error
      
      toast.success("Producto agregado a favoritos")
      fetchProducts() // Refresh to update favorites count
    } catch (error) {
      console.error('Error adding to favorites:', error)
      toast.error("Error al agregar a favoritos")
    }
  }

  const handleProductClick = async (productId: string) => {
    // Track product view
    try {
      const supabase = createClient()
      
      // Increment view count
      await supabase
        .from('products')
        .update({ views_count: products.find(p => p.id === productId)?.views_count ?? 0 + 1 })
        .eq('id', productId)

      // Track user search click if applicable
      if (userProfile && searchQuery) {
        await supabase
          .from('user_searches')
          .insert({
            user_id: userProfile.id,
            search_query: searchQuery,
            clicked_product_id: productId,
            results_count: totalProducts
          })
      }
    } catch (error) {
      console.error('Error tracking product view:', error)
    }
  }

  const applyFilters = () => {
    const [sortBy, sortOrder] = (filters.sort_by + '-' + filters.sort_order).split('-')
    setFilters({
      ...filters,
      sort_by: sortBy as any,
      sort_order: sortOrder as any
    })
    setCurrentPage(1)
    fetchProducts()
  }

  const clearFilters = () => {
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
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price)
  }

  const totalPages = Math.ceil(totalProducts / itemsPerPage)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div>
              <motion.h1
                className="text-4xl font-bold text-white mb-2 glow-text flex items-center gap-3"
                animate={{
                  textShadow: [
                    "0 2px 8px rgba(255, 215, 0, 0.3)",
                    "0 4px 16px rgba(255, 215, 0, 0.5)",
                    "0 2px 8px rgba(255, 215, 0, 0.3)"
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <motion.div
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <ShoppingCart className="h-10 w-10 text-primary glow-primary-strong" />
                </motion.div>
                Marketplace
              </motion.h1>
              <motion.p
                className="text-gray-300"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Descubre productos únicos de vendedores verificados
              </motion.p>
            </div>
            
            <div className="flex items-center gap-3">
              <Link href="/upload">
                <Button className="bg-primary hover:bg-primary/90">
                  <Package className="h-4 w-4 mr-2" />
                  Vender Producto
                </Button>
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
              >
                Buscar
              </Button>
            </div>

            <div className="text-right">
              <p className="text-gray-300">
                {totalProducts.toLocaleString()} productos encontrados
              </p>
            </div>
          </div>
        </div>

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
                    onClick={clearFilters}
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

                {/* Condition Filter */}
                <div>
                  <Label className="text-gray-300 mb-3 block">Estado</Label>
                  <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Cualquier estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Cualquier estado</SelectItem>
                      <SelectItem value="new">Nuevo</SelectItem>
                      <SelectItem value="like_new">Como nuevo</SelectItem>
                      <SelectItem value="good">Bueno</SelectItem>
                      <SelectItem value="fair">Regular</SelectItem>
                      <SelectItem value="poor">Malo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Quick Filters */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="verified-only"
                      checked={showVerifiedOnly}
                      onChange={(e) => setShowVerifiedOnly(e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="verified-only" className="text-gray-300 text-sm">
                      Solo vendedores verificados
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="featured-only"
                      checked={showFeaturedOnly}
                      onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="featured-only" className="text-gray-300 text-sm">
                      Solo productos destacados
                    </Label>
                  </div>
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

                <Button 
                  onClick={applyFilters}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  Aplicar Filtros
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Products Grid/List */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-gray-800 border border-gray-700 rounded-lg p-4 animate-pulse">
                    <div className="bg-gray-700 aspect-square rounded-lg mb-4"></div>
                    <div className="bg-gray-700 h-4 rounded mb-2"></div>
                    <div className="bg-gray-700 h-4 rounded w-2/3 mb-2"></div>
                    <div className="bg-gray-700 h-6 rounded w-1/3"></div>
                  </div>
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
                  <Button 
                    onClick={clearFilters}
                    variant="outline"
                    className="border-gray-600"
                  >
                    Limpiar filtros
                  </Button>
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
                                  >
                                    <Heart className="h-4 w-4" />
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
