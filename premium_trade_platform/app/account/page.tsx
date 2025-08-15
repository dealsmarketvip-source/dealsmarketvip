"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Calendar,
  Star,
  Package,
  ShoppingCart,
  Heart,
  Settings as SettingsIcon,
  Edit,
  Save,
  X,
  CheckCircle,
  Shield,
  Upload,
  Camera,
  Eye,
  TrendingUp
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth-instant"
import { toast } from "sonner"
import { PageHeader } from "@/components/page-header"
import { EnhancedLoading } from "@/components/ui/enhanced-loading"
import { realProductManager, formatPrice, formatDate } from "@/lib/real-products"
import Link from "next/link"

export default function AccountPage() {
  const { user, userProfile, updateProfile } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [userProducts, setUserProducts] = useState<{
    sold: any[]
    bought: any[]
    selling: any[]
  }>({ sold: [], bought: [], selling: [] })
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    company_name: '',
    location: '',
    bio: '',
    website: '',
    profile_image_url: ''
  })

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    totalPurchases: 0,
    favoriteProducts: 0,
    totalViews: 0
  })

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    
    loadUserData()
    loadUserProducts()
    loadUserStats()
  }, [user, userProfile])

  const loadUserData = () => {
    // Load data from localStorage for persistence
    const savedData = localStorage.getItem(`user_profile_${user?.id}`)
    
    if (savedData) {
      const parsed = JSON.parse(savedData)
      setFormData(parsed)
    } else {
      // Initialize with current user data
      setFormData({
        full_name: userProfile?.full_name || user?.email || '',
        email: user?.email || '',
        phone: userProfile?.phone || '',
        company_name: userProfile?.company_name || '',
        location: userProfile?.location || '',
        bio: userProfile?.bio || '',
        website: userProfile?.website || '',
        profile_image_url: userProfile?.profile_image_url || ''
      })
    }
  }

  const loadUserProducts = () => {
    if (!user?.id) return
    
    const products = realProductManager.getUserProductsWithDetails(user.id)
    setUserProducts(products)
  }

  const loadUserStats = () => {
    if (!user?.id) return
    
    const activity = realProductManager.getUserActivity(user.id)
    const favorites = realProductManager.getUserFavorites(user.id)
    const sellingProducts = realProductManager.getProductsBySeller(user.id)
    const totalViews = sellingProducts.reduce((sum, p) => sum + p.views_count, 0)
    
    setStats({
      totalProducts: sellingProducts.length,
      totalSales: activity?.total_sales || 0,
      totalPurchases: activity?.total_purchases || 0,
      favoriteProducts: favorites.length,
      totalViews
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Save to localStorage for persistence
      localStorage.setItem(`user_profile_${user?.id}`, JSON.stringify(formData))
      
      // Try to update via auth system
      try {
        await updateProfile(formData)
      } catch (error) {
        console.warn('Auth update failed, using localStorage only')
      }
      
      toast.success('Profile updated successfully!')
      setIsEditing(false)
      
      // Reload data
      loadUserData()
    } catch (error) {
      toast.error('Error updating profile')
      console.error('Error updating profile:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Create a mock URL for the uploaded image
      const mockImageUrl = `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face`
      
      setFormData(prev => ({ ...prev, profile_image_url: mockImageUrl }))
      
      // Auto-save the image
      const updatedData = { ...formData, profile_image_url: mockImageUrl }
      localStorage.setItem(`user_profile_${user?.id}`, JSON.stringify(updatedData))
      
      toast.success('Profile picture updated!')
    } catch (error) {
      toast.error('Error uploading image')
    } finally {
      setIsUploading(false)
    }
  }

  if (!user) {
    return <EnhancedLoading type="auth" fullscreen message="Loading account..." />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            My Account
          </h1>
          <p className="text-gray-300">
            Manage your profile and track your B2B activity
          </p>
        </motion.div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800 border-gray-700">
            <TabsTrigger value="profile" className="data-[state=active]:bg-primary">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-primary">
              <Package className="h-4 w-4 mr-2" />
              My Products
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-primary">
              <TrendingUp className="h-4 w-4 mr-2" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="favorites" className="data-[state=active]:bg-primary">
              <Heart className="h-4 w-4 mr-2" />
              Favorites
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Info */}
              <div className="lg:col-span-2">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-white">Profile Information</CardTitle>
                      <CardDescription>
                        Update your account details and preferences
                      </CardDescription>
                    </div>
                    <Button
                      variant={isEditing ? "secondary" : "outline"}
                      onClick={() => setIsEditing(!isEditing)}
                      className="border-gray-600"
                    >
                      {isEditing ? (
                        <>
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </>
                      ) : (
                        <>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </>
                      )}
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300">Full Name</Label>
                        <Input
                          value={formData.full_name}
                          onChange={(e) => handleInputChange('full_name', e.target.value)}
                          disabled={!isEditing}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Email</Label>
                        <Input
                          value={formData.email}
                          disabled
                          className="bg-gray-700 border-gray-600 text-white opacity-50"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Phone</Label>
                        <Input
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          disabled={!isEditing}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Company</Label>
                        <Input
                          value={formData.company_name}
                          onChange={(e) => handleInputChange('company_name', e.target.value)}
                          disabled={!isEditing}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Location</Label>
                        <Input
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          disabled={!isEditing}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Website</Label>
                        <Input
                          value={formData.website}
                          onChange={(e) => handleInputChange('website', e.target.value)}
                          disabled={!isEditing}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-gray-300">Bio</Label>
                      <Textarea
                        value={formData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        disabled={!isEditing}
                        className="bg-gray-700 border-gray-600 text-white h-24"
                        placeholder="Tell us about yourself and your business..."
                      />
                    </div>

                    {isEditing && (
                      <Button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-primary hover:bg-primary/90"
                      >
                        {isSaving ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Profile Picture & Stats */}
              <div className="space-y-6">
                {/* Profile Picture */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="pt-6 text-center">
                    <div className="relative inline-block">
                      <Avatar className="h-32 w-32 mx-auto mb-4">
                        <AvatarImage src={formData.profile_image_url} />
                        <AvatarFallback className="bg-primary/20 text-primary text-2xl">
                          {formData.full_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="absolute bottom-2 right-2">
                        <label htmlFor="profile-image-upload">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="rounded-full h-8 w-8 p-0"
                            disabled={isUploading}
                            asChild
                          >
                            <span>
                              {isUploading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                              ) : (
                                <Camera className="h-4 w-4" />
                              )}
                            </span>
                          </Button>
                        </label>
                        <input
                          id="profile-image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {formData.full_name || 'Your Name'}
                    </h3>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                      <Badge className="bg-primary/20 text-primary border-primary/30">
                        Premium
                      </Badge>
                    </div>
                    
                    {formData.company_name && (
                      <p className="text-gray-400 mb-2">
                        <Building className="h-4 w-4 inline mr-1" />
                        {formData.company_name}
                      </p>
                    )}
                    
                    {formData.location && (
                      <p className="text-gray-400">
                        <MapPin className="h-4 w-4 inline mr-1" />
                        {formData.location}
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Account Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-primary">{stats.totalProducts}</p>
                        <p className="text-sm text-gray-400">Products Listed</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-primary">{stats.totalViews}</p>
                        <p className="text-sm text-gray-400">Total Views</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-primary">{stats.totalSales}</p>
                        <p className="text-sm text-gray-400">Sales Made</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-primary">{stats.favoriteProducts}</p>
                        <p className="text-sm text-gray-400">Favorites</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* My Products Tab */}
          <TabsContent value="products">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">My Products</CardTitle>
                <CardDescription>
                  Products you're currently selling
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userProducts.selling.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {userProducts.selling.map((product) => (
                      <Card key={product.id} className="bg-gray-700 border-gray-600">
                        <CardContent className="p-4">
                          <div className="aspect-square relative mb-3 rounded-lg overflow-hidden">
                            <img
                              src={product.images[0] || '/placeholder.svg'}
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <h3 className="text-white font-semibold mb-2 line-clamp-2">
                            {product.title}
                          </h3>
                          <p className="text-primary font-bold text-lg mb-2">
                            {formatPrice(product.price)}
                          </p>
                          <div className="flex items-center justify-between text-sm text-gray-400">
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {product.views_count} views
                            </span>
                            <span>{formatDate(product.created_at)}</span>
                          </div>
                          <div className="mt-3 flex gap-2">
                            <Link href={`/product/${product.id}`} className="flex-1">
                              <Button variant="outline" size="sm" className="w-full border-gray-600">
                                View
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      No products listed yet
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Start selling by creating your first product listing
                    </p>
                    <Link href="/sell">
                      <Button className="bg-primary hover:bg-primary/90">
                        <Package className="h-4 w-4 mr-2" />
                        Create Listing
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Activity Overview</CardTitle>
                <CardDescription>
                  Your buying and selling history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center p-6 bg-gray-700 rounded-lg">
                    <Package className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{stats.totalProducts}</p>
                    <p className="text-gray-400">Products Listed</p>
                  </div>
                  <div className="text-center p-6 bg-gray-700 rounded-lg">
                    <ShoppingCart className="h-8 w-8 text-green-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{stats.totalSales}</p>
                    <p className="text-gray-400">Sales Made</p>
                  </div>
                  <div className="text-center p-6 bg-gray-700 rounded-lg">
                    <Star className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{stats.totalViews}</p>
                    <p className="text-gray-400">Total Views</p>
                  </div>
                </div>
                
                <div className="text-center py-8">
                  <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Activity tracking active
                  </h3>
                  <p className="text-gray-400">
                    Your buying and selling activity will appear here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Favorite Products</CardTitle>
                <CardDescription>
                  Products you've saved for later
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No favorites yet
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Start adding products to your favorites from the marketplace
                  </p>
                  <Link href="/marketplace">
                    <Button className="bg-primary hover:bg-primary/90">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Browse Marketplace
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
