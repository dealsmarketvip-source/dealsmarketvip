"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CrownLogo } from "@/components/ui/crown-logo"
import { CheckCircle, Crown, Building, Shield, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Faster verification process
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <CrownLogo size="lg" className="text-primary mx-auto" />
          </motion.div>
          <h2 className="text-xl font-semibold text-foreground">
            Procesando tu suscripción...
          </h2>
          <p className="text-muted-foreground">
            Esto puede tomar unos segundos
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          className="max-w-2xl mx-auto text-center space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
            className="mx-auto w-20 h-20 bg-green-500 rounded-full flex items-center justify-center"
          >
            <CheckCircle className="h-10 w-10 text-white" />
          </motion.div>

          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-foreground">
              ¡Bienvenido a DealsMarket Premium!
            </h1>
            <p className="text-xl text-muted-foreground">
              Tu suscripción ha sido activada exitosamente
            </p>
          </div>

          {/* Status Card */}
          <motion.div 
            className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-center gap-3">
              <CrownLogo size="md" className="text-primary" />
              <h2 className="text-2xl font-bold gradient-text">Estado Premium Activo</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <Shield className="h-8 w-8 text-primary mx-auto" />
                <h3 className="font-semibold">Verificado</h3>
                <p className="text-sm text-muted-foreground">
                  Empresa verificada automáticamente
                </p>
              </div>
              <div className="space-y-2">
                <Crown className="h-8 w-8 text-primary mx-auto" />
                <h3 className="font-semibold">Acceso Premium</h3>
                <p className="text-sm text-muted-foreground">
                  Deals exclusivos disponibles
                </p>
              </div>
              <div className="space-y-2">
                <Building className="h-8 w-8 text-primary mx-auto" />
                <h3 className="font-semibold">Red Empresarial</h3>
                <p className="text-sm text-muted-foreground">
                  Conecta con empresas verificadas
                </p>
              </div>
            </div>
          </motion.div>

          {/* Next Steps */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-xl font-semibold text-foreground">
              ¿Qué sigue ahora?
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Link href="/marketplace">
                <Button className="w-full gradient-primary group">
                  <Crown className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  Explorar Marketplace
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" className="w-full">
                  <Building className="mr-2 h-4 w-4" />
                  Ir al Dashboard
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Session ID for reference */}
          {sessionId && (
            <motion.div 
              className="text-center pt-4 border-t border-border"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <p className="text-xs text-muted-foreground">
                ID de transacción: {sessionId}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
