"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

interface NavigationErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

class NavigationErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<any> },
  NavigationErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ComponentType<any> }) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): NavigationErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Only log non-HMR related errors
    const isHMRError = 
      error.message.includes('Failed to fetch') ||
      error.message.includes('RSC payload') ||
      error.message.includes('chunk') ||
      error.message.includes('Loading')

    if (!isHMRError) {
      console.error('Navigation Error Boundary caught an error:', error, errorInfo)
      this.setState({
        error,
        errorInfo
      })
    } else {
      // For HMR errors, try to recover automatically
      console.debug('HMR error detected, attempting recovery...')
      setTimeout(() => {
        this.setState({ hasError: false, error: null, errorInfo: null })
      }, 1000)
    }
  }

  handleRefresh = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      // Check if it's an HMR-related error that we should handle gracefully
      const isHMRError = 
        this.state.error?.message.includes('Failed to fetch') ||
        this.state.error?.message.includes('RSC payload') ||
        this.state.error?.message.includes('chunk') ||
        this.state.error?.message.includes('Loading')

      if (isHMRError) {
        // For HMR errors, show a minimal retry interface
        return (
          <div className="fixed top-4 right-4 z-50">
            <Card className="w-80 border-yellow-500/50 bg-yellow-50/90 dark:bg-yellow-900/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <RefreshCw className="h-5 w-5 text-yellow-600 animate-spin" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      Reconnecting...
                    </p>
                    <p className="text-xs text-yellow-600 dark:text-yellow-400">
                      Development server sync
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={this.handleRetry}
                    className="h-8 w-8 p-0"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      }

      // For other errors, show full error UI
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error} retry={this.handleRetry} />
      }

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-lg">Something went wrong</CardTitle>
              <CardDescription>
                We encountered an unexpected error. This usually happens during navigation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="bg-muted p-3 rounded-md">
                  <p className="text-xs font-mono text-muted-foreground break-all">
                    {this.state.error.message}
                  </p>
                </div>
              )}
              <div className="flex gap-2">
                <Button onClick={this.handleRetry} className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button variant="outline" onClick={this.handleGoHome}>
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </div>
              <Button 
                variant="ghost" 
                onClick={this.handleRefresh}
                className="w-full text-sm"
              >
                Refresh Page
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

export default NavigationErrorBoundary
