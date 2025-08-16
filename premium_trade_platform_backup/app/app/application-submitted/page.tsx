
"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, Mail, ArrowRight } from "lucide-react"

export default function ApplicationSubmittedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-gray-50 dark:from-gray-950 dark:via-green-900/20 dark:to-gray-800">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Application Submitted Successfully!
          </h1>
          
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Thank you for applying to join PremiumTrade. Your application is now under review.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-12"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-yellow-500" />
                <span>What happens next?</span>
              </CardTitle>
              <CardDescription>
                Here's what you can expect during our verification process
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-sm font-semibold text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Document Review</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Our team will verify your company registration and business licenses
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Typically takes 1-2 business days
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-sm font-semibold text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Company Assessment</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      We'll review your company profile and business activities
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Includes LinkedIn and online presence verification
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-sm font-semibold text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Final Decision</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      You'll receive an email with our verification decision
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Complete process typically takes 2-3 business days
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-md bg-blue-50 p-4 dark:bg-blue-950/20">
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Important:</strong> Please check your email regularly, including spam folder. 
                    We'll send all updates regarding your application status to the email address you provided.
                  </p>
                </div>
              </div>

              <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
                <Button asChild className="flex-1">
                  <Link href="/" className="flex items-center justify-center space-x-2">
                    <span>Return to Homepage</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild className="flex-1">
                  <Link href="/about">Learn More About Us</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Questions about your application? Contact us at{" "}
            <a 
              href="mailto:applications@premiumtrade.com" 
              className="text-yellow-600 hover:text-yellow-500 dark:text-yellow-400"
            >
              applications@premiumtrade.com
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
