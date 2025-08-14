"use client"

import { motion } from "framer-motion"
import { Crown, ShoppingCart, Package, User, Settings, Loader2, LogIn, Code } from "lucide-react"

interface EnhancedLoadingProps {
  type?: "spinner" | "login" | "code" | "page" | "auth" | "upload" | "purchase"
  size?: "sm" | "md" | "lg"
  message?: string
  fullscreen?: boolean
}

export function EnhancedLoading({ 
  type = "spinner", 
  size = "md", 
  message,
  fullscreen = false 
}: EnhancedLoadingProps) {
  const getIcon = () => {
    switch (type) {
      case "login":
        return LogIn
      case "code":
        return Code
      case "page":
        return Crown
      case "auth":
        return User
      case "upload":
        return Package
      case "purchase":
        return ShoppingCart
      default:
        return Loader2
    }
  }

  const getMessage = () => {
    if (message) return message
    
    switch (type) {
      case "login":
        return "Signing in..."
      case "code":
        return "Validating code..."
      case "page":
        return "Loading page..."
      case "auth":
        return "Authenticating..."
      case "upload":
        return "Uploading..."
      case "purchase":
        return "Processing payment..."
      default:
        return "Loading..."
    }
  }

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  }

  const Icon = getIcon()
  
  const LoadingContent = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Animated Icon */}
      <motion.div
        className="relative"
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Glow effect */}
        <motion.div
          className={`absolute inset-0 bg-primary/30 rounded-full blur-lg ${sizeClasses[size]}`}
          animate={{
            opacity: [0.3, 0.8, 0.3],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Main icon */}
        <motion.div
          className={`relative z-10 ${sizeClasses[size]} text-primary`}
          animate={{
            rotate: type === "spinner" ? 360 : 0
          }}
          transition={{
            duration: type === "spinner" ? 1 : 0,
            repeat: type === "spinner" ? Infinity : 0,
            ease: "linear"
          }}
        >
          <Icon className={`${sizeClasses[size]}`} />
        </motion.div>
      </motion.div>

      {/* Loading dots */}
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-primary rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Message */}
      {(message || type !== "spinner") && (
        <motion.p
          className="text-sm text-muted-foreground font-medium"
          animate={{
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {getMessage()}
        </motion.p>
      )}
    </div>
  )

  if (fullscreen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center"
      >
        <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
          <LoadingContent />
        </div>
      </motion.div>
    )
  }

  return <LoadingContent />
}

// Quick loading variants
export const LoginLoading = ({ message }: { message?: string }) => (
  <EnhancedLoading type="login" message={message} />
)

export const CodeLoading = ({ message }: { message?: string }) => (
  <EnhancedLoading type="code" message={message} />
)

export const PageLoading = ({ message }: { message?: string }) => (
  <EnhancedLoading type="page" fullscreen message={message} />
)

export const AuthLoading = ({ message }: { message?: string }) => (
  <EnhancedLoading type="auth" message={message} />
)

export const UploadLoading = ({ message }: { message?: string }) => (
  <EnhancedLoading type="upload" message={message} />
)

export const PurchaseLoading = ({ message }: { message?: string }) => (
  <EnhancedLoading type="purchase" message={message} />
)
