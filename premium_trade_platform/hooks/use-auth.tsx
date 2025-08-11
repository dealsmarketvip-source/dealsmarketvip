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
  validateInvitationCode: (code: string) => Promise<{ isValid: boolean, message: string }>
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
    const result = await auth.signInWithCode(accessCode)
    setLoading(false)
    return result
  }

  const validateInvitationCode = async (code: string): Promise<{ isValid: boolean, message: string }> => {
    if (!code.trim()) {
      return { isValid: false, message: "Código requerido" }
    }

    try {
      // Códigos válidos predefinidos para demo/desarrollo
      const validCodes = [
        { code: "PREMIUM2024", message: "✨ Código Premium válido - 50% descuento" },
        { code: "LUXURY100", message: "👑 Código VIP válido - Primer mes GRATIS" },
        { code: "BETA50", message: "🚀 Código Beta válido - 25% descuento" },
        { code: "ENTERPRISE", message: "💼 Código Enterprise válido - Acceso completo" },
        { code: "INVITED2024", message: "🎯 Código de invitación válido" },
        { code: "SPECIAL", message: "⭐ Código especial válido" }
      ]

      const foundCode = validCodes.find(c => c.code === code.toUpperCase())

      if (foundCode) {
        return { isValid: true, message: foundCode.message }
      }

      // Intentar validar con la base de datos si Supabase está configurado
      try {
        const { data, error } = await db.invitationCodes.validate(code)
        if (data && !error) {
          return { isValid: true, message: "✅ Código de invitación válido" }
        }
      } catch (dbError) {
        // Si la base de datos no está configurada, usar solo códigos predefinidos
        console.warn('Database validation failed, using predefined codes only')
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
