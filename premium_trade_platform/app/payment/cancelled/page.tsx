"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CrownLogo } from "@/components/ui/crown-logo"
import { XCircle, ArrowLeft, Crown } from "lucide-react"
import { motion } from "framer-motion"

export default function PaymentCancelled() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          className="max-w-2xl mx-auto text-center space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Cancel Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
            className="mx-auto w-20 h-20 bg-red-500 rounded-full flex items-center justify-center"
          >
            <XCircle className="h-10 w-10 text-white" />
          </motion.div>

          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-foreground">
              Pago Cancelado
            </h1>
            <p className="text-xl text-muted-foreground">
              No se procesó ningún cargo. Tu suscripción no ha sido activada.
            </p>
          </div>

          {/* Info Card */}
          <motion.div 
            className="bg-card rounded-2xl p-8 space-y-6 border border-border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-center gap-3">
              <CrownLogo size="md" className="text-muted-foreground" />
              <h2 className="text-xl font-semibold text-foreground">
                ¿Cambiaste de opinión?
              </h2>
            </div>

            <p className="text-muted-foreground">
              Puedes intentar el proceso de suscripción nuevamente en cualquier momento. 
              Con DealsMarket Premium tendrás acceso a:
            </p>

            <ul className="text-left space-y-2 max-w-md mx-auto">
              <li className="flex items-center gap-2 text-sm">
                <Crown className="h-4 w-4 text-primary" />
                Deals exclusivos de lujo
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Crown className="h-4 w-4 text-primary" />
                Verificación empresarial
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Crown className="h-4 w-4 text-primary" />
                Red de empresas verificadas
              </li>
            </ul>
          </motion.div>

          {/* Actions */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="grid md:grid-cols-2 gap-4">
              <Button 
                className="w-full gradient-primary"
                onClick={() => window.history.back()}
              >
                <Crown className="mr-2 h-4 w-4" />
                Intentar de Nuevo
              </Button>
              <Link href="/">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver al Inicio
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Support */}
          <motion.div 
            className="text-center pt-4 border-t border-border"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-sm text-muted-foreground">
              ¿Necesitas ayuda? Contacta nuestro soporte:{" "}
              <a 
                href="mailto:support@dealsmarket.com" 
                className="text-primary hover:underline"
              >
                support@dealsmarket.com
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
