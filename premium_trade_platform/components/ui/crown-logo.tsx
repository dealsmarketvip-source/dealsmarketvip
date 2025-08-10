"use client"

import { motion } from "framer-motion"

interface CrownLogoProps {
  size?: "sm" | "md" | "lg"
  className?: string
  animated?: boolean
}

export function CrownLogo({ size = "md", className = "", animated = true }: CrownLogoProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  }

  const CrownIcon = () => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={`${sizeClasses[size]} ${className}`}
    >
      <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z" />
      <path d="M5 21h14" />
    </svg>
  )

  if (!animated) {
    return <CrownIcon />
  }

  return (
    <motion.div
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <CrownIcon />
    </motion.div>
  )
}

export function CrownLogoWithBrand({ className = "" }: { className?: string }) {
  return (
    <motion.div 
      className={`flex items-center gap-4 group cursor-pointer ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
        <div className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-3 rounded-2xl shadow-xl border border-primary/30 group-hover:shadow-2xl transition-all duration-300">
          <CrownLogo size="md" className="text-primary-foreground" animated={false} />
        </div>
      </div>
      <div className="flex flex-col items-start">
        <span className="text-foreground text-2xl font-black tracking-tight bg-gradient-to-r from-primary via-primary/90 to-accent bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
          DEALSMARKET
        </span>
        <span className="text-muted-foreground text-xs font-semibold uppercase tracking-[0.2em] opacity-80">
          WHERE VERIFIED COMPANIES TRADE EXCELLENCE
        </span>
      </div>
    </motion.div>
  )
}
