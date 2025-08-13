"use client"

import { useState, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown, Users, DollarSign, Globe, ArrowRight, CheckCircle, Zap } from "lucide-react"
import { motion } from "framer-motion"
import { Store, ShoppingBag } from "lucide-react"
import { WelcomePanel } from "@/components/WelcomePanel"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const [showWelcomePanel, setShowWelcomePanel] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  // Redirect to marketplace if already authenticated
  useEffect(() => {
    if (user) {
      router.push('/marketplace')
    }
  }, [user, router])

  const handleGetStarted = () => {
    if (user) {
      router.push('/marketplace')
    } else {
      setShowWelcomePanel(true)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-center gap-3 mb-6">
                <Crown className="h-8 w-8 text-primary" />
                <span className="text-primary font-bold text-lg">DEALSMARKET</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                Where Verified Companies
                <span className="text-primary block">Trade Excellence</span>
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Exclusive B2B marketplace connecting verified companies in Europe and the Middle East for premium deals worth millions.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-primary/80"
                  onClick={handleGetStarted}
                >
                  Acceso Inmediato
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg" onClick={handleGetStarted}>
                  Ver Análisis ROI
                </Button>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">€50M+</div>
                  <div className="text-sm text-muted-foreground">Volumen Mensual</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">500+</div>
                  <div className="text-sm text-muted-foreground">Empresas Verificadas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">98%</div>
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
              >
                <motion.img
                  src="https://images.pexels.com/photos/28891887/pexels-photo-28891887.jpeg"
                  alt="Modern Luxury Car Dealership - Premium Business Environment"
                  className="w-full h-auto rounded-xl shadow-2xl glow-primary"
                  animate={{
                    scale: [1, 1.02, 1],
                    filter: [
                      "drop-shadow(0 0 20px rgba(255, 215, 0, 0.3))",
                      "drop-shadow(0 0 40px rgba(255, 215, 0, 0.5))",
                      "drop-shadow(0 0 20px rgba(255, 215, 0, 0.3))"
                    ]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent"></div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Why Premium Members Choose Us</h2>
            <p className="text-xl text-muted-foreground">Exclusive benefits that pay for themselves with your first deal</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Verified Network</CardTitle>
                <CardDescription>
                  Access 500+ pre-screened companies with verified credentials
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <DollarSign className="h-12 w-12 text-green-500 mb-4" />
                <CardTitle>High-Value Deals</CardTitle>
                <CardDescription>
                  Average deal value of $125,000 with payment protection included
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Globe className="h-12 w-12 text-blue-500 mb-4" />
                <CardTitle>Global Reach</CardTitle>
                <CardDescription>
                  Access deals from 50+ countries with 24/7 premium support
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to Join Europe's Most Exclusive B2B Marketplace?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Start connecting with verified companies and close your next million-dollar deal
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-primary/80 text-lg px-8 py-4"
              onClick={handleGetStarted}
            >
              <Crown className="mr-2 h-5 w-5" />
              Acceso Inmediato
            </Button>
          </div>
        </div>
      </section>

      {/* Welcome Panel */}
      <Suspense fallback={null}>
        <WelcomePanel
          isOpen={showWelcomePanel}
          onClose={() => setShowWelcomePanel(false)}
        />
      </Suspense>
    </div>
  )
}
