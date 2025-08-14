"use client"

import type React from "react"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock, Code } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/hooks/use-auth"
import { EnhancedLoading, LoginLoading, CodeLoading } from "@/components/ui/enhanced-loading"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode?: "register" | "login"
  onSwitchMode?: (mode: "register" | "login") => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [invitationCode, setInvitationCode] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "register" | "code">("code")

  const { signIn, signUp, signInWithCode, validateInvitationCode } = useAuth()
  const supabase = createClientComponentClient()

  const handleCodeLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!invitationCode.trim()) {
      toast.error("Please enter an invitation code")
      return
    }

    setLoading(true)

    try {
      const result = await signInWithCode(invitationCode)

      if (result.error) {
        toast.error(result.error.message)
        return
      }

      toast.success("Successfully logged in with invitation code!")
      onClose()
      resetForm()
    } catch (error: any) {
      toast.error(error.message || "Failed to log in with code")
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error("Please fill in all fields")
      return
    }

    setLoading(true)

    try {
      const result = await signIn(email, password)

      if (result.error) {
        toast.error(result.error.message || "Failed to sign in")
        return
      }

      toast.success("Successfully logged in!")
      onClose()
      resetForm()
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in")
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    setLoading(true)

    try {
      const result = await signUp(email, password, {
        full_name: email.split('@')[0],
        invitation_code: invitationCode
      })

      if (result.error) {
        toast.error(result.error.message)
        return
      }

      toast.success("Account created successfully!")
      onClose()
      resetForm()
    } catch (error: any) {
      toast.error(error.message || "Failed to create account")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setEmail("")
    setPassword("")
    setConfirmPassword("")
    setInvitationCode("")
    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  const getTitle = () => {
    switch (authMode) {
      case "code": return "Enter Invitation Code"
      case "login": return "Sign In"
      case "register": return "Create Account"
    }
  }

  const getSubmitHandler = () => {
    switch (authMode) {
      case "code": return handleCodeLogin
      case "login": return handleLogin
      case "register": return handleRegister
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-foreground">{getTitle()}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Mode Selector */}
          <div className="flex rounded-lg bg-muted p-1">
            <button
              type="button"
              onClick={() => setAuthMode("code")}
              className={`flex-1 rounded-md py-2 px-3 text-sm font-medium transition-all ${
                authMode === "code"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Code className="h-4 w-4 mx-auto mb-1" />
              Code
            </button>
            <button
              type="button"
              onClick={() => setAuthMode("login")}
              className={`flex-1 rounded-md py-2 px-3 text-sm font-medium transition-all ${
                authMode === "login"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setAuthMode("register")}
              className={`flex-1 rounded-md py-2 px-3 text-sm font-medium transition-all ${
                authMode === "register"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={getSubmitHandler()} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 bg-background border-border"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 bg-background border-border"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground">
                Confirmar Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 bg-background border-border"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 gradient-primary text-primary-foreground font-semibold hover:scale-105 transition-all duration-300"
              disabled={loading}
            >
              {loading ? "Creando cuenta..." : "Crear Cuenta"}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center">
            Al crear una cuenta, aceptas nuestros{" "}
            <a href="#" className="text-primary hover:underline">
              Términos de Servicio
            </a>{" "}
            y{" "}
            <a href="#" className="text-primary hover:underline">
              Política de Privacidad
            </a>
          </p>

          <p className="text-sm text-muted-foreground text-center bg-muted/30 p-3 rounded-lg">
            📧 Te enviaremos un código de confirmación a tu email. Una vez confirmado, podrás iniciar sesión cuando
            quieras.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
