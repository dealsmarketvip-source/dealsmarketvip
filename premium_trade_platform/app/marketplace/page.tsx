"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Filter, DollarSign, MapPin, Calendar, Crown, Lock } from "lucide-react"
import { CrownLogoWithBrand } from "@/components/ui/crown-logo"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { toast } from "sonner"

interface Product {
  id: string
  title: string
  description: string
  price: number
  currency: string
  category: string
  location: string
  image_url: string
  seller_id: string
  seller_name: string
  seller_company: string
  created_at: string
  status: 'active' | 'sold' | 'reserved'
  verified_seller: boolean
}

export default function MarketplacePage() {
  const { user, userProfile } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  // Check if user has premium access
  const hasAccess = userProfile?.subscription_status === 'active' && 
                   (userProfile?.subscription_type === 'premium' || userProfile?.subscription_type === 'vip')

  useEffect(() => {
    if (!hasAccess && user) {
      toast.error("Premium subscription required to access marketplace")
      return
    }
    loadProducts()
  }, [hasAccess, user])

  const loadProducts = async () => {
    try {
      setLoading(true)
      // Load real products from database
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          users!seller_id (
            full_name,
            company_name,
            verification_status
          )
        `)
        .eq('status', 'active')
        .order(sortBy === 'newest' ? 'created_at' : sortBy === 'price_low' ? 'price' : 'price',
               { ascending: sortBy === 'price_low' })

      if (error) throw error

      const formattedProducts: Product[] = (data || []).map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        price: parseFloat(item.price),
        currency: item.currency || 'USD',
        category: item.category,
        location: item.location || 'Location not specified',
        image_url: (item.images && item.images[0]) || '/placeholder.svg',
        seller_id: item.seller_id,
        seller_name: item.users?.full_name || 'Anonymous',
        seller_company: item.users?.company_name || 'Company not specified',
        created_at: item.created_at,
        status: item.status,
        verified_seller: item.users?.verification_status === 'verified'
      }))

      setProducts(formattedProducts)
    } catch (error) {
      console.error('Error loading products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CrownLogoWithBrand className="justify-center mb-4" />
            <CardTitle>Access Required</CardTitle>
            <CardDescription>Please sign in to access the marketplace</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/">
              <Button className="gradient-primary">
                <Crown className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Lock className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle>Premium Access Required</CardTitle>
            <CardDescription>
              Subscribe to our $20/month premium plan to access exclusive deals
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/membership">
              <Button className="gradient-primary">
                <Crown className="mr-2 h-4 w-4" />
                Upgrade to Premium
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="w-full py-6 px-6 bg-background/80 backdrop-blur-xl border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link href="/">
              <CrownLogoWithBrand />
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/upload">
                <Button className="gradient-primary">
                  <Plus className="mr-2 h-4 w-4" />
                  List Product
                </Button>
              </Link>
              <Button variant="outline">
                <Crown className="mr-2 h-4 w-4" />
                {userProfile?.subscription_type === 'vip' ? 'VIP' : 'Premium'} Member
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search luxury assets, commodities, real estate..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="oil-gas">Oil & Gas</SelectItem>
                <SelectItem value="commodities">Commodities</SelectItem>
                <SelectItem value="real-estate">Real Estate</SelectItem>
                <SelectItem value="luxury-assets">Luxury Assets</SelectItem>
                <SelectItem value="financial">Financial Instruments</SelectItem>
                <SelectItem value="vehicles">Luxury Vehicles</SelectItem>
                <SelectItem value="energy">Energy & Renewables</SelectItem>
                <SelectItem value="investment">Investment Opportunities</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Premium Marketplace</h1>
          <p className="text-muted-foreground">
            Exclusive deals from verified companies worldwide
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted rounded-t-lg"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded mb-4"></div>
                  <div className="h-6 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || selectedCategory !== 'all' 
                ? "Try adjusting your search or filters" 
                : "Be the first to list a product"}
            </p>
            <Link href="/upload">
              <Button className="gradient-primary">
                <Plus className="mr-2 h-4 w-4" />
                List Your Product
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative">
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="w-full h-48 object-cover"
                  />
                  {product.verified_seller && (
                    <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
                      <Crown className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-1">{product.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">
                        ${product.price.toLocaleString()}
                      </span>
                      <Badge variant="outline">{product.category}</Badge>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-1" />
                      {product.location}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(product.created_at).toLocaleDateString()}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">{product.seller_company}</span>
                      <br />
                      <span className="text-muted-foreground">{product.seller_name}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full gradient-primary">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Contact Seller
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
