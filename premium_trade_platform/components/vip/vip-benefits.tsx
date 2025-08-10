
"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Crown, 
  Shield, 
  Zap, 
  Globe,
  Users,
  Star,
  Gift,
  Phone
} from "lucide-react"

export function VipBenefits() {
  const [visibleCards, setVisibleCards] = useState<boolean[]>([])
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  const benefits = [
    {
      icon: Crown,
      title: "Acceso Prioritario",
      description: "Primero en ver las búsquedas más exclusivas",
      details: [
        "Notificaciones instantáneas de nuevas oportunidades",
        "Acceso 24h antes que usuarios estándar",
        "Filtros avanzados exclusivos para VIP",
        "Dashboard personalizado con métricas detalladas"
      ],
      color: "text-primary"
    },
    {
      icon: Shield,
      title: "Verificación Premium",
      description: "Certificación elite que genera confianza",
      details: [
        "Badge VIP visible en todas tus interacciones",
        "Proceso de verificación acelerado",
        "Garantía de identidad y solvencia",
        "Prioridad en disputas y resoluciones"
      ],
      color: "text-green-400"
    },
    {
      icon: Globe,
      title: "Red Global Elite",
      description: "Conexiones exclusivas con la élite mundial",
      details: [
        "Acceso a proveedores ultra-premium",
        "Red privada de coleccionistas internacionales",
        "Conexiones directas con casas de subastas",
        "Brokers certificados de lujo mundial"
      ],
      color: "text-blue-400"
    },
    {
      icon: Zap,
      title: "Respuestas Instantáneas",
      description: "Comunicación directa y prioritaria",
      details: [
        "Canal de comunicación VIP directo",
        "Respuesta garantizada en 1 hora",
        "Soporte telefónico 24/7 premium",
        "Gestor de cuenta personal asignado"
      ],
      color: "text-yellow-400"
    },
    {
      icon: Users,
      title: "Concierge Personalizado",
      description: "Servicio de conserjería de lujo completo",
      details: [
        "Investigación especializada personalizada",
        "Negociación profesional en tu nombre",
        "Due diligence completo de productos",
        "Coordinación de inspecciones y entregas"
      ],
      color: "text-purple-400"
    },
    {
      icon: Gift,
      title: "Eventos Exclusivos",
      description: "Invitaciones VIP a eventos premium",
      details: [
        "Galas de arte y subastas privadas",
        "Lanzamientos exclusivos de productos",
        "Eventos de networking con élite",
        "Acceso a showrooms privados"
      ],
      color: "text-pink-400"
    },
    {
      icon: Star,
      title: "Garantías Premium+",
      description: "Protección completa en todas tus transacciones",
      details: [
        "Verificación de autenticidad garantizada",
        "Seguro de transacción incluido",
        "Garantía de devolución extendida",
        "Soporte legal especializado"
      ],
      color: "text-orange-400"
    },
    {
      icon: Phone,
      title: "Soporte Elite 24/7",
      description: "Asistencia premium disponible siempre",
      details: [
        "Línea directa VIP prioritaria",
        "Soporte multiidioma (12 idiomas)",
        "Resolución acelerada de problemas",
        "Soporte técnico especializado"
      ],
      color: "text-cyan-400"
    }
  ]

  useEffect(() => {
    const observers = cardRefs.current.map((ref, index) => {
      if (!ref) return null
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleCards(prev => {
                const newVisible = [...prev]
                newVisible[index] = true
                return newVisible
              })
            }
          })
        },
        { threshold: 0.2 }
      )
      
      observer.observe(ref)
      return observer
    })

    return () => {
      observers.forEach(observer => observer?.disconnect())
    }
  }, [])

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
          Beneficios <span className="gradient-text">Exclusivos</span> VIP Elite
        </h3>
        <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
          Diseñados específicamente para la élite global. Cada beneficio ha sido pensado 
          para maximizar tu experiencia y resultados en el marketplace premium.
        </p>
        
        <div className="flex items-center justify-center gap-8 mt-8">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-primary" />
            <span className="text-foreground font-semibold">5,000+ Miembros Elite</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary fill-primary" />
            <span className="text-foreground font-semibold">97.8% Satisfacción</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="text-foreground font-semibold">€2.8B Transacciones</span>
          </div>
        </div>
      </motion.div>

      {/* Benefits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {benefits.map((benefit, index) => {
          const IconComponent = benefit.icon
          return (
            <div
              key={index}
              ref={(el) => {
                cardRefs.current[index] = el
              }}
            >
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={visibleCards[index] ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: visibleCards[index] ? index * 0.1 : 0,
                  ease: "easeOut"
                }}
              >
                <Card className="group bg-card/30 backdrop-blur-sm border-border/50 hover:border-primary/30 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] h-full">
                  <CardHeader className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-2xl bg-card border border-border/50 group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className={`h-8 w-8 ${benefit.color}`} />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-foreground group-hover:text-primary transition-colors text-xl">
                          {benefit.title}
                        </CardTitle>
                        <CardDescription className="text-muted-foreground text-base mt-2">
                          {benefit.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      {benefit.details.map((detail, detailIndex) => (
                        <motion.div
                          key={detailIndex}
                          initial={{ x: -20, opacity: 0 }}
                          animate={visibleCards[index] ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }}
                          transition={{ 
                            duration: 0.4, 
                            delay: visibleCards[index] ? (index * 0.1) + (detailIndex * 0.05) + 0.3 : 0 
                          }}
                          className="flex items-start gap-3 group/item hover:bg-muted/20 p-2 rounded-lg transition-colors"
                        >
                          <div className={`w-2 h-2 rounded-full ${benefit.color.replace('text-', 'bg-')} flex-shrink-0 mt-2 group-hover/item:scale-125 transition-transform`} />
                          <span className="text-foreground/90 text-sm leading-relaxed group-hover/item:text-foreground transition-colors">
                            {detail}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-border/50">
                      <Badge 
                        variant="secondary" 
                        className={`${benefit.color.replace('text-', 'bg-')}/10 ${benefit.color} border-0`}
                      >
                        Exclusivo para VIP Elite
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          )
        })}
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="text-center p-12 gradient-card rounded-3xl border border-primary/20 relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-8 gap-4 transform rotate-12 scale-150">
            {Array.from({ length: 32 }).map((_, i) => (
              <div key={i} className="aspect-square bg-primary rounded-lg" />
            ))}
          </div>
        </div>
        
        <div className="relative z-10">
          <Crown className="h-16 w-16 text-primary mx-auto mb-6" />
          <h3 className="text-3xl font-bold text-foreground mb-4">
            ¿Listo para la Experiencia <span className="gradient-text">VIP Elite</span>?
          </h3>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Únete a más de 5,000 miembros elite que ya disfrutan de estos beneficios exclusivos 
            y han generado más de €2.8B en transacciones exitosas.
          </p>
          
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>Activación inmediata</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span>Garantía 30 días</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <span>Soporte premium incluido</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
