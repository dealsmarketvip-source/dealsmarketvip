"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CrownLogo } from "@/components/ui/crown-logo"
import { Mail, Lock, User, Building, Phone, MapPin, Eye, EyeOff, Shield, Key, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultTab?: "login" | "register"
}

export function AuthModal({ isOpen, onClose, defaultTab = "login" }: AuthModalProps) {
  const authContext = useAuth()
  const { signIn, signUp, signInWithCode, validateInvitationCode, loading } = authContext || {
    signIn: async () => ({ error: null }),
    signUp: async () => ({ error: null }),
    signInWithCode: async () => ({ error: null }),
    validateInvitationCode: async () => ({ isValid: false, message: "" }),
    loading: false
  }
  const [currentTab, setCurrentTab] = useState(defaultTab)
  const [codeOnlyForm, setCodeOnlyForm] = useState({ accessCode: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState<"auth" | "verification" | "payment">("auth")
  
  // Form states
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [registerForm, setRegisterForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    companyName: "",
    phone: "",
    country: "",
    invitationCode: ""
  })
  const [verificationCode, setVerificationCode] = useState("")
  const [codeValidation, setCodeValidation] = useState<{
    isValid: boolean | null,
    message: string,
    isChecking: boolean
  }>({ isValid: null, message: "", isChecking: false })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { error } = await signIn(loginForm.email, loginForm.password)
      if (error) {
        toast.error("Error al iniciar sesión: " + error.message)
      } else {
        toast.success("¡Bienvenido de vuelta!")
        onClose()
      }
    } catch (error) {
      toast.error("Error inesperado al iniciar sesión")
    }
  }

  // Validar código de invitación usando el hook real
  const validateCodeInput = async (code: string) => {
    if (!code.trim()) {
      setCodeValidation({ isValid: null, message: "", isChecking: false })
      return
    }

    setCodeValidation({ isValid: null, message: "", isChecking: true })

    try {
      const result = await validateInvitationCode(code)

      setCodeValidation({
        isValid: result.isValid,
        message: result.message,
        isChecking: false
      })

      if (result.isValid) {
        toast.success(result.message)
      }
    } catch (error) {
      setCodeValidation({
        isValid: false,
        message: "❌ Error al validar código",
        isChecking: false
      })
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (registerForm.password !== registerForm.confirmPassword) {
      toast.error("Las contraseñas no coinciden")
      return
    }

    if (registerForm.password.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres")
      return
    }

    // Verificar código de invitación si se proporcionó
    if (registerForm.invitationCode && codeValidation.isValid !== true) {
      toast.error("Por favor verifica que tu código de invitación sea válido")
      return
    }

    try {
      const { error } = await signUp(registerForm.email, registerForm.password, {
        full_name: registerForm.fullName,
        company_name: registerForm.companyName,
        phone: registerForm.phone,
        country: registerForm.country,
        invitation_code: registerForm.invitationCode
      })

      if (error) {
        toast.error("Error al crear cuenta: " + error.message)
      } else {
        // Generate and log verification code for development
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
        console.log("🔐 Código de verificación para desarrollo:", verificationCode)
        toast.success("¡Cuenta creada! Código de verificación: " + verificationCode)
        setStep("verification")
      }
    } catch (error) {
      toast.error("Error inesperado al crear cuenta")
    }
  }

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    if (verificationCode.length !== 6) {
      toast.error("El código debe tener 6 dígitos")
      return
    }

    // Faster verification simulation
    toast.success("¡Email verificado! Procediendo al pago...")
    setTimeout(() => setStep("payment"), 300)
  }

  const handleCodeOnlyLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!codeOnlyForm.accessCode.trim()) {
      toast.error("Por favor ingresa un código de acceso")
      return
    }

    try {
      const { error, data } = await signInWithCode(codeOnlyForm.accessCode)
      if (error) {
        toast.error("Error con el código: " + error.message)
      } else {
        toast.success("¡Código válido! Redirigiendo...")
        setTimeout(() => {
          onClose()
          window.location.href = '/marketplace'
        }, 1000)
      }
    } catch (error) {
      toast.error("Error inesperado al validar código")
    }
  }

  const renderAuthStep = () => (
    <Tabs value={currentTab} onValueChange={(value) => setCurrentTab(value as "login" | "register" | "code")}>
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
        <TabsTrigger value="register">Crear Cuenta</TabsTrigger>
        <TabsTrigger value="code">Código Acceso</TabsTrigger>
      </TabsList>

      <TabsContent value="login">
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="tu@empresa.com"
                className="pl-9"
                value={loginForm.email}
                onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-9 pr-9"
                value={loginForm.password}
                onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                required
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

          <Button type="submit" className="w-full gradient-primary" disabled={loading}>
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>
        </form>
      </TabsContent>

      <TabsContent value="register">
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nombre Completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="fullName"
                  placeholder="Juan Pérez"
                  className="pl-9"
                  value={registerForm.fullName}
                  onChange={(e) => setRegisterForm(prev => ({ ...prev, fullName: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName">Empresa</Label>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="companyName"
                  placeholder="Mi Empresa S.L."
                  className="pl-9"
                  value={registerForm.companyName}
                  onChange={(e) => setRegisterForm(prev => ({ ...prev, companyName: e.target.value }))}
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="regEmail">Email Empresarial</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="regEmail"
                type="email"
                placeholder="contacto@empresa.com"
                className="pl-9"
                value={registerForm.email}
                onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  placeholder="+34 600 000 000"
                  className="pl-9"
                  value={registerForm.phone}
                  onChange={(e) => setRegisterForm(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">País</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="country"
                  placeholder="España"
                  className="pl-9"
                  value={registerForm.country}
                  onChange={(e) => setRegisterForm(prev => ({ ...prev, country: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="invitationCode" className="flex items-center gap-2">
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Key className="h-4 w-4 text-primary glow-primary" />
              </motion.div>
              Código de Invitación (Opcional)
            </Label>
            <div className="relative">
              <motion.div
                animate={{
                  scale: codeValidation.isValid === true ? [1, 1.2, 1] : 1,
                  rotate: codeValidation.isValid === true ? [0, 15, -15, 0] : 0
                }}
                transition={{ duration: 0.5 }}
              >
                <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              </motion.div>
              <Input
                id="invitationCode"
                placeholder="PREMIUM2024, LUXURY100, BETA50"
                className={`pl-9 pr-12 transition-all duration-300 ${
                  codeValidation.isValid === true ? 'border-green-500 glow-accent' :
                  codeValidation.isValid === false ? 'border-red-500' : ''
                }`}
                value={registerForm.invitationCode}
                onChange={(e) => {
                  const code = e.target.value.toUpperCase()
                  setRegisterForm(prev => ({ ...prev, invitationCode: code }))
                  validateCodeInput(code)
                }}
              />
              <div className="absolute right-3 top-3">
                {codeValidation.isChecking && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Key className="h-4 w-4 text-primary" />
                  </motion.div>
                )}
                {codeValidation.isValid === true && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </motion.div>
                )}
                {codeValidation.isValid === false && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  </motion.div>
                )}
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{
                opacity: codeValidation.message ? 1 : 0,
                y: codeValidation.message ? 0 : -10
              }}
              transition={{ duration: 0.3 }}
            >
              <p className={`text-xs ${
                codeValidation.isValid === true ? 'text-green-500' :
                codeValidation.isValid === false ? 'text-red-500' :
                'text-muted-foreground'
              }`}>
                {codeValidation.message || "Con un código válido serás verificado automáticamente"}
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="regPassword">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="regPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-9 pr-9"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                  required
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-9"
                  value={registerForm.confirmPassword}
                  onChange={(e) => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  required
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full gradient-primary" disabled={loading}>
            {loading ? "Creando cuenta..." : "Crear Cuenta Premium"}
          </Button>
        </form>
      </TabsContent>

      <TabsContent value="code">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center space-y-6"
        >
          <div className="space-y-2">
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Key className="h-16 w-16 text-primary mx-auto glow-primary-strong" />
            </motion.div>
            <h3 className="text-xl font-semibold glow-text">Acceso con Código</h3>
            <p className="text-muted-foreground">
              Ingresa tu código de invitación para acceso directo
            </p>
          </div>

          <form onSubmit={handleCodeOnlyLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="accessCode">Código de Acceso</Label>
              <div className="relative">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Key className="absolute left-3 top-3 h-4 w-4 text-primary glow-primary" />
                </motion.div>
                <Input
                  id="accessCode"
                  placeholder="PREMIUM2024, LUXURY100..."
                  className="pl-9 text-center text-lg tracking-wider uppercase glow-accent"
                  value={codeOnlyForm.accessCode}
                  onChange={(e) => setCodeOnlyForm(prev => ({
                    ...prev,
                    accessCode: e.target.value.toUpperCase()
                  }))}
                  required
                />
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                type="submit"
                className="w-full gradient-primary glow-primary-strong pulse-glow shimmer"
                disabled={loading}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Key className="h-4 w-4 mr-2" />
                  </motion.div>
                ) : (
                  <Key className="mr-2 h-4 w-4" />
                )}
                {loading ? "Validando código..." : "Acceder con Código"}
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="ml-2 h-4 w-4" />
                </motion.div>
              </Button>
            </motion.div>
          </form>

          <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-4 space-y-2">
            <p className="text-sm font-medium">Códigos de ejemplo válidos:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {["PREMIUM2024", "LUXURY100", "BETA50"].map((code) => (
                <motion.button
                  key={code}
                  type="button"
                  className="px-3 py-1 bg-primary/20 text-primary text-xs rounded-full border border-primary/30 hover:bg-primary/30 transition-colors"
                  onClick={() => setCodeOnlyForm(prev => ({ ...prev, accessCode: code }))}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {code}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </TabsContent>
    </Tabs>
  )

  const renderVerificationStep = () => (
    <div className="text-center space-y-6">
      <div className="space-y-2">
        <Mail className="mx-auto h-12 w-12 text-primary" />
        <h3 className="text-xl font-semibold">Verifica tu Email</h3>
        <p className="text-muted-foreground">
          Hemos enviado un código de 6 dígitos a<br />
          <span className="font-medium text-foreground">{registerForm.email}</span>
        </p>
      </div>

      <form onSubmit={handleVerification} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="verificationCode">Código de Verificación</Label>
          <Input
            id="verificationCode"
            placeholder="123456"
            className="text-center text-2xl tracking-widest"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            maxLength={6}
            required
          />
        </div>

        <Button type="submit" className="w-full gradient-primary">
          Verificar Email
        </Button>

        <Button 
          type="button" 
          variant="ghost" 
          className="w-full"
          onClick={() => toast.success("Código reenviado")}
        >
          Reenviar código
        </Button>
      </form>
    </div>
  )

  const [paymentLoading, setPaymentLoading] = useState(false)

  const handlePayment = async () => {
    setPaymentLoading(true)

    try {
      toast.info("Preparando pago seguro...")

      // For demo purposes, simulate faster payment flow
      if (registerForm.invitationCode === "LUXURY100") {
        // VIP users get instant access
        toast.success("¡Acceso VIP activado instantáneamente!")
        setTimeout(() => {
          window.location.href = "/payment/success?session_id=demo_luxury_access"
        }, 1000)
        return
      }

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invitationCode: registerForm.invitationCode
        }),
        signal: AbortSignal.timeout(10000) // 10 second timeout
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const { url, error } = await response.json()

      if (error) {
        toast.error("Error al crear sesión de pago: " + error)
        return
      }

      if (url) {
        toast.success("Redirigiendo a Stripe...")
        window.location.href = url
      }
    } catch (error) {
      console.error('Payment error:', error)
      toast.error("Error al procesar el pago. Por favor intenta de nuevo.")
    } finally {
      setPaymentLoading(false)
    }
  }

  const renderPaymentStep = () => {
    const hasInvitationCode = registerForm.invitationCode.trim() !== ""
    const isVIP = registerForm.invitationCode === "LUXURY100"
    const hasDiscount = ["PREMIUM2024", "BETA50", "LUXURY100"].includes(registerForm.invitationCode)

    return (
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <CrownLogo size="lg" className="mx-auto text-primary" />
          <h3 className="text-xl font-semibold">
            {isVIP ? "¡Felicidades! Acceso VIP" : "Suscripción Premium"}
          </h3>
          <p className="text-muted-foreground">
            {hasInvitationCode ? (
              hasDiscount ? (
                <span>
                  Precio especial: <span className="line-through text-muted-foreground/60">$20/mes</span>{" "}
                  <span className="font-bold text-primary">
                    {isVIP ? "¡GRATIS primer mes!" :
                     registerForm.invitationCode === "PREMIUM2024" ? "$10/mes" :
                     "$15/mes"}
                  </span>
                </span>
              ) : (
                <span>Únete a empresas verificadas por <span className="font-bold text-primary">$20/mes</span></span>
              )
            ) : (
              <span>Únete a empresas verificadas por <span className="font-bold text-primary">$20/mes</span></span>
            )}
          </p>
          {hasInvitationCode && (
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
              <Shield className="h-3 w-3" />
              Código aplicado: {registerForm.invitationCode}
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 space-y-4">
          <h4 className="font-semibold text-lg">
            {isVIP ? "Beneficios VIP:" : "Beneficios Premium:"}
          </h4>
          <ul className="text-left space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              {hasInvitationCode ? "Verificación empresarial instantánea" : "Verificación empresarial completa"}
            </li>
            <li className="flex items-center gap-2">
              <CrownLogo size="sm" className="text-primary" />
              Acceso a deals exclusivos de lujo
            </li>
            <li className="flex items-center gap-2">
              <Building className="h-4 w-4 text-primary" />
              Networking con empresas verificadas
            </li>
            {isVIP && (
              <>
                <li className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  Acceso prioritario a subastas premium
                </li>
                <li className="flex items-center gap-2">
                  <CrownLogo size="sm" className="text-primary" />
                  Gestor de cuenta dedicado
                </li>
              </>
            )}
          </ul>
        </div>

        <Button
          className="w-full gradient-primary"
          onClick={handlePayment}
          disabled={paymentLoading}
        >
          {paymentLoading ? (
            "Procesando..."
          ) : (
            isVIP ? "Activar Acceso VIP Gratuito" :
            hasDiscount ? `Pagar ${registerForm.invitationCode === "PREMIUM2024" ? "$10" : "$15"}/mes con Stripe` :
            "Pagar $20/mes con Stripe"
          )}
        </Button>

        <p className="text-xs text-muted-foreground">
          Pago seguro procesado por Stripe. Cancela en cualquier momento.
          {hasInvitationCode && " Tu código de invitación será aplicado automáticamente."}
        </p>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-center">
            <CrownLogo size="sm" className="text-primary" />
            DEALSMARKET
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {step === "auth" && renderAuthStep()}
            {step === "verification" && renderVerificationStep()}
            {step === "payment" && renderPaymentStep()}
          </motion.div>
        </AnimatePresence>

        {step !== "auth" && (
          <Button 
            variant="ghost" 
            onClick={() => setStep("auth")}
            className="mt-4"
          >
            ← Volver
          </Button>
        )}
      </DialogContent>
    </Dialog>
  )
}
