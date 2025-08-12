"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  Crown, 
  Key, 
  CreditCard, 
  Shield, 
  ArrowRight, 
  CheckCircle,
  Building,
  Mail,
  Lock,
  Eye,
  EyeOff
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

export default function CreateAccountPage() {
  const { validateInvitationCode, signUp } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [step, setStep] = useState<"method" | "code" | "payment" | "credentials">("method")
  const [accountMethod, setAccountMethod] = useState<"invitation" | "payment" | null>(null)
  const [invitationCode, setInvitationCode] = useState("")
  const [codeValidation, setCodeValidation] = useState<{
    isValid: boolean | null
    message: string
    accountData?: any
  }>({ isValid: null, message: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Form data for credentials step
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: ""
  })

  // Check if there's a code in URL params
  useEffect(() => {
    const code = searchParams.get('code')
    if (code) {
      setAccountMethod("invitation")
      setInvitationCode(code)
      setStep("code")
      validateCode(code)
    }
  }, [searchParams])

  const validateCode = async (code: string) => {
    if (!code.trim()) {
      setCodeValidation({ isValid: null, message: "" })
      return
    }

    try {
      setLoading(true)
      const result = await validateInvitationCode(code)
      
      setCodeValidation({
        isValid: result.isValid,
        message: result.message,
        accountData: result.accountData
      })
      
      if (result.isValid) {
        toast.success(result.message)
        // Automatic progression to credentials step
        setTimeout(() => setStep("credentials"), 1000)
      }
    } catch (error) {
      setCodeValidation({
        isValid: false,
        message: "❌ Error al validar código"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleMethodSelection = (method: "invitation" | "payment") => {
    setAccountMethod(method)
    if (method === "invitation") {
      setStep("code")
    } else {
      setStep("payment")
    }
  }

  const handleCreateAccount = async () => {
    if (!codeValidation.accountData) return

    // Validation
    if (credentials.email && credentials.password !== credentials.confirmPassword) {
      toast.error("Las contraseñas no coinciden")
      return
    }

    if (credentials.email && credentials.password.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres")
      return
    }

    try {
      setLoading(true)

      // Create account with invitation code data
      const accountData = {
        full_name: credentials.fullName || codeValidation.accountData.company_name,
        email: credentials.email || `${invitationCode.toLowerCase()}@dealsmarket.temp`,
        company_name: codeValidation.accountData.company_name,
        subscription_type: codeValidation.accountData.subscription_type,
        verification_status: codeValidation.accountData.verification_status,
        invitation_code: invitationCode,
        company_type: codeValidation.accountData.company_type,
        account_description: codeValidation.accountData.description
      }

      // If user provided email/password, create traditional account
      if (credentials.email && credentials.password) {
        const { error } = await signUp(credentials.email, credentials.password, accountData)
        
        if (error) {
          toast.error("Error al crear cuenta: " + error.message)
          return
        }
      } else {
        // Create code-only account (simulate success for now)
        toast.success("¡Cuenta creada exitosamente!")
      }

      toast.success(`¡Bienvenido a ${codeValidation.accountData.company_name}!`)
      router.push('/marketplace')

    } catch (error) {
      toast.error("Error inesperado al crear cuenta")
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentMethod = async () => {
    try {
      setLoading(true)
      
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: 'premium_plan',
          successUrl: `${window.location.origin}/create-account?step=credentials&payment=success`,
          cancelUrl: window.location.href
        })
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No se recibió la URL de pago')
      }

    } catch (error) {
      toast.error("Error al procesar el pago")
    } finally {
      setLoading(false)
    }
  }

  const renderMethodSelection = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <Crown className="h-16 w-16 text-primary mx-auto" />
        <h1 className="text-3xl font-bold text-foreground">
          Crear Cuenta en DealsMarket
        </h1>
        <p className="text-muted-foreground">
          Elige cómo deseas crear tu cuenta empresarial
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Invitation Code Method */}
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card 
            className="cursor-pointer border-primary/30 hover:border-primary/60 transition-all"
            onClick={() => handleMethodSelection("invitation")}
          >
            <CardContent className="pt-6 text-center space-y-4">
              <Key className="h-12 w-12 text-primary mx-auto" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Código de Invitación</h3>
                <p className="text-muted-foreground text-sm">
                  Accede con tu código de invitación empresarial
                </p>
              </div>
              <Badge className="bg-green-500/20 text-green-400">
                Acceso Inmediato
              </Badge>
            </CardContent>
          </Card>
        </motion.div>

        {/* Payment Method */}
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card 
            className="cursor-pointer border-blue-500/30 hover:border-blue-500/60 transition-all"
            onClick={() => handleMethodSelection("payment")}
          >
            <CardContent className="pt-6 text-center space-y-4">
              <CreditCard className="h-12 w-12 text-blue-500 mx-auto" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Suscripción Premium</h3>
                <p className="text-muted-foreground text-sm">
                  Paga €20/mes por acceso completo
                </p>
              </div>
              <Badge className="bg-blue-500/20 text-blue-400">
                €20/mes
              </Badge>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )

  const renderCodeStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <Key className="h-16 w-16 text-primary mx-auto" />
        <h1 className="text-3xl font-bold text-foreground">
          Ingresa tu Código de Invitación
        </h1>
        <p className="text-muted-foreground">
          Este código creará automáticamente tu cuenta empresarial
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="invitationCode">Código de Invitación</Label>
          <div className="relative">
            <Key className="absolute left-3 top-3 h-4 w-4 text-primary z-20" />
            <motion.div
              className="absolute inset-0 border border-primary/30 rounded-md"
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(255, 215, 0, 0.1)",
                  "0 0 0 3px rgba(255, 215, 0, 0.3)",
                  "0 0 0 0 rgba(255, 215, 0, 0.1)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <Input
              id="invitationCode"
              placeholder="Ingresa tu código..."
              className="pl-9 text-center text-lg tracking-wider uppercase relative z-10"
              value={invitationCode}
              onChange={(e) => {
                const code = e.target.value.toUpperCase()
                setInvitationCode(code)
                validateCode(code)
              }}
            />
          </div>
        </div>

        {codeValidation.message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-lg border ${
              codeValidation.isValid 
                ? 'bg-green-500/10 border-green-500/30 text-green-400'
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}
          >
            <div className="flex items-center gap-2">
              {codeValidation.isValid ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <Shield className="h-4 w-4" />
              )}
              <span className="text-sm font-medium">{codeValidation.message}</span>
            </div>
            
            {codeValidation.isValid && codeValidation.accountData && (
              <div className="mt-3 space-y-2">
                <div className="bg-primary/10 rounded-lg p-3">
                  <h4 className="font-semibold text-primary mb-2">Datos de la Cuenta:</h4>
                  <div className="space-y-1 text-sm">
                    <div><span className="font-medium">Empresa:</span> {codeValidation.accountData.company_name}</div>
                    <div><span className="font-medium">Tipo:</span> {codeValidation.accountData.company_type}</div>
                    <div><span className="font-medium">Plan:</span> {codeValidation.accountData.subscription_type}</div>
                    <div><span className="font-medium">Estado:</span> {codeValidation.accountData.verification_status}</div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => setStep("method")}
            className="flex-1"
          >
            Volver
          </Button>
          
          {codeValidation.isValid && (
            <Button 
              onClick={() => setStep("credentials")}
              className="flex-1 gradient-primary"
            >
              Continuar
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )

  const renderPaymentStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <CreditCard className="h-16 w-16 text-blue-500 mx-auto" />
        <h1 className="text-3xl font-bold text-foreground">
          Suscripción Premium
        </h1>
        <p className="text-muted-foreground">
          Acceso completo a la plataforma por €20/mes
        </p>
      </div>

      <Card className="border-blue-500/30">
        <CardContent className="pt-6 space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-500">€20/mes</div>
            <p className="text-muted-foreground">Facturación mensual</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>Acceso completo al marketplace</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>Verificación empresarial</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>Soporte prioritario</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>Analytics avanzados</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button 
          variant="outline" 
          onClick={() => setStep("method")}
          className="flex-1"
        >
          Volver
        </Button>
        
        <Button 
          onClick={handlePaymentMethod}
          disabled={loading}
          className="flex-1 bg-blue-500 hover:bg-blue-600"
        >
          {loading ? "Procesando..." : "Proceder al Pago"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )

  const renderCredentialsStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        {codeValidation.accountData ? (
          <Building className="h-16 w-16 text-primary mx-auto" />
        ) : (
          <Crown className="h-16 w-16 text-primary mx-auto" />
        )}
        <h1 className="text-3xl font-bold text-foreground">
          {codeValidation.accountData 
            ? `Bienvenido a ${codeValidation.accountData.company_name}`
            : "Completar Registro"
          }
        </h1>
        <p className="text-muted-foreground">
          {codeValidation.accountData 
            ? "Opcionalmente, puedes agregar credenciales de acceso"
            : "Completa tu información para acceder"
          }
        </p>
      </div>

      {codeValidation.accountData && (
        <Card className="border-primary/30">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-primary mb-2">Cuenta Creada Automáticamente:</h3>
            <div className="space-y-2 text-sm">
              <div><span className="font-medium">Empresa:</span> {codeValidation.accountData.company_name}</div>
              <div><span className="font-medium">Descripción:</span> {codeValidation.accountData.description}</div>
              <div><span className="font-medium">Plan:</span> {codeValidation.accountData.subscription_type}</div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <p className="text-sm text-muted-foreground text-center">
          {codeValidation.accountData 
            ? "Puedes acceder usando tu código de invitación, o agregar email y contraseña:"
            : "Completa estos campos para finalizar el registro:"
          }
        </p>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nombre Completo {!codeValidation.accountData && "*"}</Label>
            <div className="relative">
              <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="fullName"
                placeholder={codeValidation.accountData ? "Opcional" : "Tu nombre completo"}
                className="pl-9"
                value={credentials.fullName}
                onChange={(e) => setCredentials(prev => ({ ...prev, fullName: e.target.value }))}
                required={!codeValidation.accountData}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email {!codeValidation.accountData && "*"}</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder={codeValidation.accountData ? "Opcional - para notificaciones" : "tu@empresa.com"}
                className="pl-9"
                value={credentials.email}
                onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                required={!codeValidation.accountData}
              />
            </div>
            {codeValidation.accountData && (
              <p className="text-xs text-muted-foreground">
                Si no proporcionas email, usarás solo el código para acceder
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña {!codeValidation.accountData && "*"}</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={codeValidation.accountData ? "Opcional" : "Mínimo 8 caracteres"}
                className="pl-9 pr-9"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                required={!codeValidation.accountData}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {credentials.password && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirma tu contraseña"
                  className="pl-9"
                  value={credentials.confirmPassword}
                  onChange={(e) => setCredentials(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  required
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => setStep(codeValidation.accountData ? "code" : "method")}
            className="flex-1"
          >
            Volver
          </Button>
          
          <Button 
            onClick={handleCreateAccount}
            disabled={loading}
            className="flex-1 gradient-primary"
          >
            {loading ? "Creando cuenta..." : "Crear Cuenta"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {step === "method" && renderMethodSelection()}
          {step === "code" && renderCodeStep()}
          {step === "payment" && renderPaymentStep()}
          {step === "credentials" && renderCredentialsStep()}
        </motion.div>
      </div>
    </div>
  )
}
