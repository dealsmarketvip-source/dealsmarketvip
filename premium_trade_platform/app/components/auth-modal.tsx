"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, Mail, Lock, Crown, Shield } from "lucide-react"
import { toast } from "sonner"
import { auth } from "@/lib/supabase"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [accessCode, setAccessCode] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("register")

  const supabase = createClientComponentClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error("Passwords don't match")
      return
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    setLoading(true)

    try {
      const { data, error } = await auth.signUp(email, password, undefined, {
        full_name: "",
        company_name: ""
      })

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success("Account created! Check your email to confirm your account.")
      onClose()
      resetForm()
      if (onSuccess) onSuccess()
    } catch (error) {
      toast.error("Error creating account")
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await auth.signIn(email, password)

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success("Successfully signed in!")
      onClose()
      resetForm()
      if (onSuccess) onSuccess()
    } catch (error) {
      toast.error("Error signing in")
    } finally {
      setLoading(false)
    }
  }

  const handleCodeAccess = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!accessCode.trim()) {
      toast.error("Please enter an access code")
      return
    }

    setLoading(true)

    try {
      const { data, error } = await auth.signInWithCode(accessCode.trim())

      if (error) {
        toast.error(error.message || "Invalid access code")
        return
      }

      toast.success("Access granted! Welcome to DealsMarket.")
      onClose()
      resetForm()
      if (onSuccess) onSuccess()
    } catch (error) {
      toast.error("Error processing access code")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setEmail("")
    setPassword("")
    setConfirmPassword("")
    setAccessCode("")
    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-foreground">
            Join DealsMarket
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="register" className="text-xs">
              <Crown className="w-3 h-3 mr-1" />
              Register
            </TabsTrigger>
            <TabsTrigger value="login" className="text-xs">
              <Mail className="w-3 h-3 mr-1" />
              Login
            </TabsTrigger>
            <TabsTrigger value="code" className="text-xs">
              <Shield className="w-3 h-3 mr-1" />
              Code
            </TabsTrigger>
          </TabsList>

          <TabsContent value="register" className="space-y-4">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12"
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
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10 h-12"
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
                className="w-full h-12 gradient-primary"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Account ($20/month)"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="your@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12"
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

              <Button
                type="submit"
                className="w-full h-12 gradient-primary"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="code" className="space-y-4">
            <form onSubmit={handleCodeAccess} className="space-y-4">
              <div className="text-center space-y-2 mb-4">
                <Shield className="h-12 w-12 text-green-500 mx-auto" />
                <div className="text-lg font-semibold">Instant Access</div>
                <div className="text-sm text-muted-foreground">
                  Enter your invitation code for immediate premium access
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="access-code">Access Code</Label>
                <Input
                  id="access-code"
                  placeholder="XXXXX-XXXXX-XXXXX"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                  className="text-center font-mono text-lg h-12"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 gradient-primary"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Access Marketplace"}
              </Button>

              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                <div className="text-xs text-green-700 dark:text-green-300 text-center">
                  ✓ No email verification required<br />
                  ✓ Instant premium access<br />
                  ✓ Pre-linked company profile
                </div>
              </div>
            </form>
          </TabsContent>
        </Tabs>

        <p className="text-xs text-muted-foreground text-center">
          By joining, you agree to our{" "}
          <a href="#" className="text-primary hover:underline">Terms</a>{" "}
          and{" "}
          <a href="#" className="text-primary hover:underline">Privacy Policy</a>
        </p>
      </DialogContent>
    </Dialog>
  )
}
