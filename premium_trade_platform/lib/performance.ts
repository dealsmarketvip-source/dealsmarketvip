export class PerformanceTracker {
  private static timers = new Map<string, number>()

  static startTimer(name: string) {
    this.timers.set(name, performance.now())
    performance.mark(`${name}-start`)
  }

  static endTimer(name: string) {
    const startTime = this.timers.get(name)
    if (startTime) {
      const duration = performance.now() - startTime
      performance.mark(`${name}-end`)
      performance.measure(name, `${name}-start`, `${name}-end`)
      this.timers.delete(name)
      
      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`⚡ ${name}: ${duration.toFixed(2)}ms`)
      }
      
      return duration
    }
    return 0
  }

  static async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    this.startTimer(name)
    try {
      const result = await fn()
      this.endTimer(name)
      return result
    } catch (error) {
      this.endTimer(name)
      throw error
    }
  }

  static measure<T>(name: string, fn: () => T): T {
    this.startTimer(name)
    try {
      const result = fn()
      this.endTimer(name)
      return result
    } catch (error) {
      this.endTimer(name)
      throw error
    }
  }

  static reportVitals() {
    // Report Core Web Vitals
    if (typeof window !== 'undefined') {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(console.log)
        getFID(console.log) 
        getFCP(console.log)
        getLCP(console.log)
        getTTFB(console.log)
      })
    }
  }
}

// Route timing helpers
export const routeTimings = {
  startPageLoad: (route: string) => {
    PerformanceTracker.startTimer(`page-load-${route}`)
  },
  
  endPageLoad: (route: string) => {
    return PerformanceTracker.endTimer(`page-load-${route}`)
  },
  
  startDataFetch: (endpoint: string) => {
    PerformanceTracker.startTimer(`fetch-${endpoint}`)
  },
  
  endDataFetch: (endpoint: string) => {
    return PerformanceTracker.endTimer(`fetch-${endpoint}`)
  },
  
  startHydration: () => {
    PerformanceTracker.startTimer('hydration')
  },
  
  endHydration: () => {
    return PerformanceTracker.endTimer('hydration')
  }
}
