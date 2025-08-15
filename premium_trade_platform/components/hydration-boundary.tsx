'use client'

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasHydrationError: boolean
}

class HydrationBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasHydrationError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    // Check if it's a hydration error
    if (error.message?.includes('Hydration failed') || 
        error.message?.includes('Text content does not match') ||
        error.message?.includes('server rendered HTML')) {
      return { hasHydrationError: true }
    }
    
    // Let other errors bubble up
    throw error
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Only handle hydration errors
    if (error.message?.includes('Hydration failed')) {
      console.warn('Hydration error caught by boundary:', error.message)
      // Force a re-render on the client
      setTimeout(() => {
        this.setState({ hasHydrationError: false })
      }, 0)
    }
  }

  render() {
    if (this.state.hasHydrationError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default HydrationBoundary
