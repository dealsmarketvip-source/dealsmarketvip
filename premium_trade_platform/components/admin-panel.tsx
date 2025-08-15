"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Shield, Settings, User, Crown, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth-instant'
import { toast } from 'sonner'

interface AdminPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const { user, updateProfile } = useAuth()
  const [currentRole, setCurrentRole] = useState(user?.role || 'user')
  const [isUpdating, setIsUpdating] = useState(false)

  if (!user?.is_admin) {
    return null
  }

  const handleRoleChange = async (newRole: string) => {
    setIsUpdating(true)
    try {
      await updateProfile({
        role: newRole,
        is_admin: newRole === 'admin'
      })
      setCurrentRole(newRole)
      toast.success(`Rol cambiado a: ${newRole === 'admin' ? 'Administrador' : 'Usuario'}`)
    } catch (error) {
      toast.error('Error al cambiar el rol')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose()
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-card border border-border rounded-xl p-6 max-w-md w-full shadow-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Panel de Admin</h2>
                  <p className="text-sm text-muted-foreground">ASTERO1 Controls</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <EyeOff className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-6">
              {/* User Info */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Información de Usuario
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Email:</span>
                    <span className="text-sm font-medium">{user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Empresa:</span>
                    <span className="text-sm font-medium">{user.company_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Estado:</span>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                      {user.is_admin ? 'Admin' : 'Usuario'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Role Switcher */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Cambiar Rol
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Seleccionar Rol:
                    </label>
                    <Select 
                      value={currentRole} 
                      onValueChange={handleRoleChange}
                      disabled={isUpdating}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">
                          <div className="flex items-center gap-2">
                            <Crown className="h-4 w-4 text-primary" />
                            Administrador
                          </div>
                        </SelectItem>
                        <SelectItem value="user">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            Usuario Ordinario
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    <strong>Administrador:</strong> Acceso completo a todas las funciones<br/>
                    <strong>Usuario:</strong> Acceso estándar como cualquier usuario
                  </div>
                </CardContent>
              </Card>

              {/* Current Permissions */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Permisos Actuales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className={`p-2 rounded ${user.is_admin ? 'bg-green-500/20 text-green-400' : 'bg-muted text-muted-foreground'}`}>
                      Panel Admin
                    </div>
                    <div className="p-2 rounded bg-green-500/20 text-green-400">
                      Marketplace
                    </div>
                    <div className="p-2 rounded bg-green-500/20 text-green-400">
                      Perfil
                    </div>
                    <div className="p-2 rounded bg-green-500/20 text-green-400">
                      Configuración
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cerrar
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
