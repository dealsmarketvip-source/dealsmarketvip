"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { 
  Upload, 
  X, 
  Package, 
  AlertCircle, 
  CheckCircle, 
  Camera,
  Plus,
  Trash2,
  Tag,
  DollarSign,
  MapPin,
  Truck
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth-instant"
import { createClient, db } from "@/lib/supabase"
import { toast } from "sonner"
import { UserLimits } from "@/lib/types/database"
import { canUserPerformAction } from "@/lib/stripe"
import Link from "next/link"

const CATEGORIES = [
  { value: 'electronics', label: 'Electrónicos', subcategories: ['smartphones', 'laptops', 'tablets', 'accessories', 'gaming'] },
  { value: 'fashion', label: 'Moda', subcategories: ['clothing', 'shoes', 'accessories', 'bags', 'jewelry'] },
  { value: 'home', label: 'Hogar', subcategories: ['furniture', 'decor', 'appliances', 'kitchen', 'garden'] },
  { value: 'vehicles', label: 'Vehículos', subcategories: ['cars', 'motorcycles', 'bicycles', 'parts', 'accessories'] },
  { value: 'sports', label: 'Deportes', subcategories: ['fitness', 'outdoor', 'team-sports', 'water-sports', 'equipment'] },
  { value: 'books', label: 'Libros', subcategories: ['fiction', 'non-fiction', 'textbooks', 'comics', 'magazines'] },
  { value: 'music', label: 'Música', subcategories: ['instruments', 'vinyl', 'cds', 'equipment', 'accessories'] },
  { value: 'art', label: 'Arte', subcategories: ['paintings', 'sculptures', 'prints', 'photography', 'crafts'] },
  { value: 'business', label: 'Negocios', subcategories: ['equipment', 'services', 'supplies', 'software', 'consulting'] },
  { value: 'other', label: 'Otros', subcategories: ['collectibles', 'toys', 'tools', 'industrial', 'miscellaneous'] }
]

const CONDITIONS = [
  { value: 'new', label: 'Nuevo', description: 'Producto sin usar, en su embalaje original' },
  { value: 'like_new', label: 'Como nuevo', description: 'Usado muy poco, en excelente estado' },
  { value: 'good', label: 'Bueno', description: 'Usado pero en buen estado funcional' },
  { value: 'fair', label: 'Regular', description: 'Usado con signos de desgaste visible' },
  { value: 'poor', label: 'Malo', description: 'Muy usado, puede requerir reparaciones' }
]

interface ProductForm {
  title: string
  description: string
  category: string
  subcategory: string
  price: number
  condition: string
  brand: string
  model: string
  location: string
  shipping_included: boolean
  shipping_cost: number
  specifications: Record<string, string>
  images: File[]
}

