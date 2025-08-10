"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CrownLogoWithBrand } from "@/components/ui/crown-logo"
import { ArrowLeft, Upload, DollarSign, MapPin, Tag, Crown, Lock } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function UploadProductPage() {
  const { user, userProfile } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    currency: "USD",
    category: "",
    location: "",
    condition: "new",
    imageUrl: "",
    specifications: ""
  })

  // Check if user has premium access
  const hasAccess = userProfile?.subscription_status === 'active' && 
                   (userProfile?.subscription_type === 'premium' || userProfile?.subscription_type === 'vip')

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!hasAccess) {
      toast.error("Premium subscription required to list products")
      return
    }

    if (!formData.title || !formData.description || !formData.price || !formData.category) {
      toast.error("Please fill in all required fields")
      return
    }

    setLoading(true)
    
    try {
      // Get the user ID from the profile
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) throw new Error("Not authenticated")

      const { data: userRecord } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', authUser.id)
        .single()

      if (!userRecord) throw new Error("User profile not found")

      // Parse specifications if provided
      let specs = {}
      if (formData.specifications) {
        try {
          specs = JSON.parse(formData.specifications)
        } catch {
          // If not valid JSON, store as a simple object
          specs = { notes: formData.specifications }
        }
      }

      // Create the product
      const { data, error } = await supabase
        .from('products')
        .insert({
          seller_id: userRecord.id,
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          currency: formData.currency,
          category: formData.category,
          location: formData.location,
          condition: formData.condition,
          images: formData.imageUrl ? [formData.imageUrl] : [],
          specifications: specs,
          status: 'active',
          featured: userProfile?.subscription_type === 'vip' // VIP users get featured listings
        })
        .select()
        .single()

      if (error) throw error

      toast.success("Product listed successfully!")
      router.push("/marketplace")
      
    } catch (error: any) {
      console.error('Error creating product:', error)
      toast.error("Failed to list product: " + (error.message || "Unknown error"))
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CrownLogoWithBrand className="justify-center mb-4" />
            <CardTitle>Access Required</CardTitle>
            <CardDescription>Please sign in to list products</CardDescription>
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
              Subscribe to our $20/month premium plan to list products
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
      <header className="w-full py-6 px-6 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <Link href="/marketplace">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Marketplace
              </Button>
            </Link>
            <CrownLogoWithBrand />
            <Badge className="bg-primary text-primary-foreground">
              <Crown className="mr-1 h-3 w-3" />
              {userProfile?.subscription_type === 'vip' ? 'VIP' : 'Premium'} Member
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">List Your Product</h1>
          <p className="text-muted-foreground">
            Share your premium assets with verified companies worldwide
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Provide essential details about your product
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Product Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Luxury Office Building - Manhattan"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Detailed description of your product..."
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <Tag className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
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
                </div>

                <div>
                  <Label htmlFor="condition">Condition</Label>
                  <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="used">Used</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Location */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Location</CardTitle>
              <CardDescription>
                Set your price and specify location
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="price">Price *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="0.00"
                      className="pl-9"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="JPY">JPY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g., New York, USA"
                    className="pl-9"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images & Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Images & Specifications</CardTitle>
              <CardDescription>
                Add visual content and technical details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="imageUrl">Product Image URL</Label>
                <div className="relative">
                  <Upload className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="pl-9"
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Provide a high-quality image URL for your product
                </p>
              </div>

              <div>
                <Label htmlFor="specifications">Specifications (Optional)</Label>
                <Textarea
                  id="specifications"
                  value={formData.specifications}
                  onChange={(e) => handleInputChange('specifications', e.target.value)}
                  placeholder='{"square_feet": 50000, "year_built": 2015, "occupancy_rate": "100%"}'
                  rows={3}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Add technical specifications in JSON format or as text
                </p>
              </div>
            </CardContent>
          </Card>

          {/* VIP Feature */}
          {userProfile?.subscription_type === 'vip' && (
            <Card className="border-primary bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-primary" />
                  VIP Benefits
                </CardTitle>
                <CardDescription>
                  Your listing will be featured prominently in search results
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="submit"
              className="gradient-primary flex-1"
              disabled={loading}
            >
              {loading ? "Publishing..." : "Publish Product"}
            </Button>
            <Link href="/marketplace">
              <Button variant="outline">Cancel</Button>
            </Link>
          </div>
        </form>
      </main>
    </div>
  )
}
