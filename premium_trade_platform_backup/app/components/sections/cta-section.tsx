
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle } from "lucide-react"

const benefits = [
  "Access to 500+ verified companies",
  "Exclusive high-value deal opportunities",
  "Private network with enhanced security",
  "Direct connections with decision makers",
]

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-r from-yellow-500 to-yellow-600">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-black/10 px-8 py-16 text-center backdrop-blur-sm">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl font-bold tracking-tight text-black sm:text-4xl"
          >
            Ready to Join the Elite Network?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-4 text-lg text-black/80"
          >
            Submit your application today and gain access to exclusive business opportunities
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-2 text-black">
                <CheckCircle className="h-5 w-5 text-green-700" />
                <span className="text-sm font-medium">{benefit}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-10 flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
          >
            <Button size="lg" variant="secondary" asChild>
              <Link href="/apply" className="flex items-center space-x-2">
                <span>Apply for Membership</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
            className="mt-6 text-sm text-black/70"
          >
            Only €20/month after verification • Cancel anytime • Exclusive member benefits
          </motion.p>
        </div>
      </div>
    </section>
  )
}
