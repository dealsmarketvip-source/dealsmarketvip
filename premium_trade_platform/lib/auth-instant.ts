// Ultra-fast authentication that grants immediate access
"use client"

// Mock user data for instant access
const INSTANT_USER = {
  id: 'instant-user-123',
  email: 'demo@dealsmarket.com',
  full_name: 'Demo User',
  company_name: 'Demo Company',
  subscription_type: 'enterprise',
  verification_status: 'verified'
}

const INVITATION_CODES = {
  'ASTERO1': {
    email: 'admin@astero.trading',
    company_name: 'Astero Trading Group',
    subscription_type: 'enterprise',
    verification_status: 'verified'
  },
  'BETA50': {
    email: 'beta@dealsmarket.vip', 
    company_name: 'Beta Tester Company',
    subscription_type: 'enterprise',
    verification_status: 'verified'
  }
} as const

// Store auth state in localStorage for persistence
const AUTH_KEY = 'dealsmarket_auth_instant'

export function getInstantAuth() {
  if (typeof window === 'undefined') return null
  
  const stored = localStorage.getItem(AUTH_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return null
    }
  }
  return null
}

export function setInstantAuth(user: any) {
  if (typeof window === 'undefined') return
  localStorage.setItem(AUTH_KEY, JSON.stringify(user))
}

export function clearInstantAuth() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(AUTH_KEY)
}

export function validateCodeInstant(code: string) {
  const upperCode = code.toUpperCase()
  const codeData = INVITATION_CODES[upperCode as keyof typeof INVITATION_CODES]
  
  if (!codeData) {
    return {
      isValid: false,
      message: '❌ Invalid invitation code'
    }
  }

  return {
    isValid: true,
    message: `🌟 ${codeData.company_name} - Access Granted`,
    accountData: codeData
  }
}

export async function loginWithCodeInstant(code: string) {
  const validation = validateCodeInstant(code)

  if (!validation.isValid) {
    return {
      success: false,
      error: validation.message
    }
  }

  const user = {
    ...INSTANT_USER,
    ...validation.accountData,
    invitation_code: code.toUpperCase()
  }

  // Store in localStorage immediately
  setInstantAuth(user)

  return {
    success: true,
    user,
    message: validation.message || 'Login successful'
  }
}

export function signInInstant(email: string, password: string) {
  // For demo purposes, accept any email/password
  const user = {
    ...INSTANT_USER,
    email,
    full_name: email.split('@')[0]
  }

  setInstantAuth(user)

  return {
    success: true,
    user,
    message: 'Login successful'
  }
}

export function signUpInstant(email: string, password: string, metadata: any = {}) {
  const user = {
    ...INSTANT_USER,
    email,
    full_name: metadata.full_name || email.split('@')[0],
    company_name: metadata.company_name || 'New Company'
  }

  setInstantAuth(user)

  return {
    success: true,
    user,
    message: 'Account created successfully'
  }
}

export function signOutInstant() {
  clearInstantAuth()
  return {
    success: true,
    message: 'Signed out successfully'
  }
}
