
"use client"

import Link from "next/link"
import { Building2 } from "lucide-react"
import { motion } from "framer-motion"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-500">
              <Building2 className="h-5 w-5 text-black" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Premium<span className="text-yellow-500">Trade</span>
            </span>
          </motion.div>

          {/* Links */}
          <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-300">
            <Link 
              href="/about" 
              className="hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className="hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
            >
              Contact
            </Link>
            <Link 
              href="/pricing" 
              className="hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
            >
              Pricing
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-sm text-gray-500 dark:text-gray-400">
            © {currentYear} PremiumTrade. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
