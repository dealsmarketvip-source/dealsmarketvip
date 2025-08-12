"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { LoadingSpinner, LoadingOverlay } from '@/components/ui/loading-spinner'
import { 
  Settings, 
  Bell, 
  Shield, 
  CreditCard, 
  Palette, 
  Globe, 
  Moon, 
  Sun, 
  Monitor,
  Key,
  Mail,
  Smartphone,
  Lock,
  Eye,
  EyeOff,
  Download,
  Trash2,
  AlertTriangle,
  Save,
  ArrowLeft,
  Zap,
  Crown,
  RefreshCw
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useTheme } from 'next-themes'
import { toast } from 'sonner'

export default function SettingsPage() {
  const { user, userProfile } = useAuth()
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      marketing: false,
      newProducts: true,
      priceDrops: true,
      messages: true
    },
    privacy: {
      profileVisible: true,
      showEmail: false,
      showPhone: false,
      indexProfile: true
    },
    preferences: {
      language: 'es',
      currency: 'EUR',
      timezone: 'Europe/Madrid',
      itemsPerPage: 20
    },
    security: {
      twoFactor: false,
      sessionTimeout: 30,
      loginAlerts: true
    }
  })

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
  }, [user, router])

  const handleSave = async () => {
    setSaveLoading(true)
    try {
      // Simulate save operation
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('Configuración guardada correctamente')
    } catch (error) {
      toast.error('Error al guardar la configuración')
    } finally {
      setSaveLoading(false)
    }
  }

  const handleExportData = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success('Descarga iniciada. Revisa tu email.')
    } catch (error) {
      toast.error('Error al exportar datos')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      '⚠️ ¿Estás seguro de que quieres eliminar tu cuenta?\n\nEsta acción no se puede deshacer y perderás:\n- Todos tus productos\n- Tus favoritos\n- Tu historial de transacciones\n- Tu suscripción premium'
    )
    
    if (!confirmed) return

    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('Solicitud de eliminación enviada')
    } catch (error) {
      toast.error('Error al procesar la solicitud')
    } finally {
      setLoading(false)
    }
  }

  if (!user || !userProfile) {
    return <LoadingOverlay isLoading={true} text="Cargando configuración..." variant="default" />
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
              size="sm"
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
                  <Settings className="h-6 w-6 text-primary-foreground" />
                </motion.div>
                Configuración
              </h1>
              <p className="text-muted-foreground">
                Personaliza tu experiencia en DealsMarket
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="sticky top-8">
              <CardContent className="pt-6">
                <nav className="space-y-2">
                  {[
                    { id: 'notifications', icon: Bell, label: 'Notificaciones' },
                    { id: 'privacy', icon: Shield, label: 'Privacidad' },
                    { id: 'appearance', icon: Palette, label: 'Apariencia' },
                    { id: 'security', icon: Key, label: 'Seguridad' },
                    { id: 'billing', icon: CreditCard, label: 'Facturación' },
                    { id: 'data', icon: Download, label: 'Mis Datos' }
                  ].map((item, index) => (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </motion.button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3 space-y-8"
          >
            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notificaciones
                </CardTitle>
                <CardDescription>
                  Configura cómo y cuándo quieres recibir notificaciones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {[
                    { key: 'email', label: 'Notificaciones por email', description: 'Recibe actualizaciones importantes por email' },
                    { key: 'push', label: 'Notificaciones push', description: 'Notificaciones en tiempo real en tu navegador' },
                    { key: 'marketing', label: 'Marketing y promociones', description: 'Ofertas especiales y novedades' },
                    { key: 'newProducts', label: 'Nuevos productos', description: 'Te avisamos cuando hay productos que te puedan interesar' },
                    { key: 'priceDrops', label: 'Bajadas de precio', description: 'Notificaciones cuando baje el precio de tus favoritos' },
                    { key: 'messages', label: 'Mensajes', description: 'Notificaciones de mensajes de otros usuarios' }
                  ].map((notification) => (
                    <div key={notification.key} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{notification.label}</p>
                        <p className="text-xs text-muted-foreground">{notification.description}</p>
                      </div>
                      <Switch
                        checked={settings.notifications[notification.key as keyof typeof settings.notifications]}
                        onCheckedChange={(checked) => 
                          setSettings(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, [notification.key]: checked }
                          }))
                        }
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Privacy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Privacidad
                </CardTitle>
                <CardDescription>
                  Controla qué información es visible para otros usuarios
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {[
                    { key: 'profileVisible', label: 'Perfil público', description: 'Tu perfil es visible para otros miembros verificados' },
                    { key: 'showEmail', label: 'Mostrar email', description: 'Tu email será visible en tu perfil público' },
                    { key: 'showPhone', label: 'Mostrar teléfono', description: 'Tu número de teléfono será visible en tu perfil' },
                    { key: 'indexProfile', label: 'Indexar perfil', description: 'Permitir que tu perfil aparezca en búsquedas' }
                  ].map((privacy) => (
                    <div key={privacy.key} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{privacy.label}</p>
                        <p className="text-xs text-muted-foreground">{privacy.description}</p>
                      </div>
                      <Switch
                        checked={settings.privacy[privacy.key as keyof typeof settings.privacy]}
                        onCheckedChange={(checked) => 
                          setSettings(prev => ({
                            ...prev,
                            privacy: { ...prev.privacy, [privacy.key]: checked }
                          }))
                        }
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Appearance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Apariencia
                </CardTitle>
                <CardDescription>
                  Personaliza el aspecto de la interfaz
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tema</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: 'light', icon: Sun, label: 'Claro' },
                        { value: 'dark', icon: Moon, label: 'Oscuro' },
                        { value: 'system', icon: Monitor, label: 'Sistema' }
                      ].map((themeOption) => (
                        <Button
                          key={themeOption.value}
                          variant={theme === themeOption.value ? "default" : "outline"}
                          className="flex flex-col gap-2 h-auto py-4"
                          onClick={() => setTheme(themeOption.value)}
                        >
                          <themeOption.icon className="h-4 w-4" />
                          <span className="text-xs">{themeOption.label}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Idioma</Label>
                      <Select value={settings.preferences.language} onValueChange={(value) => 
                        setSettings(prev => ({
                          ...prev,
                          preferences: { ...prev.preferences, language: value }
                        }))
                      }>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="es">🇪🇸 Español</SelectItem>
                          <SelectItem value="en">🇺🇸 English</SelectItem>
                          <SelectItem value="fr">🇫🇷 Français</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Moneda</Label>
                      <Select value={settings.preferences.currency} onValueChange={(value) => 
                        setSettings(prev => ({
                          ...prev,
                          preferences: { ...prev.preferences, currency: value }
                        }))
                      }>
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
                </div>
              </CardContent>
            </Card>

            {/* Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Seguridad
                </CardTitle>
                <CardDescription>
                  Mantén tu cuenta segura
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Autenticación de dos factores</p>
                      <p className="text-xs text-muted-foreground">Añade una capa extra de seguridad</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={settings.security.twoFactor ? "default" : "secondary"}>
                        {settings.security.twoFactor ? "Activo" : "Inactivo"}
                      </Badge>
                      <Switch
                        checked={settings.security.twoFactor}
                        onCheckedChange={(checked) => 
                          setSettings(prev => ({
                            ...prev,
                            security: { ...prev.security, twoFactor: checked }
                          }))
                        }
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>Cambiar contraseña</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Nueva contraseña"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-auto p-1"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      <Input type="password" placeholder="Confirmar contraseña" />
                    </div>
                    <Button variant="outline" size="sm">
                      <Lock className="mr-2 h-4 w-4" />
                      Actualizar Contraseña
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Billing */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <CreditCard className="h-5 w-5" />
                  Facturación Premium
                </CardTitle>
                <CardDescription>
                  Gestiona tu suscripción y métodos de pago
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Crown className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-semibold">Plan Premium</p>
                      <p className="text-sm text-muted-foreground">€20/mes • Renovación automática</p>
                    </div>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    Activo
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-12">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Cambiar Plan
                  </Button>
                  <Button variant="outline" className="h-12">
                    <Download className="mr-2 h-4 w-4" />
                    Descargar Facturas
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Data Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Gestión de Datos
                </CardTitle>
                <CardDescription>
                  Exporta o elimina tus datos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <h4 className="font-semibold text-blue-400 mb-2">Exportar mis datos</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Descarga una copia de todos tus datos en formato JSON.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={handleExportData}
                      disabled={loading}
                      className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                    >
                      {loading ? (
                        <LoadingSpinner size="sm" variant="default" />
                      ) : (
                        <>
                          <Download className="mr-2 h-4 w-4" />
                          Exportar Datos
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <h4 className="font-semibold text-red-400 mb-2">Eliminar cuenta</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Esta acción eliminará permanentemente tu cuenta y todos los datos asociados.
                      No se puede deshacer.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={handleDeleteAccount}
                      disabled={loading}
                      className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                    >
                      {loading ? (
                        <LoadingSpinner size="sm" variant="default" />
                      ) : (
                        <>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar Cuenta
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <motion.div
              className="sticky bottom-8 bg-background/80 backdrop-blur-sm border border-border/50 rounded-lg p-4"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={handleSave}
                className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold shadow-lg"
                disabled={saveLoading}
              >
                {saveLoading ? (
                  <LoadingSpinner size="sm" variant="default" />
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Configuración
                    <Zap className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
