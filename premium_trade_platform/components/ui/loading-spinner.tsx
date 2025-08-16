"use client"

import { motion } from "framer-motion"
import { Loader2, Crown, ShoppingCart, Package } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "default" | "crown" | "shopping" | "package"
  className?: string
  text?: string
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6", 
  lg: "h-8 w-8",
  xl: "h-12 w-12"
}

const iconComponents = {
  default: Loader2,
  crown: Crown,
  shopping: ShoppingCart,
  package: Package
}

export function LoadingSpinner({ 
  size = "md", 
  variant = "default", 
  className, 
  text 
}: LoadingSpinnerProps) {
  const Icon = iconComponents[variant]
  
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Glow effect background */}
        <motion.div
          className={cn(
            "absolute inset-0 rounded-full blur-md opacity-60",
            sizeClasses[size],
            variant === "crown" && "bg-primary",
            variant === "shopping" && "bg-blue-500",
            variant === "package" && "bg-green-500",
            variant === "default" && "bg-primary"
          )}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Main spinner icon */}
        <motion.div
          animate={variant === "default" ? { rotate: 360 } : { 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={variant === "default" ? {
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          } : {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Icon 
            className={cn(
              sizeClasses[size],
              "relative z-10",
              variant === "crown" && "text-primary",
              variant === "shopping" && "text-blue-500", 
              variant === "package" && "text-green-500",
              variant === "default" && "text-primary"
            )}
          />
        </motion.div>
      </motion.div>
      
      {text && (
        <motion.p
          className="text-sm text-muted-foreground font-medium"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  )
}

export function LoadingOverlay({ 
  isLoading, 
  text = "Cargando...", 
  variant = "default" 
}: {
  isLoading: boolean
  text?: string
  variant?: "default" | "crown" | "shopping" | "package"
}) {
  if (!isLoading) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-card p-8 rounded-lg shadow-lg border border-border"
      >
        <LoadingSpinner size="xl" variant={variant} text={text} />
      </motion.div>
    </motion.div>
  )
}

export function LoadingButton({ 
  isLoading, 
  children, 
  variant = "default",
  size = "sm",
  ...props 
}: {
  isLoading: boolean
  children: React.ReactNode
  variant?: "default" | "crown" | "shopping" | "package"
  size?: "sm" | "md" | "lg" | "xl"
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} disabled={isLoading || props.disabled}>
      {isLoading ? (
        <div className="flex items-center gap-2">
          <LoadingSpinner size={size} variant={variant} />
          {children}
        </div>
      ) : (
        children
      )}
    </button>
  )
}

export function LoadingCard() {
  return (
    <div className="bg-card border border-border rounded-lg p-6 animate-pulse">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-muted rounded-full"></div>
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-3 bg-muted rounded w-1/2"></div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-muted rounded"></div>
        <div className="h-4 bg-muted rounded w-5/6"></div>
        <div className="h-4 bg-muted rounded w-2/3"></div>
      </div>
    </div>
  )
}

export function LoadingProductCard() {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden animate-pulse">
      <div className="aspect-square bg-muted"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-muted rounded w-3/4"></div>
        <div className="h-3 bg-muted rounded w-1/2"></div>
        <div className="flex items-center justify-between">
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-1/4"></div>
        </div>
      </div>
    </div>
  )
}
