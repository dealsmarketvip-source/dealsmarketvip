"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { User as SupabaseUser } from "@supabase/supabase-js"
import { createClient, auth, db } from "@/lib/supabase"
import { User } from "@/lib/types/database"

interface AuthContextType {
  user: SupabaseUser | null
  userProfile: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<{ error: any }>
  signInWithCode: (accessCode: string) => Promise<{ error: any, data?: any }>
  createAccountWithCode: (code: string, userData?: any) => Promise<{ error: any, data?: any }>
  validateInvitationCode: (code: string) => Promise<{ isValid: boolean, message: string, accountData?: any }>
  signOut: () => Promise<{ error: any }>
  updateProfile: (updates: Partial<User>) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [userProfile, setUserProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      
      if (session?.user) {
        // Fetch user profile
        const { data: profile } = await db.users.getByAuthId(session.user.id)
        setUserProfile(profile)
      }
      
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        
        if (session?.user) {
          // Fetch or create user profile
          let { data: profile, error } = await db.users.getByAuthId(session.user.id)
          
          if (error && error.code === 'PGRST116') {
            // User profile doesn't exist, create it
            const { data: newProfile } = await db.users.create({
              auth_id: session.user.id,
              email: session.user.email!,
              full_name: session.user.user_metadata?.full_name || '',
              subscription_type: 'free',
              subscription_status: 'inactive',
              verification_status: 'pending'
            })
            profile = newProfile
          }
          
          setUserProfile(profile)
        } else {
          setUserProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    const result = await auth.signIn(email, password)
    setLoading(false)
    return result
  }

  const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
    setLoading(true)

    // Si hay un código de invitación, validarlo primero
    if (metadata?.invitation_code) {
      const validation = await validateInvitationCode(metadata.invitation_code)
      if (!validation.isValid) {
        setLoading(false)
        return { error: new Error(validation.message) }
      }
    }

    const result = await auth.signUp(email, password, metadata?.invitation_code, metadata)
    setLoading(false)
    return result
  }

  const signInWithCode = async (accessCode: string) => {
    setLoading(true)

    try {
      // Validar el código primero
      const validation = await validateInvitationCode(accessCode)

      if (!validation.isValid) {
        setLoading(false)
        return { error: new Error(validation.message), data: null }
      }

      // Si el código es válido, simular acceso exitoso sin Supabase
      setLoading(false)
      return {
        data: {
          codeValid: true,
          accessCode: accessCode,
          message: validation.message,
          accountData: validation.accountData
        },
        error: null
      }
    } catch (error) {
      setLoading(false)
      return { error: new Error("Error al validar código"), data: null }
    }
  }

  const createAccountWithCode = async (code: string, userData?: any) => {
    setLoading(true)

    try {
      // Validar el código y obtener datos de la cuenta
      const validation = await validateInvitationCode(code)

      if (!validation.isValid || !validation.accountData) {
        setLoading(false)
        return { error: new Error(validation.message), data: null }
      }

      // Crear cuenta con los datos del código + datos adicionales del usuario
      const accountData = {
        ...validation.accountData,
        ...userData,
        invitation_code: code,
        created_with_code: true
      }

      // Simular creación exitosa de cuenta
      // En una implementación real, aquí crearías el usuario en Supabase
      console.log('Creating account with data:', accountData)

      setLoading(false)
      return {
        data: {
          success: true,
          accountData: accountData,
          message: `Cuenta creada para ${validation.accountData.company_name}`
        },
        error: null
      }
    } catch (error) {
      setLoading(false)
      return { error: new Error("Error al crear cuenta"), data: null }
    }
  }

  const validateInvitationCode = async (code: string): Promise<{ isValid: boolean, message: string, accountData?: any }> => {
    if (!code.trim()) {
      return { isValid: false, message: "Código requerido" }
    }

    try {
      // Códigos válidos con datos de cuenta asociados
      const validCodes = [
        {
          code: "PREMIUM2024",
          message: "✨ Código Premium válido - 50% descuento",
          accountData: {
            company_name: "Premium Trading Corp",
            company_type: "enterprise",
            subscription_type: "premium",
            discount: 50,
            verification_status: "verified",
            description: "Empresa de trading premium con acceso completo a la plataforma"
          }
        },
        {
          code: "LUXURY100",
          message: "👑 Código VIP válido - Primer mes GRATIS",
          accountData: {
            company_name: "Luxury Deals International",
            company_type: "vip",
            subscription_type: "vip",
            discount: 100,
            verification_status: "verified",
            description: "Acceso VIP con beneficios exclusivos y primer mes gratuito"
          }
        },
        {
          code: "BETA50",
          message: "🚀 Código Beta válido - 25% descuento",
          accountData: {
            company_name: "Beta Tester Company",
            company_type: "beta",
            subscription_type: "premium",
            discount: 25,
            verification_status: "pending",
            description: "Cuenta beta para pruebas de nuevas funcionalidades"
          }
        },
        {
          code: "ENTERPRISE",
          message: "💼 Código Enterprise válido - Acceso completo",
          accountData: {
            company_name: "Enterprise Solutions Ltd",
            company_type: "enterprise",
            subscription_type: "enterprise",
            discount: 0,
            verification_status: "verified",
            description: "Soluciones empresariales con acceso completo a todas las funciones"
          }
        },
        {
          code: "ASTER01",
          message: "🌟 Código Aster válido - Acceso completo",
          accountData: {
            company_name: "Aster Trading Group",
            company_type: "premium",
            subscription_type: "premium",
            discount: 30,
            verification_status: "verified",
            description: "Grupo de trading especializado en oportunidades de alto valor"
          }
        },
        {
          code: "DEMO123",
          message: "🔥 Código de demostración válido",
          accountData: {
            company_name: "Demo Company",
            company_type: "demo",
            subscription_type: "free",
            discount: 0,
            verification_status: "pending",
            description: "Cuenta de demostración para pruebas"
          }
        }
      ]

      const foundCode = validCodes.find(c => c.code === code.toUpperCase())

      if (foundCode) {
        return {
          isValid: true,
          message: foundCode.message,
          accountData: foundCode.accountData
        }
      }

      return { isValid: false, message: "❌ Código inválido o expirado" }
    } catch (error) {
      console.error('Error validating invitation code:', error)
      return { isValid: false, message: "❌ Error al validar código" }
    }
  }

  const signOut = async () => {
    setLoading(true)
    const result = await auth.signOut()
    setUser(null)
    setUserProfile(null)
    setLoading(false)
    return result
  }

  const updateProfile = async (updates: Partial<User>) => {
    if (!userProfile) return { error: new Error('No user profile found') }
    
    const { data, error } = await db.users.update(userProfile.id, updates)
    if (data) {
      setUserProfile(data)
    }
    return { error }
  }

  const value = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signInWithCode,
    validateInvitationCode,
    signOut,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
