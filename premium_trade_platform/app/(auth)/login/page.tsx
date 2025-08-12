"use client"

import { LoginForm } from '@/components/auth/LoginForm'
import { motion } from 'framer-motion'
import { Crown, Users, Shield, Zap } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/5 to-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-lg"
          >
            {/* Logo */}
            <motion.div
              className="flex items-center gap-3 mb-8"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center">
                <Crown className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">DEALSMARKET</h1>
                <p className="text-sm text-muted-foreground">Premium B2B Platform</p>
              </div>
            </motion.div>

            {/* Main Content */}
            <div className="space-y-6">
              <div>
                <h2 className="text-4xl font-bold text-foreground mb-4">
                  Accede a Oportunidades
                  <span className="block bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    Exclusivas
                  </span>
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Únete a más de 500 empresas verificadas que confían en DealsMarket 
                  para transacciones B2B de alto valor y oportunidades de negocio exclusivas.
                </p>
              </div>

              {/* Features */}
              <div className="space-y-4">
                {[
                  {
                    icon: Shield,
                    title: 'Empresas Verificadas',
                    description: 'Solo empresas con verificación KYC completa'
                  },
                  {
                    icon: Users,
                    title: 'Red Exclusiva',
                    description: 'Acceso a deals de €125,000 promedio'
                  },
                  {
                    icon: Zap,
                    title: 'Transacciones Seguras',
                    description: 'Protección completa en cada operación'
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="grid grid-cols-3 gap-6 pt-6 border-t border-border/50"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">500+</div>
                  <div className="text-xs text-muted-foreground">Empresas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">€50M+</div>
                  <div className="text-xs text-muted-foreground">Volumen Mensual</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">98%</div>
                  <div className="text-xs text-muted-foreground">Satisfacción</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <LoginForm />
            </motion.div>

            {/* Additional Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="text-center mt-8 space-y-4"
            >
              <div className="text-sm text-muted-foreground">
                ¿No tienes acceso aún?{' '}
                <Link 
                  href="/membership" 
                  className="font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Solicitar Membresía
                </Link>
              </div>
              
              <div className="text-xs text-muted-foreground">
                <Link 
                  href="/support" 
                  className="hover:text-foreground transition-colors"
                >
                  ¿Necesitas ayuda?
                </Link>
                {' • '}
                <Link 
                  href="/privacy" 
                  className="hover:text-foreground transition-colors"
                >
                  Privacidad
                </Link>
                {' • '}
                <Link 
                  href="/terms" 
                  className="hover:text-foreground transition-colors"
                >
                  Términos
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
