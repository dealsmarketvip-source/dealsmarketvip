"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Header } from "./header"
import { VipBanner } from "./vip-banner"
import Link from "next/link"
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react"

export function HeroSection() {
  const categories = [
    { name: "Artículos de Lujo", icon: "💎" },
    { name: "Vehículos Clásicos", icon: "🏎️" },
    { name: "Inmuebles Premium", icon: "🏛️" },
    { name: "Arte y Coleccionables", icon: "🎨" },
    { name: "Negocios en Venta", icon: "🏢" },
    { name: "Servicios Especializados", icon: "⚡" },
    { name: "Tecnología Avanzada", icon: "🚀" },
    { name: "Experiencias Únicas", icon: "✨" },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
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
    <section className="flex flex-col items-center relative mx-auto overflow-hidden min-h-screen">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="w-full relative z-10">
        <Header />
      </div>

      {/* VIP Banner */}
      <VipBanner />

      {/* Main Content */}
      <div className="w-full flex-1 py-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          {/* Main Title */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-12"
          >
            <h1 className="text-foreground text-5xl md:text-7xl font-bold mb-6 leading-tight">
              ¿QUÉ ESTÁS <span className="gradient-text inline-block">BUSCANDO?</span>
            </h1>

            {/* Hero Image */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-8"
            >
              <img
                src="/images/hero-marketplace.png"
                alt="BridgeZone Marketplace"
                className="w-full max-w-4xl mx-auto rounded-3xl shadow-2xl border border-border/20"
              />
            </motion.div>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-muted-foreground text-xl md:text-2xl max-w-3xl mx-auto"
            >
              El primer marketplace donde publicas lo que necesitas y los vendedores te encuentran
            </motion.p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
          >
            <Link href="#publicar-busqueda">
              <Button className="group gradient-primary text-primary-foreground hover:scale-105 px-10 py-4 rounded-2xl font-semibold text-lg shadow-2xl transition-all duration-300 glow-primary">
                <Sparkles className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                Publicar Búsqueda
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="#ofrecer-servicio">
              <Button className="group bg-accent hover:bg-accent/90 text-accent-foreground hover:scale-105 px-10 py-4 rounded-2xl font-semibold text-lg shadow-2xl transition-all duration-300">
                <TrendingUp className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Ofrecer Servicio
              </Button>
            </Link>
          </motion.div>

          {/* Category Buttons */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20"
          >
            {categories.map((category, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Button
                  variant="outline"
                  className="group gradient-card hover:bg-card/80 text-foreground border-border/50 hover:border-primary/50 py-8 px-6 rounded-2xl font-medium text-sm h-auto transition-all duration-300 hover:scale-105 hover:shadow-lg bg-transparent"
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-2xl group-hover:scale-110 transition-transform">{category.icon}</span>
                    <span className="leading-tight">{category.name}</span>
                  </div>
                </Button>
              </motion.div>
            ))}
          </motion.div>

          {/* Featured Section Header */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">BÚSQUEDAS DESTACADAS</h2>
            <div className="text-sm text-muted-foreground">
              ¿NUEVO EN BRIDGEZONE?{" "}
              <Link
                href="#como-funciona"
                className="text-primary hover:text-primary/80 font-semibold hover:underline transition-all"
              >
                APRENDE CÓMO FUNCIONA
              </Link>
            </div>
          </motion.div>

          {/* Featured Posts Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {/* Post 1 */}
            <motion.div variants={itemVariants}>
              <div className="group gradient-card rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-border/50">
                <div className="relative overflow-hidden">
                  <img
                    src="/images/wanted-posts/luxury-watch.png"
                    alt="Colección de relojes de lujo buscada"
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold">
                      URGENTE
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-3 text-foreground group-hover:text-primary transition-colors">
                    Se Busca: Patek Philippe Nautilus
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    Coleccionista busca Patek Philippe Nautilus en excelente estado. Presupuesto hasta €150,000.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-primary font-bold text-lg">€150,000</span>
                    <Button size="sm" className="gradient-primary hover:scale-105 transition-all duration-300">
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Post 2 */}
            <motion.div variants={itemVariants}>
              <div className="group gradient-card rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-border/50">
                <div className="relative overflow-hidden">
                  <img
                    src="/images/wanted-posts/classic-car.png"
                    alt="Coche clásico deportivo buscado"
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold">
                      VIP
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-3 text-foreground group-hover:text-primary transition-colors">
                    Se Busca: Ferrari 250 GTO
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    Inversor busca Ferrari 250 GTO auténtico con documentación completa.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-primary font-bold text-lg">€50M+</span>
                    <Button size="sm" className="gradient-primary hover:scale-105 transition-all duration-300">
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Post 3 */}
            <motion.div variants={itemVariants}>
              <div className="group gradient-card rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-border/50">
                <div className="relative overflow-hidden">
                  <img
                    src="/images/wanted-posts/yacht.png"
                    alt="Yate de lujo buscado"
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold">
                      DESTACADO
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-3 text-foreground group-hover:text-primary transition-colors">
                    Se Busca: Superyate 80m+
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    Empresario busca superyate de más de 80 metros para compra inmediata.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-primary font-bold text-lg">€100M</span>
                    <Button size="sm" className="gradient-primary hover:scale-105 transition-all duration-300">
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Post 4 */}
            <motion.div variants={itemVariants}>
              <div className="group gradient-card rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-border/50">
                <div className="relative overflow-hidden">
                  <img
                    src="/images/wanted-posts/art-collection.png"
                    alt="Colección de arte buscada"
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-3 text-foreground group-hover:text-primary transition-colors">
                    Se Busca: Obra de Picasso
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    Galería busca obra auténtica de Pablo Picasso período azul o rosa.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-primary font-bold text-lg">€25M</span>
                    <Button size="sm" className="gradient-primary hover:scale-105 transition-all duration-300">
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Post 5 */}
            <motion.div variants={itemVariants}>
              <div className="group gradient-card rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-border/50">
                <div className="relative overflow-hidden">
                  <img
                    src="/images/wanted-posts/real-estate.png"
                    alt="Mansión de lujo buscada"
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-3 text-foreground group-hover:text-primary transition-colors">
                    Se Busca: Mansión en Marbella
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    Familia busca mansión frente al mar en Marbella, mínimo 1000m² construidos.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-primary font-bold text-lg">€15M</span>
                    <Button size="sm" className="gradient-primary hover:scale-105 transition-all duration-300">
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Post 6 */}
            <motion.div variants={itemVariants}>
              <div className="group gradient-card rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-border/50">
                <div className="relative overflow-hidden">
                  <img
                    src="/images/wanted-posts/business.png"
                    alt="Empresa tecnológica buscada"
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-3 text-foreground group-hover:text-primary transition-colors">
                    Se Busca: Startup FinTech
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    Fondo de inversión busca startup FinTech en Europa para adquisición.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-primary font-bold text-lg">€50M</span>
                    <Button size="sm" className="gradient-primary hover:scale-105 transition-all duration-300">
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
