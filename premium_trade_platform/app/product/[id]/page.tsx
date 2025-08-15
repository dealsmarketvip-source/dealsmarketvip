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
  views_count: number
  favorites_count: number
  shipping_included: boolean
  shipping_cost: number
  location: string
  featured: boolean
  verified: boolean
  created_at: string
  updated_at: string
  seller?: {
    id: string
    full_name: string
    verification_status: string
    profile_image_url?: string
    company_name?: string
    member_since?: string
  }
}

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const { user, userProfile } = useAuth()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState(false)
  const [contactLoading, setContactLoading] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchProduct()
    }
  }, [params.id])

  const fetchProduct = async () => {
    try {
      setLoading(true)

      // Use mock data for instant functionality
      const productResult = getMockProductById(params.id as string)

      if (!productResult.data || productResult.error) {
        toast.error(productResult.error?.message || 'Product not found')
        router.push('/marketplace')
        return
      }

      setProduct(productResult.data)

    } catch (error) {
      console.error('Error fetching product:', error)
      toast.error('Error loading product')
      router.push('/marketplace')
    } finally {
      setLoading(false)
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
      // Simulate favorite toggle
      await new Promise(resolve => setTimeout(resolve, 500))

      if (isFavorite) {
        setIsFavorite(false)
        toast.success('Removed from favorites')
      } else {
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

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product?.title,
        text: product?.description,
        url: window.location.href,
      })
    } catch (error) {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard')
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getConditionLabel = (condition: string) => {
    const conditions: Record<string, string> = {
      new: 'New',
      like_new: 'Like New',
      good: 'Good',
      fair: 'Fair',
      poor: 'Poor'
    }
    return conditions[condition] || condition
  }

  const getConditionColor = (condition: string) => {
    const colors: Record<string, string> = {
      new: 'bg-green-500/20 text-green-400 border-green-500/30',
      like_new: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      good: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      fair: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      poor: 'bg-red-500/20 text-red-400 border-red-500/30'
    }
    return colors[condition] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  }

  if (loading) {
    return <LoadingOverlay isLoading={true} text="Loading product..." variant="package" />
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Product not found</h2>
          <p className="text-muted-foreground mb-4">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => router.push('/marketplace')}>
            Back to Marketplace
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
      <div className="container mx-auto px-4 py-8">
        {/* Header with back button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">Product Details</h1>
            <p className="text-muted-foreground">
              {product.category} • Published on {formatDate(product.created_at)}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Main Image */}
            <Card className="overflow-hidden">
              <div className="relative aspect-video bg-muted">
                {product.images.length > 0 ? (
                  <Image
                    src={product.images[currentImageIndex]}
                    alt={product.title}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
                
                {/* Badges overlay */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {product.featured && (
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                      <Star className="h-3 w-3 mr-1" />
                      Destacado
                    </Badge>
                  )}
                  {product.seller?.verification_status === 'verified' && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      <Shield className="h-3 w-3 mr-1" />
                      Verificado
                    </Badge>
                  )}
                </div>

                {/* Image navigation */}
                {product.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {product.images.map((_, index) => (
                      <button
                        key={`product-dot-${index}`}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          currentImageIndex === index 
                            ? 'bg-primary' 
                            : 'bg-white/50 hover:bg-white/70'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={`product-thumb-${index}`}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      currentImageIndex === index 
                        ? 'border-primary' 
                        : 'border-transparent hover:border-primary/50'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.title} - Imagen ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Product Description */}
            <Card>
              <CardHeader>
                <CardTitle>Descripción</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  {product.description.split('\n').map((paragraph, index) => (
                    <p key={`product-desc-${index}`} className="mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column - Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Price and Title */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    {product.title}
                  </h1>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    {product.views_count} visualizaciones
                    <Heart className="h-4 w-4" />
                    {product.favorites_count} favoritos
                  </div>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-primary">
                    {formatPrice(product.price)}
                  </span>
                  {product.shipping_included ? (
                    <span className="text-sm text-green-400">Envío incluido</span>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      + {formatPrice(product.shipping_cost)} envío
                    </span>
                  )}
                </div>

                {/* Condition */}
                <Badge className={getConditionColor(product.condition)}>
                  {getConditionLabel(product.condition)}
                </Badge>

                {/* Location */}
                {product.location && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {product.location}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card>
              <CardContent className="pt-6 space-y-3">
                <Button
                  onClick={handleContact}
                  className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  disabled={contactLoading}
                >
                  {contactLoading ? (
                    <LoadingSpinner size="sm" variant="default" />
                  ) : (
                    <>
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Contactar Vendedor
                    </>
                  )}
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={handleFavorite}
                    disabled={favoriteLoading}
                    className={isFavorite ? 'text-red-500 border-red-500/50' : ''}
                  >
                    {favoriteLoading ? (
                      <LoadingSpinner size="sm" variant="default" />
                    ) : (
                      <>
                        <Heart className={`mr-2 h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                        {isFavorite ? 'Favorito' : 'Favorito'}
                      </>
                    )}
                  </Button>
                  
                  <Button variant="outline" onClick={handleShare}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Compartir
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Seller Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Vendedor
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={product.seller?.profile_image_url} />
                    <AvatarFallback>
                      {product.seller?.full_name?.charAt(0) || 'V'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">
                        {product.seller?.full_name || 'Vendedor'}
                      </h3>
                      {product.seller?.verification_status === 'verified' && (
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                      )}
                    </div>
                    
                    {product.seller?.company_name && (
                      <p className="text-sm text-muted-foreground">
                        {product.seller.company_name}
                      </p>
                    )}
                    
                    {product.seller?.member_since && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Calendar className="h-3 w-3" />
                        Miembro desde {formatDate(product.seller.member_since)}
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Crown className="h-4 w-4 text-primary" />
                    <span className="text-foreground">Empresa Verificada</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-green-400" />
                    <span className="text-foreground">Perfil de Confianza</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Truck className="h-4 w-4 text-blue-400" />
                    <span className="text-foreground">Envíos Seguros</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full" size="sm">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Ver Perfil Completo
                </Button>
              </CardContent>
            </Card>

            {/* Safety Notice */}
            <Card className="border-yellow-500/20 bg-yellow-500/5">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-yellow-400 mb-1">
                      Consejos de Seguridad
                    </p>
                    <ul className="text-muted-foreground space-y-1 text-xs">
                      <li>• Verifica siempre la identidad del vendedor</li>
                      <li>• Usa métodos de pago seguros</li>
                      <li>• Revisa los términos de envío</li>
                      <li>• Contacta a soporte si tienes dudas</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
