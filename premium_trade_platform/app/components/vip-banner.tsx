"use client"

import { motion } from "framer-motion"
import { Crown, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function VipBanner() {
  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="w-full gradient-primary py-4 px-6 relative overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute top-2 left-10"
        >
          <Sparkles className="h-4 w-4 text-primary-foreground" />
        </motion.div>
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute top-1 right-20"
        >
          <Crown className="h-5 w-5 text-primary-foreground" />
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 relative z-10">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          <Crown className="h-6 w-6 text-primary-foreground" />
        </motion.div>
        <span className="text-primary-foreground font-bold text-lg">Hazte Miembro VIP y destaca tus búsquedas</span>
        <Button
          variant="outline"
          size="sm"
          className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary transition-all duration-300"
        >
          Más Info
        </Button>
      </div>
    </motion.div>
  )
}
