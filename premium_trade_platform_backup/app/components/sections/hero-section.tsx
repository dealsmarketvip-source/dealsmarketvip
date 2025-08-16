
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, Shield, Users, Globe } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-yellow-50 to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      <div className="absolute inset-0 hero-gradient" />
      
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl"
          >
            Exclusive B2B Marketplace for
            <span className="block text-gradient">Premium Enterprises</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-300"
          >
            Connect with verified European and Middle Eastern companies dealing in high-value products. 
            Access exclusive opportunities in oil, luxury goods, real estate, and more.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 flex items-center justify-center gap-x-6"
          >
            <Button size="lg" asChild>
              <Link href="/apply" className="flex items-center space-x-2">
                <span>Apply for Membership</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/about">Learn More</Link>
            </Button>
          </motion.div>
          
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3"
          >
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-500">
                <Shield className="h-6 w-6 text-black" />
              </div>
              <div className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">500+</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Verified Companies</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-500">
                <Globe className="h-6 w-6 text-black" />
              </div>
              <div className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">35+</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Countries</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-500">
                <Users className="h-6 w-6 text-black" />
              </div>
              <div className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">€2B+</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Deals Facilitated</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
