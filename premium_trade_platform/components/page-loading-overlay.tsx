"use client"

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Crown, Loader2, Sparkles } from 'lucide-react'

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
    hidden: { 
      opacity: 0,
      backdropFilter: 'blur(0px)'
    },
    visible: { 
      opacity: 1,
      backdropFilter: 'blur(8px)',
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0,
      backdropFilter: 'blur(0px)',
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  }

  const containerVariants = {
    hidden: { 
      scale: 0.8,
      opacity: 0,
      y: 20
    },
    visible: { 
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
        delay: 0.1
      }
    },
    exit: { 
      scale: 0.8,
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  }

  const logoVariants = {
    animate: {
      rotate: [0, 360],
      scale: [1, 1.1, 1],
      transition: {
        rotate: {
          duration: 2,
          ease: "linear",
          repeat: Infinity
        },
        scale: {
          duration: 1.5,
          ease: "easeInOut",
          repeat: Infinity
        }
      }
    }
  }

  const sparkleVariants = {
    animate: {
      scale: [0, 1, 0],
      rotate: [0, 180, 360],
      opacity: [0, 1, 0],
      transition: {
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
        staggerChildren: 0.2
      }
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
          style={{ backdropFilter: 'blur(8px)' }}
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative bg-card/90 backdrop-blur-lg border border-border/50 rounded-2xl p-8 shadow-2xl min-w-[320px] max-w-md mx-4"
            style={{
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 40px rgba(255, 215, 0, 0.1)'
            }}
          >
            {/* Decorative sparkles */}
            <div className="absolute -top-2 -right-2">
              <motion.div variants={sparkleVariants} animate="animate">
                <Sparkles className="h-4 w-4 text-primary" />
              </motion.div>
            </div>
            <div className="absolute -bottom-2 -left-2">
              <motion.div 
                variants={sparkleVariants} 
                animate="animate"
                transition={{ delay: 0.5 }}
              >
                <Sparkles className="h-3 w-3 text-accent" />
              </motion.div>
            </div>

            {/* Main content */}
            <div className="text-center space-y-6">
              {/* Logo with animation */}
              <div className="relative flex justify-center">
                <motion.div
                  variants={logoVariants}
                  animate="animate"
                  className="relative"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center relative overflow-hidden">
                    {/* Animated gradient overlay */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                      animate={{
                        x: ['-100%', '100%']
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                    <Crown className="h-8 w-8 text-primary-foreground relative z-10" />
                  </div>
                </motion.div>

                {/* Rotating rings */}
                <motion.div
                  className="absolute inset-0 border-2 border-primary/30 rounded-2xl"
                  animate={{
                    rotate: 360,
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    rotate: {
                      duration: 3,
                      ease: "linear",
                      repeat: Infinity
                    },
                    scale: {
                      duration: 2,
                      ease: "easeInOut",
                      repeat: Infinity
                    }
                  }}
                />
                <motion.div
                  className="absolute inset-0 border border-accent/20 rounded-2xl"
                  animate={{
                    rotate: -360,
                    scale: [1.1, 1, 1.1]
                  }}
                  transition={{
                    rotate: {
                      duration: 4,
                      ease: "linear",
                      repeat: Infinity
                    },
                    scale: {
                      duration: 3,
                      ease: "easeInOut",
                      repeat: Infinity
                    }
                  }}
                />
              </div>

              {/* Brand name */}
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  DEALSMARKET
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Premium B2B Platform</p>
              </div>

              {/* Loading text with animated dots */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">
                  {loadingText}<span className="text-primary">{dots}</span>
                </p>

                {/* Animated progress bar */}
                <div className="w-full bg-muted/50 rounded-full h-1 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                    animate={{
                      x: ['-100%', '100%']
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    style={{ width: '40%' }}
                  />
                </div>

                {/* Spinning loader */}
                <div className="flex justify-center">
                  <Loader2 className="h-5 w-5 text-primary animate-spin" />
                </div>
              </div>

              {/* Tip text */}
              <p className="text-xs text-muted-foreground/70">
                Preparando tu experiencia premium...
              </p>
            </div>

            {/* Ambient glow effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 rounded-2xl -z-10"
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.02, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
