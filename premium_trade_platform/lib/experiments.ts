// GrowthBook feature flags and experimentation service

export interface ExperimentConfig {
  id: string
  key: string
  name: string
  description?: string
  variations: Record<string, any>
  defaultValue: any
  targeting?: {
    userId?: string[]
    userType?: string[]
    location?: string[]
    percentage?: number
  }
}

export interface FeatureFlag {
  key: string
  enabled: boolean
  value?: any
  variation?: string
  experiment?: string
}

export interface UserAttributes {
  id?: string
  email?: string
  userType?: 'individual' | 'business' | 'freelancer'
  subscriptionType?: 'free' | 'premium' | 'enterprise'
  country?: string
  city?: string
  verificationStatus?: 'pending' | 'verified' | 'rejected'
  registrationDate?: string
  lastActiveDate?: string
  deviceType?: 'mobile' | 'tablet' | 'desktop'
  browser?: string
  utm_source?: string
  utm_campaign?: string
}

class ExperimentService {
  private growthbook: any = null
  private initialized = false
  private features: Record<string, FeatureFlag> = {}

  constructor() {
    this.initializeGrowthBook()
  }

  private async initializeGrowthBook() {
    try {
      const apiHost = process.env.NEXT_PUBLIC_GROWTHBOOK_API_HOST || process.env.GROWTHBOOK_API_HOST
      const clientKey = process.env.NEXT_PUBLIC_GROWTHBOOK_CLIENT_KEY || process.env.GROWTHBOOK_CLIENT_KEY

      if (!apiHost || !clientKey) {
        console.warn('GrowthBook credentials not found. Feature flags will use defaults.')
        this.initialized = true
        return
      }

      // Dynamic import to avoid client-side issues
      if (typeof window !== 'undefined') {
        const { GrowthBook } = await import('@growthbook/growthbook')
        
        this.growthbook = new GrowthBook({
          apiHost,
          clientKey,
          enableDevMode: process.env.NODE_ENV === 'development',
          trackingCallback: (experiment, result) => {
            this.trackExperiment(experiment, result)
          }
        })

        await this.growthbook.loadFeatures()
        this.initialized = true
        console.log('✅ GrowthBook initialized successfully')
      } else {
        // Server-side initialization
        console.log('⚠️ GrowthBook server-side initialization')
        this.initialized = true
      }
    } catch (error) {
      console.warn('⚠️ GrowthBook initialization failed:', error)
      this.initialized = true
    }
  }

  private trackExperiment(experiment: any, result: any) {
    // Track experiment exposure for analytics
    console.log('🧪 Experiment tracked:', {
      experimentId: experiment.key,
      variationId: result.variationId,
      variationName: result.variationName,
      value: result.value
    })

    // Send to analytics service
    if (typeof window !== 'undefined') {
      // Track with your analytics service
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'experiment_viewed',
          properties: {
            experimentId: experiment.key,
            variationId: result.variationId,
            variationName: result.variationName,
            value: result.value,
            inExperiment: result.inExperiment
          }
        })
      }).catch(error => console.warn('Failed to track experiment:', error))
    }
  }

  // Set user attributes for targeting
  setUserAttributes(attributes: UserAttributes) {
    if (!this.growthbook) return

    this.growthbook.setAttributes({
      id: attributes.id,
      email: attributes.email,
      userType: attributes.userType,
      subscriptionType: attributes.subscriptionType,
      country: attributes.country,
      city: attributes.city,
      verificationStatus: attributes.verificationStatus,
      registrationDate: attributes.registrationDate,
      lastActiveDate: attributes.lastActiveDate,
      deviceType: attributes.deviceType,
      browser: attributes.browser,
      utm_source: attributes.utm_source,
      utm_campaign: attributes.utm_campaign
    })
  }

  // Get feature flag value
  getFeature(key: string, defaultValue: any = false): any {
    if (!this.initialized) {
      return defaultValue
    }

    if (!this.growthbook) {
      return this.getFallbackFeature(key, defaultValue)
    }

    try {
      const result = this.growthbook.getFeatureValue(key, defaultValue)
      
      // Cache the result
      this.features[key] = {
        key,
        enabled: Boolean(result),
        value: result,
        variation: this.growthbook.getFeatureResult(key)?.variationId?.toString(),
        experiment: this.growthbook.getFeatureResult(key)?.experiment?.key
      }

      return result
    } catch (error) {
      console.warn(`Feature flag '${key}' failed:`, error)
      return this.getFallbackFeature(key, defaultValue)
    }
  }

  // Check if feature is enabled
  isFeatureEnabled(key: string): boolean {
    return Boolean(this.getFeature(key, false))
  }

  // Get experiment variation
  getExperimentVariation(experimentKey: string, defaultVariation: string = 'control'): string {
    const result = this.getFeature(experimentKey, defaultVariation)
    return typeof result === 'string' ? result : defaultVariation
  }

  // Fallback for when GrowthBook is not available
  private getFallbackFeature(key: string, defaultValue: any): any {
    // Define fallback feature flags
    const fallbackFeatures: Record<string, any> = {
      homepageHeroVariant: 'original',
      enableNewCheckout: false,
      showPremiumFeatures: false,
      enableAdvancedFilters: true,
      showBetaFeatures: false,
      enableSocialLogin: true,
      showPersonalizedRecommendations: false,
      enableRealTimeNotifications: true,
      showNewPricingPage: false,
      enableMobileOptimizations: true
    }

    return fallbackFeatures[key] ?? defaultValue
  }

  // Force refresh features
  async refreshFeatures() {
    if (!this.growthbook) return

    try {
      await this.growthbook.loadFeatures()
      console.log('✅ GrowthBook features refreshed')
    } catch (error) {
      console.warn('Failed to refresh features:', error)
    }
  }

  // Get all active features
  getAllFeatures(): Record<string, FeatureFlag> {
    return { ...this.features }
  }

  // Cleanup
  destroy() {
    if (this.growthbook) {
      this.growthbook.destroy()
      this.growthbook = null
    }
    this.features = {}
    this.initialized = false
  }
}

