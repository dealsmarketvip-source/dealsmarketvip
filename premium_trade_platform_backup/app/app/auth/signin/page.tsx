
"use client"

import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Loader2, AlertCircle } from "lucide-react"
import { toast } from "sonner"

export default function SignInPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password")
        toast.error("Invalid email or password")
      } else {
        // Get session to check user role
        const session = await getSession()
        
        if (session?.user?.role === "VERIFIED_COMPANY") {
          router.push("/dashboard")
          toast.success("Welcome back!")
        } else if (session?.user?.role === "PENDING") {
          router.push("/application-status")
          toast.info("Your application is still under review")
        } else if (session?.user?.role === "REJECTED") {
          toast.error("Your application was not approved")
        } else if (session?.user?.role === "ADMIN") {
          router.push("/admin")
          toast.success("Welcome back, Admin!")
        } else {
          router.push("/")
        }
      }
    } catch (error) {
      console.error("Sign in error:", error)
      setError("Something went wrong. Please try again.")
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError("") // Clear error when user starts typing
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50 to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-lg bg-yellow-500">
              <Building2 className="h-8 w-8 text-black" />
            </div>
            <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Sign in to your account
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Access your premium business network
            </p>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Welcome back</CardTitle>
              <CardDescription>
                Sign in with your verified company credentials
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mb-4 rounded-md bg-red-50 p-3 dark:bg-red-950/20"
                >
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="mt-1"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="mt-1"
                    disabled={isLoading}
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Don't have an account?{" "}
                  <Link 
                    href="/apply" 
                    className="font-medium text-yellow-600 hover:text-yellow-500 dark:text-yellow-400"
                  >
                    Apply for membership
                  </Link>
                </p>
              </div>

              <div className="mt-4 rounded-md bg-yellow-50 p-3 dark:bg-yellow-950/20">
                <p className="text-xs text-yellow-800 dark:text-yellow-200">
                  <strong>Note:</strong> Only verified company accounts can access the platform. 
                  If you haven't applied yet, please submit your application for review.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
