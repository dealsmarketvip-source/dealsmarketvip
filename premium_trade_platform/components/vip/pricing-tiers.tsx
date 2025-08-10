
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { 
  Crown, 
  Check, 
  Star,
  Zap,
  Diamond,
  Infinity,
  Shield
} from "lucide-react"

export function PricingTiers() {
  const [isYearly, setIsYearly] = useState(false)

  const tiers = [
    {
      name: "VIP Elite",
      description: "Para coleccionistas y empresarios exigentes",
      icon: Crown,
      price: { monthly: 149, yearly: 1490 },
      originalPrice: { monthly: 199, yearly: 1990 },
      popular: false,
      features: [
        "Acceso prioritario a búsquedas exclusivas",
        "Verificación premium y badge VIP",
        "Soporte VIP 24/7 en 12 idiomas",
        "Red global de proveedores verificados",
        "Analytics avanzados y reportes",
        "Garantía de transacción incluida",
        "Eventos VIP trimestrales",
        "Hasta 50 búsquedas destacadas/mes"
      ],
      color: "from-primary to-primary/80",
      badgeColor: "bg-primary text-primary-foreground"
    },
    {
      name: "VIP Elite Pro",
      description: "El máximo nivel de exclusividad",
      icon: Diamond,
      price: { monthly: 299, yearly: 2990 },
      originalPrice: { monthly: 399, yearly: 3990 },
      popular: true,
      features: [
        "Todo de VIP Elite, más:",
        "Concierge personal asignado",
        "Acceso a subastas privadas exclusivas",
        "Due diligence profesional incluido",
        "Negociación profesional en tu nombre",
        "Seguro de transacción premium",
        "Invitaciones a galas internacionales",
        "Búsquedas destacadas ilimitadas",
        "Línea directa con CEO"
      ],
      color: "from-purple-600 to-pink-600",
      badgeColor: "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
    },
    {
      name: "VIP Ultra Elite",
      description: "Exclusivo para ultra high net worth",
      icon: Infinity,
      price: { monthly: 599, yearly: 5990 },
      originalPrice: { monthly: 799, yearly: 7990 },
      popular: false,
      features: [
        "Todo de VIP Elite Pro, más:",
        "Equipo dedicado de 3 especialistas",
        "Acceso a deals off-market exclusivos",
        "Investigación de mercado personalizada",
        "Conexiones directas con casas de subastas",
        "Cobertura de seguro hasta €10M",
        "Eventos privados personalizados",
        "Servicios de logística global",
        "Consultoría de inversión incluida"
      ],
      color: "from-amber-500 to-orange-600",
      badgeColor: "bg-gradient-to-r from-amber-500 to-orange-600 text-white"
    }
  ]

  const calculateSavings = (monthly: number, yearly: number) => {
    const yearlyCost = monthly * 12
    const savings = yearlyCost - yearly
    const percentage = Math.round((savings / yearlyCost) * 100)
    return { amount: savings, percentage }
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
          Planes <span className="gradient-text">VIP Elite</span>
        </h3>
        <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-8">
          Elige el nivel de exclusividad que mejor se adapte a tus necesidades. 
          Todos los planes incluyen garantía de satisfacción de 30 días.
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <Label htmlFor="billing-switch" className={`text-lg ${!isYearly ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>
            Mensual
          </Label>
          <div className="relative">
            <Switch
              id="billing-switch"
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-primary"
            />
            {isYearly && (
              <Badge className="absolute -top-8 -right-2 bg-green-500 text-white text-xs">
                Ahorra 25%
              </Badge>
            )}
          </div>
          <Label htmlFor="billing-switch" className={`text-lg ${isYearly ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>
            Anual
          </Label>
        </div>
      </motion.div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {tiers.map((tier, index) => {
          const IconComponent = tier.icon
          const savings = calculateSavings(tier.price.monthly, tier.price.yearly)
          const currentPrice = isYearly ? tier.price.yearly : tier.price.monthly
          const originalPrice = isYearly ? tier.originalPrice.yearly : tier.originalPrice.monthly

          return (
            <motion.div
              key={tier.name}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className={tier.badgeColor}>
                    <Star className="w-3 h-3 mr-1" />
                    Más Popular
                  </Badge>
                </div>
              )}

              <Card className={`group relative overflow-hidden border-2 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl h-full ${
                tier.popular 
                  ? 'border-primary/50 bg-card/70 backdrop-blur-xl' 
                  : 'border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30'
              }`}>
                {/* Background Gradient */}
                <div className={`absolute inset-0 opacity-5 bg-gradient-to-br ${tier.color}`} />

                <CardHeader className="relative z-10 text-center space-y-4">
                  {/* Icon */}
                  <div className="flex justify-center">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${tier.color} shadow-lg`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <CardTitle className="text-foreground text-2xl font-bold">
                      {tier.name}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground mt-2">
                      {tier.description}
                    </CardDescription>
                  </div>

                  {/* Pricing */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-3xl md:text-4xl font-bold text-foreground">
                        €{currentPrice.toLocaleString()}
                      </span>
                      <div className="text-left">
                        <div className="text-sm text-muted-foreground line-through">
                          €{originalPrice.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          /{isYearly ? 'año' : 'mes'}
                        </div>
                      </div>
                    </div>
                    
                    {isYearly && (
                      <div className="text-sm text-green-400 font-semibold">
                        Ahorras €{savings.amount.toLocaleString()} ({savings.percentage}%)
                      </div>
                    )}
                    
                    <div className="text-xs text-muted-foreground">
                      {isYearly ? 'Facturado anualmente' : 'Facturado mensualmente'}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="relative z-10 space-y-6">
                  {/* Features */}
                  <div className="space-y-3">
                    {tier.features.map((feature, featureIndex) => (
                      <motion.div
                        key={featureIndex}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.4, delay: (index * 0.1) + (featureIndex * 0.05) + 0.3 }}
                        className="flex items-start gap-3 group/feature"
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          {feature.startsWith('Todo de') ? (
                            <Zap className="h-4 w-4 text-primary" />
                          ) : (
                            <Check className="h-4 w-4 text-green-400" />
                          )}
                        </div>
                        <span className={`text-sm leading-relaxed transition-colors group-hover/feature:text-foreground ${
                          feature.startsWith('Todo de') 
                            ? 'text-primary font-semibold' 
                            : 'text-foreground/90'
                        }`}>
                          {feature}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <div className="space-y-4 pt-6">
                    <Button 
                      className={`w-full py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg ${
                        tier.popular
                          ? 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground glow-primary'
                          : 'gradient-primary'
                      }`}
                    >
                      <Crown className="mr-2 h-5 w-5" />
                      Comenzar Ahora
                    </Button>
                    
                    <div className="text-center space-y-2">
                      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <Shield className="h-3 w-3" />
                        <span>Garantía de 30 días</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Sin compromiso · Cancela cuando quieras
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Enterprise CTA */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="text-center p-8 gradient-card rounded-2xl border border-primary/20 relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-6 gap-6 transform rotate-12 scale-150">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="aspect-square bg-primary rounded-lg" />
            ))}
          </div>
        </div>
        
        <div className="relative z-10">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            ¿Necesitas algo más <span className="gradient-text">Personalizado</span>?
          </h3>
          <p className="text-muted-foreground mb-6">
            Para organizaciones, family offices y ultra high net worth individuals 
            ofrecemos soluciones completamente personalizadas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              Contactar Ventas Enterprise
            </Button>
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              Agendar Demo Personalizada
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
