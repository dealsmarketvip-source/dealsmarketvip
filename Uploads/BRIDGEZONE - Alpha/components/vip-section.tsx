"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Crown, Star, Zap, Shield, Users, Globe, Award, CheckCircle, Sparkles } from "lucide-react"

export function VipSection() {
  const vipBenefits = [
    {
      icon: <Crown className="h-8 w-8" />,
      title: "Búsquedas Destacadas",
      description: "Tus búsquedas aparecen en los primeros lugares con badge VIP dorado.",
      highlight: true,
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Respuesta Prioritaria",
      description: "Los proveedores ven tus búsquedas primero y responden más rápido.",
      highlight: true,
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Verificación Premium",
      description: "Verificación completa de identidad y solvencia con certificado digital.",
      highlight: false,
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Red Exclusiva",
      description: "Acceso a proveedores VIP y oportunidades no disponibles públicamente.",
      highlight: true,
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Soporte 24/7",
      description: "Línea directa con nuestro equipo de expertos disponible siempre.",
      highlight: false,
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Concierge Personal",
      description: "Gestor dedicado para búsquedas complejas y de alto valor.",
      highlight: true,
    },
  ]

  const vipFeatures = [
    "Hasta 5 búsquedas destacadas simultáneas",
    "Badge VIP dorado en todas tus publicaciones",
    "Acceso a categorías exclusivas de lujo",
    "Analytics avanzados de tus búsquedas",
    "Notificaciones push prioritarias",
    "Verificación premium con certificado",
    "Soporte por WhatsApp 24/7",
    "Gestor de cuenta personal",
    "Acceso a eventos VIP exclusivos",
    "Red de proveedores premium verificados",
  ]

  const testimonials = [
    {
      name: "Alessandro Conti",
      role: "Coleccionista de Arte",
      image: "/images/avatars/annette-black.png",
      quote: "Como miembro VIP, encontré una obra de Picasso en 48 horas. El servicio es excepcional.",
    },
    {
      name: "Fatima Al-Rashid",
      role: "CEO, Luxury Holdings",
      image: "/images/avatars/dianne-russell.png",
      quote: "La red VIP me ha conectado con proveedores que nunca habría encontrado por mi cuenta.",
    },
    {
      name: "Marcus Weber",
      role: "Inversor Inmobiliario",
      image: "/images/avatars/cameron-williamson.png",
      quote: "El ROI de la membresía VIP se pagó solo con la primera transacción. Increíble.",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  return (
    <section id="vip" className="w-full py-20 px-4 bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-6">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              className="text-primary"
            >
              <Crown className="h-16 w-16" />
            </motion.div>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Membresía <span className="gradient-text">VIP</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Accede al nivel premium de BridgeZone. Búsquedas destacadas, red exclusiva de proveedores y soporte
            personalizado para encontrar exactamente lo que necesitas.
          </p>
        </motion.div>

        {/* VIP Benefits Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
        >
          {vipBenefits.map((benefit, index) => (
            <motion.div key={index} variants={itemVariants}>
              <div
                className={`group gradient-card rounded-2xl p-8 border transition-all duration-500 hover:scale-105 hover:shadow-2xl h-full ${
                  benefit.highlight
                    ? "border-primary/50 hover:border-primary glow-primary"
                    : "border-border/50 hover:border-primary/50"
                }`}
              >
                <div className="text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                  {benefit.icon}
                </div>

                <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                  {benefit.title}
                  {benefit.highlight && <Sparkles className="inline-block ml-2 h-5 w-5 text-primary" />}
                </h3>

                <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* VIP Features List */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="gradient-card rounded-3xl p-12 border border-primary/30 glow-primary">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-foreground mb-4">Todo lo que Incluye la Membresía VIP</h3>
              <p className="text-muted-foreground text-lg">
                Beneficios exclusivos diseñados para maximizar tus oportunidades de éxito.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {vipFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* VIP Testimonials */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Lo que Dicen Nuestros Miembros VIP</h3>
            <p className="text-muted-foreground text-lg">Historias reales de éxito de nuestra comunidad VIP.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="gradient-card rounded-2xl p-8 border border-border/50 hover:border-primary/50 transition-all duration-300"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>

                <p className="text-foreground mb-6 leading-relaxed italic">"{testimonial.quote}"</p>

                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full border-2 border-primary/30"
                  />
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* VIP Pricing Card */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto"
        >
          <div className="gradient-card rounded-3xl p-12 border border-primary/50 glow-primary-strong text-center relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-10">
              <motion.div
                animate={{
                  x: [0, 100, 0],
                  y: [0, -50, 0],
                }}
                transition={{
                  duration: 10,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="absolute top-4 left-4"
              >
                <Crown className="h-8 w-8 text-primary" />
              </motion.div>
              <motion.div
                animate={{
                  x: [0, -80, 0],
                  y: [0, 30, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 2,
                }}
                className="absolute bottom-4 right-4"
              >
                <Sparkles className="h-6 w-6 text-primary" />
              </motion.div>
            </div>

            <div className="relative z-10">
              <div className="flex justify-center mb-6">
                <Crown className="h-12 w-12 text-primary" />
              </div>

              <h3 className="text-3xl font-bold text-foreground mb-4">Membresía VIP</h3>

              <div className="text-5xl font-bold gradient-text mb-2">€20</div>
              <div className="text-muted-foreground mb-8">/mes</div>

              <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto">
                Acceso completo a todas las funciones premium, red exclusiva de proveedores y soporte personalizado.
              </p>

              <Button className="gradient-primary text-primary-foreground px-12 py-4 rounded-2xl font-bold text-xl hover:scale-105 transition-all duration-300 glow-primary pulse-glow">
                <Crown className="mr-2 h-6 w-6" />
                Hacerse VIP Ahora
              </Button>

              <p className="text-sm text-muted-foreground mt-4">Sin permanencia • Cancela cuando quieras</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
