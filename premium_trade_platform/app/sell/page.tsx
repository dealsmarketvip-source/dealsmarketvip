"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { 
  Package, 
  Upload, 
  X, 
  Euro, 
  MapPin, 
  Tag, 
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth-instant"
import { toast } from "sonner"
import { EnhancedLoading, UploadLoading } from "@/components/ui/enhanced-loading"

const CATEGORIES = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'fashion', label: 'Fashion' },
  { value: 'home', label: 'Home & Garden' },
  { value: 'vehicles', label: 'Vehicles' },
  { value: 'sports', label: 'Sports & Recreation' },
  { value: 'books', label: 'Books & Media' },
  { value: 'business', label: 'Business Equipment' },
  { value: 'art', label: 'Art & Collectibles' },
  { value: 'other', label: 'Other' }
]

const CONDITIONS = [
  { value: 'new', label: 'New' },
  { value: 'like_new', label: 'Like New' },
  { value: 'excellent', label: 'Excellent' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' }
]

export default function SellPage() {
  const { user, userProfile } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isMounted, setIsMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Redirect if not authenticated (only after mount)
  useEffect(() => {
    if (isMounted && !user) {
      toast.error("You must be logged in to sell products")
      router.push('/login')
    }
  }, [user, router, isMounted])

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: '',
    location: '',
    shipping_included: true,
    shipping_cost: '',
    tags: '',
    featured: false
  })

  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    if (files.length + images.length > 5) {
      toast.error("Maximum 5 images allowed")
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          return 100
        }
        return prev + 10
      })
    }, 200)

    const newImages = [...images, ...files]
    const newPreviews = [...imagePreviews]

    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        newPreviews.push(e.target?.result as string)
        if (newPreviews.length === newImages.length) {
          setImagePreviews(newPreviews)
        }
      }
      reader.readAsDataURL(file)
    })

    setImages(newImages)
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) newErrors.title = "Title is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = "Valid price is required"
    if (!formData.category) newErrors.category = "Category is required"
    if (!formData.condition) newErrors.condition = "Condition is required"
    if (!formData.location.trim()) newErrors.location = "Location is required"
    if (images.length === 0) newErrors.images = "At least one image is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)

    try {
      // In a real app, you would upload images to storage first
      // For now, we'll simulate this process
      
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        shipping_cost: formData.shipping_cost ? parseFloat(formData.shipping_cost) : 0,
        seller_id: userProfile?.id,
        status: 'active',
        images: imagePreviews, // In real app, these would be storage URLs
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      // Simulate product creation for instant functionality
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Mock successful creation
      console.log('Product created:', productData)

      toast.success("Product listed successfully!")
      router.push('/marketplace')

    } catch (error: any) {
      console.error('Error creating product:', error)
      toast.error(error.message || "Failed to create product listing")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Prevent hydration mismatch by showing consistent loading state
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-center min-h-96">
            <EnhancedLoading type="auth" message="Loading..." />
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return <EnhancedLoading type="auth" fullscreen message="Checking authentication..." />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <motion.div
              className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(34, 197, 94, 0.3)",
                  "0 0 40px rgba(34, 197, 94, 0.6)",
                  "0 0 20px rgba(34, 197, 94, 0.3)"
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Package className="h-6 w-6 text-white" />
            </motion.div>
            Sell Your Product
          </h1>
          <p className="text-gray-300">
            List your premium product on our exclusive B2B marketplace
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Product Details</CardTitle>
              <CardDescription className="text-gray-400">
                Provide comprehensive information about your product
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-white">Product Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter product title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className={`bg-gray-900/50 border-gray-600 text-white ${errors.title ? 'border-red-500' : ''}`}
                  />
                  {errors.title && (
                    <p className="text-red-400 text-sm flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.title}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your product in detail"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className={`bg-gray-900/50 border-gray-600 text-white ${errors.description ? 'border-red-500' : ''}`}
                  />
                  {errors.description && (
                    <p className="text-red-400 text-sm flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Price and Category Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-white">Price (€) *</Label>
                    <div className="relative">
                      <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        className={`pl-10 bg-gray-900/50 border-gray-600 text-white ${errors.price ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.price && (
                      <p className="text-red-400 text-sm flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.price}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-white">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger className={`bg-gray-900/50 border-gray-600 text-white ${errors.category ? 'border-red-500' : ''}`}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700">
                        {CATEGORIES.map((category) => (
                          <SelectItem key={category.value} value={category.value} className="text-white">
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-red-400 text-sm flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.category}
                      </p>
                    )}
                  </div>
                </div>

                {/* Condition and Location Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="condition" className="text-white">Condition *</Label>
                    <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
                      <SelectTrigger className={`bg-gray-900/50 border-gray-600 text-white ${errors.condition ? 'border-red-500' : ''}`}>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700">
                        {CONDITIONS.map((condition) => (
                          <SelectItem key={condition.value} value={condition.value} className="text-white">
                            {condition.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.condition && (
                      <p className="text-red-400 text-sm flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.condition}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-white">Location *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="location"
                        placeholder="City, Country"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className={`pl-10 bg-gray-900/50 border-gray-600 text-white ${errors.location ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.location && (
                      <p className="text-red-400 text-sm flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.location}
                      </p>
                    )}
                  </div>
                </div>

                {/* Images Upload */}
                <div className="space-y-4">
                  <Label className="text-white">Product Images * (Max 5)</Label>
                  
                  {/* Upload Area */}
                  <div className={`border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-gray-500 transition-colors ${errors.images ? 'border-red-500' : ''}`}>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                      disabled={isUploading}
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      {isUploading ? (
                        <UploadLoading message={`Uploading... ${uploadProgress}%`} />
                      ) : (
                        <div className="space-y-2">
                          <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                          <p className="text-gray-400">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-sm text-gray-500">
                            PNG, JPG, GIF up to 10MB each
                          </p>
                        </div>
                      )}
                    </label>
                  </div>

                  {/* Image Previews */}
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative group"
                        >
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-600"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {errors.images && (
                    <p className="text-red-400 text-sm flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.images}
                    </p>
                  )}
                </div>

                {/* Shipping Options */}
                <div className="space-y-4 border-t border-gray-700 pt-6">
                  <h3 className="text-lg font-semibold text-white">Shipping Options</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="shipping_included" className="text-white">Free Shipping</Label>
                      <p className="text-sm text-gray-400">Include shipping in the product price</p>
                    </div>
                    <Switch
                      id="shipping_included"
                      checked={formData.shipping_included}
                      onCheckedChange={(checked) => handleInputChange('shipping_included', checked)}
                    />
                  </div>

                  {!formData.shipping_included && (
                    <div className="space-y-2">
                      <Label htmlFor="shipping_cost" className="text-white">Shipping Cost (€)</Label>
                      <div className="relative">
                        <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="shipping_cost"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={formData.shipping_cost}
                          onChange={(e) => handleInputChange('shipping_cost', e.target.value)}
                          className="pl-10 bg-gray-900/50 border-gray-600 text-white"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label htmlFor="tags" className="text-white">Tags (Optional)</Label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="tags"
                      placeholder="premium, luxury, business (separated by commas)"
                      value={formData.tags}
                      onChange={(e) => handleInputChange('tags', e.target.value)}
                      className="pl-10 bg-gray-900/50 border-gray-600 text-white"
                    />
                  </div>
                  <p className="text-sm text-gray-400">
                    Add relevant tags to help buyers find your product
                  </p>
                </div>

                {/* Featured Option */}
                <div className="flex items-center justify-between border-t border-gray-700 pt-6">
                  <div>
                    <Label htmlFor="featured" className="text-white">Featured Listing</Label>
                    <p className="text-sm text-gray-400">Highlight your product for better visibility</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => handleInputChange('featured', checked)}
                    />
                    <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                      Premium
                    </Badge>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.div
                  className="flex gap-4 pt-6"
                  whileHover={{ scale: 1.02 }}
                >
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating Listing...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        List Product
                      </div>
                    )}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
