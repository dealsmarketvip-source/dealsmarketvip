"use client"

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, Crown, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const isDemo = searchParams.get('demo') === 'true'
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading for better UX
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-muted-foreground">Procesando tu suscripción...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-8"
        >
          <CheckCircle className="w-24 h-24 text-green-500 mx-auto" />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-3xl font-bold text-foreground mb-4"
        >
          ¡Suscripción Exitosa!
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-muted-foreground mb-8"
        >
          {isDemo
            ? 'Demo: Simulación de suscripción exitosa. Configura las claves de Stripe para pagos reales.'
            : 'Bienvenido al plan Premium. Ahora tienes acceso completo a todas las funciones VIP de la plataforma.'
          }
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="space-y-4"
        >
          <div className="bg-card/50 border border-primary/20 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">
                {isDemo ? 'Demo - Plan Premium' : 'Plan Premium Activado'}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">20 € / mes</p>
            {sessionId && (
              <p className="text-xs text-muted-foreground mt-2">
                ID de sesión: {sessionId}
              </p>
            )}
            {isDemo && (
              <p className="text-xs text-orange-400 mt-2">
                Modo demo - Configure las claves de Stripe para pagos reales
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="flex-1">
              <Link href="/marketplace">
                <ArrowRight className="w-4 h-4 mr-2" />
                Ir al Marketplace
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href="/profile">
                Ver Perfil
              </Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-muted-foreground">
            ¿Necesitas ayuda?{' '}
            <Link href="/contact" className="text-primary hover:underline">
              Contacta con soporte
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
