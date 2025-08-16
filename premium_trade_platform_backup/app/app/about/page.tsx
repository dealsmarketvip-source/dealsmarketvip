
"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Shield, 
  Users, 
  Globe, 
  TrendingUp,
  Building2,
  Star,
  CheckCircle,
  ArrowRight
} from "lucide-react"
import Link from "next/link"

const values = [
  {
    name: "Trust & Verification",
    description: "Every member undergoes rigorous verification to ensure authenticity and credibility.",
    icon: Shield,
  },
  {
    name: "Exclusive Network",
    description: "Private platform connecting only the most established European and Middle Eastern enterprises.",
    icon: Users,
  },
  {
    name: "Global Reach",
    description: "Facilitating cross-border transactions across strategic markets and regions.",
    icon: Globe,
  },
  {
    name: "Premium Focus",
    description: "Specialized in high-value transactions and luxury business opportunities.",
    icon: TrendingUp,
  },
]

const milestones = [
  { year: "2019", title: "Platform Founded", description: "Launched with 50 verified companies" },
  { year: "2020", title: "European Expansion", description: "Reached 200+ companies across 15 countries" },
  { year: "2021", title: "Middle East Entry", description: "Extended network to Gulf and MENA region" },
  { year: "2022", title: "€1B+ Facilitated", description: "Milestone in transaction volume reached" },
  { year: "2023", title: "500 Companies", description: "Premium network of verified enterprises" },
  { year: "2024", title: "€2B+ Volume", description: "Doubled our transaction facilitation" },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-yellow-50 to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Badge className="mb-4">
              About PremiumTrade
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              Connecting Premium
              <span className="block text-gradient">Business Enterprises</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-300">
              We've built the most exclusive B2B marketplace for verified companies dealing in 
              high-value products across Europe and the Middle East.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Our Mission
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-xl text-gray-600 dark:text-gray-300">
              To create the world's most trusted and exclusive platform for premium business 
              transactions, connecting verified enterprises and facilitating high-value deals 
              with complete security and transparency.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Our Core Values
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <motion.div
                key={value.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center h-full">
                  <CardHeader>
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-lg bg-yellow-500">
                      <value.icon className="h-8 w-8 text-black" />
                    </div>
                    <CardTitle className="mt-4">{value.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Our Journey
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Key milestones in building the premier B2B platform
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-yellow-500 transform -translate-x-1/2"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'justify-start' : 'justify-end'
                  }`}
                >
                  <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <Card>
                      <CardHeader>
                        <div className="flex items-center space-x-2">
                          <Badge className="text-xs">{milestone.year}</Badge>
                          {index % 2 !== 0 && <Badge className="text-xs">{milestone.year}</Badge>}
                        </div>
                        <CardTitle className="text-lg">{milestone.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 dark:text-gray-300">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="absolute left-1/2 w-4 h-4 bg-yellow-500 rounded-full transform -translate-x-1/2 border-4 border-white dark:border-gray-950"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Platform Impact
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              The numbers speak for themselves
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "Verified Companies", value: "500+", icon: Building2 },
              { name: "Countries Covered", value: "35+", icon: Globe },
              { name: "Deals Facilitated", value: "€2B+", icon: TrendingUp },
              { name: "Platform Rating", value: "4.9/5", icon: Star },
            ].map((stat, index) => (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <stat.icon className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {stat.name}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-yellow-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
              Ready to Join Our Network?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-black/80">
              Apply for membership and gain access to exclusive business opportunities 
              with verified premium enterprises.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/apply" className="flex items-center space-x-2">
                  <span>Apply for Membership</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
