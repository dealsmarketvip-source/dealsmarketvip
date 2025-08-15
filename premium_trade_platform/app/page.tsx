"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown, Users, DollarSign, Globe, ArrowRight, CheckCircle, Zap, Shield } from "lucide-react"
import { motion } from "framer-motion"
import { Store, ShoppingBag } from "lucide-react"
import { useAuth } from "@/hooks/use-auth-instant"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { analytics } from "@/lib/analytics"

// Import the WelcomePanel component directly since lazy loading is causing issues
import { WelcomePanel } from "@/components/WelcomePanel"

export default function HomePage() {
  const [showWelcomePanel, setShowWelcomePanel] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  // Track page view
  useEffect(() => {
    analytics.trackView({
      page: 'homepage',
      userId: user?.id
    });
  }, []);

  const handleGetStarted = () => {
    analytics.trackClick({
      element: 'get_started_button',
      location: 'hero_section',
      userId: user?.id
    });

    if (user) {
      window.location.href = '/marketplace'
    } else {
      setShowWelcomePanel(true)
    }
  }

  return (
    <div className="min-h-screen bg-background bg-matrix">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-center gap-3 mb-6">
                <Crown className="h-8 w-8 text-primary animate-pulse-green" />
                <span className="text-primary font-bold text-lg glow-text">DEALSMARKET</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight glow-text">
                Mercado Exclusivo de
                <span className="text-primary block gradient-text">Deals Premium</span>
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Plataforma exclusiva donde empresas verificadas crean oportunidades millonarias a través de transacciones seguras y de alto valor.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="btn-neon text-lg px-8 py-4"
                  onClick={handleGetStarted}
                >
                  Acceso Instantáneo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={handleGetStarted}
                  className="border-primary text-primary hover:bg-primary hover:text-black glow-primary"
                >
                  Ver Análisis ROI
                </Button>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center glow-card p-4 rounded-lg">
                  <div className="text-2xl font-bold text-primary glow-text">€50M+</div>
                  <div className="text-sm text-muted-foreground">Volumen Mensual</div>
                </div>
                <div className="text-center glow-card p-4 rounded-lg">
                  <div className="text-2xl font-bold text-primary glow-text">500+</div>
                  <div className="text-sm text-muted-foreground">Empresas Verificadas</div>
                </div>
                <div className="text-center glow-card p-4 rounded-lg">
                  <div className="text-2xl font-bold text-primary glow-text">98%</div>
                  <div className="text-sm text-muted-foreground">Tasa de Éxito</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 1, -1, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="glow-primary-strong rounded-xl"
              >
                <Image
                  src="https://images.pexels.com/photos/28891887/pexels-photo-28891887.jpeg"
                  alt="Concesionario de Lujo Moderno - Ambiente de Negocios Premium"
                  width={800}
                  height={600}
                  className="w-full h-auto rounded-xl shadow-2xl glow-primary"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{
                    filter: "drop-shadow(0 0 20px rgba(0, 255, 0, 0.4))"
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent rounded-xl"></div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4 glow-text">Por Qué Elegir DealsMarket</h2>
            <p className="text-xl text-muted-foreground">Beneficios exclusivos que se pagan solos con tu primer deal</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="glow-card-hover gradient-card">
              <CardHeader className="p-6">
                <Users className="h-12 w-12 text-primary mb-4 animate-pulse-green" />
                <CardTitle className="text-foreground">Red Verificada</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Acceso a 500+ empresas pre-verificadas con credenciales validadas
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glow-card-hover gradient-card">
              <CardHeader className="p-6">
                <DollarSign className="h-12 w-12 text-accent mb-4 animate-pulse-green" />
                <CardTitle className="text-foreground">Deals de Alto Valor</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Valor promedio de deal de $125,000 con protección de pago incluida
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glow-card-hover gradient-card">
              <CardHeader className="p-6">
                <Globe className="h-12 w-12 text-primary mb-4 animate-pulse-green" />
                <CardTitle className="text-foreground">Alcance Global</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Acceso a deals de 50+ países con soporte premium 24/7
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6 glow-text">Qué Hacemos</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              DealsMarket es el marketplace B2B premier de Europa donde empresas verificadas crean oportunidades millonarias a través de transacciones seguras y de alto valor.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-foreground glow-text">Conectando Excelencia Empresarial</h3>
              <p className="text-lg text-muted-foreground">
                Facilitamos relaciones comerciales exclusivas entre empresas verificadas en Europa y Medio Oriente, asegurando que cada transacción cumpla con los más altos estándares de seguridad y rentabilidad.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-accent" />
                  <span className="text-foreground">Proceso riguroso de verificación de empresas</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-accent" />
                  <span className="text-foreground">Protección de pago segura en todos los deals</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-accent" />
                  <span className="text-foreground">Inteligencia de mercado y analytics en tiempo real</span>
                </li>
              </ul>
            </div>
            <div className="relative">
              <Image
                src="https://images.pexels.com/photos/7415132/pexels-photo-7415132.jpeg"
                alt="Reunión de negocios - Colaboración profesional"
                width={600}
                height={400}
                className="rounded-xl shadow-2xl glow-primary"
                style={{
                  filter: "drop-shadow(0 0 15px rgba(0, 255, 0, 0.3))"
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 glow-text">
            ¿Listo para Unirte al Marketplace B2B Más Exclusivo de Europa?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Comienza a conectar con empresas verificadas y cierra tu próximo deal millonario
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="btn-neon text-lg px-8 py-4"
              onClick={handleGetStarted}
            >
              <Crown className="mr-2 h-5 w-5" />
              Acceso Instantáneo
            </Button>
          </div>
        </div>
      </section>

      {/* Welcome Panel */}
      <WelcomePanel
        isOpen={showWelcomePanel}
        onClose={() => setShowWelcomePanel(false)}
      />
    </div>
  )
}
