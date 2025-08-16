

"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Loader2, Building2, ExternalLink } from "lucide-react"

const companySchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  country: z.string().min(1, "Please select a country"),
  registrationNumber: z.string().optional(),
  licenseNumber: z.string().optional(),
  linkedinUrl: z.string().url("Please enter a valid LinkedIn URL").optional().or(z.literal("")),
})

type CompanyFormData = z.infer<typeof companySchema>

const countries = [
  "United Kingdom", "Germany", "France", "Italy", "Spain", "Netherlands",
  "Switzerland", "Austria", "Belgium", "Sweden", "Norway", "Denmark",
  "UAE", "Saudi Arabia", "Qatar", "Kuwait", "Bahrain", "Oman",
  "Turkey", "Israel", "Jordan", "Lebanon", "Egypt"
]

interface SettingsFormProps {
  user: {
    id: string
    company?: {
      id: string
      name: string
      country: string
      registryNumber?: string | null
      licenseNumber?: string | null
      linkedinUrl?: string | null
      status: string
    }
  }
}

export function SettingsForm({ user }: SettingsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: user.company?.name || "",
      country: user.company?.country || "",
      registrationNumber: user.company?.registryNumber || "",
      licenseNumber: user.company?.licenseNumber || "",
      linkedinUrl: user.company?.linkedinUrl || "",
    }
  })

  const onSubmit = async (data: CompanyFormData) => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch("/api/company/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to update company")
      }

      toast.success("Company information updated successfully!")
    } catch (error) {
      toast.error("Failed to update company information. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return "success"
      case "PENDING":
        return "warning"
      case "REJECTED":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="h-5 w-5" />
            <span>Company Information</span>
          </CardTitle>
          {user.company?.status && (
            <Badge variant={getStatusColor(user.company.status)}>
              {user.company.status}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Company Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name *</Label>
              <Input
                id="name"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Country *</Label>
                <Select 
                  value={watch("country")}
                  onValueChange={(value) => setValue("country", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.country && (
                  <p className="text-sm text-red-500">{errors.country.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="registrationNumber">Registration Number</Label>
                <Input
                  id="registrationNumber"
                  placeholder="Company registration number"
                  {...register("registrationNumber")}
                />
                {errors.registrationNumber && (
                  <p className="text-sm text-red-500">{errors.registrationNumber.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="licenseNumber">License Number</Label>
              <Input
                id="licenseNumber"
                placeholder="Business license number (if applicable)"
                {...register("licenseNumber")}
              />
              {errors.licenseNumber && (
                <p className="text-sm text-red-500">{errors.licenseNumber.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedinUrl">LinkedIn Company Profile</Label>
              <Input
                id="linkedinUrl"
                type="url"
                placeholder="https://linkedin.com/company/yourcompany"
                {...register("linkedinUrl")}
              />
              {errors.linkedinUrl && (
                <p className="text-sm text-red-500">{errors.linkedinUrl.message}</p>
              )}
            </div>
          </div>

          {/* Verification Status */}
          {user.company?.status && (
            <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium">Verification Status</h3>
              <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Current Status</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {user.company.status === "VERIFIED" && "Your company has been verified and approved."}
                      {user.company.status === "PENDING" && "Your company verification is under review."}
                      {user.company.status === "REJECTED" && "Your company verification was rejected. Please contact support."}
                    </p>
                  </div>
                  <Badge variant={getStatusColor(user.company.status)}>
                    {user.company.status}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end pt-6">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
