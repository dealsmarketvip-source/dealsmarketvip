
"use client"

import { motion } from "framer-motion"
import { Shield, Zap, Globe, Lock, TrendingUp, Users } from "lucide-react"

const features = [
  {
    name: "Verified Companies Only",
    description: "Every member undergoes rigorous verification ensuring authenticity and credibility in all transactions.",
    icon: Shield,
  },
  {
    name: "High-Value Products",
    description: "Exclusive access to premium categories including oil, luxury cars, gold, watches, and business acquisitions.",
    icon: TrendingUp,
  },
  {
    name: "European & Middle Eastern Focus",
    description: "Connecting established markets with emerging opportunities across strategic regions.",
    icon: Globe,
  },
  {
    name: "Private Network",
    description: "Secure, invitation-only platform protecting sensitive business information and relationships.",
    icon: Lock,
  },
  {
    name: "Fast Deal Execution",
    description: "Streamlined processes and direct connections accelerate business negotiations and closures.",
    icon: Zap,
  },
  {
    name: "Exclusive Community",
    description: "Join a select network of premium enterprises and industry leaders.",
    icon: Users,
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
          >
            Why Choose PremiumTrade?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-4 text-lg text-gray-600 dark:text-gray-300"
          >
            Built for serious enterprises conducting high-value transactions
          </motion.p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative rounded-lg bg-gray-50 p-6 hover:bg-yellow-50 dark:bg-gray-900 dark:hover:bg-yellow-950/20 transition-colors duration-300"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-500 group-hover:bg-yellow-600 transition-colors duration-300">
                <feature.icon className="h-6 w-6 text-black" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                {feature.name}
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
