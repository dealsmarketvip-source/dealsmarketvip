"use client"

import { motion } from 'framer-motion'
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function CancelPage() {
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
          <XCircle className="w-24 h-24 text-red-500 mx-auto" />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-3xl font-bold text-foreground mb-4"
        >
          Suscripción Cancelada
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-muted-foreground mb-8"
        >
          No se ha procesado ningún pago. Tu suscripción al plan Premium ha sido cancelada.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="space-y-4"
        >
          <div className="bg-card/50 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-foreground mb-2">¿Qué ocurrió?</h3>
            <ul className="text-sm text-muted-foreground space-y-1 text-left">
              <li>• El proceso de pago fue interrumpido</li>
              <li>• No se ha realizado ningún cargo</li>
              <li>• Puedes intentarlo de nuevo en cualquier momento</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="flex-1">
              <Link href="/vip">
                <RefreshCw className="w-4 h-4 mr-2" />
                Intentar de Nuevo
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Inicio
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
            ¿Tienes problemas con el pago?{' '}
            <Link href="/contact" className="text-primary hover:underline">
              Contacta con soporte
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
