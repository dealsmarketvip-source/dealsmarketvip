
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Shield, CheckCircle, Loader2 } from "lucide-react"
import { COUNTRIES } from "@/lib/constants"
import { toast } from "sonner"

export default function ApplyPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    companyName: "",
    country: "",
    registryNumber: "",
    licenseNumber: "",
    linkedinUrl: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Application submitted successfully!")
        router.push("/application-submitted")
      } else {
        toast.error(data.error || "Failed to submit application")
      }
    } catch (error) {
      console.error("Application error:", error)
      toast.error("Failed to submit application")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50 to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-lg bg-yellow-500">
            <Building2 className="h-8 w-8 text-black" />
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Apply for Membership
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Join the exclusive network of verified premium enterprises
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Benefits Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-yellow-500" />
                  <span>Verification Process</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Company Documentation</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Registry and license verification</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Business Profile Review</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">LinkedIn and company assessment</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Manual Approval</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Personal review by our team</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Member Benefits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>✓ Access to 500+ verified companies</p>
                <p>✓ Post up to 5 active listings</p>
                <p>✓ Direct contact with decision makers</p>
                <p>✓ Exclusive deal opportunities</p>
                <p>✓ Private network security</p>
                <p>✓ Premium support</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Application Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>
                  Provide accurate information for verification. All fields marked with * are required.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      minLength={8}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="mt-1"
                    />
                    <p className="mt-1 text-xs text-gray-500">Minimum 8 characters</p>
                  </div>

                  <div>
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={(e) => handleInputChange("companyName", e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <Select 
                      value={formData.country || ""}
                      onValueChange={(value) => handleInputChange("country", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRIES.map((country) => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="registryNumber">Company Registry Number</Label>
                      <Input
                        id="registryNumber"
                        type="text"
                        value={formData.registryNumber}
                        onChange={(e) => handleInputChange("registryNumber", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="licenseNumber">Business License Number</Label>
                      <Input
                        id="licenseNumber"
                        type="text"
                        value={formData.licenseNumber}
                        onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="linkedinUrl">Company LinkedIn URL</Label>
                    <Input
                      id="linkedinUrl"
                      type="url"
                      placeholder="https://linkedin.com/company/your-company"
                      value={formData.linkedinUrl}
                      onChange={(e) => handleInputChange("linkedinUrl", e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div className="rounded-md bg-yellow-50 p-4 dark:bg-yellow-950/20">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      <strong>Please note:</strong> Your application will be reviewed manually by our team. 
                      We will contact you within 2-3 business days with the verification result.
                    </p>
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
                        Submitting Application...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
