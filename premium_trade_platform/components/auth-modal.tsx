"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock, Code } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/hooks/use-auth-instant"
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

  const { signIn, signUp, signInWithCode } = useAuth()

  const handleCodeLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!invitationCode.trim()) {
      toast.error("Please enter an invitation code")
      return
    }

    // Show loading briefly for visual feedback
    setLoading(true)
    toast.success("Logging in...")

    try {
      const result = await signInWithCode(invitationCode)

      if (result.error) {
        toast.error(result.error.message)
        setLoading(false)
        return
      }

      // Instant success - no waiting
      toast.success("Login successful! Redirecting...")
      onClose()
      resetForm()
      setLoading(false)

      // Note: signInWithCode already handles redirect
    } catch (error: any) {
      toast.error(error.message || "Failed to log in with code")
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
            {/* Invitation Code Field */}
            {authMode === "code" && (
              <div className="space-y-2">
                <Label htmlFor="invitationCode" className="text-foreground">
                  Invitation Code
                </Label>
                <div className="relative">
                  <Code className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="invitationCode"
                    type="text"
                    placeholder="Enter invitation code (e.g., ASTERO1)"
                    value={invitationCode}
                    onChange={(e) => setInvitationCode(e.target.value.toUpperCase())}
                    className="pl-11 bg-background border-input h-12"
                    disabled={loading}
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Try ASTERO1 or BETA50 for demo access
                </p>
              </div>
            )}

            {/* Email Field - for login and register */}
            {(authMode === "login" || authMode === "register") && (
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 bg-background border-border"
                    disabled={loading}
                    required
                  />
                </div>
              </div>
            )}

            {/* Password Field - for login and register */}
            {(authMode === "login" || authMode === "register") && (
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">
                  Password
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
                    disabled={loading}
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
            )}

            {/* Confirm Password Field - only for register */}
            {authMode === "register" && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-foreground">
                  Confirm Password
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
                    disabled={loading}
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
            )}

            {/* Invitation Code for Register */}
            {authMode === "register" && (
              <div className="space-y-2">
                <Label htmlFor="registerCode" className="text-foreground">
                  Invitation Code (Optional)
                </Label>
                <div className="relative">
                  <Code className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="registerCode"
                    type="text"
                    placeholder="Enter invitation code for premium access"
                    value={invitationCode}
                    onChange={(e) => setInvitationCode(e.target.value.toUpperCase())}
                    className="pl-10 h-12 bg-background border-border"
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  {authMode === "code" && <CodeLoading />}
                  {authMode === "login" && <LoginLoading />}
                  {authMode === "register" && <EnhancedLoading type="auth" size="sm" />}
                </div>
              ) : (
                <>
                  {authMode === "code" && "Login with Code"}
                  {authMode === "login" && "Sign In"}
                  {authMode === "register" && "Create Account"}
                </>
              )}
            </Button>
          </form>

          {/* Help Text */}
          <div className="text-center space-y-2">
            {authMode === "code" && (
              <p className="text-sm text-muted-foreground">
                Use ASTERO1 or BETA50 for immediate access with full functionality
              </p>
            )}
            {authMode === "login" && (
              <p className="text-sm text-muted-foreground">
                Don't have an account? Try the Code tab for demo access
              </p>
            )}
            {authMode === "register" && (
              <p className="text-sm text-muted-foreground">
                Already have an account? Switch to Login tab
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
