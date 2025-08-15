"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Star, DollarSign, MapPin, Calendar, Trash2 } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/hooks/use-auth-instant"
import { useRouter } from "next/navigation"

// Mock data for favorites
const mockFavorites = [
  {
    id: "1",
    title: "Premium Tech Equipment",
    description: "High-quality technology solutions for enterprise clients",
    price: 125000,
    location: "Berlin, Germany",
    rating: 4.8,
    seller: "TechCorp Solutions",
    addedDate: "2024-01-15",
    category: "Technology"
  },
  {
    id: "2", 
    title: "Industrial Machinery Package",
    description: "Complete industrial equipment for manufacturing",
    price: 285000,
    location: "Amsterdam, Netherlands",
    rating: 4.6,
    seller: "IndustrialPro",
    addedDate: "2024-01-10",
    category: "Industrial"
  }
]

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState(mockFavorites)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  const removeFavorite = (id: string) => {
    setFavorites(prev => prev.filter(item => item.id !== id))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Access Required</h2>
          <p className="text-muted-foreground mb-6">Please sign in to view your favorites</p>
          <Button onClick={() => router.push('/login')}>
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <Heart className="h-8 w-8 text-red-500 fill-current" />
            <h1 className="text-4xl font-bold text-foreground">My Favorites</h1>
          </motion.div>
          <p className="text-xl text-muted-foreground">
            Your saved products and deals
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{favorites.length}</div>
              <div className="text-sm text-muted-foreground">Saved Items</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <DollarSign className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-500">
                {formatPrice(favorites.reduce((sum, item) => sum + item.price, 0) / favorites.length || 0)}
              </div>
              <div className="text-sm text-muted-foreground">Average Value</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Star className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">
                {(favorites.reduce((sum, item) => sum + item.rating, 0) / favorites.length || 0).toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </CardContent>
          </Card>
        </div>

        {/* Favorites List */}
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {favorites.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{item.title}</CardTitle>
                        <CardDescription>{item.description}</CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFavorite(item.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge variant="secondary">{item.category}</Badge>
                      <Badge variant="outline" className="bg-green-500/20 text-green-600 border-green-500/30">
                        {formatPrice(item.price)}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {item.location}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Added {formatDate(item.addedDate)}
                      </div>

                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-primary fill-current" />
                        <span className="text-sm font-medium">{item.rating}</span>
                        <span className="text-sm text-muted-foreground">• {item.seller}</span>
                      </div>

                      <div className="flex gap-2 pt-3">
                        <Button className="flex-1">
                          View Details
                        </Button>
                        <Button variant="outline">
                          Contact Seller
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-foreground mb-4">
              No favorites yet
            </h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Start exploring our marketplace and save items you're interested in. 
              Your favorites will appear here for easy access.
            </p>
            <Button onClick={() => router.push('/marketplace')}>
              Explore Marketplace
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
