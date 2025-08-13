"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  CreditCard, 
  Shield, 
  Crown,
  Edit3,
  Camera,
  CheckCircle,
  Clock,
  X,
  Star,
  Zap
} from "lucide-react"
import { LoadingSpinner, LoadingOverlay } from "@/components/loading-spinner"
import { toast } from "sonner"

export default function AccountPage() {
  const { user, userProfile, loading } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    country: '',
    city: '',
    address: '',
  })

  useEffect(() => {
    if (userProfile) {
      setFormData({
        full_name: userProfile.full_name || '',
        phone: userProfile.phone || '',
        country: userProfile.country || '',
        city: userProfile.city || '',
        address: userProfile.address || '',
      })
    }
  }, [userProfile])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success("Perfil actualizado correctamente")
      setIsEditing(false)
    } catch (error) {
      toast.error("Error al actualizar perfil")
    } finally {
      setIsSaving(false)
    }
  }

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-500/20 text-green-400"><CheckCircle className="w-3 h-3 mr-1" />Verificado</Badge>
      case 'in_review':
        return <Badge className="bg-blue-500/20 text-blue-400"><Clock className="w-3 h-3 mr-1" />En Revisión</Badge>
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-400"><Clock className="w-3 h-3 mr-1" />Pendiente</Badge>
      default:
        return <Badge className="bg-red-500/20 text-red-400"><X className="w-3 h-3 mr-1" />No Verificado</Badge>
    }
  }

  const getSubscriptionBadge = (type: string) => {
    switch (type) {
      case 'premium':
        return <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground"><Crown className="w-3 h-3 mr-1" />Premium</Badge>
      case 'enterprise':
        return <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white"><Star className="w-3 h-3 mr-1" />Enterprise</Badge>
      default:
        return <Badge className="bg-muted text-muted-foreground">Gratuito</Badge>
    }
  }

  if (loading) {
    return <LoadingOverlay text="Cargando tu cuenta..." />
  }

  if (!user || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <CardTitle>Acceso Restringido</CardTitle>
            <CardDescription>Debes iniciar sesión para ver tu cuenta</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => window.location.href = '/login'}>
              Iniciar Sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">Mi Cuenta</h1>
          <p className="text-muted-foreground">Gestiona tu información personal y configuración de cuenta</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="text-center">
              <CardHeader>
                <div className="relative mx-auto mb-4">
                  <Avatar className="h-24 w-24 mx-auto">
                    <AvatarImage src={userProfile.profile_image_url} />
                    <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                      {userProfile.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <CardTitle className="text-xl">{userProfile.full_name || 'Usuario'}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
                
                <div className="space-y-2 mt-4">
                  {getVerificationBadge(userProfile.verification_status)}
                  {getSubscriptionBadge(userProfile.subscription_type)}
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Tipo de Usuario:</span>
                    <span className="capitalize">{userProfile.user_type}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Saldo:</span>
                    <span className="font-medium">€{userProfile.account_balance?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Miembro desde:</span>
                    <span>{new Date(userProfile.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Information Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Información Personal
                  </CardTitle>
                  <CardDescription>
                    Actualiza tu información de contacto y ubicación
                  </CardDescription>
                </div>
                <Button
                  variant={isEditing ? "outline" : "default"}
                  size="sm"
                  onClick={() => {
                    if (isEditing) {
                      setIsEditing(false)
                      // Reset form data
                      setFormData({
                        full_name: userProfile.full_name || '',
                        phone: userProfile.phone || '',
                        country: userProfile.country || '',
                        city: userProfile.city || '',
                        address: userProfile.address || '',
                      })
                    } else {
                      setIsEditing(true)
                    }
                  }}
                  disabled={isSaving}
                >
                  {isEditing ? (
                    <>
                      <X className="mr-2 h-4 w-4" />
                      Cancelar
                    </>
                  ) : (
                    <>
                      <Edit3 className="mr-2 h-4 w-4" />
                      Editar
                    </>
                  )}
                </Button>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Nombre Completo</Label>
                    {isEditing ? (
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                        placeholder="Tu nombre completo"
                      />
                    ) : (
                      <div className="flex items-center p-3 bg-muted/30 rounded-md">
                        <User className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{userProfile.full_name || 'No especificado'}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="flex items-center p-3 bg-muted/30 rounded-md">
                      <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{user.email}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="+34 123 456 789"
                      />
                    ) : (
                      <div className="flex items-center p-3 bg-muted/30 rounded-md">
                        <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{userProfile.phone || 'No especificado'}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">País</Label>
                    {isEditing ? (
                      <Input
                        id="country"
                        value={formData.country}
                        onChange={(e) => setFormData({...formData, country: e.target.value})}
                        placeholder="España"
                      />
                    ) : (
                      <div className="flex items-center p-3 bg-muted/30 rounded-md">
                        <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{userProfile.country || 'No especificado'}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">Ciudad</Label>
                    {isEditing ? (
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        placeholder="Madrid"
                      />
                    ) : (
                      <div className="flex items-center p-3 bg-muted/30 rounded-md">
                        <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{userProfile.city || 'No especificado'}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Dirección</Label>
                    {isEditing ? (
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        placeholder="Calle Principal 123, 28001 Madrid"
                      />
                    ) : (
                      <div className="flex items-center p-3 bg-muted/30 rounded-md">
                        <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{userProfile.address || 'No especificado'}</span>
                      </div>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      disabled={isSaving}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="bg-gradient-to-r from-primary to-primary/80"
                    >
                      {isSaving ? (
                        <div className="flex items-center">
                          <LoadingSpinner size="sm" />
                          <span className="ml-2">Guardando...</span>
                        </div>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Guardar Cambios
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="mr-2 h-5 w-5" />
                Acciones Rápidas
              </CardTitle>
              <CardDescription>
                Gestiona tu cuenta y suscripción
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                  <CreditCard className="h-6 w-6" />
                  <span className="text-sm">Métodos de Pago</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                  <Shield className="h-6 w-6" />
                  <span className="text-sm">Verificación</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                  <Crown className="h-6 w-6" />
                  <span className="text-sm">Actualizar Plan</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
