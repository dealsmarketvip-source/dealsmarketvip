"use client"

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Crown, Loader2 } from 'lucide-react'

interface PageLoadingOverlayProps {
  isLoading: boolean
  message?: string
  type?: 'navigation' | 'auth' | 'processing'
}

export function PageLoadingOverlay({ isLoading, message, type = 'navigation' }: PageLoadingOverlayProps) {
  const [loadingText, setLoadingText] = useState(message || 'Cargando...')
  const [dots, setDots] = useState('')

  // Animate loading text dots
  useEffect(() => {
    if (!isLoading) return

    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return ''
        return prev + '.'
      })
    }, 500)

    return () => clearInterval(interval)
  }, [isLoading])

  // Update loading messages based on type
  useEffect(() => {
    if (message) {
      setLoadingText(message)
      return
    }

    switch (type) {
      case 'auth':
        setLoadingText('Autenticando')
        break
      case 'processing':
        setLoadingText('Procesando')
        break
      default:
        setLoadingText('Navegando')
    }
  }, [message, type])

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.2 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  }

  const containerVariants = {
    hidden: { 
      scale: 0.95,
      opacity: 0
    },
    visible: { 
      scale: 1,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: { 
      scale: 0.95,
      opacity: 0,
      transition: { duration: 0.2 }
    }
  }

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-[9999] bg-background/80 backdrop-blur-sm flex items-center justify-center"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-card border border-border rounded-xl p-8 shadow-lg min-w-[280px] max-w-sm mx-4"
          >
            {/* Main content */}
            <div className="text-center space-y-6">
              {/* Simple logo */}
              <div className="flex justify-center">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
                  <Crown className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>

              {/* Brand name */}
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  DEALSMARKET
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Premium B2B Platform</p>
              </div>

              {/* Loading text with animated dots */}
              <div className="space-y-4">
                <p className="text-sm font-medium text-foreground">
                  {loadingText}<span className="text-primary">{dots}</span>
                </p>

                {/* Simple progress bar */}
                <div className="w-full bg-muted rounded-full h-1">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </div>

                {/* Simple spinner */}
                <div className="flex justify-center">
                  <Loader2 className="h-5 w-5 text-primary animate-spin" />
                </div>
              </div>

              {/* Simple tip text */}
              <p className="text-xs text-muted-foreground">
                Un momento por favor...
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
