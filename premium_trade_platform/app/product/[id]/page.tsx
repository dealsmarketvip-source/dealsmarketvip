"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { 
  ShoppingCart,
  Heart,
  Share2,
  MapPin,
  Package,
  Truck,
  Shield,
  Star,
  Eye,
  Calendar,
  ArrowLeft,
  MessageCircle,
  Flag,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { createClient, db } from "@/lib/supabase"
import { toast } from "sonner"
import { ProductWithImages, User, UserLimits } from "@/lib/types/database"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"

interface ExtendedProduct extends ProductWithImages {
  seller?: Pick<User, 'id' | 'full_name' | 'verification_status' | 'profile_image_url' | 'created_at'>
}

export default function ProductPage() {
  const { user, userProfile } = useAuth()
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string

  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)
  const [product, setProduct] = useState<ExtendedProduct | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [userLimits, setUserLimits] = useState<UserLimits | null>(null)
  const [isFavorited, setIsFavorited] = useState(false)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    fetchProduct()
    if (userProfile) {
      fetchUserLimits()
      checkIfFavorited()
    }
  }, [productId, userProfile])

  const fetchProduct = async () => {
    try {
      setLoading(true)

      // Check if this is a demo product ID
      if (productId.startsWith('demo-')) {
        const demoProducts = [
          {
            id: 'demo-1',
            title: 'iPhone 14 Pro Max 256GB',
            description: 'Producto de demostración.\n\nEste es un iPhone 14 Pro Max en excelente estado, con 256GB de almacenamiento. Incluye todos los accesorios originales y caja.\n\nCaracterísticas:\n- Pantalla Super Retina XDR de 6.7"\n- Chip A16 Bionic\n- Sistema de cámaras Pro de 48MP\n- Batería que dura todo el día\n- Resistente al agua IP68',
            price: 1200,
            currency: 'EUR',
            images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=800&fit=crop'],
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
            specifications: {
              'Marca': 'Apple',
              'Modelo': 'iPhone 14 Pro Max',
              'Almacenamiento': '256GB',
              'Color': 'Deep Purple',
              'Estado': 'Nuevo'
            },
            seller: {
              id: 'demo-seller',
              full_name: 'Vendedor Demo',
              verification_status: 'verified' as const,
              profile_image_url: undefined,
              created_at: '2023-01-01T00:00:00Z'
            }
          },
          {
            id: 'demo-2',
            title: 'MacBook Pro 14" M3',
            description: 'Producto de demostración.\n\nMacBook Pro 14" con chip M3, ideal para profesionales creativos y desarrolladores.\n\nCaracterísticas:\n- Chip M3 de Apple\n- 16GB de memoria unificada\n- SSD de 512GB\n- Pantalla Liquid Retina XDR de 14.2"\n- Batería de hasta 18 horas',
            price: 2200,
            currency: 'EUR',
            images: ['https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop'],
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
            specifications: {
              'Marca': 'Apple',
              'Modelo': 'MacBook Pro 14"',
              'Procesador': 'M3',
              'RAM': '16GB',
              'Almacenamiento': '512GB SSD'
            },
            seller: {
              id: 'demo-seller-2',
              full_name: 'TechStore Demo',
              verification_status: 'verified' as const,
              profile_image_url: undefined,
              created_at: '2023-01-01T00:00:00Z'
            }
          }
        ]

        const demoProduct = demoProducts.find(p => p.id === productId)
        if (demoProduct) {
          setProduct(demoProduct as any)
          return
        }
      }

      const { data, error } = await db.products.getById(productId)

      if (error) throw error
      if (!data) {
        toast.error("Producto no encontrado")
        router.push('/marketplace')
        return
      }

      setProduct(data as ExtendedProduct)

      // Increment view count (only if not a demo product)
      if (!productId.startsWith('demo-')) {
        await db.products.update(productId, {
          views_count: (data.views_count || 0) + 1
        })
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.error('Error fetching product:', {
        message: errorMessage,
        error: error instanceof Error ? error.stack : error
      })

      // Check if it's a Supabase configuration issue
      const isConfigIssue = errorMessage.includes('placeholder') ||
                           errorMessage.includes('not properly configured') ||
                           !process.env.NEXT_PUBLIC_SUPABASE_URL ||
                           process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')

      if (isConfigIssue) {
        toast.error("Base de datos no configurada. Mostrando productos de demostración.")
      } else {
        toast.error(`Error al cargar el producto: ${errorMessage}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchUserLimits = async () => {
    if (!userProfile) return

    try {
      const supabase = createClient()
      const { data } = await supabase
        .from('user_limits')
        .select('*')
        .eq('user_id', userProfile.id)
        .single()

      if (data) {
        setUserLimits(data)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.error('Error fetching user limits:', {
        message: errorMessage,
        error: error instanceof Error ? error.stack : error
      })
    }
  }

  const checkIfFavorited = async () => {
    if (!userProfile) return

    try {
      const supabase = createClient()
      const { data } = await supabase
        .from('user_favorites')
        .select('id')
        .eq('user_id', userProfile.id)
        .eq('product_id', productId)
        .single()

      setIsFavorited(!!data)
    } catch (error) {
      // Not favorited or error - keep as false
    }
  }

  const handleAddToFavorites = async () => {
    if (!userProfile) {
      toast.error("Debes iniciar sesión para agregar favoritos")
      return
    }

    try {
      if (isFavorited) {
        await db.favorites.remove(userProfile.id, productId)
        setIsFavorited(false)
        toast.success("Producto eliminado de favoritos")
      } else {
        await db.favorites.add(userProfile.id, productId)
        setIsFavorited(true)
        toast.success("Producto agregado a favoritos")
      }
    } catch (error) {
      console.error('Error managing favorites:', error)
      toast.error("Error al gestionar favoritos")
    }
  }

  const handlePurchase = async () => {
    if (!user || !userProfile) {
      toast.error("Debes iniciar sesión para comprar")
      return
    }

    if (!product) return

    // Check if user is trying to buy their own product
    if (product.seller_id === userProfile.id) {
      toast.error("No puedes comprar tu propio producto")
      return
    }

    // Check purchase limits
    if (userLimits && userLimits.current_purchases >= userLimits.max_purchases) {
      toast.error(`Has alcanzado el límite de compras (${userLimits.max_purchases}) para tu plan`)
      return
    }

    try {
      setPurchasing(true)

      const response = await fetch('/api/create-product-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: quantity,
          successUrl: `${window.location.origin}/payment/success`,
          cancelUrl: window.location.href
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear la sesión de pago')
      }

      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No se recibió la URL de pago')
      }

    } catch (error) {
      console.error('Error creating checkout:', error)
      toast.error("Error al procesar la compra. Inténtalo de nuevo.")
    } finally {
      setPurchasing(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.title,
          text: `Mira este producto en DealsMarket: ${product?.title}`,
          url: window.location.href,
        })
      } catch (error) {
        console.error('Error sharing:', error)
        // Fallback to clipboard if share fails
        copyToClipboard()
      }
    } else {
      // Fallback: copy URL to clipboard
      copyToClipboard()
    }
  }

  const copyToClipboard = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(window.location.href)
        toast.success("Enlace copiado al portapapeles")
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement('textarea')
        textArea.value = window.location.href
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        toast.success("Enlace copiado")
      }
    } catch (error) {
      console.error('Error copying to clipboard:', error)
      toast.error("No se pudo copiar el enlace")
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <Card className="max-w-md mx-auto bg-gray-800 border-gray-700">
          <CardContent className="pt-6 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Producto no encontrado</h2>
            <p className="text-gray-400 mb-4">
              El producto que buscas no existe o ha sido eliminado.
            </p>
            <Link href="/marketplace">
              <Button className="bg-primary hover:bg-primary/90">
                Volver al Marketplace
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isOwner = userProfile?.id === product.seller_id
  const totalPrice = product.price * quantity + (product.shipping_included ? 0 : product.shipping_cost)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Back Navigation */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-gray-300 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
              {product.images?.length > 0 ? (
                <img
                  src={product.images[selectedImageIndex]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="h-24 w-24 text-gray-400" />
                </div>
              )}
            </div>

            {/* Image Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index
                        ? 'border-primary'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Title and Price */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold text-white">{product.title}</h1>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleAddToFavorites}
                    className={isFavorited ? 'text-red-400' : 'text-gray-400'}
                  >
                    <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleShare}
                    className="text-gray-400"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
                {product.condition && (
                  <Badge variant="outline" className="border-gray-600 text-gray-300">
                    {product.condition === 'new' && 'Nuevo'}
                    {product.condition === 'like_new' && 'Como nuevo'}
                    {product.condition === 'good' && 'Bueno'}
                    {product.condition === 'fair' && 'Regular'}
                    {product.condition === 'poor' && 'Malo'}
                  </Badge>
                )}
              </div>

              {/* Badges */}
              <div className="flex gap-2 mb-4">
                {product.featured && (
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                    <Star className="h-3 w-3 mr-1" />
                    Destacado
                  </Badge>
                )}
                {product.verified && (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verificado
                  </Badge>
                )}
                {product.seller?.verification_status === 'verified' && (
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    <Shield className="h-3 w-3 mr-1" />
                    Vendedor Verificado
                  </Badge>
                )}
              </div>
            </div>

            {/* Seller Information */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={product.seller?.profile_image_url} />
                    <AvatarFallback>
                      {product.seller?.full_name?.charAt(0) || 'V'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">
                        {product.seller?.full_name || 'Vendedor'}
                      </span>
                      {product.seller?.verification_status === 'verified' && (
                        <Shield className="h-4 w-4 text-green-400" />
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">
                      Miembro desde {product.seller?.created_at ? 
                        new Date(product.seller.created_at).toLocaleDateString() : 
                        'hace tiempo'
                      }
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="border-gray-600">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contactar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Product Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-300">
                <Eye className="h-4 w-4" />
                {product.views_count} visualizaciones
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Heart className="h-4 w-4" />
                {product.favorites_count} favoritos
              </div>
              {product.category && (
                <div className="flex items-center gap-2 text-gray-300">
                  <Package className="h-4 w-4" />
                  {product.category}
                </div>
              )}
              {product.location && (
                <div className="flex items-center gap-2 text-gray-300">
                  <MapPin className="h-4 w-4" />
                  {product.location}
                </div>
              )}
            </div>

            {/* Shipping Info */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-white font-medium">
                      {product.shipping_included ? 'Envío incluido' : `Envío: ${formatPrice(product.shipping_cost)}`}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {product.shipping_included 
                        ? 'El envío está incluido en el precio'
                        : 'Coste de envío adicional'
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Purchase Section */}
            {!isOwner && product.status === 'active' && (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <Label className="text-gray-300">Cantidad</Label>
                    <div className="flex items-center gap-3 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        className="border-gray-600"
                      >
                        -
                      </Button>
                      <span className="text-white font-medium px-4">{quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(quantity + 1)}
                        className="border-gray-600"
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <Separator className="bg-gray-700" />

                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-300">
                      <span>Precio unitario:</span>
                      <span>{formatPrice(product.price)}</span>
                    </div>
                    {!product.shipping_included && product.shipping_cost > 0 && (
                      <div className="flex justify-between text-gray-300">
                        <span>Envío:</span>
                        <span>{formatPrice(product.shipping_cost)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-white font-bold text-lg">
                      <span>Total:</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handlePurchase}
                    disabled={purchasing || !user}
                    className="w-full bg-primary hover:bg-primary/90 h-12 text-lg"
                    size="lg"
                  >
                    {purchasing ? (
                      'Procesando...'
                    ) : !user ? (
                      'Inicia sesión para comprar'
                    ) : (
                      <>
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Comprar ahora
                      </>
                    )}
                  </Button>

                  {!user && (
                    <p className="text-center text-gray-400 text-sm">
                      <Link href="/auth" className="text-primary hover:underline">
                        Inicia sesión
                      </Link> para realizar la compra
                    </p>
                  )}

                  {userLimits && userLimits.current_purchases >= userLimits.max_purchases && (
                    <Alert className="bg-yellow-500/10 border-yellow-500/30">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-yellow-400">
                        Has alcanzado el límite de compras para tu plan.{' '}
                        {userProfile?.subscription_type === 'free' && (
                          <Link href="/membership" className="underline">
                            Actualiza a Premium
                          </Link>
                        )}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Owner Actions */}
            {isOwner && (
              <Alert className="bg-blue-500/10 border-blue-500/30">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-blue-400">
                  Este es tu producto. Puedes gestionarlo desde tu{' '}
                  <Link href="/profile" className="underline">
                    perfil
                  </Link>.
                </AlertDescription>
              </Alert>
            )}

            {/* Product not available */}
            {product.status !== 'active' && (
              <Alert className="bg-red-500/10 border-red-500/30">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-400">
                  Este producto ya no está disponible.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        {/* Product Description */}
        <div className="mt-12">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Descripción</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                {product.description}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Specifications */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="mt-8">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Especificaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0">
                      <span className="text-gray-400">{key}</span>
                      <span className="text-white font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
