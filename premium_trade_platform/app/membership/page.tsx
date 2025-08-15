"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X, ShoppingCart, Package, Users, Shield, BarChart3, CreditCard, Star } from "lucide-react"
import { motion } from "framer-motion"
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

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        duration: 0.6
      }
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="container mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          variants={cardVariants}
        >
          <motion.h1 
            className="text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Planes de Membresía
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Únete a la plataforma B2B más exclusiva de Europa. Conecta con empresas verificadas y cierra deals millonarios con total seguridad.
          </motion.p>
        </motion.div>

        {/* Current Status Card */}
        {userProfile && (
          <motion.div 
            className="max-w-4xl mx-auto mb-8"
            variants={cardVariants}
          >
            <Card className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Tu Estado Actual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, staggerChildren: 0.1 }}
                >
                  <motion.div 
                    className="text-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="text-2xl font-bold text-primary mb-1">
                      {currentPlan === 'free' ? 'Gratuito' : 'Premium'}
                    </div>
                    <div className="text-gray-400">Plan Actual</div>
                  </motion.div>
                  <motion.div 
                    className="text-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="text-2xl font-bold text-blue-400 mb-1">
                      {currentUsage.products}/{currentLimits.max_products}
                    </div>
                    <div className="text-gray-400">Productos Activos</div>
                  </motion.div>
                  <motion.div 
                    className="text-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="text-2xl font-bold text-green-400 mb-1">
                      {currentUsage.purchases}/{currentLimits.max_purchases}
                    </div>
                    <div className="text-gray-400">Compras Este Mes</div>
                  </motion.div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Pricing Cards */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto"
          variants={containerVariants}
        >
          {/* Free Plan */}
          <motion.div
            variants={cardVariants}
            whileHover={{ 
              scale: 1.02, 
              y: -8,
              transition: { type: "spring", stiffness: 300, damping: 20 }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="bg-gray-800 border-gray-700 relative hover:border-gray-600 hover:shadow-xl transition-all duration-500 h-full">
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
                <motion.div 
                  className="text-4xl font-bold text-white"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                >
                  ${SUBSCRIPTION_PLANS.free.price}
                  <span className="text-lg font-normal text-gray-400">/mes</span>
                </motion.div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  <motion.div 
                    className="flex items-center gap-3"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Package className="h-5 w-5 text-red-400" />
                    <span className="text-gray-300">
                      {SUBSCRIPTION_PLANS.free.limits.max_products} productos para vender
                    </span>
                  </motion.div>
                  <motion.div 
                    className="flex items-center gap-3"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <ShoppingCart className="h-5 w-5 text-blue-400" />
                    <span className="text-gray-300">
                      {SUBSCRIPTION_PLANS.free.limits.max_purchases} compra por mes
                    </span>
                  </motion.div>
                  <motion.div 
                    className="flex items-center gap-3"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <X className="h-5 w-5 text-red-400" />
                    <span className="text-gray-300">Sin verificación empresarial</span>
                  </motion.div>
                  <motion.div 
                    className="flex items-center gap-3"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <X className="h-5 w-5 text-red-400" />
                    <span className="text-gray-300">Sin analytics avanzados</span>
                  </motion.div>
                </div>
                
                <ul className="space-y-2 text-sm text-gray-400">
                  {SUBSCRIPTION_PLANS.free.features.map((feature, index) => (
                    <motion.li 
                      key={`free-feature-${index}`} 
                      className="flex items-center gap-2"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.9 + index * 0.1 }}
                    >
                      <Check className="h-4 w-4 text-green-400" />
                      {feature}
                    </motion.li>
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
          </motion.div>

          {/* Premium Plan */}
          <motion.div
            variants={cardVariants}
            whileHover={{ 
              scale: 1.02, 
              y: -8,
              transition: { type: "spring", stiffness: 300, damping: 20 }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="bg-gray-800 border-primary relative hover:border-primary/80 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 h-full">
              <motion.div 
                className="absolute -top-3 left-1/2 transform -translate-x-1/2"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                <Badge className="bg-primary text-primary-foreground">
                  <Star className="h-3 w-3 mr-1" />
                  Recomendado
                </Badge>
              </motion.div>
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
                  Para empresas que buscan deals millonarios
                </CardDescription>
                <motion.div 
                  className="text-4xl font-bold text-white"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                >
                  ${SUBSCRIPTION_PLANS.premium.price}
                  <span className="text-lg font-normal text-gray-400">/mes</span>
                </motion.div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  <motion.div 
                    className="flex items-center gap-3"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Package className="h-5 w-5 text-primary" />
                    <span className="text-gray-300 font-medium">
                      {SUBSCRIPTION_PLANS.premium.limits.max_products} productos para vender
                    </span>
                  </motion.div>
                  <motion.div 
                    className="flex items-center gap-3"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <ShoppingCart className="h-5 w-5 text-primary" />
                    <span className="text-gray-300 font-medium">
                      {SUBSCRIPTION_PLANS.premium.limits.max_purchases} compras por mes
                    </span>
                  </motion.div>
                  <motion.div 
                    className="flex items-center gap-3"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Shield className="h-5 w-5 text-primary" />
                    <span className="text-gray-300 font-medium">Verificación empresarial completa</span>
                  </motion.div>
                  <motion.div 
                    className="flex items-center gap-3"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <span className="text-gray-300 font-medium">Analytics avanzados</span>
                  </motion.div>
                  <motion.div 
                    className="flex items-center gap-3"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.9 }}
                  >
                    <Users className="h-5 w-5 text-primary" />
                    <span className="text-gray-300 font-medium">Red exclusiva de empresas</span>
                  </motion.div>
                </div>
                
                <ul className="space-y-2 text-sm text-gray-400">
                  {SUBSCRIPTION_PLANS.premium.features.map((feature, index) => (
                    <motion.li 
                      key={`premium-feature-${index}`} 
                      className="flex items-center gap-2"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 1.0 + index * 0.1 }}
                    >
                      <Check className="h-4 w-4 text-primary" />
                      {feature}
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <motion.div 
                  className="w-full"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 relative overflow-hidden"
                    onClick={handleUpgrade}
                    disabled={upgrading || currentPlan === 'premium'}
                  >
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
                    {currentPlan === 'premium' ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Plan Actual
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        {upgrading ? 'Procesando...' : 'Acceso Premium'}
                      </>
                    )}
                  </Button>
                </motion.div>
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div 
          className="mt-16 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <motion.h2 
            className="text-3xl font-bold text-white text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            ¿Por qué elegir DealsMarket?
          </motion.h2>
          <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={cardVariants}>
              <Card className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-white">✅ Red Exclusiva de Empresas Verificadas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Accede a más de 500 empresas verificadas con documentación legal completa. 
                    Cada empresa pasa por un riguroso proceso de verificación antes de unirse a la plataforma.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants}>
              <Card className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-white">🛡️ Seguridad y Protección Total</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Todos los deals están protegidos por nuestro sistema de escrow y garantías legales. 
                    Zero tolerancia a estafadores con verificación en tiempo real.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants}>
              <Card className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-white">💰 Deals de Alto Valor (€100K+ promedio)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Especializado en transacciones B2B de gran volumen. Nuestros miembros manejan 
                    deals desde €100K hasta varios millones con soporte dedicado 24/7.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