export default function UploadPage() {
  const { user, userProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [userLimits, setUserLimits] = useState<UserLimits | null>(null)
  const [currentProducts, setCurrentProducts] = useState(0)
  const [canUpload, setCanUpload] = useState(false)
  
  const [form, setForm] = useState<ProductForm>({
    title: '',
    description: '',
    category: '',
    subcategory: '',
    price: 0,
    condition: '',
    brand: '',
    model: '',
    location: '',
    shipping_included: false,
    shipping_cost: 0,
    specifications: {},
    images: []
  })

  const [imagesPreviews, setImagesPreviews] = useState<string[]>([])
  const [specKey, setSpecKey] = useState('')
  const [specValue, setSpecValue] = useState('')

  useEffect(() => {
    if (userProfile) {
      fetchUserLimits()
    }
  }, [userProfile])

  const fetchUserLimits = async () => {
    if (!userProfile) return

    try {
      const supabase = createClient()
      
      // Get user limits
      const { data: limits } = await supabase
        .from('user_limits')
        .select('*')
        .eq('user_id', userProfile.id)
        .single()

      if (limits) {
        setUserLimits(limits)
        setCanUpload(limits.current_products < limits.max_products)
      }

      // Get current products count
      const { data: products, count } = await supabase
        .from('products')
        .select('id', { count: 'exact' })
        .eq('seller_id', userProfile.id)
        .eq('status', 'active')

      setCurrentProducts(count || 0)
    } catch (error) {
      console.error('Error fetching user limits:', error)
    }
  }

  const handleImageUpload = (files: File[]) => {
    if (form.images.length + files.length > 8) {
      toast.error("Máximo 8 imágenes por producto")
      return
    }

    const newImages = [...form.images, ...files]
    setForm(prev => ({ ...prev, images: newImages }))

    // Create previews
    const newPreviews = [...imagesPreviews]
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        newPreviews.push(e.target?.result as string)
        setImagesPreviews([...newPreviews])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    const newImages = form.images.filter((_, i) => i !== index)
    const newPreviews = imagesPreviews.filter((_, i) => i !== index)
    setForm(prev => ({ ...prev, images: newImages }))
    setImagesPreviews(newPreviews)
  }

  const addSpecification = () => {
    if (specKey && specValue) {
      setForm(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specKey]: specValue
        }
      }))
      setSpecKey('')
      setSpecValue('')
    }
  }

  const removeSpecification = (key: string) => {
    const newSpecs = { ...form.specifications }
    delete newSpecs[key]
    setForm(prev => ({ ...prev, specifications: newSpecs }))
  }

  const uploadImages = async (productId: string) => {
    if (form.images.length === 0) return []

    const supabase = createClient()
    const uploadedUrls: string[] = []

    for (let i = 0; i < form.images.length; i++) {
      const file = form.images[i]
      const fileExt = file.name.split('.').pop()
      const fileName = `${productId}/${Date.now()}_${i}.${fileExt}`

      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, file, {
          onUploadProgress: (progress) => {
            const totalProgress = ((i + (progress.loaded / progress.total)) / form.images.length) * 100
            setUploadProgress(totalProgress)
          }
        })

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName)

      uploadedUrls.push(publicUrl)

      // Save to product_images table
      await supabase
        .from('product_images')
        .insert({
          product_id: productId,
          image_url: publicUrl,
          is_primary: i === 0,
          sort_order: i
        })
    }

    return uploadedUrls
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!userProfile) {
      toast.error("Debes iniciar sesión para subir productos")
      return
    }

    if (!canUpload) {
      toast.error("Has alcanzado el límite de productos para tu plan")
      return
    }

    if (userProfile.verification_status !== 'verified' && !userProfile.verification_bypass) {
      toast.error("Debes verificar tu cuenta para subir productos")
      return
    }

    if (!form.title || !form.description || !form.category || !form.price) {
      toast.error("Por favor completa todos los campos obligatorios")
      return
    }

    if (form.images.length === 0) {
      toast.error("Debes subir al menos una imagen")
      return
    }

    try {
      setLoading(true)
      setUploadProgress(0)
      
      const supabase = createClient()

      // Create product record
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          seller_id: userProfile.id,
          title: form.title,
          description: form.description,
          category: form.category,
          subcategory: form.subcategory,
          price: form.price,
          condition: form.condition,
          brand: form.brand || null,
          model: form.model || null,
          location: form.location || null,
          shipping_included: form.shipping_included,
          shipping_cost: form.shipping_cost,
          specifications: form.specifications,
          status: 'active',
          images: [] // Will be updated after image upload
        })
        .select()
        .single()

      if (productError) throw productError

      // Upload images
      const imageUrls = await uploadImages(product.id)

      // Update product with image URLs
      await supabase
        .from('products')
        .update({ images: imageUrls })
        .eq('id', product.id)

      // Update user limits
      if (userLimits) {
        await supabase
          .from('user_limits')
          .update({ current_products: userLimits.current_products + 1 })
          .eq('user_id', userProfile.id)
      }

      // Log audit
      await supabase
        .from('audit_logs')
        .insert({
          user_id: userProfile.id,
          action: 'product_created',
          resource_type: 'product',
          resource_id: product.id,
          new_values: form
        })

      toast.success("Producto subido correctamente")
      
      // Reset form
      setForm({
        title: '',
        description: '',
        category: '',
        subcategory: '',
        price: 0,
        condition: '',
        brand: '',
        model: '',
        location: '',
        shipping_included: false,
        shipping_cost: 0,
        specifications: {},
        images: []
      })
      setImagesPreviews([])
      fetchUserLimits()

    } catch (error) {
      console.error('Error uploading product:', error)
      toast.error("Error al subir el producto")
    } finally {
      setLoading(false)
      setUploadProgress(0)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <Card className="max-w-md mx-auto bg-gray-800 border-gray-700">
          <CardContent className="pt-6 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-300 mb-4">
              Debes iniciar sesión para subir productos
            </p>
            <Link href="/auth">
              <Button className="bg-primary hover:bg-primary/90">
                Iniciar Sesión
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (userProfile && userProfile.verification_status !== 'verified' && !userProfile.verification_bypass) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <Card className="max-w-md mx-auto bg-gray-800 border-gray-700">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Verificación Requerida</h2>
            <p className="text-gray-300 mb-4">
              Debes verificar tu cuenta antes de poder subir productos al marketplace.
            </p>
            <Link href="/verification">
              <Button className="bg-primary hover:bg-primary/90">
                Verificar Cuenta
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Subir Producto
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Publica tu producto en el marketplace y llega a miles de compradores potenciales.
          </p>
        </div>

        {/* Limits Status */}
        {userLimits && (
          <Card className="mb-6 bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-300">Productos activos</span>
                <span className="text-white font-medium">
                  {currentProducts}/{userLimits.max_products}
                </span>
              </div>
              <Progress 
                value={(currentProducts / Math.max(userLimits.max_products, 1)) * 100}
                className="h-2 mb-3"
              />
              {!canUpload && (
                <Alert className="bg-red-500/10 border-red-500/30">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-red-400">
                    Has alcanzado el límite de productos para tu plan. 
                    {userProfile?.subscription_type === 'free' && (
                      <>
                        {" "}
                        <Link href="/membership" className="underline">
                          Actualiza a Premium
                        </Link> para subir más productos.
                      </>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {canUpload ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Tag className="h-5 w-5 text-primary" />
                  Información Básica
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-gray-300">Título del Producto *</Label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Ej: iPhone 14 Pro Max 256GB Nuevo"
                    maxLength={100}
                  />
                  <p className="text-xs text-gray-400 mt-1">{form.title.length}/100 caracteres</p>
                </div>

                <div>
                  <Label htmlFor="description" className="text-gray-300">Descripción *</Label>
                  <Textarea
                    id="description"
                    value={form.description}
                    onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white h-32"
                    placeholder="Describe tu producto en detalle..."
                    maxLength={1000}
                  />
                  <p className="text-xs text-gray-400 mt-1">{form.description.length}/1000 caracteres</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category" className="text-gray-300">Categoría *</Label>
                    <Select 
                      value={form.category} 
                      onValueChange={(value) => setForm(prev => ({ ...prev, category: value, subcategory: '' }))}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Selecciona categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {form.category && (
                    <div>
                      <Label htmlFor="subcategory" className="text-gray-300">Subcategoría</Label>
                      <Select 
                        value={form.subcategory} 
                        onValueChange={(value) => setForm(prev => ({ ...prev, subcategory: value }))}
                      >
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Selecciona subcategoría" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.find(c => c.value === form.category)?.subcategories.map((sub) => (
                            <SelectItem key={sub} value={sub}>
                              {sub.charAt(0).toUpperCase() + sub.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="brand" className="text-gray-300">Marca</Label>
                    <Input
                      id="brand"
                      value={form.brand}
                      onChange={(e) => setForm(prev => ({ ...prev, brand: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Apple, Samsung, etc."
                    />
                  </div>
                  <div>
                    <Label htmlFor="model" className="text-gray-300">Modelo</Label>
                    <Input
                      id="model"
                      value={form.model}
                      onChange={(e) => setForm(prev => ({ ...prev, model: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="iPhone 14 Pro Max"
                    />
                  </div>
                  <div>
                    <Label htmlFor="condition" className="text-gray-300">Estado *</Label>
                    <Select 
                      value={form.condition} 
                      onValueChange={(value) => setForm(prev => ({ ...prev, condition: value }))}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Estado" />
                      </SelectTrigger>
                      <SelectContent>
                        {CONDITIONS.map((condition) => (
                          <SelectItem key={condition.value} value={condition.value}>
                            {condition.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing and Shipping */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Precio y Envío
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price" className="text-gray-300">Precio (EUR) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.price || ''}
                      onChange={(e) => setForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location" className="text-gray-300">Ubicación</Label>
                    <Input
                      id="location"
                      value={form.location}
                      onChange={(e) => setForm(prev => ({ ...prev, location: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Madrid, España"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="shipping_included"
                      checked={form.shipping_included}
                      onCheckedChange={(checked) => 
                        setForm(prev => ({ 
                          ...prev, 
                          shipping_included: checked as boolean,
                          shipping_cost: checked ? 0 : prev.shipping_cost
                        }))
                      }
                    />
                    <Label htmlFor="shipping_included" className="text-gray-300">
                      Envío incluido en el precio
                    </Label>
                  </div>

                  {!form.shipping_included && (
                    <div>
                      <Label htmlFor="shipping_cost" className="text-gray-300">Coste de Envío (EUR)</Label>
                      <Input
                        id="shipping_cost"
                        type="number"
                        step="0.01"
                        min="0"
                        value={form.shipping_cost || ''}
                        onChange={(e) => setForm(prev => ({ ...prev, shipping_cost: parseFloat(e.target.value) || 0 }))}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="5.99"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Camera className="h-5 w-5 text-primary" />
                  Imágenes del Producto *
                </CardTitle>
                <CardDescription>
                  Sube hasta 8 imágenes. La primera será la imagen principal.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagesPreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={preview} 
                        alt={`Preview ${index + 1}`}
                        className="w-full aspect-square object-cover rounded-lg border border-gray-600"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      {index === 0 && (
                        <Badge className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs">
                          Principal
                        </Badge>
                      )}
                    </div>
                  ))}

                  {form.images.length < 8 && (
                    <div>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => {
                          const files = Array.from(e.target.files || [])
                          handleImageUpload(files)
                        }}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-primary transition-colors"
                      >
                        <Plus className="h-8 w-8 text-gray-400 mb-2" />
                        <span className="text-gray-400 text-sm text-center">
                          Añadir Imágenes
                        </span>
                      </label>
                    </div>
                  )}
                </div>

                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">Subiendo imágenes...</span>
                      <span className="text-gray-300">{Math.round(uploadProgress)}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Especificaciones</CardTitle>
                <CardDescription>
                  Añade especificaciones técnicas para dar más detalles sobre tu producto
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={specKey}
                    onChange={(e) => setSpecKey(e.target.value)}
                    placeholder="Característica (ej: Memoria)"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  <Input
                    value={specValue}
                    onChange={(e) => setSpecValue(e.target.value)}
                    placeholder="Valor (ej: 256GB)"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  <Button 
                    type="button"
                    onClick={addSpecification}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {Object.entries(form.specifications).length > 0 && (
                  <div className="space-y-2">
                    {Object.entries(form.specifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                        <div>
                          <span className="text-white font-medium">{key}: </span>
                          <span className="text-gray-300">{value}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSpecification(key)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="pt-6">
                <Button 
                  type="submit"
                  disabled={loading || !canUpload}
                  className="w-full bg-primary hover:bg-primary/90 h-12 text-lg"
                  size="lg"
                >
                  {loading ? (
                    <>Subiendo Producto...</>
                  ) : (
                    <>
                      <Upload className="h-5 w-5 mr-2" />
                      Publicar Producto
                    </>
                  )}
                </Button>
                <p className="text-center text-gray-400 text-sm mt-3">
                  Al publicar, aceptas nuestros términos y condiciones
                </p>
              </CardContent>
            </Card>
          </form>
        ) : (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Límite Alcanzado</h2>
              <p className="text-gray-300 mb-4">
                Has alcanzado el límite de productos para tu plan actual.
              </p>
              {userProfile?.subscription_type === 'free' && (
                <Link href="/membership">
                  <Button className="bg-primary hover:bg-primary/90">
                    Actualizar a Premium
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
