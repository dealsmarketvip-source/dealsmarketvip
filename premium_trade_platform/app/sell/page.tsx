"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { LoadingSpinner, LoadingOverlay } from '@/components/ui/loading-spinner'
import { 
  Package, 
  Crown, 
  Upload, 
  Camera, 
  X, 
  Plus, 
  MapPin, 
  Euro, 
  Truck, 
  Star,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Info,
  Zap,
  Save,
  Eye
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'sonner'

const CATEGORIES = [
  { value: 'electronics', label: 'Electrónicos' },
  { value: 'fashion', label: 'Moda' },
  { value: 'home', label: 'Hogar' },
  { value: 'vehicles', label: 'Vehículos' },
  { value: 'sports', label: 'Deportes' },
  { value: 'books', label: 'Libros' },
  { value: 'music', label: 'Música' },
  { value: 'art', label: 'Arte' },
  { value: 'business', label: 'Negocios' },
  { value: 'other', label: 'Otros' }
]

const CONDITIONS = [
  { value: 'new', label: 'Nuevo', description: 'Sin usar, en su embalaje original' },
  { value: 'like_new', label: 'Como nuevo', description: 'Usado muy poco, excelente estado' },
  { value: 'good', label: 'Bueno', description: 'Usado normal, buen estado general' },
  { value: 'fair', label: 'Regular', description: 'Usado frecuentemente, estado aceptable' },
  { value: 'poor', label: 'Malo', description: 'Muy usado, necesita reparaciones' }
]

export default function SellPage() {
  const { user, userProfile } = useAuth()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    condition: '',
    price: '',
    currency: 'EUR',
    location: '',
    shipping_included: false,
    shipping_cost: '',
    images: [] as string[],
    featured: false,
    tags: [] as string[]
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!user) {
      toast.error('Debes iniciar sesión para vender productos')
      router.push('/login')
      return
    }

    if (userProfile?.verification_status !== 'verified') {
      toast.error('Solo empresas verificadas pueden vender productos')
      router.push('/membership')
      return
    }
  }, [user, userProfile, router])

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 1:
        if (!formData.title.trim()) newErrors.title = 'El título es requerido'
        if (!formData.description.trim()) newErrors.description = 'La descripción es requerida'
        if (!formData.category) newErrors.category = 'La categoría es requerida'
        if (!formData.condition) newErrors.condition = 'El estado es requerido'
        break
      case 2:
        if (!formData.price || parseFloat(formData.price) <= 0) {
          newErrors.price = 'El precio debe ser mayor a 0'
        }
        if (!formData.location.trim()) newErrors.location = 'La ubicación es requerida'
        if (!formData.shipping_included && (!formData.shipping_cost || parseFloat(formData.shipping_cost) < 0)) {
          newErrors.shipping_cost = 'El costo de envío debe ser 0 o mayor'
        }
        break
      case 3:
        if (formData.images.length === 0) {
          newErrors.images = 'Debes agregar al menos una imagen'
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4))
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    // Simulate image upload
    files.forEach((file, index) => {
      setTimeout(() => {
        const imageUrl = `https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=300&fit=crop&sig=${Date.now() + index}`
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, imageUrl]
        }))
      }, (index + 1) * 500)
    })
    
    toast.success(`Subiendo ${files.length} imagen(es)...`)
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async () => {
    if (!validateStep(3)) return

    setSubmitting(true)
    try {
      // Simulate product creation
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      toast.success('¡Producto publicado exitosamente!')
      router.push('/marketplace')
    } catch (error) {
      toast.error('Error al publicar el producto')
    } finally {
      setSubmitting(false)
    }
  }

  if (!user || !userProfile) {
    return <LoadingOverlay isLoading={true} text="Verificando acceso..." variant="crown" />
  }

  if (submitting) {
    return <LoadingOverlay isLoading={true} text="Publicando producto..." variant="package" />
  }

  const steps = [
    { number: 1, title: 'Información Básica', description: 'Título, descripción y categoría' },
    { number: 2, title: 'Precio y Envío', description: 'Precio, ubicación y costos de envío' },
    { number: 3, title: 'Imágenes', description: 'Fotos del producto' },
    { number: 4, title: 'Revisión', description: 'Revisar y publicar' }
  ]

  if (previewMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="outline"
                onClick={() => setPreviewMode(false)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver a Editar
              </Button>
              
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-foreground">Vista Previa del Producto</h1>
                <p className="text-muted-foreground">Así verán tu producto otros usuarios</p>
              </div>

              <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90">
                <Save className="mr-2 h-4 w-4" />
                Publicar Producto
              </Button>
            </div>
          </motion.div>

          {/* Product Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Images */}
            <div className="lg:col-span-2">
              <Card>
                <div className="aspect-video bg-muted relative overflow-hidden">
                  {formData.images.length > 0 ? (
                    <img 
                      src={formData.images[0]} 
                      alt={formData.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Descripción</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {formData.description}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <h1 className="text-2xl font-bold text-foreground mb-4">
                    {formData.title}
                  </h1>

                  <div className="space-y-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-primary">
                        {parseFloat(formData.price).toLocaleString('es-ES', {
                          style: 'currency',
                          currency: formData.currency
                        })}
                      </span>
                      {formData.shipping_included ? (
                        <span className="text-sm text-green-400">Envío incluido</span>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          + {parseFloat(formData.shipping_cost || '0').toLocaleString('es-ES', {
                            style: 'currency',
                            currency: formData.currency
                          })} envío
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Badge>{CONDITIONS.find(c => c.value === formData.condition)?.label}</Badge>
                      <Badge variant="outline">{CATEGORIES.find(c => c.value === formData.category)?.label}</Badge>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {formData.location}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
            
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
                <motion.div
                  className="w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center"
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(245, 158, 11, 0.3)",
                      "0 0 40px rgba(245, 158, 11, 0.6)",
                      "0 0 20px rgba(245, 158, 11, 0.3)"
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Package className="h-6 w-6 text-primary-foreground" />
                </motion.div>
                Vender Producto
              </h1>
              <p className="text-muted-foreground">
                Crea tu anuncio y conecta con empresas verificadas
              </p>
            </div>
          </div>

          {/* Steps */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex items-center">
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      currentStep >= step.number
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                    animate={currentStep === step.number ? {
                      boxShadow: [
                        "0 0 0 rgba(245, 158, 11, 0)",
                        "0 0 20px rgba(245, 158, 11, 0.4)",
                        "0 0 0 rgba(245, 158, 11, 0)"
                      ]
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {currentStep > step.number ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      step.number
                    )}
                  </motion.div>
                  <div className="ml-3 hidden md:block">
                    <p className="text-sm font-medium text-foreground">{step.title}</p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-8 md:w-24 h-0.5 bg-border mx-4" />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Form Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Información Básica
                  </CardTitle>
                  <CardDescription>
                    Proporciona los detalles principales de tu producto
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título del producto *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Ej: iPhone 15 Pro Max 1TB - Nuevo"
                      className={errors.title ? 'border-red-500' : ''}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-400">{errors.title}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe tu producto en detalle: estado, características, incluye..."
                      rows={6}
                      className={errors.description ? 'border-red-500' : ''}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-400">{errors.description}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Categoría *</Label>
                      <Select 
                        value={formData.category} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.category && (
                        <p className="text-sm text-red-400">{errors.category}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Estado *</Label>
                      <Select 
                        value={formData.condition} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, condition: value }))}
                      >
                        <SelectTrigger className={errors.condition ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Estado del producto" />
                        </SelectTrigger>
                        <SelectContent>
                          {CONDITIONS.map((condition) => (
                            <SelectItem key={condition.value} value={condition.value}>
                              <div>
                                <div className="font-medium">{condition.label}</div>
                                <div className="text-xs text-muted-foreground">{condition.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.condition && (
                        <p className="text-sm text-red-400">{errors.condition}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Euro className="h-5 w-5" />
                    Precio y Envío
                  </CardTitle>
                  <CardDescription>
                    Configura el precio y las opciones de envío
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="price">Precio *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="0.00"
                        className={errors.price ? 'border-red-500' : ''}
                      />
                      {errors.price && (
                        <p className="text-sm text-red-400">{errors.price}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Moneda</Label>
                      <Select 
                        value={formData.currency} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EUR">€ Euro</SelectItem>
                          <SelectItem value="USD">$ Dólar</SelectItem>
                          <SelectItem value="GBP">£ Libra</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Ubicación *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Madrid, España"
                        className={`pl-10 ${errors.location ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.location && (
                      <p className="text-sm text-red-400">{errors.location}</p>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Envío incluido en el precio</Label>
                        <p className="text-sm text-muted-foreground">
                          El envío está incluido en el precio del producto
                        </p>
                      </div>
                      <Switch
                        checked={formData.shipping_included}
                        onCheckedChange={(checked) => setFormData(prev => ({ 
                          ...prev, 
                          shipping_included: checked,
                          shipping_cost: checked ? '0' : prev.shipping_cost 
                        }))}
                      />
                    </div>

                    {!formData.shipping_included && (
                      <div className="space-y-2">
                        <Label htmlFor="shipping_cost">Costo de envío</Label>
                        <div className="relative">
                          <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            id="shipping_cost"
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.shipping_cost}
                            onChange={(e) => setFormData(prev => ({ ...prev, shipping_cost: e.target.value }))}
                            placeholder="0.00"
                            className={`pl-10 ${errors.shipping_cost ? 'border-red-500' : ''}`}
                          />
                        </div>
                        {errors.shipping_cost && (
                          <p className="text-sm text-red-400">{errors.shipping_cost}</p>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Imágenes del Producto
                  </CardTitle>
                  <CardDescription>
                    Añade fotos de alta calidad para mostrar tu producto
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Upload Area */}
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <div className="space-y-4">
                      <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                      <div>
                        <p className="font-medium text-foreground">Sube imágenes de tu producto</p>
                        <p className="text-sm text-muted-foreground">PNG, JPG hasta 10MB cada una</p>
                      </div>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <Button asChild variant="outline">
                        <label htmlFor="image-upload" className="cursor-pointer">
                          <Camera className="mr-2 h-4 w-4" />
                          Seleccionar Imágenes
                        </label>
                      </Button>
                    </div>
                  </div>

                  {errors.images && (
                    <p className="text-sm text-red-400">{errors.images}</p>
                  )}

                  {/* Image Preview */}
                  {formData.images.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-medium">Imágenes seleccionadas ({formData.images.length})</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {formData.images.map((image, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative aspect-square rounded-lg overflow-hidden border border-border"
                          >
                            <img
                              src={image}
                              alt={`Producto ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <Button
                              size="sm"
                              variant="destructive"
                              className="absolute top-2 right-2 h-6 w-6 p-0"
                              onClick={() => removeImage(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                            {index === 0 && (
                              <Badge className="absolute bottom-2 left-2 text-xs">
                                Principal
                              </Badge>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {currentStep === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    Revisión Final
                  </CardTitle>
                  <CardDescription>
                    Revisa toda la información antes de publicar
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-foreground mb-2">Información Básica</h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="text-muted-foreground">Título:</span> {formData.title}</p>
                          <p><span className="text-muted-foreground">Categoría:</span> {CATEGORIES.find(c => c.value === formData.category)?.label}</p>
                          <p><span className="text-muted-foreground">Estado:</span> {CONDITIONS.find(c => c.value === formData.condition)?.label}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-foreground mb-2">Precio y Envío</h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="text-muted-foreground">Precio:</span> {parseFloat(formData.price).toLocaleString('es-ES', { style: 'currency', currency: formData.currency })}</p>
                          <p><span className="text-muted-foreground">Ubicación:</span> {formData.location}</p>
                          <p><span className="text-muted-foreground">Envío:</span> {formData.shipping_included ? 'Incluido' : `${parseFloat(formData.shipping_cost || '0').toLocaleString('es-ES', { style: 'currency', currency: formData.currency })}`}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-foreground mb-2">Imágenes</h4>
                        <p className="text-sm text-muted-foreground mb-2">{formData.images.length} imagen(es) seleccionada(s)</p>
                        {formData.images.length > 0 && (
                          <div className="grid grid-cols-3 gap-2">
                            {formData.images.slice(0, 3).map((image, index) => (
                              <div key={index} className="aspect-square rounded border overflow-hidden">
                                <img src={image} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className="font-medium text-foreground mb-2">Descripción</h4>
                        <p className="text-sm text-muted-foreground line-clamp-4">
                          {formData.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-semibold text-blue-400 mb-1">Antes de publicar</p>
                        <ul className="text-muted-foreground space-y-1">
                          <li>• Tu producto será visible para todas las empresas verificadas</li>
                          <li>• Recibirás notificaciones cuando alguien esté interesado</li>
                          <li>• Puedes editar o eliminar el anuncio en cualquier momento</li>
                          <li>• Como empresa verificada, tu perfil aparecerá con la insignia de confianza</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setPreviewMode(true)}
                      className="flex-1"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Vista Previa
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                    >
                      <Zap className="mr-2 h-4 w-4" />
                      Publicar Producto
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        {!previewMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mt-8"
          >
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Anterior
            </Button>

            <div className="text-sm text-muted-foreground">
              Paso {currentStep} de {steps.length}
            </div>

            {currentStep < 4 ? (
              <Button
                onClick={handleNext}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90"
              >
                Siguiente
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <div className="w-24" /> // Spacer
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
