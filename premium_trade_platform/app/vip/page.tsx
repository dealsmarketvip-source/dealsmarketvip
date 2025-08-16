"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Crown, 
  Star, 
  Users, 
  Award,
  Sparkles,
  Target,
  Diamond,
  ArrowLeft
} from "lucide-react"
import Link from "next/link"
import { VipBenefits } from "@/components/vip/vip-benefits"
import { PricingTiers } from "@/components/vip/pricing-tiers"
import SubscribeButton from "@/components/SubscribeButton"
import { useAuth } from "@/hooks/use-auth-instant"

export default function VipPage() {
  const { user, userProfile } = useAuth()
  const vipStats = [
    { 
      number: "5,000+", 
      label: "Miembros VIP Elite", 
      icon: "👑",
      description: "Empresarios y coleccionistas exclusivos"
    },
    { 
      number: "€2.8B", 
      label: "Transacciones VIP", 
      icon: "💎",
      description: "Volumen total gestionado en 2024"
    },
    { 
      number: "97.8%", 
      label: "Tasa de Éxito", 
      icon: "🎯",
      description: "Búsquedas exitosas para miembros VIP"
    },
    { 
      number: "24/7", 
      label: "Soporte Premium", 
      icon: "⚡",
      description: "Disponible en 12 idiomas"
    }
  ]

  const exclusiveFeatures = [
    {
      title: "Red Global Elite",
      description: "Acceso a proveedores ultra-premium no disponibles públicamente",
      icon: "🌍",
      details: [
        "Casas de subastas exclusivas",
        "Dealers certificados internacionalmente",
        "Red privada de coleccionistas",
        "Brokers de lujo verificados"
      ]
    },
    {
      title: "Concierge Personalizado",
      description: "Servicio de conserjería premium para búsquedas complejas",
      icon: "🎩",
      details: [
        "Gestor personal asignado",
        "Investigación especializada",
        "Negociación profesional",
        "Due diligence completo"
      ]
    },
    {
      title: "Eventos Exclusivos",
      description: "Invitaciones a galas, subastas y eventos de networking VIP",
      icon: "🍾",
      details: [
        "Galas de arte contemporáneo",
        "Subastas privadas",
        "Eventos de networking",
        "Lanzamientos exclusivos"
      ]
    },
    {
      title: "Garantía Premium+",
      description: "Protección completa para transacciones de alto valor",
      icon: "🛡️",
      details: [
        "Verificación de autenticidad",
        "Seguro de transacción",
        "Garantía de devolución",
        "Soporte legal especializado"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="w-full py-6 px-6 bg-background/80 backdrop-blur-xl border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-4">
                <ArrowLeft className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
                <div className="flex flex-col items-start">
                  <span className="text-foreground text-2xl font-bold tracking-wider gradient-text">BRIDGEZONE</span>
                  <span className="text-muted-foreground text-xs font-medium uppercase tracking-widest">VIP ELITE</span>
                </div>
              </Link>
              <nav className="hidden md:flex items-center gap-2">
                <Link href="/marketplace" className="text-muted-foreground hover:text-primary px-4 py-2 rounded-full font-medium transition-all duration-300 hover:bg-muted/50">Marketplace</Link>
                <Link href="/vip" className="text-primary px-4 py-2 rounded-full font-medium transition-all duration-300 bg-primary/10">VIP Elite</Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Button className="gradient-primary text-primary-foreground hover:scale-105 px-6 py-2 rounded-full font-medium shadow-lg transition-all duration-300 glow-primary">
                Registrarse
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full py-20 px-4 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-[1200px] h-[800px] bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/8 rounded-full blur-3xl animate-pulse" style={{animationDelay: '3s'}} />
          <div className="absolute top-40 left-20 w-72 h-72 bg-accent/8 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}} />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Hero Header */}
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            {/* Animated Crown */}
            <div className="flex justify-center mb-8">
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1],
                  y: [0, -10, 0]
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative"
              >
                <Crown className="h-24 w-24 text-primary" />
                
                {/* Floating sparkles */}
                <motion.div
                  animate={{ 
                    scale: [0.8, 1.2, 0.8],
                    opacity: [0.3, 1, 0.3],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                  className="absolute -top-4 -right-4"
                >
                  <Sparkles className="h-6 w-6 text-primary" />
                </motion.div>
                <motion.div
                  animate={{ 
                    scale: [1, 0.8, 1],
                    opacity: [0.5, 1, 0.5],
                    rotate: [0, -180, -360]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                  className="absolute -bottom-2 -left-6"
                >
                  <Star className="h-5 w-5 text-primary fill-primary" />
                </motion.div>
              </motion.div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-8">
              Experiencia <span className="gradient-text">VIP Elite</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-12">
              Únete a la red más exclusiva del mundo. Donde las búsquedas extraordinarias 
              se encuentran con el servicio excepcional y las oportunidades ilimitadas.
            </p>

            {/* VIP Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-primary/20 to-accent/20 backdrop-blur-sm border border-primary/30 rounded-full px-8 py-4 mb-12"
            >
              <Crown className="h-6 w-6 text-primary" />
              <span className="text-foreground font-semibold text-lg">
                Membresía VIP Elite - Acceso Inmediato
              </span>
              <Badge className="bg-primary text-primary-foreground">
                Limitado
              </Badge>
            </motion.div>
          </motion.div>

          {/* VIP Stats */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
          >
            {vipStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 + (index * 0.1) }}
                className="text-center group"
              >
                <div className="bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm border border-primary/20 rounded-2xl p-8 hover:border-primary/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                  <div className="text-lg font-semibold text-foreground mb-2">{stat.label}</div>
                  <div className="text-sm text-muted-foreground">{stat.description}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Exclusive Features Preview */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Servicios <span className="gradient-text">Exclusivos</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Funcionalidades premium diseñadas para la élite global
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {exclusiveFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ x: index % 2 === 0 ? -30 : 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 + (index * 0.1) }}
                  className="group"
                >
                  <div className="bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 rounded-2xl p-8 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl h-full">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {feature.details.map((detail, detailIndex) => (
                        <div key={`vip-page-${index}-detail-${detailIndex}`} className="flex items-center gap-3 text-sm">
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                          <span className="text-foreground">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Main VIP Tabs */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Tabs defaultValue="benefits" className="space-y-8">
              <TabsList className="grid w-full md:w-auto grid-cols-2 bg-muted/30 p-1 rounded-2xl">
                <TabsTrigger 
                  value="benefits" 
                  className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-8 py-3"
                >
                  <Diamond className="mr-2 h-5 w-5" />
                  Beneficios Elite
                </TabsTrigger>
                <TabsTrigger 
                  value="pricing" 
                  className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-8 py-3"
                >
                  <Target className="mr-2 h-5 w-5" />
                  Planes y Precios
                </TabsTrigger>
              </TabsList>

              <TabsContent value="benefits" className="space-y-0">
                <VipBenefits />
              </TabsContent>

              <TabsContent value="pricing" className="space-y-0">
                <PricingTiers />
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Final CTA */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center mt-20 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 rounded-3xl blur-xl" />
            <div className="relative bg-card/30 backdrop-blur-xl border border-primary/30 rounded-3xl p-16 glow-primary">
              <Crown className="h-16 w-16 text-primary mx-auto mb-6" />
              <h3 className="text-4xl font-bold text-foreground mb-6">
                Tu Búsqueda <span className="gradient-text">Perfecta</span> Te Espera
              </h3>
              <p className="text-muted-foreground text-xl mb-8 max-w-3xl mx-auto">
                Más de 5,000 miembros elite ya han descubierto oportunidades valoradas en €2.8B. 
                Es tu momento de unirte a la élite.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                {userProfile?.role !== 'premium' ? (
                  <SubscribeButton
                    userId={user?.id}
                    email={user?.email || ''}
                    className="gradient-primary text-primary-foreground px-16 py-6 text-xl font-bold rounded-2xl hover:scale-105 transition-all duration-300 glow-primary"
                  />
                ) : (
                  <Button className="gradient-primary text-primary-foreground px-16 py-6 text-xl font-bold rounded-2xl hover:scale-105 transition-all duration-300 glow-primary" disabled>
                    <Crown className="mr-3 h-7 w-7" />
                    Ya eres Miembro VIP Elite
                  </Button>
                )}
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">
                    <span className="line-through">€199/mes</span> → <span className="text-primary font-bold">€20/mes</span>
                  </div>
                  <div className="text-xs text-green-400">Oferta especial - Suscripción premium</div>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-8 mt-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary" />
                  <span>Garantía 30 días</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span>5,000+ miembros elite</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-primary fill-primary" />
                  <span>97.8% satisfacción</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
