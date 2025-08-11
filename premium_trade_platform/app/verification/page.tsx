"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { 
  Upload, 
  FileText, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  User,
  Building,
  Briefcase,
  Camera
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase"
import { toast } from "sonner"
import { User as UserType, VerificationDocument } from "@/lib/types/database"

interface VerificationFormData {
  user_type: 'individual' | 'business' | 'freelancer'
  full_name: string
  dni: string
  phone: string
  address: string
  city: string
  country: string
  business_name?: string
  business_registration?: string
  tax_id?: string
  documents: {
    type: 'dni' | 'passport' | 'business_license' | 'tax_certificate' | 'bank_statement'
    file: File | null
    uploaded?: boolean
  }[]
}

const VERIFICATION_BYPASS_CODE = "SKIP_VERIFICATION"

export default function VerificationPage() {
  const { user, userProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [bypassCode, setBypassCode] = useState("")
  const [documents, setDocuments] = useState<VerificationDocument[]>([])
  const [formData, setFormData] = useState<VerificationFormData>({
    user_type: 'individual',
    full_name: '',
    dni: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    documents: [
      { type: 'dni', file: null },
      { type: 'bank_statement', file: null }
    ]
  })

  useEffect(() => {
    if (userProfile) {
      setFormData(prev => ({
        ...prev,
        full_name: userProfile.full_name || '',
        dni: userProfile.dni || '',
        phone: userProfile.phone || '',
        address: userProfile.address || '',
        city: userProfile.city || '',
        country: userProfile.country || '',
        user_type: userProfile.user_type
      }))
      fetchVerificationDocuments()
    }
  }, [userProfile])

  const fetchVerificationDocuments = async () => {
    if (!userProfile) return

    try {
      const supabase = createClient()
      const { data } = await supabase
        .from('verification_documents')
        .select('*')
        .eq('user_id', userProfile.id)
        .order('uploaded_at', { ascending: false })

      if (data) {
        setDocuments(data)
      }
    } catch (error) {
      console.error('Error fetching documents:', error)
    }
  }

  const handleBypassVerification = async () => {
    if (!bypassCode || !userProfile) return

    try {
      setLoading(true)
      const supabase = createClient()

      // Use the bypass code
      const { data: result } = await supabase
        .rpc('use_invitation_code', {
          code_input: bypassCode,
          user_id_input: userProfile.id
        })

      if (result?.success && result?.verification_bypass) {
        // Update user verification status
        await supabase
          .from('users')
          .update({ 
            verification_status: 'verified',
            verification_bypass: true 
          })
          .eq('id', userProfile.id)

        toast.success("Verificación saltada correctamente")
        window.location.reload()
      } else {
        toast.error("Código de bypass inválido")
      }
    } catch (error) {
      console.error('Error bypassing verification:', error)
      toast.error("Error al procesar el código")
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (index: number, file: File) => {
    if (!userProfile) return

    try {
      setUploadProgress(0)
      const supabase = createClient()

      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${userProfile.id}/${formData.documents[index].type}_${Date.now()}.${fileExt}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('verification-documents')
        .upload(fileName, file, {
          onUploadProgress: (progress) => {
            setUploadProgress((progress.loaded / progress.total) * 100)
          }
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('verification-documents')
        .getPublicUrl(fileName)

      // Save document record to database
      const { error: dbError } = await supabase
        .from('verification_documents')
        .insert({
          user_id: userProfile.id,
          document_type: formData.documents[index].type,
          document_url: publicUrl,
          document_name: file.name,
          file_size: file.size,
          status: 'pending'
        })

      if (dbError) throw dbError

      // Update form state
      const newDocuments = [...formData.documents]
      newDocuments[index] = { ...newDocuments[index], file, uploaded: true }
      setFormData(prev => ({ ...prev, documents: newDocuments }))

      toast.success("Documento subido correctamente")
      fetchVerificationDocuments()
    } catch (error) {
      console.error('Error uploading file:', error)
      toast.error("Error al subir el documento")
    } finally {
      setUploadProgress(0)
    }
  }

  const handleUserTypeChange = (type: 'individual' | 'business' | 'freelancer') => {
    let requiredDocuments = [
      { type: 'dni' as const, file: null },
      { type: 'bank_statement' as const, file: null }
    ]

    if (type === 'business') {
      requiredDocuments.push(
        { type: 'business_license' as const, file: null },
        { type: 'tax_certificate' as const, file: null }
      )
    } else if (type === 'freelancer') {
      requiredDocuments.push(
        { type: 'tax_certificate' as const, file: null }
      )
    }

    setFormData(prev => ({
      ...prev,
      user_type: type,
      documents: requiredDocuments
    }))
  }

  const handleSubmitVerification = async () => {
    if (!userProfile) return

    try {
      setLoading(true)
      const supabase = createClient()

      // Update user profile
      const { error: updateError } = await supabase
        .from('users')
        .update({
          full_name: formData.full_name,
          dni: formData.dni,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          country: formData.country,
          user_type: formData.user_type,
          verification_status: 'in_review'
        })
        .eq('id', userProfile.id)

      if (updateError) throw updateError

      toast.success("Información enviada para revisión")
    } catch (error) {
      console.error('Error submitting verification:', error)
      toast.error("Error al enviar la verificación")
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-green-400" />
      case 'in_review':
        return <Clock className="h-5 w-5 text-yellow-400" />
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-400" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'verified':
        return 'Verificado'
      case 'in_review':
        return 'En Revisión'
      case 'rejected':
        return 'Rechazado'
      default:
        return 'Pendiente'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'in_review':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <Card className="max-w-md mx-auto bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <p className="text-center text-gray-300">
              Debes iniciar sesión para acceder a la verificación
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Verificación de Identidad
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Completa tu verificación para acceder a todas las funciones del marketplace
            y generar confianza con otros usuarios.
          </p>
        </div>

        {/* Current Status */}
        {userProfile && (
          <Card className="mb-6 bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                {getStatusIcon(userProfile.verification_status)}
                Estado de Verificación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Badge className={getStatusColor(userProfile.verification_status)}>
                    {getStatusText(userProfile.verification_status)}
                  </Badge>
                  {userProfile.verification_bypass && (
                    <Badge className="ml-2 bg-purple-500/20 text-purple-400 border-purple-500/30">
                      Verificación Saltada
                    </Badge>
                  )}
                </div>
                {userProfile.verification_status === 'verified' && (
                  <Shield className="h-8 w-8 text-green-400" />
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bypass Code Section */}
        {userProfile?.verification_status !== 'verified' && (
          <Card className="mb-6 bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Código de Salto de Verificación</CardTitle>
              <CardDescription>
                Si tienes un código especial, puedes saltarte el proceso de verificación
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input
                  placeholder="Ingresa tu código de salto"
                  value={bypassCode}
                  onChange={(e) => setBypassCode(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <Button 
                  onClick={handleBypassVerification}
                  disabled={loading || !bypassCode}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Verificar Código
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Verification Form */}
        {userProfile?.verification_status !== 'verified' && (
          <div className="space-y-6">
            {/* User Type Selection */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Tipo de Usuario</CardTitle>
                <CardDescription>
                  Selecciona el tipo de cuenta que mejor describa tu actividad
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { type: 'individual', icon: User, label: 'Individual', desc: 'Persona física' },
                    { type: 'freelancer', icon: Briefcase, label: 'Autónomo', desc: 'Trabajador independiente' },
                    { type: 'business', icon: Building, label: 'Empresa', desc: 'Sociedad o corporación' }
                  ].map(({ type, icon: Icon, label, desc }) => (
                    <div
                      key={type}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.user_type === type
                          ? 'border-primary bg-primary/10'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                      onClick={() => handleUserTypeChange(type as any)}
                    >
                      <Icon className="h-8 w-8 text-primary mb-2" />
                      <div className="text-white font-medium">{label}</div>
                      <div className="text-gray-400 text-sm">{desc}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Información Personal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="full_name" className="text-gray-300">Nombre Completo</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Tu nombre completo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dni" className="text-gray-300">DNI/CIF</Label>
                    <Input
                      id="dni"
                      value={formData.dni}
                      onChange={(e) => setFormData(prev => ({ ...prev, dni: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="12345678A"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone" className="text-gray-300">Teléfono</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="+34 600 000 000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country" className="text-gray-300">País</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="España"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address" className="text-gray-300">Dirección</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Tu dirección completa"
                  />
                </div>

                {formData.user_type === 'business' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="business_name" className="text-gray-300">Nombre de la Empresa</Label>
                      <Input
                        id="business_name"
                        value={formData.business_name || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, business_name: e.target.value }))}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="Mi Empresa S.L."
                      />
                    </div>
                    <div>
                      <Label htmlFor="tax_id" className="text-gray-300">Número Fiscal</Label>
                      <Input
                        id="tax_id"
                        value={formData.tax_id || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, tax_id: e.target.value }))}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="ESA12345678"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Document Upload */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Documentos Requeridos</CardTitle>
                <CardDescription>
                  Sube los documentos necesarios para completar tu verificación
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.documents.map((doc, index) => (
                  <div key={index} className="border border-gray-600 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <span className="text-white font-medium">
                          {doc.type === 'dni' && 'DNI/Pasaporte'}
                          {doc.type === 'business_license' && 'Licencia de Negocio'}
                          {doc.type === 'tax_certificate' && 'Certificado Fiscal'}
                          {doc.type === 'bank_statement' && 'Extracto Bancario'}
                        </span>
                      </div>
                      {doc.uploaded && (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          Subido
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleFileUpload(index, file)
                        }}
                        className="hidden"
                        id={`file-${index}`}
                      />
                      <label
                        htmlFor={`file-${index}`}
                        className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-primary transition-colors"
                      >
                        <Upload className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-400">
                          {doc.file ? doc.file.name : 'Seleccionar archivo'}
                        </span>
                      </label>
                      
                      {uploadProgress > 0 && uploadProgress < 100 && (
                        <Progress value={uploadProgress} className="w-full" />
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Uploaded Documents Status */}
            {documents.length > 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Estado de Documentos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-primary" />
                          <div>
                            <div className="text-white font-medium">{doc.document_name}</div>
                            <div className="text-gray-400 text-sm">
                              Subido el {new Date(doc.uploaded_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <Badge className={getStatusColor(doc.status)}>
                          {getStatusText(doc.status)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Submit Button */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="pt-6">
                <Button 
                  onClick={handleSubmitVerification}
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90"
                  size="lg"
                >
                  {loading ? 'Enviando...' : 'Enviar para Verificación'}
                </Button>
                <p className="text-center text-gray-400 text-sm mt-3">
                  Tu información será revisada en un plazo de 24-48 horas
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Verified Status */}
        {userProfile?.verification_status === 'verified' && (
          <Card className="bg-green-500/10 border-green-500/30">
            <CardContent className="pt-6 text-center">
              <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">¡Verificación Completada!</h2>
              <p className="text-green-300 mb-4">
                Tu cuenta ha sido verificada correctamente. Ya puedes acceder a todas las funciones premium.
              </p>
              <Button 
                onClick={() => window.location.href = '/marketplace'}
                className="bg-primary hover:bg-primary/90"
              >
                Ir al Marketplace
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
