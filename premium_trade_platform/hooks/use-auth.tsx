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
    const result = await auth.signUp(email, password, metadata)
    setLoading(false)
    return result
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
