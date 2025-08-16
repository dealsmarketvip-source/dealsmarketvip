"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Search, Filter, Star, Verified, TrendingUp, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function MarketplaceSection() {
  const featuredSearches = [
    {
      id: 1,
      title: "Rolex Daytona Paul Newman",
      category: "Relojes de Lujo",
      budget: "€500,000",
      location: "Suiza",
      urgency: "Alta",
      verified: true,
      responses: 12,
      timeLeft: "2 días",
      description: "Coleccionista serio busca Rolex Daytona Paul Newman auténtico con documentación completa.",
      image: "/images/wanted-posts/luxury-watch.png",
    },
    {
      id: 2,
      title: "Startup IA en Europa",
      category: "Negocios",
      budget: "€10M - €50M",
      location: "Europa",
      urgency: "Media",
      verified: true,
      responses: 8,
      timeLeft: "1 semana",
      description: "Fondo de inversión busca startup de IA con tracción demostrada para adquisición.",
      image: "/images/wanted-posts/business.png",
    },
    {
      id: 3,
      title: "Villa en Costa del Sol",
      category: "Inmuebles",
      budget: "€5M - €15M",
      location: "España",
      urgency: "Baja",
      verified: true,
      responses: 15,
      timeLeft: "3 días",
      description: "Familia busca villa de lujo frente al mar con mínimo 8 habitaciones y piscina.",
      image: "/images/wanted-posts/real-estate.png",
    },
    {
      id: 4,
      title: "Colección Arte Contemporáneo",
      category: "Arte",
      budget: "€2M - €10M",
      location: "Internacional",
      urgency: "Media",
      verified: true,
      responses: 6,
      timeLeft: "5 días",
      description: "Museo privado busca obras de Banksy, Kaws y artistas contemporáneos reconocidos.",
      image: "/images/wanted-posts/art-collection.png",
    },
  ]

  const categories = [
    { name: "Artículos de Lujo", count: 234, icon: "💎" },
    { name: "Vehículos", count: 156, icon: "🏎️" },
    { name: "Inmuebles", count: 89, icon: "🏛️" },
    { name: "Arte y Coleccionables", count: 167, icon: "🎨" },
    { name: "Negocios", count: 78, icon: "🏢" },
    { name: "Servicios", count: 145, icon: "⚡" },
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
    <section id="marketplace" className="w-full py-20 px-4 bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
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
            <span className="gradient-text">Marketplace</span> de Búsquedas
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explora miles de búsquedas activas de compradores verificados. Encuentra oportunidades únicas y conecta
            directamente con quien necesita lo que ofreces.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Buscar por producto, servicio o palabra clave..."
                className="pl-12 h-14 bg-card border-border text-foreground rounded-2xl"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-[200px] h-14 bg-card border-border rounded-2xl">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="luxury">Artículos de Lujo</SelectItem>
                <SelectItem value="vehicles">Vehículos</SelectItem>
                <SelectItem value="real-estate">Inmuebles</SelectItem>
                <SelectItem value="art">Arte</SelectItem>
                <SelectItem value="business">Negocios</SelectItem>
                <SelectItem value="services">Servicios</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="budget">
              <SelectTrigger className="w-full md:w-[200px] h-14 bg-card border-border rounded-2xl">
                <SelectValue placeholder="Presupuesto" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="budget">Cualquier presupuesto</SelectItem>
                <SelectItem value="low">€1K - €10K</SelectItem>
                <SelectItem value="medium">€10K - €100K</SelectItem>
                <SelectItem value="high">€100K - €1M</SelectItem>
                <SelectItem value="premium">€1M+</SelectItem>
              </SelectContent>
            </Select>
            <Button className="h-14 px-8 gradient-primary rounded-2xl">
              <Filter className="mr-2 h-5 w-5" />
              Filtrar
            </Button>
          </div>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16"
        >
          {categories.map((category, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Button
                variant="outline"
                className="group w-full h-24 gradient-card hover:bg-card/80 border-border/50 hover:border-primary/50 rounded-2xl transition-all duration-300 hover:scale-105 bg-transparent"
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl group-hover:scale-110 transition-transform">{category.icon}</span>
                  <div className="text-center">
                    <div className="text-sm font-medium text-foreground">{category.name}</div>
                    <div className="text-xs text-muted-foreground">{category.count} búsquedas</div>
                  </div>
                </div>
              </Button>
            </motion.div>
          ))}
        </motion.div>

        {/* Featured Searches */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground">Búsquedas Destacadas</h3>
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
            >
              Ver todas
            </Button>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {featuredSearches.map((search, index) => (
              <motion.div key={search.id} variants={itemVariants}>
                <div className="group gradient-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
                  <div className="relative">
                    <img
                      src={search.image || "/placeholder.svg"}
                      alt={search.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      {search.verified && (
                        <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <Verified className="h-3 w-3" />
                          Verificado
                        </span>
                      )}
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${
                          search.urgency === "Alta"
                            ? "bg-red-500 text-white"
                            : search.urgency === "Media"
                              ? "bg-yellow-500 text-black"
                              : "bg-green-500 text-white"
                        }`}
                      >
                        {search.urgency}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="bg-background/80 backdrop-blur-sm text-foreground px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {search.timeLeft}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                          {search.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {search.category} • {search.location}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-primary font-bold text-lg">{search.budget}</div>
                      </div>
                    </div>

                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{search.description}</p>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          {search.responses} ofertas
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-primary text-primary" />
                          4.9
                        </span>
                      </div>
                      <Button className="gradient-primary hover:scale-105 transition-all duration-300">
                        Hacer Oferta
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center gradient-card rounded-3xl p-12 border border-border/50"
        >
          <h3 className="text-3xl font-bold text-foreground mb-4">¿No encuentras lo que buscas?</h3>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Publica tu propia búsqueda y deja que los vendedores te encuentren con las mejores ofertas del mercado.
          </p>
          <Button className="gradient-primary text-primary-foreground px-8 py-4 rounded-2xl font-semibold text-lg hover:scale-105 transition-all duration-300 glow-primary">
            Publicar Mi Búsqueda
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
