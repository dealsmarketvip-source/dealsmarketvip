
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Search, 
  Filter, 
  TrendingUp,
  Map,
  Grid3X3,
  List,
  SlidersHorizontal,
  Eye,
  Crown
} from "lucide-react"
import { AdvancedFilters } from "./marketplace/advanced-filters"
import { SearchAnalytics } from "./marketplace/search-analytics"
import { FeaturedSearches } from "./marketplace/featured-searches"

export function MarketplaceAdvanced() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [activeTab, setActiveTab] = useState("featured")

  const quickCategories = [
    { id: "luxury", name: "Artículos de Lujo", icon: "💎", count: 1247, trend: "+23%" },
    { id: "vehicles", name: "Vehículos Premium", icon: "🏎️", count: 856, trend: "+18%" },
    { id: "realestate", name: "Inmuebles Exclusivos", icon: "🏛️", count: 643, trend: "+31%" },
    { id: "art", name: "Arte y Coleccionables", icon: "🎨", count: 892, trend: "+45%" },
    { id: "business", name: "Negocios Premium", icon: "🏢", count: 234, trend: "+67%" },
    { id: "technology", name: "Tecnología Avanzada", icon: "🚀", count: 567, trend: "+89%" },
    { id: "experiences", name: "Experiencias VIP", icon: "✨", count: 345, trend: "+34%" },
    { id: "collectibles", name: "Coleccionables Únicos", icon: "🏆", count: 789, trend: "+12%" }
  ]

  const trendingLocations = [
    { name: "Mónaco", flag: "🇲🇨", searches: 234 },
    { name: "Suiza", flag: "🇨🇭", searches: 189 },
    { name: "Dubai", flag: "🇦🇪", searches: 167 },
    { name: "Londres", flag: "🇬🇧", searches: 156 },
    { name: "París", flag: "🇫🇷", searches: 143 },
    { name: "Nueva York", flag: "🇺🇸", searches: 134 }
  ]

  return (
    <section id="marketplace" className="w-full py-20 px-4 bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/3 to-accent/3 rounded-full blur-3xl" />
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
            <span className="gradient-text">Marketplace</span> Premium
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-8">
            Descubre miles de búsquedas activas de compradores verificados. El lugar donde las oportunidades 
            extraordinarias encuentran a los proveedores excepcionales.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { label: "Búsquedas Activas", value: "3,247", icon: "🔍" },
              { label: "Valor Total", value: "€1.2B", icon: "💰" },
              { label: "Usuarios Verificados", value: "15,234", icon: "✅" },
              { label: "Éxito Promedio", value: "94%", icon: "🎯" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-2xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Advanced Search Bar */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 p-2 rounded-3xl bg-card/50 backdrop-blur-xl border border-border/50">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder="Buscar por producto, marca, categoría..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 bg-transparent border-0 text-foreground placeholder:text-muted-foreground focus:ring-0 focus:ring-offset-0"
                />
              </div>
              
              {/* Category Select */}
              <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-[200px] h-14 bg-transparent border-0">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {quickCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <span>{category.icon}</span>
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Location Select */}
              <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-[200px] h-14 bg-transparent border-0">
                  <SelectValue placeholder="Ubicación" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all">Todas las ubicaciones</SelectItem>
                  {trendingLocations.map((location) => (
                    <SelectItem key={location.name} value={location.name.toLowerCase()}>
                      <div className="flex items-center gap-2">
                        <span>{location.flag}</span>
                        {location.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Filter Button */}
              <Button
                onClick={() => setIsFiltersOpen(true)}
                className="h-14 px-6 bg-muted/50 hover:bg-muted/80 text-foreground border border-border/50 hover:border-primary/50 transition-all duration-300"
                variant="outline"
              >
                <SlidersHorizontal className="mr-2 h-5 w-5" />
                Filtros
              </Button>

              {/* Search Button */}
              <Button className="h-14 px-8 gradient-primary hover:scale-105 transition-all duration-300">
                <Search className="mr-2 h-5 w-5" />
                Buscar
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Quick Categories */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-foreground">Categorías Populares</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-muted" : ""}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-muted" : ""}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className={`grid gap-4 ${
            viewMode === "grid" 
              ? "grid-cols-2 md:grid-cols-4 lg:grid-cols-8" 
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
          }`}>
            {quickCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Button
                  variant="outline"
                  className={`group w-full transition-all duration-300 hover:scale-105 hover:shadow-lg bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 ${
                    viewMode === "grid" ? "h-24 p-3" : "h-16 p-4 justify-start"
                  }`}
                >
                  <div className={`flex items-center gap-3 ${viewMode === "grid" ? "flex-col" : "flex-row flex-1"}`}>
                    <div className="text-2xl group-hover:scale-110 transition-transform">
                      {category.icon}
                    </div>
                    <div className={`${viewMode === "grid" ? "text-center" : "flex-1 text-left"}`}>
                      <div className="font-medium text-foreground text-sm leading-tight">
                        {category.name}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{category.count}</span>
                        <Badge variant="secondary" className="text-xs px-1 py-0 bg-green-500/10 text-green-400">
                          {category.trend}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full md:w-auto grid-cols-3 bg-muted/30 p-1 rounded-2xl">
              <TabsTrigger 
                value="featured" 
                className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Crown className="mr-2 h-4 w-4" />
                Destacadas
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger 
                value="map" 
                className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Map className="mr-2 h-4 w-4" />
                Mapa
              </TabsTrigger>
            </TabsList>

            <TabsContent value="featured" className="space-y-0">
              <FeaturedSearches />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-0">
              <SearchAnalytics />
            </TabsContent>

            <TabsContent value="map" className="space-y-8">
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🗺️</div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Vista de Mapa Interactivo</h3>
                <p className="text-muted-foreground mb-8">
                  Explora búsquedas por ubicación geográfica en tiempo real
                </p>
                <Button className="gradient-primary">
                  <Eye className="mr-2 h-4 w-4" />
                  Próximamente
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Advanced Filters Sidebar */}
        <AdvancedFilters
          isOpen={isFiltersOpen}
          onClose={() => setIsFiltersOpen(false)}
        />

        {/* CTA Section */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-20 gradient-card rounded-3xl p-16 border border-border/50 relative overflow-hidden"
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="grid grid-cols-6 gap-8 transform rotate-12 scale-150">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="aspect-square bg-primary rounded-lg" />
              ))}
            </div>
          </div>

          <div className="relative z-10">
            <h3 className="text-4xl font-bold text-foreground mb-6">
              ¿No Encuentras lo que <span className="gradient-text">Buscas</span>?
            </h3>
            <p className="text-muted-foreground text-xl mb-8 max-w-3xl mx-auto">
              Publica tu búsqueda personalizada y deja que nuestra red global de proveedores 
              verificados compita para ofrecerte las mejores opciones del mercado.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button className="gradient-primary text-primary-foreground px-12 py-4 text-lg font-semibold rounded-2xl hover:scale-105 transition-all duration-300 glow-primary">
                <Crown className="mr-3 h-6 w-6" />
                Publicar Mi Búsqueda
              </Button>
              <Button variant="outline" className="px-8 py-4 text-lg border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent">
                <TrendingUp className="mr-2 h-5 w-5" />
                Ver Todas las Búsquedas
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-8 mt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>3,247 búsquedas activas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span>€1.2B en oportunidades</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                <span>94% tasa de éxito</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
