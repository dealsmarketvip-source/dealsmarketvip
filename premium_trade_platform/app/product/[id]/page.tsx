"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { LoadingSpinner, LoadingOverlay } from '@/components/ui/loading-spinner'
import { EnhancedLoading } from '@/components/ui/enhanced-loading'
import { 
  Heart, 
  Share2, 
  MapPin, 
  Package, 
  Truck, 
  Shield, 
  Star, 
  Eye, 
  Clock,
  ArrowLeft,
  MessageCircle,
  Phone,
  Mail,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Users,
  Crown
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth-instant'
import { getMockProductById } from '@/lib/mock-data'
import { realProductManager } from '@/lib/real-products'
import { toast } from 'sonner'

interface Product {
  id: string
  title: string
  description: string
  price: number
  currency: string
  images: string[]
  seller_id: string
  status: string
  condition: string
  category: string
  subcategory?: string
  location?: string
  views_count?: number
  favorites_count?: number
  shipping_included?: boolean
  shipping_cost?: number
  created_at: string
  updated_at: string
  specifications?: any
  seller?: {
    id: string
    full_name: string
    verification_status: string
    profile_image_url?: string
  }
}

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const { user, userProfile } = useAuth()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [initialLoading, setInitialLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState(false)
  const [contactLoading, setContactLoading] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [params.id])

  const fetchProduct = async () => {
    setLoading(true)
    setInitialLoading(true)
    
    try {
      // Show loading for realistic UX
      await new Promise(resolve => setTimeout(resolve, 1000))

      // First try to get real product
      let product = realProductManager.getProductById(params.id as string)

      // If not found in real products, try mock data
      if (!product) {
        const productResult = getMockProductById(params.id as string)
        if (!productResult.data || productResult.error) {
          toast.error(productResult.error?.message || 'Product not found')
          router.push('/marketplace')
          return
        }
        product = productResult.data
      } else {
        // Increment views for real products
        realProductManager.incrementViews(params.id as string)
      }

      setProduct(product)
      
      // Check if it's in favorites (mock)
      const favoriteItems = JSON.parse(localStorage.getItem('favorites') || '[]')
      setIsFavorite(favoriteItems.includes(params.id))

    } catch (error) {
      console.error('Error fetching product:', error)
      toast.error('Error loading product')
      router.push('/marketplace')
    } finally {
      setLoading(false)
      setInitialLoading(false)
    }
  }

  const handleFavorite = async () => {
    if (!userProfile) {
      toast.error('You must sign in to add favorites')
      router.push('/login')
      return
    }

    setFavoriteLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))

      const favoriteItems = JSON.parse(localStorage.getItem('favorites') || '[]')
      
      if (isFavorite) {
        const updatedFavorites = favoriteItems.filter((id: string) => id !== params.id)
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
        setIsFavorite(false)
        toast.success('Removed from favorites')
      } else {
        const updatedFavorites = [...favoriteItems, params.id]
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
        setIsFavorite(true)
        toast.success('Added to favorites')
      }
    } catch (error) {
      toast.error('Error updating favorites')
    } finally {
      setFavoriteLoading(false)
    }
  }

  const handleContact = async () => {
    if (!userProfile) {
      toast.error('You must sign in to contact the seller')
      router.push('/login')
      return
    }

    setContactLoading(true)
    // Simulate contact action
    setTimeout(() => {
      setContactLoading(false)
      toast.success('Message sent to seller')
    }, 1500)
  }

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  // Show enhanced loading screen
  if (initialLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <EnhancedLoading 
          type="page" 
          fullscreen 
          message="Cargando producto..."
        />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <Card className="bg-gray-800 border-gray-700 p-8 text-center">
          <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Product not found</h2>
          <p className="text-gray-400 mb-6">The product you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/marketplace')}>
            Back to Marketplace
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-6 md:py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to marketplace
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gray-800 border-gray-700 overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-square">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentImageIndex}
                      src={product.images[currentImageIndex] || '/placeholder.svg'}
                      alt={product.title}
                      className="w-full h-full object-cover"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </AnimatePresence>
                  
                  {/* Image Counter */}
                  {product.images.length > 1 && (
                    <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {product.images.length}
                    </div>
                  )}
                </div>
                
                {/* Thumbnail Navigation */}
                {product.images.length > 1 && (
                  <div className="p-4">
                    <div className="flex gap-2 overflow-x-auto">
                      {product.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                            index === currentImageIndex
                              ? 'border-primary'
                              : 'border-gray-600 hover:border-gray-500'
                          }`}
                        >
                          <img
                            src={image}
                            alt={`${product.title} - Image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Title and Price */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      {product.title}
                    </h1>
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="secondary" className="text-xs">
                        {product.category}
                      </Badge>
                      {product.condition && (
                        <Badge variant="outline" className="text-xs">
                          {product.condition}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleFavorite}
                    disabled={favoriteLoading}
                    className={`${isFavorite ? 'text-red-400 hover:text-red-300' : 'text-gray-400 hover:text-white'}`}
                  >
                    {favoriteLoading ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                    )}
                  </Button>
                </div>

                <div className="flex items-baseline gap-4 mb-6">
                  <p className="text-3xl md:text-4xl font-bold text-primary">
                    {formatPrice(product.price)}
                  </p>
                  {product.shipping_included && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      Free Shipping
                    </Badge>
                  )}
                </div>

                <p className="text-gray-300 leading-relaxed mb-6">
                  {product.description}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleContact}
                    disabled={contactLoading}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {contactLoading ? (
                      <LoadingSpinner size="sm" variant="default" />
                    ) : (
                      <>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Contact Seller
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-600">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Seller Information */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Seller Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={product.seller?.profile_image_url} />
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {product.seller?.full_name?.charAt(0) || 'S'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">
                      {product.seller?.full_name || 'Verified Seller'}
                    </h3>
                    <div className="flex items-center gap-2">
                      {product.seller?.verification_status === 'verified' && (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      <span className="text-sm text-gray-400">Member since 2023</span>
                    </div>
                  </div>
                </div>
                
                {product.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <MapPin className="h-4 w-4" />
                    <span>{product.location}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Product Stats */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-primary">{product.views_count || 0}</p>
                    <p className="text-sm text-gray-400">Views</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">{product.favorites_count || 0}</p>
                    <p className="text-sm text-gray-400">Favorites</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center">
                        <span className="text-gray-400 capitalize">{key.replace('_', ' ')}:</span>
                        <span className="text-white font-medium">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
