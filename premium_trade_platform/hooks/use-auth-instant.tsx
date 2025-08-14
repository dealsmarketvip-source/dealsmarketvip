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
}

interface AuthContextType {
  user: AuthUser | null
  userProfile: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: any; data?: any }>
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<{ error?: any; data?: any }>
  signInWithCode: (accessCode: string) => Promise<{ error?: any; data?: any }>
  validateInvitationCode: (code: string) => Promise<{ isValid: boolean; message: string; accountData?: any }>
  signOut: () => Promise<{ error?: any }>
  updateProfile: (updates: any) => Promise<{ error?: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [userProfile, setUserProfile] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing auth immediately
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

  const validateInvitationCode = async (code: string) => {
    return validateCodeInstant(code)
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
