"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Database, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { isDatabaseConnected } from '@/lib/database'

interface DatabaseStatusProps {
  showDetails?: boolean
  className?: string
}

export function DatabaseStatus({ showDetails = false, className }: DatabaseStatusProps) {
  const isConnected = isDatabaseConnected()

  if (isConnected && !showDetails) {
    return null // Don't show anything if database is connected and we don't want details
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card className={`border ${isConnected ? 'border-green-500/20 bg-green-500/5' : 'border-orange-500/20 bg-orange-500/5'}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isConnected ? 'bg-green-500/20' : 'bg-orange-500/20'}`}>
              {isConnected ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-orange-500" />
              )}
            </div>
            <div className="flex-1">
              <CardTitle className="text-base flex items-center gap-2">
                <Database className="h-4 w-4" />
                Estado de Base de Datos
                <Badge variant={isConnected ? 'default' : 'secondary'} className={isConnected ? 'bg-green-500' : 'bg-orange-500'}>
                  {isConnected ? 'Conectada' : 'Desconectada'}
                </Badge>
              </CardTitle>
            </div>
          </div>
        </CardHeader>

        {(!isConnected || showDetails) && (
          <CardContent>
            {!isConnected ? (
              <div className="space-y-3">
                <CardDescription>
                  La base de datos no está conectada. Para acceder a todas las funciones de la plataforma B2B, 
                  conecta tu base de datos Neon.
                </CardDescription>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Funciones limitadas sin base de datos:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Notificaciones en modo demo</li>
                    <li>• Productos de muestra únicamente</li>
                    <li>• Sin persistencia de datos</li>
                    <li>• Sin consultas B2B reales</li>
                  </ul>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    size="sm" 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      // This will be handled by the MCP system
                      window.open('#open-mcp-popover', '_self')
                    }}
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Conectar a Neon
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      fetch('/api/init-database', { method: 'POST' })
                        .then(res => res.json())
                        .then(data => console.log('Database init result:', data))
                        .catch(err => console.error('Database init error:', err))
                    }}
                  >
                    Inicializar DB
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <CardDescription className="text-green-600">
                  ✅ Base de datos conectada correctamente. Todas las funciones están disponibles.
                </CardDescription>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Funciones activas:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Notificaciones en tiempo real</li>
                    <li>• Marketplace completo con productos reales</li>
                    <li>• Sistema de consultas B2B</li>
                    <li>• Gestión de deals y transacciones</li>
                    <li>• Verificación de empresas</li>
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </motion.div>
  )
}

// Hook to check database status
export function useDatabaseStatus() {
  const [isConnected, setIsConnected] = React.useState(false)

  React.useEffect(() => {
    setIsConnected(isDatabaseConnected())
  }, [])

  return { isConnected }
}
