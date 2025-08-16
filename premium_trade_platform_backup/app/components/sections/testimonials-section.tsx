
"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Alessandro Rossi",
    role: "CEO, Mediterranean Energy Corp",
    country: "Italy",
    content: "PremiumTrade connected us with verified partners across the Middle East. The platform's exclusivity ensures quality interactions and serious business opportunities.",
  },
  {
    name: "Fatima Al-Zahra",
    role: "Managing Director, Gulf Luxury Holdings",
    country: "UAE",
    content: "The verification process gave us confidence in every connection. We've completed over €50M in transactions through this platform in just 8 months.",
  },
  {
    name: "Klaus Weber",
    role: "Chairman, Alpine Investments",
    country: "Austria",
    content: "Finally, a platform that understands the needs of premium businesses. The private network approach protects our sensitive negotiations perfectly.",
  },
]

export function TestimonialsSection() {
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
            Trusted by Industry Leaders
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-4 text-lg text-gray-600 dark:text-gray-300"
          >
            See what our verified members say about their experience
          </motion.p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="rounded-lg bg-gray-50 p-8 dark:bg-gray-900"
            >
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                ))}
              </div>
              <blockquote className="mt-4 text-gray-600 dark:text-gray-300">
                "{testimonial.content}"
              </blockquote>
              <div className="mt-6">
                <div className="font-semibold text-gray-900 dark:text-white">
                  {testimonial.name}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {testimonial.role}
                </div>
                <div className="text-sm text-yellow-600 dark:text-yellow-400">
                  {testimonial.country}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
