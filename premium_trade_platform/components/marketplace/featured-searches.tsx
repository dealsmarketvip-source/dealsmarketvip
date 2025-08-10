
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Crown, 
  MapPin, 
  Clock, 
  Eye, 
  Heart,
  Share2,
  CheckCircle,
  Star,
  TrendingUp
} from "lucide-react"

export function FeaturedSearches() {
  const [favorites, setFavorites] = useState<string[]>([])

  const featuredSearches = [
    {
      id: "1",
      title: "Rolex Daytona Platino - Edición Limitada",
      description: "Buscando Rolex Daytona en platino, preferiblemente con diamantes en la carátula. Certificado de autenticidad requerido.",
      category: "Relojes de Lujo",
      location: "Mónaco",
      budget: "€150,000 - €200,000",
      urgency: "Alta",
      postedBy: "Coleccionista Verificado",
      timeAgo: "hace 2 horas",
      views: 247,
      responses: 12,
      isVip: true,
      verified: true,
      trending: true
    },
    {
      id: "2",
      title: "Ferrari LaFerrari - Estado Impecable",
      description: "Coleccionista serio busca Ferrari LaFerrari con menos de 1,000 km. Historial completo de mantenimiento esencial.",
      category: "Vehículos Premium",
      location: "Dubai",
      budget: "€2,500,000 - €3,000,000",
      urgency: "Media",
      postedBy: "Empresa Verificada",
      timeAgo: "hace 5 horas",
      views: 892,
      responses: 28,
      isVip: true,
      verified: true,
      trending: true
    },
    {
      id: "3",
      title: "Picasso - Período Azul Original",
      description: "Galería internacional busca obra original de Picasso del período azul. Proveniencia documentada imprescindible.",
      category: "Arte y Coleccionables",
      location: "París",
      budget: "€5,000,000+",
      urgency: "Baja",
      postedBy: "Galería de Arte",
      timeAgo: "hace 1 día",
      views: 654,
      responses: 8,
      isVip: true,
      verified: true,
      trending: false
    },
    {
      id: "4",
      title: "Penthouse con Vista al Central Park",
      description: "Inversionista privado busca penthouse de lujo en Manhattan con vista al Central Park. Mínimo 400m².",
      category: "Inmuebles Exclusivos",
      location: "Nueva York",
      budget: "€25,000,000 - €40,000,000",
      urgency: "Alta",
      postedBy: "Inversionista Privado",
      timeAgo: "hace 3 horas",
      views: 543,
      responses: 15,
      isVip: true,
      verified: true,
      trending: true
    },
    {
      id: "5",
      title: "Hermès Birkin - Cocodrilo Himalaya",
      description: "Coleccionista busca Hermès Birkin en piel de cocodrilo Himalaya, tamaño 30cm. Preferencia por herrajes de oro.",
      category: "Artículos de Lujo",
      location: "Londres",
      budget: "€300,000 - €500,000",
      urgency: "Media",
      postedBy: "Coleccionista Elite",
      timeAgo: "hace 6 horas",
      views: 432,
      responses: 9,
      isVip: false,
      verified: true,
      trending: false
    },
    {
      id: "6",
      title: "Bugatti Chiron Sport - Color Personalizado",
      description: "Búsqueda de Bugatti Chiron Sport con configuración personalizada. Interesado en colores únicos y acabados especiales.",
      category: "Vehículos Premium",
      location: "Ginebra",
      budget: "€3,500,000+",
      urgency: "Baja",
      postedBy: "Coleccionista de Autos",
      timeAgo: "hace 8 horas",
      views: 321,
      responses: 6,
      isVip: true,
      verified: true,
      trending: false
    }
  ]

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    )
  }

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
          Búsquedas <span className="gradient-text">Destacadas</span>
        </h3>
        <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
          Oportunidades exclusivas de compradores verificados. Conecta con la élite global 
          y accede a las búsquedas más codiciadas del mercado premium.
        </p>
      </motion.div>

      {/* Featured Searches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {featuredSearches.map((search, index) => (
          <motion.div
            key={search.id}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card className="group bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] h-full">
              <CardHeader className="space-y-4">
                {/* Header Row */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    {search.isVip && (
                      <Badge className="bg-primary/20 text-primary border-primary/30">
                        <Crown className="w-3 h-3 mr-1" />
                        VIP
                      </Badge>
                    )}
                    {search.verified && (
                      <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verificado
                      </Badge>
                    )}
                    {search.trending && (
                      <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFavorite(search.id)}
                      className="text-muted-foreground hover:text-red-400"
                    >
                      <Heart 
                        className={`h-4 w-4 ${
                          favorites.includes(search.id) ? 'fill-red-400 text-red-400' : ''
                        }`}
                      />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <CardTitle className="text-foreground group-hover:text-primary transition-colors text-lg leading-tight">
                    {search.title}
                  </CardTitle>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="font-medium text-primary">{search.category}</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {search.location}
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Description */}
                <CardDescription className="text-foreground/80 leading-relaxed">
                  {search.description}
                </CardDescription>

                {/* Budget */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-primary/5 border border-primary/20">
                  <span className="text-sm font-medium text-muted-foreground">Presupuesto:</span>
                  <span className="font-bold text-primary text-lg">{search.budget}</span>
                </div>

                {/* Stats Row */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {search.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {search.responses} respuestas
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {search.timeAgo}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{search.postedBy}</div>
                      <div className="text-xs text-muted-foreground">
                        Urgencia: <span className={`font-medium ${
                          search.urgency === 'Alta' ? 'text-red-400' : 
                          search.urgency === 'Media' ? 'text-yellow-400' : 'text-green-400'
                        }`}>
                          {search.urgency}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button className="gradient-primary hover:scale-105 transition-transform">
                    Responder
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Load More */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="text-center pt-8"
      >
        <Button 
          variant="outline" 
          className="px-12 py-3 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground hover:scale-105 transition-all duration-300"
        >
          Cargar Más Búsquedas
        </Button>
        <p className="text-muted-foreground text-sm mt-4">
          Mostrando 6 de 3,247 búsquedas activas
        </p>
      </motion.div>
    </div>
  )
}
