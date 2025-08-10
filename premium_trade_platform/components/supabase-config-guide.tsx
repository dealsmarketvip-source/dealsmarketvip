"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Database, Key, Settings } from "lucide-react"

export function SupabaseConfigGuide() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const isConfigured = supabaseUrl && 
    !supabaseUrl.includes('placeholder') && 
    !supabaseUrl.includes('demo')

  if (isConfigured) {
    return null
  }

  return (
    <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-amber-600" />
          <CardTitle className="text-amber-800 dark:text-amber-200">
            Configuración de Supabase Requerida
          </CardTitle>
        </div>
        <CardDescription className="text-amber-700 dark:text-amber-300">
          Para que la autenticación funcione correctamente, necesitas configurar Supabase.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
          <Database className="h-4 w-4" />
          <AlertTitle className="text-blue-800 dark:text-blue-200">
            Pasos para configurar Supabase:
          </AlertTitle>
          <AlertDescription className="text-blue-700 dark:text-blue-300">
            <ol className="list-decimal list-inside space-y-2 mt-2">
              <li>
                Crea una cuenta en{" "}
                <a 
                  href="https://supabase.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-600 inline-flex items-center gap-1"
                >
                  Supabase <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>Crea un nuevo proyecto</li>
              <li>Ve a Settings → API</li>
              <li>Copia tu Project URL y anon public key</li>
              <li>Configura las variables de entorno:</li>
            </ol>
          </AlertDescription>
        </Alert>

        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg font-mono text-sm">
          <div className="flex items-center gap-2 mb-2">
            <Key className="h-4 w-4" />
            <span className="font-semibold">Variables de entorno requeridas:</span>
          </div>
          <div className="space-y-1">
            <div>
              <Badge variant="outline" className="mr-2">
                NEXT_PUBLIC_SUPABASE_URL
              </Badge>
              <span className="text-muted-foreground">Tu Project URL</span>
            </div>
            <div>
              <Badge variant="outline" className="mr-2">
                NEXT_PUBLIC_SUPABASE_ANON_KEY
              </Badge>
              <span className="text-muted-foreground">Tu anon public key</span>
            </div>
          </div>
        </div>

        <Alert>
          <AlertDescription>
            💡 <strong>Tip:</strong> Agrega estas variables en tu archivo <code>.env.local</code> 
            en la raíz del proyecto.
          </AlertDescription>
        </Alert>

        <Button asChild className="w-full">
          <a 
            href="https://supabase.com/dashboard" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2"
          >
            Abrir Supabase Dashboard <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </CardContent>
    </Card>
  )
}
