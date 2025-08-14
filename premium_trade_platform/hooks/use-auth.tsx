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
  sendLoginCode: (email: string) => Promise<{ error: any, data?: any }>
  verifyLoginCode: (email: string, code: string) => Promise<{ error: any, data?: any }>
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
    // Get initial session with timeout for better performance
    const getInitialSession = async () => {
      try {
        // Add timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Auth timeout')), 5000)
        )

        const sessionPromise = supabase.auth.getSession()

        const { data: { session } } = await Promise.race([sessionPromise, timeoutPromise]) as any
        setUser(session?.user ?? null)

        if (session?.user) {
          // Fetch user profile asynchronously without blocking
          db.users.getByAuthId(session.user.id).then(({ data: profile }) => {
            setUserProfile(profile)
          }).catch(error => {
            console.warn('Failed to load user profile:', error)
            setUserProfile(null)
          })
        }
      } catch (error) {
        console.warn('Auth initialization failed:', error)
        setUser(null)
        setUserProfile(null)
      } finally {
        setLoading(false)
      }
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
      // Import the working auth module
      const { validateAndSignInWithCode } = await import('@/lib/auth-simple')

      const result = await validateAndSignInWithCode(accessCode.toUpperCase())

      if (!result.success) {
        setLoading(false)
        return { error: new Error(result.error), data: null }
      }

      // If successful, set the user state
      if (result.data) {
        setUser(result.data.user)
        setUserProfile(result.data.profile)
      }

      setLoading(false)
      return {
        data: {
          success: true,
          user: result.data?.user,
          profile: result.data?.profile,
          message: "Successfully logged in with code"
        },
        error: null
      }
    } catch (error: any) {
      setLoading(false)
      return { error: new Error(error.message || "Error logging in with code"), data: null }
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
      return { isValid: false, message: "Code required" }
    }

    try {
      // Use the working validation
      const { validateInvitationCodeOnly } = await import('@/lib/auth-simple')
      return await validateInvitationCodeOnly(code.toUpperCase())
    } catch (error) {
      console.error('Error validating invitation code:', error)
      return { isValid: false, message: "❌ Error validating code" }
    }
  }

  const sendLoginCode = async (email: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/send-login-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar código')
      }

      setLoading(false)
      return { data, error: null }
    } catch (error: any) {
      setLoading(false)
      return { data: null, error }
    }
  }

  const verifyLoginCode = async (email: string, code: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/verify-login-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al verificar código')
      }

      // If verification successful, set user state
      if (data.success && data.user) {
        // Create a mock Supabase user object
        const mockUser: SupabaseUser = {
          id: data.user.id,
          email: data.user.email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          aud: 'authenticated',
          app_metadata: {},
          user_metadata: {
            full_name: data.user.full_name
          },
          role: 'authenticated',
          email_confirmed_at: new Date().toISOString(),
          phone_confirmed_at: null,
          confirmation_sent_at: null,
          confirmed_at: new Date().toISOString(),
          recovery_sent_at: null,
          last_sign_in_at: new Date().toISOString(),
          phone: null,
          factors: []
        }

        setUser(mockUser)
        setUserProfile(data.user)
      }

      setLoading(false)
      return { data, error: null }
    } catch (error: any) {
      setLoading(false)
      return { data: null, error }
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
    createAccountWithCode,
    validateInvitationCode,
    sendLoginCode,
    verifyLoginCode,
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
