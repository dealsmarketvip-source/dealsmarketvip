import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getServerSideExperiment, FeatureFlags } from '@/lib/experiments'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  try {
    // Get user ID from cookie or header
    const userId = request.cookies.get('user_id')?.value || 
                  request.headers.get('x-user-id')

    // Set user ID header for downstream components
    if (userId) {
      response.headers.set('x-user-id', userId)
    }

    // Run experiments for specific routes
    if (request.nextUrl.pathname === '/') {
      // Homepage hero experiment
      const heroVariant = getServerSideExperiment(
        request, 
        FeatureFlags.HOMEPAGE_HERO_VARIANT, 
        'original'
      )
      
      response.headers.set('x-hero-variant', heroVariant)
      
      // Set cookie for client-side consistency
      response.cookies.set('hero_variant', heroVariant, {
        maxAge: 60 * 60 * 24, // 24 hours
        httpOnly: false, // Allow client-side access
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      })
    }

    // Pricing page experiment
    if (request.nextUrl.pathname.startsWith('/pricing')) {
      const pricingVariant = getServerSideExperiment(
        request,
        FeatureFlags.SHOW_NEW_PRICING_PAGE,
        'control'
      )
      
      response.headers.set('x-pricing-variant', pricingVariant)
      response.cookies.set('pricing_variant', pricingVariant, {
        maxAge: 60 * 60 * 24,
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      })
    }

    // Mobile optimizations
    const userAgent = request.headers.get('user-agent') || ''
    const isMobile = /Mobile|Android|iPhone|iPad/.test(userAgent)
    
    if (isMobile) {
      const mobileOptimizations = getServerSideExperiment(
        request,
        FeatureFlags.ENABLE_MOBILE_OPTIMIZATIONS,
        'enabled'
      )
      
      response.headers.set('x-mobile-optimizations', mobileOptimizations)
      response.cookies.set('mobile_optimizations', mobileOptimizations, {
        maxAge: 60 * 60 * 24,
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      })
    }

    // Geographic targeting
    const country = request.headers.get('cf-ipcountry') || 
                   request.headers.get('x-vercel-ip-country')
    
    if (country) {
      response.headers.set('x-user-country', country)
      response.cookies.set('user_country', country, {
        maxAge: 60 * 60 * 24 * 7, // 1 week
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      })
    }

    // Track experiment exposure for analytics
    if (process.env.NODE_ENV === 'production') {
      // In production, you might want to track middleware experiments
      // This could send to an analytics endpoint or queue
    }

    return response

  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    // Only run middleware on specific routes for better performance
    '/(marketplace|account|settings|sell|product)/:path*',
    '/',
    '/pricing/:path*'
  ],
}
