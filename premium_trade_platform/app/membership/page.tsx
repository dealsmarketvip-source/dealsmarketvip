"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X, ShoppingCart, Package, Users, Shield, BarChart3, CreditCard, Star } from "lucide-react"
import { useAuth } from "@/hooks/use-auth-instant"
import { SUBSCRIPTION_PLANS } from "@/lib/stripe"
import { createClient } from "@/lib/supabase"
import { toast } from "sonner"
import { User, UserLimits } from "@/lib/types/database"

interface UserWithLimits extends User {
  user_limits?: UserLimits[]
}

export default function MembershipPage() {
  const { user, userProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [upgrading, setUpgrading] = useState(false)
  const [userLimits, setUserLimits] = useState<UserLimits | null>(null)
  const [currentUsage, setCurrentUsage] = useState({
    products: 0,
    purchases: 0
  })

  useEffect(() => {
    if (userProfile) {
      fetchUserLimitsAndUsage()
    }
  }, [userProfile])

  const fetchUserLimitsAndUsage = async () => {
    if (!userProfile) return

    try {
      const supabase = createClient()
      
      // Get user limits
      const { data: limits } = await supabase
        .from('user_limits')
        .select('*')
        .eq('user_id', userProfile.id)
        .single()

      if (limits) {
        setUserLimits(limits)
      }

      // Get current usage
      const [productsResult, ordersResult] = await Promise.all([
        supabase
          .from('products')
          .select('id')
          .eq('seller_id', userProfile.id)
          .eq('status', 'active'),
        supabase
          .from('orders')
          .select('id')
          .eq('buyer_id', userProfile.id)
          .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
      ])

      setCurrentUsage({
        products: productsResult.data?.length || 0,
        purchases: ordersResult.data?.length || 0
      })
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  const handleUpgrade = async () => {
    if (!user) {
      toast.error("Debes iniciar sesión para actualizar tu plan")
      return
    }

    setUpgrading(true)
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: 'premium',
          successUrl: `${window.location.origin}/payment/success`,
          cancelUrl: `${window.location.origin}/membership`,
        }),
      })

      const { url } = await response.json()
      
      if (url) {
        window.location.href = url
      } else {
        throw new Error('No se pudo crear la sesión de pago')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error("Error al procesar el pago. Inténtalo de nuevo.")
    } finally {
      setUpgrading(false)
    }
  }

  const currentPlan = userProfile?.subscription_type || 'free'
  const currentLimits = userLimits || SUBSCRIPTION_PLANS[currentPlan as keyof typeof SUBSCRIPTION_PLANS].limits

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Planes de Membresía
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Elige el plan perfecto para tu negocio. Accede a herramientas exclusivas 
            y amplía tus oportunidades de venta en DealsMarket.
          </p>
        </div>

        {/* Current Status Card */}
        {userProfile && (
          <div className="max-w-4xl mx-auto mb-8">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Tu Estado Actual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {currentPlan === 'free' ? 'Gratuito' : 'Premium'}
                    </div>
                    <div className="text-gray-400">Plan Actual</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400 mb-1">
                      {currentUsage.products}/{currentLimits.max_products}
                    </div>
                    <div className="text-gray-400">Productos Activos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400 mb-1">
                      {currentUsage.purchases}/{currentLimits.max_purchases}
                    </div>
                    <div className="text-gray-400">Compras Este Mes</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <Card className="bg-gray-800 border-gray-700 relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl text-white">
                  {SUBSCRIPTION_PLANS.free.name}
                </CardTitle>
                {currentPlan === 'free' && (
                  <Badge variant="outline" className="border-primary text-primary">
                    Plan Actual
                  </Badge>
                )}
              </div>
              <CardDescription className="text-gray-400">
                Perfecto para comenzar a explorar
              </CardDescription>
              <div className="text-4xl font-bold text-white">
                ${SUBSCRIPTION_PLANS.free.price}
                <span className="text-lg font-normal text-gray-400">/mes</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-red-400" />
                  <span className="text-gray-300">
                    {SUBSCRIPTION_PLANS.free.limits.max_products} productos para vender
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <ShoppingCart className="h-5 w-5 text-blue-400" />
                  <span className="text-gray-300">
                    {SUBSCRIPTION_PLANS.free.limits.max_purchases} compra por mes
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <X className="h-5 w-5 text-red-400" />
                  <span className="text-gray-300">Sin verificación empresarial</span>
                </div>
                <div className="flex items-center gap-3">
                  <X className="h-5 w-5 text-red-400" />
                  <span className="text-gray-300">Sin analytics avanzados</span>
                </div>
              </div>
              
              <ul className="space-y-2 text-sm text-gray-400">
                {SUBSCRIPTION_PLANS.free.features.map((feature, index) => (
                  <li key={`free-feature-${index}`} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-400" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant="outline"
                disabled={currentPlan === 'free'}
              >
                {currentPlan === 'free' ? 'Plan Actual' : 'Cambiar a Gratuito'}
              </Button>
            </CardFooter>
          </Card>

          {/* Premium Plan */}
          <Card className="bg-gray-800 border-primary relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-primary text-primary-foreground">
                <Star className="h-3 w-3 mr-1" />
                Recomendado
              </Badge>
            </div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl text-white">
                  {SUBSCRIPTION_PLANS.premium.name}
                </CardTitle>
                {currentPlan === 'premium' && (
                  <Badge variant="outline" className="border-primary text-primary">
                    Plan Actual
                  </Badge>
                )}
              </div>
              <CardDescription className="text-gray-400">
                Para vendedores serios y empresas
              </CardDescription>
              <div className="text-4xl font-bold text-white">
                ${SUBSCRIPTION_PLANS.premium.price}
                <span className="text-lg font-normal text-gray-400">/mes</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-primary" />
                  <span className="text-gray-300 font-medium">
                    {SUBSCRIPTION_PLANS.premium.limits.max_products} productos para vender
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  <span className="text-gray-300 font-medium">
                    {SUBSCRIPTION_PLANS.premium.limits.max_purchases} compras por mes
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="text-gray-300 font-medium">Verificación empresarial</span>
                </div>
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <span className="text-gray-300 font-medium">Analytics avanzados</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="text-gray-300 font-medium">Networking empresarial</span>
                </div>
              </div>
              
              <ul className="space-y-2 text-sm text-gray-400">
                {SUBSCRIPTION_PLANS.premium.features.map((feature, index) => (
                  <li key={`premium-feature-${index}`} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-primary hover:bg-primary/90"
                onClick={handleUpgrade}
                disabled={upgrading || currentPlan === 'premium'}
              >
                {currentPlan === 'premium' ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Plan Actual
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    {upgrading ? 'Procesando...' : 'Actualizar a Premium'}
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Preguntas Frecuentes
          </h2>
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">¿Qué incluye la verificación empresarial?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  La verificación empresarial incluye validación de documentos legales, 
                  DNI/CIF, y certificados fiscales. Esto te da una insignia verificada 
                  que genera mayor confianza en los compradores.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">¿Cómo funcionan los límites de productos?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Con el plan Premium puedes tener hasta 3 productos activos 
                  simultáneamente en el marketplace. Una vez vendido un producto, 
                  puedes subir uno nuevo.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">¿Puedo cancelar mi suscripción en cualquier momento?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Sí, puedes cancelar tu suscripción en cualquier momento desde tu 
                  panel de control. Mantendrás acceso a las funciones premium hasta 
                  el final del período facturado.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
