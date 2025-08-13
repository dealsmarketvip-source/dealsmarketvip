"use client"

import { motion } from "framer-motion"
import { Crown } from "lucide-react"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  text?: string
  className?: string
}

export function LoadingSpinner({ size = "md", text, className = "" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-10 w-10", 
    lg: "h-16 w-16"
  }

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  }

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      {/* Spinning Crown with Glow */}
      <motion.div
        className="relative"
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { duration: 2, repeat: Infinity, ease: "linear" },
          scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/30 blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Crown Icon */}
        <Crown 
          className={`${sizeClasses[size]} text-primary relative z-10`}
          style={{
            filter: "drop-shadow(0 0 8px rgba(255, 215, 0, 0.6))"
          }}
        />
      </motion.div>

      {/* Loading Text */}
      {text && (
        <motion.p 
          className={`${textSizeClasses[size]} text-muted-foreground font-medium`}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          {text}
        </motion.p>
      )}

      {/* Loading Dots */}
      <div className="flex space-x-1">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-2 h-2 bg-primary rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1,
              delay: index * 0.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  )
}

// Full screen loading overlay
export function LoadingOverlay({ text = "Cargando..." }: { text?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-card border border-border rounded-2xl p-8 shadow-2xl"
        style={{
          boxShadow: "0 0 50px rgba(255, 215, 0, 0.2)"
        }}
      >
        <LoadingSpinner size="lg" text={text} />
      </motion.div>
    </motion.div>
  )
}

// Page transition loading
export function PageTransitionLoading() {
  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: "100%" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed top-0 left-0 h-1 bg-gradient-to-r from-primary to-primary/50 z-50"
      style={{
        boxShadow: "0 0 10px rgba(255, 215, 0, 0.8)"
      }}
    />
  )
}
