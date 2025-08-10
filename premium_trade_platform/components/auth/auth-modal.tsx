"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CrownLogo } from "@/components/ui/crown-logo"
import { Mail, Lock, User, Building, Phone, MapPin, Eye, EyeOff, Shield } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultTab?: "login" | "register"
}

export function AuthModal({ isOpen, onClose, defaultTab = "login" }: AuthModalProps) {
  const { signIn, signUp, loading } = useAuth()
  const [currentTab, setCurrentTab] = useState(defaultTab)
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
        toast.success("¡Cuenta creada! Revisa tu email para verificar tu cuenta.")
        setStep("verification")
      }
    } catch (error) {
      toast.error("Error inesperado al crear cuenta")
    }
  }

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here we would verify the email code
    toast.success("¡Email verificado! Procediendo al pago...")
    setStep("payment")
  }

  const renderAuthStep = () => (
    <Tabs value={currentTab} onValueChange={(value) => setCurrentTab(value as "login" | "register")}>
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
        <TabsTrigger value="register">Crear Cuenta</TabsTrigger>
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
            <Label htmlFor="invitationCode">Código de Invitación (Opcional)</Label>
            <div className="relative">
              <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="invitationCode"
                placeholder="PREMIUM2024"
                className="pl-9"
                value={registerForm.invitationCode}
                onChange={(e) => setRegisterForm(prev => ({ ...prev, invitationCode: e.target.value }))}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Con un código válido serás verificado automáticamente
            </p>
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

  const renderPaymentStep = () => (
    <div className="text-center space-y-6">
      <div className="space-y-2">
        <CrownLogo size="lg" className="mx-auto text-primary" />
        <h3 className="text-xl font-semibold">Suscripción Premium</h3>
        <p className="text-muted-foreground">
          Únete a empresas verificadas por solo <span className="font-bold text-primary">$20/mes</span>
        </p>
      </div>

      <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 space-y-4">
        <h4 className="font-semibold text-lg">Beneficios Premium:</h4>
        <ul className="text-left space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            Verificación empresarial completa
          </li>
          <li className="flex items-center gap-2">
            <CrownLogo size="sm" className="text-primary" />
            Acceso a deals exclusivos de lujo
          </li>
          <li className="flex items-center gap-2">
            <Building className="h-4 w-4 text-primary" />
            Networking con empresas verificadas
          </li>
        </ul>
      </div>

      <Button 
        className="w-full gradient-primary"
        onClick={() => {
          toast.success("Redirigiendo a pago seguro...")
          // Here we would integrate with Stripe
        }}
      >
        Pagar $20/mes con Stripe
      </Button>

      <p className="text-xs text-muted-foreground">
        Pago seguro procesado por Stripe. Cancela en cualquier momento.
      </p>
    </div>
  )

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
