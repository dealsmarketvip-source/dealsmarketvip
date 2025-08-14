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
  Shield
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth-instant"
import { db } from "@/lib/supabase"
import { toast } from "sonner"
import { PageHeader } from "@/components/page-header"
import { PageLoading, EnhancedLoading } from "@/components/ui/enhanced-loading"

export default function AccountPage() {
  const { user, userProfile, updateProfile } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    totalPurchases: 0,
    favoriteProducts: 0
  })

  const [formData, setFormData] = useState({
    full_name: '',
    company_name: '',
    phone: '',
    location: '',
    bio: '',
    website: ''
  })

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
  }, [user, router])

  // Load user profile data
  useEffect(() => {
    if (userProfile) {
      setFormData({
        full_name: userProfile.full_name || '',
        company_name: userProfile.company_name || '',
        phone: userProfile.phone || '',
        location: userProfile.profile_data?.location || '',
        bio: userProfile.profile_data?.bio || '',
        website: userProfile.profile_data?.website || ''
      })
    }
  }, [userProfile])

  // Load user statistics
  useEffect(() => {
    if (userProfile?.id) {
      loadUserStats()
    }
  }, [userProfile])

  const loadUserStats = async () => {
    try {
      const [productsResult, favoritesResult] = await Promise.all([
        db.products.getByUserId(userProfile?.id || ''),
        db.favorites.getByUserId(userProfile?.id || '')
      ])

      setStats({
        totalProducts: productsResult.data?.length || 0,
        totalSales: 0, // Would need orders data
        totalPurchases: 0, // Would need orders data
        favoriteProducts: favoritesResult.data?.length || 0
      })
    } catch (error) {
      console.error('Error loading user stats:', error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    
    try {
      const updates = {
        full_name: formData.full_name,
        company_name: formData.company_name,
        phone: formData.phone,
        profile_data: {
          ...userProfile?.profile_data,
          location: formData.location,
          bio: formData.bio,
          website: formData.website
        }
      }

      const { error } = await updateProfile(updates)
      
      if (error) {
        throw error
      }

      toast.success("Profile updated successfully!")
      setIsEditing(false)
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    // Reset form data
    setFormData({
      full_name: userProfile?.full_name || '',
      company_name: userProfile?.company_name || '',
      phone: userProfile?.phone || '',
      location: userProfile?.profile_data?.location || '',
      bio: userProfile?.profile_data?.bio || '',
      website: userProfile?.profile_data?.website || ''
    })
    setIsEditing(false)
  }

  // Allow access to account for demo purposes
  // if (!user) {
  //   return <PageLoading message="Please log in to access your account" />
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <PageHeader 
        title="My Account" 
        description="Manage your profile and view your activity"
      />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1"
          >
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24 border-4 border-primary/20">
                    <AvatarImage src={userProfile?.profile_image_url} />
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-foreground text-2xl">
                      {userProfile?.full_name?.charAt(0) || userProfile?.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-white">
                  {userProfile?.full_name || 'User'}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  {userProfile?.company_name || userProfile?.email}
                </CardDescription>
                <div className="flex justify-center gap-2 mt-4">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    <Shield className="h-3 w-3 mr-1" />
                    {userProfile?.verification_status === 'verified' ? 'Verified' : 'Pending'}
                  </Badge>
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    {userProfile?.subscription_type?.charAt(0).toUpperCase() + userProfile?.subscription_type?.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Statistics */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm mt-6">
              <CardHeader>
                <CardTitle className="text-white text-lg">Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Package className="h-4 w-4" />
                    Products Listed
                  </div>
                  <span className="text-white font-semibold">{stats.totalProducts}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-gray-400">
                    <ShoppingCart className="h-4 w-4" />
                    Total Sales
                  </div>
                  <span className="text-white font-semibold">{stats.totalSales}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Heart className="h-4 w-4" />
                    Favorites
                  </div>
                  <span className="text-white font-semibold">{stats.favoriteProducts}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Star className="h-4 w-4" />
                    Rating
                  </div>
                  <span className="text-white font-semibold">4.8/5</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Profile Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-white">Profile Information</CardTitle>
                    <CardDescription className="text-gray-400">
                      Update your profile details and preferences
                    </CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="border-primary/30 text-primary hover:bg-primary/10"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancel}
                        disabled={isSaving}
                        className="border-gray-600 text-gray-300 hover:bg-gray-800"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        {isSaving ? (
                          <EnhancedLoading type="spinner" size="sm" />
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name" className="text-white">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) => handleInputChange('full_name', e.target.value)}
                        disabled={!isEditing}
                        className="pl-10 bg-gray-900/50 border-gray-600 text-white disabled:opacity-70"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company_name" className="text-white">Company Name</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="company_name"
                        value={formData.company_name}
                        onChange={(e) => handleInputChange('company_name', e.target.value)}
                        disabled={!isEditing}
                        className="pl-10 bg-gray-900/50 border-gray-600 text-white disabled:opacity-70"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        value={userProfile?.email || ''}
                        disabled
                        className="pl-10 bg-gray-900/50 border-gray-600 text-white opacity-50"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-white">Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        disabled={!isEditing}
                        className="pl-10 bg-gray-900/50 border-gray-600 text-white disabled:opacity-70"
                      />
                    </div>
                  </div>
                </div>

                {/* Location and Website */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-white">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        disabled={!isEditing}
                        placeholder="City, Country"
                        className="pl-10 bg-gray-900/50 border-gray-600 text-white disabled:opacity-70"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-white">Website</Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      disabled={!isEditing}
                      placeholder="https://your-website.com"
                      className="bg-gray-900/50 border-gray-600 text-white disabled:opacity-70"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-white">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Tell us about yourself or your company..."
                    rows={4}
                    className="bg-gray-900/50 border-gray-600 text-white disabled:opacity-70"
                  />
                </div>

                {/* Account Created */}
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>Member since {new Date(userProfile?.created_at || '').toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
