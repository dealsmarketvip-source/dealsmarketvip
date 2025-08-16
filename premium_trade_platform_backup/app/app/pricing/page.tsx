
"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Star, ArrowRight } from "lucide-react"
import { SUBSCRIPTION_PRICE, MAX_ADS_PER_COMPANY } from "@/lib/constants"

const features = [
  "Access to 500+ verified companies",
  `Post up to ${MAX_ADS_PER_COMPANY} active listings`,
  "Direct contact information",
  "Premium categories access",
  "Private network security",
  "Priority customer support",
  "Advanced search filters",
  "Deal tracking tools",
]

const testimonial = {
  quote: "The ROI from our first deal alone covered 2 years of membership fees. This platform is invaluable for serious B2B transactions.",
  author: "Sarah Johnson",
  title: "CEO, Nordic Trade Solutions",
  country: "Sweden"
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50 to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <Badge className="mb-4">
            Premium Membership
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
            One plan, unlimited opportunities. Join the exclusive network today.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16"
        >
          <Card className="relative overflow-hidden border-2 border-yellow-500">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Badge className="flex items-center space-x-1">
                <Star className="h-3 w-3" />
                <span>Most Popular</span>
              </Badge>
            </div>
            
            <CardHeader className="text-center pb-8 pt-12">
              <CardTitle className="text-3xl font-bold">
                Premium Membership
              </CardTitle>
              <CardDescription className="text-lg">
                Everything you need to connect with premium enterprises
              </CardDescription>
              <div className="mt-6">
                <span className="text-5xl font-bold text-gray-900 dark:text-white">
                  €{SUBSCRIPTION_PRICE}
                </span>
                <span className="text-lg text-gray-600 dark:text-gray-300">/month</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Billed monthly • Cancel anytime • No setup fees
              </p>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 space-y-4">
                <Button size="lg" className="w-full" asChild>
                  <Link href="/apply" className="flex items-center justify-center space-x-2">
                    <span>Start Your Application</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                
                <div className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Already have an account?{" "}
                    <Link 
                      href="/auth/signin" 
                      className="text-yellow-600 hover:text-yellow-500 dark:text-yellow-400"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16"
        >
          <Card className="bg-gray-50 dark:bg-gray-900">
            <CardContent className="pt-6">
              <blockquote className="text-center">
                <div className="flex justify-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <p className="text-lg italic text-gray-700 dark:text-gray-300 mb-4">
                  "{testimonial.quote}"
                </p>
                <footer>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.title}
                  </div>
                  <div className="text-sm text-yellow-600 dark:text-yellow-400">
                    {testimonial.country}
                  </div>
                </footer>
              </blockquote>
            </CardContent>
          </Card>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How does the verification process work?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  We manually review each application, verifying company registration, business licenses, 
                  and professional profiles. The process typically takes 2-3 business days.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I cancel my subscription anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Yes, you can cancel your subscription at any time. You'll continue to have access 
                  until the end of your current billing period.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What happens if my application is rejected?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  If your application doesn't meet our verification criteria, we'll provide feedback 
                  and you can reapply with additional documentation.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
