"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Shield, Zap, Users, Globe, Clock, Award, CheckCircle, ArrowRight } from "lucide-react"

export function ServicesSection() {
  const services = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Verificación Premium",
      description: "Verificamos la identidad y solvencia de todos los miembros para garantizar transacciones seguras.",
      features: [
        "Verificación de identidad",
        "Check de solvencia",
        "Historial de transacciones",
        "Certificado digital",
      ],
      price: "Incluido en VIP",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Búsquedas Destacadas",
      description: "Posiciona tus búsquedas en los primeros lugares para recibir más ofertas de calidad.",
      features: ["Posición prioritaria", "Mayor visibilidad", "Más respuestas", "Analytics detallados"],
      price: "€50/mes por búsqueda",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Gestor Personal",
      description: "Un experto dedicado te ayuda a optimizar tus búsquedas y conectar con los mejores proveedores.",
      features: ["Consultor dedicado", "Optimización de búsquedas", "Red de contactos", "Soporte 24/7"],
      price: "Solo plan Empresarial",
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Red Internacional",
      description: "Acceso a nuestra red global de proveedores verificados en Europa y Medio Oriente.",
      features: ["Proveedores globales", "Múltiples idiomas", "Soporte local", "Logística internacional"],
      price: "Incluido en todos los planes",
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Respuesta Rápida",
      description: "Garantizamos respuestas en menos de 24 horas para búsquedas urgentes marcadas como prioritarias.",
      features: ["Respuesta < 24h", "Notificaciones push", "Email prioritario", "SMS alerts"],
      price: "€25/búsqueda urgente",
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Concierge de Lujo",
      description: "Servicio premium para búsquedas de artículos de lujo con expertos especializados.",
      features: ["Expertos en lujo", "Autenticación", "Valoraciones", "Transacciones seguras"],
      price: "€500/transacción",
    },
  ]

  const processSteps = [
    {
      step: "01",
      title: "Publica tu búsqueda",
      description: "Describe detalladamente lo que necesitas con presupuesto y especificaciones.",
    },
    {
      step: "02",
      title: "Verificamos tu perfil",
      description: "Nuestro equipo verifica tu identidad y solvencia para generar confianza.",
    },
    {
      step: "03",
      title: "Recibe ofertas",
      description: "Los proveedores verificados te contactan directamente con sus mejores ofertas.",
    },
    {
      step: "04",
      title: "Conecta y negocia",
      description: "Comunícate directamente con los oferentes y negocia los mejores términos.",
    },
  ]

  const stats = [
    { number: "10,000+", label: "Búsquedas activas" },
    { number: "5,000+", label: "Miembros verificados" },
    { number: "€2.5B+", label: "Valor transacciones" },
    { number: "98%", label: "Tasa de éxito" },
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
    },
  }

  return (
    <section id="servicios" className="w-full py-20 px-4 bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-40 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
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
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Nuestros <span className="gradient-text">Servicios</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Servicios premium diseñados para maximizar tus oportunidades de encontrar exactamente lo que buscas con la
            máxima seguridad y eficiencia.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div key={index} variants={itemVariants}>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
        >
          {services.map((service, index) => (
            <motion.div key={index} variants={itemVariants}>
              <div className="group gradient-card rounded-2xl p-8 border border-border/50 hover:border-primary/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl h-full">
                <div className="text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>

                <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>

                <p className="text-muted-foreground mb-6 leading-relaxed">{service.description}</p>

                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <div className="text-primary font-bold text-lg mb-4">{service.price}</div>
                  <Button className="w-full gradient-primary hover:scale-105 transition-all duration-300">
                    Más Información
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Process Section */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Cómo Funciona Nuestro Proceso</h3>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Un proceso simple y eficiente diseñado para conectarte con los mejores proveedores del mercado.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                <div className="text-center">
                  <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl mb-4 mx-auto">
                    {step.step}
                  </div>
                  <h4 className="text-lg font-bold text-foreground mb-2">{step.title}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                </div>

                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full">
                    <ArrowRight className="h-6 w-6 text-primary mx-auto" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center gradient-card rounded-3xl p-12 border border-border/50"
        >
          <h3 className="text-3xl font-bold text-foreground mb-4">¿Listo para encontrar lo que buscas?</h3>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Únete a miles de miembros que ya han encontrado exactamente lo que necesitaban a través de nuestra
            plataforma.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="gradient-primary text-primary-foreground px-8 py-4 rounded-2xl font-semibold text-lg hover:scale-105 transition-all duration-300 glow-primary">
              Comenzar Ahora
            </Button>
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4 rounded-2xl font-semibold text-lg bg-transparent"
            >
              Hablar con un Experto
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