// Singleton instance
export const experiments = new ExperimentService()

// Convenience functions
export const getFeature = (key: string, defaultValue?: any) => experiments.getFeature(key, defaultValue)
export const isFeatureEnabled = (key: string) => experiments.isFeatureEnabled(key)
export const getExperimentVariation = (experimentKey: string, defaultVariation?: string) => 
  experiments.getExperimentVariation(experimentKey, defaultVariation)
export const setUserAttributes = (attributes: UserAttributes) => experiments.setUserAttributes(attributes)

// Predefined feature flags for the application
export const FeatureFlags = {
  HOMEPAGE_HERO_VARIANT: 'homepageHeroVariant',
  ENABLE_NEW_CHECKOUT: 'enableNewCheckout',
  SHOW_PREMIUM_FEATURES: 'showPremiumFeatures',
  ENABLE_ADVANCED_FILTERS: 'enableAdvancedFilters',
  SHOW_BETA_FEATURES: 'showBetaFeatures',
  ENABLE_SOCIAL_LOGIN: 'enableSocialLogin',
  SHOW_PERSONALIZED_RECOMMENDATIONS: 'showPersonalizedRecommendations',
  ENABLE_REALTIME_NOTIFICATIONS: 'enableRealTimeNotifications',
  SHOW_NEW_PRICING_PAGE: 'showNewPricingPage',
  ENABLE_MOBILE_OPTIMIZATIONS: 'enableMobileOptimizations'
} as const

// React hook for feature flags
export function useFeatureFlag(flagKey: string, defaultValue: any = false) {
  const value = getFeature(flagKey, defaultValue)
  
  return {
    isEnabled: Boolean(value),
    value,
    variation: experiments.getFeature(flagKey)?.variation,
    experiment: experiments.getFeature(flagKey)?.experiment
  }
}

// React hook for experiments
export function useExperiment(experimentKey: string, defaultVariation: string = 'control') {
  const variation = getExperimentVariation(experimentKey, defaultVariation)
  
  return {
    variation,
    isControl: variation === 'control',
    isVariant: variation !== 'control'
  }
}

// Homepage hero experiment example
export function useHomepageHeroExperiment() {
  return useExperiment(FeatureFlags.HOMEPAGE_HERO_VARIANT, 'original')
}

// Edge middleware support for server-side experiments
export function getServerSideExperiment(
  request: Request, 
  experimentKey: string, 
  defaultVariation: string = 'control'
): string {
  try {
    // Extract user attributes from request
    const userAgent = request.headers.get('user-agent') || ''
    const country = request.headers.get('cf-ipcountry') || 
                   request.headers.get('x-vercel-ip-country') || 'unknown'
    
    // Simple server-side bucketing (in production, use GrowthBook's server SDK)
    const userId = request.headers.get('x-user-id')
    if (userId) {
      const hash = Array.from(userId).reduce((hash, char) => {
        return ((hash << 5) - hash + char.charCodeAt(0)) & 0xfffffff
      }, 0)
      
      const bucket = Math.abs(hash) % 100
      
      // Example: 50/50 split for homepage hero
      if (experimentKey === FeatureFlags.HOMEPAGE_HERO_VARIANT) {
        return bucket < 50 ? 'original' : 'variant_a'
      }
    }
    
    return defaultVariation
  } catch (error) {
    console.warn('Server-side experiment failed:', error)
    return defaultVariation
  }
}
