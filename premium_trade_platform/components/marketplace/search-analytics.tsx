
"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Eye, Clock, MapPin } from "lucide-react"

export function SearchAnalytics() {
  const trendingSearches = [
    { term: "Rolex Daytona", searches: 1247, trend: "+23%", location: "Monaco", timeframe: "última semana" },
    { term: "Ferrari LaFerrari", searches: 892, trend: "+45%", location: "Dubai", timeframe: "último mes" },
    { term: "Picasso Original", searches: 654, trend: "-12%", location: "París", timeframe: "última semana" },
    { term: "Penthouse Manhattan", searches: 543, trend: "+67%", location: "Nueva York", timeframe: "último mes" },
    { term: "Hermès Birkin", searches: 432, trend: "+89%", location: "Londres", timeframe: "última semana" },
    { term: "Bugatti Chiron", searches: 321, trend: "+34%", location: "Suiza", timeframe: "último mes" }
  ]

  const topCategories = [
    { name: "Relojes de Lujo", percentage: 32, searches: 3247 },
    { name: "Vehículos Premium", percentage: 28, searches: 2856 },
    { name: "Arte y Antigüedades", percentage: 18, searches: 1834 },
    { name: "Inmuebles Exclusivos", percentage: 12, searches: 1245 },
    { name: "Joyas y Diamantes", percentage: 10, searches: 1023 }
  ]

  const hotspots = [
    { city: "Mónaco", flag: "🇲🇨", searches: 2341, growth: "+45%" },
    { city: "Dubai", flag: "🇦🇪", searches: 1987, growth: "+32%" },
    { city: "Ginebra", flag: "🇨🇭", searches: 1654, growth: "+28%" },
    { city: "Londres", flag: "🇬🇧", searches: 1432, growth: "+23%" },
    { city: "Nueva York", flag: "🇺🇸", searches: 1287, growth: "+19%" },
    { city: "París", flag: "🇫🇷", searches: 1156, growth: "+15%" }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h3 className="text-3xl font-bold text-foreground mb-4">
          Analytics de <span className="gradient-text">Búsquedas</span>
        </h3>
        <p className="text-muted-foreground text-lg">
          Tendencias y datos en tiempo real del mercado premium global
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trending Searches */}
        <motion.div
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <TrendingUp className="h-5 w-5 text-primary" />
                Búsquedas Trending
              </CardTitle>
              <CardDescription>
                Las búsquedas más populares en tiempo real
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {trendingSearches.map((search, index) => (
                <motion.div
                  key={search.term}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group cursor-pointer"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {search.term}
                      </h4>
                      <Badge 
                        variant={search.trend.startsWith('+') ? 'default' : 'secondary'}
                        className={search.trend.startsWith('+') ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}
                      >
                        {search.trend.startsWith('+') ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                        {search.trend}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {search.searches.toLocaleString()} búsquedas
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {search.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {search.timeframe}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Categories */}
        <motion.div
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-8"
        >
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-foreground">Categorías Top</CardTitle>
              <CardDescription>Por volumen de búsquedas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {topCategories.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.6 + (index * 0.1) }}
                  className="space-y-2"
                >
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-foreground">{category.name}</span>
                    <span className="text-muted-foreground">{category.percentage}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary rounded-full h-2 transition-all duration-1000 ease-out"
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {category.searches.toLocaleString()} búsquedas
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Geographic Hotspots */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-foreground">Hotspots Geográficos</CardTitle>
              <CardDescription>Ciudades con mayor actividad</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {hotspots.map((hotspot, index) => (
                <motion.div
                  key={hotspot.city}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.8 + (index * 0.1) }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{hotspot.flag}</span>
                    <div>
                      <div className="font-semibold text-foreground">{hotspot.city}</div>
                      <div className="text-xs text-muted-foreground">{hotspot.searches.toLocaleString()} búsquedas</div>
                    </div>
                  </div>
                  <Badge className="bg-green-500/10 text-green-400">
                    {hotspot.growth}
                  </Badge>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
