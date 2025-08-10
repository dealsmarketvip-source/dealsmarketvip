"use client"

import { motion } from "framer-motion"

interface LoadingAnimationProps {
  isLoading: boolean
  children: React.ReactNode
  className?: string
}

export function LoadingAnimation({ isLoading, children, className = "" }: LoadingAnimationProps) {
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-[200px] ${className}`}>
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Animated Logo Spinner */}
          <motion.div
            className="relative"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl shadow-2xl border border-primary/20 glow-primary">
              <div className="w-full h-full bg-primary-foreground rounded-xl flex items-center justify-center m-1">
                <span className="text-primary font-black text-2xl">D</span>
              </div>
            </div>
            <motion.div
              className="absolute -inset-2 bg-gradient-to-r from-primary/30 to-accent/30 rounded-3xl blur-lg"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>

          {/* Loading Text */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-foreground text-lg font-semibold mb-2">Cargando...</h3>
            <div className="flex gap-1 justify-center">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-primary rounded-full"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Page transition wrapper
export function PageTransition({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Section reveal animation
export function SectionReveal({ children, delay = 0, className = "" }: { 
  children: React.ReactNode
  delay?: number
  className?: string 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.8, 
        delay,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Navigation link animation
export function NavLinkAnimation({ children, isActive = false }: { 
  children: React.ReactNode
  isActive?: boolean
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative"
    >
      {children}
      {isActive && (
        <motion.div
          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full"
          layoutId="activeNav"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  )
}

// Category card animation
export function CategoryCardAnimation({ children, index = 0 }: { 
  children: React.ReactNode
  index?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  )
}
