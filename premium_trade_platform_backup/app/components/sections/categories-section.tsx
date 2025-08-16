
"use client"

import { motion } from "framer-motion"
import { 
  Fuel, 
  Car, 
  Coins, 
  Watch, 
  Building2, 
  Hotel, 
  Ship, 
  Plane, 
  Palette, 
  Diamond 
} from "lucide-react"

const categories = [
  { name: "Oil & Gas", icon: Fuel, description: "Energy sector opportunities" },
  { name: "Luxury Cars", icon: Car, description: "Premium automotive deals" },
  { name: "Gold & Metals", icon: Coins, description: "Precious metals trading" },
  { name: "Luxury Watches", icon: Watch, description: "High-end timepieces" },
  { name: "Business Acquisitions", icon: Building2, description: "M&A opportunities" },
  { name: "Hotels & Real Estate", icon: Hotel, description: "Property investments" },
  { name: "Yachts & Boats", icon: Ship, description: "Marine luxury assets" },
  { name: "Private Jets", icon: Plane, description: "Aviation opportunities" },
  { name: "Art & Collectibles", icon: Palette, description: "Fine art and collectibles" },
  { name: "Diamonds & Jewelry", icon: Diamond, description: "Luxury jewelry and gems" },
]

export function CategoriesSection() {
  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
          >
            Premium Categories
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-4 text-lg text-gray-600 dark:text-gray-300"
          >
            Access exclusive opportunities in high-value industries
          </motion.p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="group cursor-pointer rounded-lg bg-white p-6 text-center shadow-sm hover:shadow-md dark:bg-gray-800 transition-all duration-300"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-lg bg-yellow-100 group-hover:bg-yellow-500 dark:bg-yellow-900 dark:group-hover:bg-yellow-500 transition-colors duration-300">
                <category.icon className="h-8 w-8 text-yellow-600 group-hover:text-black dark:text-yellow-400 dark:group-hover:text-black transition-colors duration-300" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-gray-900 dark:text-white">
                {category.name}
              </h3>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {category.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
