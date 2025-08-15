"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, TrendingUp, TrendingDown, DollarSign, Package, Filter, Eye, Star } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/hooks/use-auth-instant"

interface StockItem {
  id: string
  name: string
  category: string
  price: number
  change: number
  changePercent: number
  volume: number
  market: string
  trend: 'up' | 'down' | 'stable'
  rating: number
  featured: boolean
}

const mockStockData: StockItem[] = [
  {
    id: "1",
    name: "Productos Tecnológicos Premium",
    category: "Tecnología",
    price: 125000,
    change: 8500,
    changePercent: 7.3,
    volume: 450000,
    market: "Europa",
    trend: 'up',
    rating: 4.8,
    featured: true
  },
  {
    id: "2",
    name: "Maquinaria Industrial Avanzada",
    category: "Industria",
    price: 285000,
    change: -12000,
    changePercent: -4.1,
    volume: 230000,
    market: "Medio Oriente",
    trend: 'down',
    rating: 4.6,
    featured: false
  },
  {
    id: "3",
    name: "Componentes Automotrices",
    category: "Automotriz",
    price: 95000,
    change: 3200,
    changePercent: 3.5,
    volume: 320000,
    market: "Europa",
    trend: 'up',
    rating: 4.7,
    featured: true
  },
  {
    id: "4",
    name: "Equipos Médicos Especializados",
    category: "Salud",
    price: 450000,
    change: 0,
    changePercent: 0,
    volume: 180000,
    market: "Global",
    trend: 'stable',
    rating: 4.9,
    featured: false
  },
  {
    id: "5",
    name: "Materiales de Construcción Premium",
    category: "Construcción",
    price: 75000,
    change: 5800,
    changePercent: 8.4,
    volume: 520000,
    market: "Europa",
    trend: 'up',
    rating: 4.5,
    featured: true
  },
  {
    id: "6",
    name: "Software Empresarial B2B",
    category: "Software",
    price: 85000,
    change: -2500,
    changePercent: -2.9,
    volume: 410000,
    market: "Global",
    trend: 'down',
    rating: 4.8,
    featured: false
  }
]

export default function StockPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedMarket, setSelectedMarket] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [filteredData, setFilteredData] = useState<StockItem[]>(mockStockData)
  const { user } = useAuth()

  useEffect(() => {
    let filtered = mockStockData.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.category.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
      const matchesMarket = selectedMarket === "all" || item.market === selectedMarket
      
      return matchesSearch && matchesCategory && matchesMarket
    })

    // Sort data
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price":
          return b.price - a.price
        case "change":
          return b.changePercent - a.changePercent
        case "volume":
          return b.volume - a.volume
        case "rating":
          return b.rating - a.rating
        default:
          return a.name.localeCompare(b.name)
      }
    })

    setFilteredData(filtered)
  }, [searchTerm, selectedCategory, selectedMarket, sortBy])

  const categories = [...new Set(mockStockData.map(item => item.category))]
  const markets = [...new Set(mockStockData.map(item => item.market))]

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-accent" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-destructive" />
      default:
        return <div className="h-4 w-4 bg-muted rounded-full" />
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(0)}K`
    }
    return volume.toString()
  }

  return (
    <div className="min-h-screen bg-background bg-matrix py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 glow-text">
            Stock de Productos Premium
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Descubre y negocia productos de alta calidad de empresas verificadas en tiempo real
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="gradient-card glow-card mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-muted/50 border-border focus:border-primary"
                  />
                </div>
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-muted/50 border-border">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las Categorías</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedMarket} onValueChange={setSelectedMarket}>
                <SelectTrigger className="bg-muted/50 border-border">
                  <SelectValue placeholder="Mercado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los Mercados</SelectItem>
                  {markets.map(market => (
                    <SelectItem key={market} value={market}>{market}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-muted/50 border-border">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nombre</SelectItem>
                  <SelectItem value="price">Precio</SelectItem>
                  <SelectItem value="change">Cambio</SelectItem>
                  <SelectItem value="volume">Volumen</SelectItem>
                  <SelectItem value="rating">Calificación</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="gradient-card glow-card">
            <CardContent className="p-6 text-center">
              <Package className="h-8 w-8 text-primary mx-auto mb-2 animate-pulse-green" />
              <div className="text-2xl font-bold text-primary glow-text">{filteredData.length}</div>
              <div className="text-sm text-muted-foreground">Productos Disponibles</div>
            </CardContent>
          </Card>

          <Card className="gradient-card glow-card">
            <CardContent className="p-6 text-center">
              <DollarSign className="h-8 w-8 text-accent mx-auto mb-2 animate-pulse-green" />
              <div className="text-2xl font-bold text-accent glow-text">
                {formatPrice(filteredData.reduce((sum, item) => sum + item.price, 0) / filteredData.length)}
              </div>
              <div className="text-sm text-muted-foreground">Precio Promedio</div>
            </CardContent>
          </Card>

          <Card className="gradient-card glow-card">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2 animate-pulse-green" />
              <div className="text-2xl font-bold text-primary glow-text">
                {filteredData.filter(item => item.trend === 'up').length}
              </div>
              <div className="text-sm text-muted-foreground">En Tendencia Alcista</div>
            </CardContent>
          </Card>

          <Card className="gradient-card glow-card">
            <CardContent className="p-6 text-center">
              <Star className="h-8 w-8 text-accent mx-auto mb-2 animate-pulse-green" />
              <div className="text-2xl font-bold text-accent glow-text">
                {(filteredData.reduce((sum, item) => sum + item.rating, 0) / filteredData.length).toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">Calificación Promedio</div>
            </CardContent>
          </Card>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="gradient-card glow-card-hover h-full">
                <CardHeader className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <CardTitle className="text-foreground flex items-center gap-2">
                        {item.name}
                        {item.featured && (
                          <Badge variant="secondary" className="bg-primary text-black">
                            Destacado
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        {item.category} • {item.market}
                      </CardDescription>
                    </div>
                    {getTrendIcon(item.trend)}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary glow-text">
                        {formatPrice(item.price)}
                      </span>
                      <div className={`flex items-center gap-1 ${
                        item.changePercent > 0 ? 'text-accent' : 
                        item.changePercent < 0 ? 'text-destructive' : 'text-muted-foreground'
                      }`}>
                        <span className="text-sm font-medium">
                          {item.changePercent > 0 ? '+' : ''}{item.changePercent.toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Volumen:</span>
                        <div className="font-medium text-foreground">{formatVolume(item.volume)}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Rating:</span>
                        <div className="font-medium text-foreground flex items-center gap-1">
                          {item.rating}
                          <Star className="h-3 w-3 text-accent fill-current" />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button 
                        className="flex-1 btn-neon"
                        disabled={!user}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalles
                      </Button>
                      <Button 
                        variant="outline"
                        className="border-primary text-primary hover:bg-primary hover:text-black"
                        disabled={!user}
                      >
                        Contactar
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-20">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No se encontraron productos
            </h3>
            <p className="text-muted-foreground">
              Ajusta tus filtros para ver más resultados
            </p>
          </div>
        )}

        {!user && (
          <Card className="gradient-card glow-card mt-12">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-foreground mb-4 glow-text">
                Acceso Premium Requerido
              </h3>
              <p className="text-muted-foreground mb-6">
                Inicia sesión para acceder a información detallada de productos y contactar vendedores
              </p>
              <Button className="btn-neon">
                Iniciar Sesión
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
