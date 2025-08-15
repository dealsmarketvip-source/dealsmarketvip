"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { 
  getInstantAuth, 
  setInstantAuth, 
  clearInstantAuth,
  loginWithCodeInstant,
  signInInstant,
  signUpInstant,
  signOutInstant,
  validateCodeInstant
} from "@/lib/auth-instant"

interface AuthUser {
  id: string
  email: string
  full_name?: string
  company_name?: string
  phone?: string
  dni?: string
  country?: string
  city?: string
  address?: string
  profile_image_url?: string
  user_type?: 'individual' | 'business' | 'freelancer'
  subscription_type?: 'free' | 'premium'
  subscription_status?: 'active' | 'inactive' | 'pending' | 'cancelled'
  verification_status?: 'pending' | 'in_review' | 'verified' | 'rejected'
  verification_bypass?: boolean
  account_balance?: number
  stripe_customer_id?: string
  invitation_code?: string
  created_at?: string
  updated_at?: string
  profile_data?: Record<string, any>
  preferences?: Record<string, any>
  role?: string
}

interface AuthContextType {
  user: AuthUser | null
  userProfile: AuthUser | null
  loading: boolean
  isHydrated: boolean
  signIn: (email: string, password: string) => Promise<{ error?: any; data?: any }>
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<{ error?: any; data?: any }>
  signInWithCode: (accessCode: string) => Promise<{ error?: any; data?: any }>
  createAccountWithCode: (code: string, userData?: any) => Promise<{ error?: any; data?: any }>
  validateInvitationCode: (code: string) => Promise<{ isValid: boolean; message: string; accountData?: any }>
  sendLoginCode: (email: string) => Promise<{ error?: any; data?: any }>
  verifyLoginCode: (email: string, code: string) => Promise<{ error?: any; data?: any }>
  signOut: () => Promise<{ error?: any }>
  updateProfile: (updates: any) => Promise<{ error?: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [userProfile, setUserProfile] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // Mark as hydrated first
    setIsHydrated(true)

    // Check for existing auth
    const existingAuth = getInstantAuth()
    if (existingAuth) {
      setUser(existingAuth)
      setUserProfile(existingAuth)
    }
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    // No loading state for instant auth
    try {
      const result = signInInstant(email, password)

      if (result.success) {
        setUser(result.user)
        setUserProfile(result.user)
        return { data: result.user, error: null }
      }

      return { error: { message: 'Login failed' }, data: null }
    } catch (error: any) {
      return { error: { message: error.message || 'Login failed' }, data: null }
    }
  }

  const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
    // No loading state for instant auth
    try {
      const result = signUpInstant(email, password, metadata)

      if (result.success) {
        setUser(result.user)
        setUserProfile(result.user)
        return { data: result.user, error: null }
      }

      return { error: { message: 'Sign up failed' }, data: null }
    } catch (error: any) {
      return { error: { message: error.message || 'Sign up failed' }, data: null }
    }
  }

  const signInWithCode = async (accessCode: string) => {
    // Instant code authentication
    try {
      const result = await loginWithCodeInstant(accessCode)

      if (result.success) {
        setUser(result.user)
        setUserProfile(result.user)

        // Redirect immediately
        setTimeout(() => {
          window.location.href = '/marketplace'
        }, 500) // Small delay to ensure state is updated

        return {
          data: {
            success: true,
            user: result.user,
            profile: result.user,
            message: result.message
          },
          error: null
        }
      }

      return { error: new Error(result.error), data: null }
    } catch (error: any) {
      return { error: new Error(error.message || 'Code login failed'), data: null }
    }
  }

  const createAccountWithCode = async (code: string, userData?: any) => {
    try {
      const validation = await validateCodeInstant(code)

      if (!validation.isValid || !validation.accountData) {
        return { error: new Error(validation.message), data: null }
      }

      // Create account with code data + user data
      const accountData = {
        ...validation.accountData,
        ...userData,
        invitation_code: code,
        created_with_code: true
      }

      // For instant auth, we simulate account creation
      const newUser = {
        id: `user_${Date.now()}`,
        email: accountData.email || userData?.email || '',
        full_name: accountData.company_name || userData?.full_name || '',
        company_name: accountData.company_name,
        subscription_type: 'premium',
        verification_status: 'verified',
        invitation_code: code,
        ...accountData
      }

      setUser(newUser)
      setUserProfile(newUser)
      setInstantAuth(newUser)

      return {
        data: {
          success: true,
          accountData: newUser,
          message: `Cuenta creada para ${accountData.company_name}`
        },
        error: null
      }
    } catch (error: any) {
      return { error: new Error('Error al crear cuenta'), data: null }
    }
  }

  const validateInvitationCode = async (code: string) => {
    return validateCodeInstant(code)
  }

  const sendLoginCode = async (email: string) => {
    // For instant auth, simulate sending code
    return { data: { success: true, message: 'Code sent' }, error: null }
  }

  const verifyLoginCode = async (email: string, code: string) => {
    // For instant auth, simulate verification
    const mockUser = {
      id: `user_${Date.now()}`,
      email,
      full_name: 'Test User',
      subscription_type: 'free' as const,
      verification_status: 'verified' as const
    }

    setUser(mockUser)
    setUserProfile(mockUser)
    setInstantAuth(mockUser)

    return { data: { success: true, user: mockUser }, error: null }
  }

  const signOut = async () => {
    // Instant sign out
    try {
      signOutInstant()
      setUser(null)
      setUserProfile(null)
      return { error: null }
    } catch (error: any) {
      return { error: { message: error.message || 'Sign out failed' } }
    }
  }

  const updateProfile = async (updates: any) => {
    if (!user) return { error: new Error('No user found') }
    
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    setUserProfile(updatedUser)
    setInstantAuth(updatedUser)
    
    return { error: null }
  }

  const value = {
    user,
    userProfile,
    loading,
    isHydrated,
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
