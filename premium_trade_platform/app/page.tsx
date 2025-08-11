"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown, Users, DollarSign, Globe, ArrowRight, CheckCircle, Zap } from "lucide-react"
import { motion } from "framer-motion"
import { Store, ShoppingBag } from "lucide-react"
import { ROIPresentation } from "./components/roi-presentation"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const [showROIPresentation, setShowROIPresentation] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  // Redirect to marketplace if already authenticated
  useEffect(() => {
    if (user) {
      router.push('/marketplace')
    }
  }, [user, router])

  const handleGetStarted = () => {
    setShowROIPresentation(true)
  }

  const handleROIComplete = () => {
    setShowROIPresentation(false)
    router.push('/marketplace')
  }

  if (showROIPresentation) {
    return <ROIPresentation onComplete={handleROIComplete} />
  }

  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <motion.div
                  animate={{
                    y: [0, -5, 0],
                    scale: [1, 1.02, 1]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Badge className="gradient-primary text-primary-foreground font-bold text-lg px-4 py-2 glow-primary-strong shimmer">
                    Join Verified Companies - $20/month Premium Access
                  </Badge>
                </motion.div>
                <motion.h1
                  className="text-5xl lg:text-6xl font-bold text-foreground glow-text"
                  animate={{
                    textShadow: [
                      "0 2px 8px rgba(255, 215, 0, 0.3)",
                      "0 4px 16px rgba(255, 215, 0, 0.5)",
                      "0 2px 8px rgba(255, 215, 0, 0.3)"
                    ]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  Million-Dollar
                  <span className="gradient-text block pulse-glow">
                    Opportunities
                  </span>
                  <span className="text-3xl lg:text-4xl text-muted-foreground block mt-2">
                    For Verified Companies
                  </span>
                </motion.h1>
                <p className="text-xl text-muted-foreground">
                  Access exclusive deals from 500+ verified companies worldwide. 
                  Premium members see average profits of $125,000 per deal.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <motion.div
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                >
                  <div className="text-3xl font-bold text-primary glow-primary shimmer">$50M+</div>
                  <div className="text-sm text-muted-foreground">Monthly Volume</div>
                </motion.div>
                <motion.div
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                >
                  <div className="text-3xl font-bold text-primary glow-primary shimmer">500+</div>
                  <div className="text-sm text-muted-foreground">Verified Companies</div>
                </motion.div>
                <motion.div
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                >
                  <div className="text-3xl font-bold text-primary glow-primary shimmer">98%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </motion.div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    className="gradient-primary text-lg h-14 px-8 glow-primary-strong pulse-glow shimmer"
                    onClick={handleGetStarted}
                  >
                    <Crown className="mr-2 h-5 w-5" />
                    Start Premium Access
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg h-14 px-8 glow-card-hover border-primary/50 hover:bg-primary/10"
                    onClick={handleGetStarted}
                  >
                    View ROI Analysis
                  </Button>
                </motion.div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="h-4 w-4 text-green-600" />
                  <span className="font-semibold text-green-800 dark:text-green-200">625,000% ROI Potential</span>
                </div>
                <div className="text-sm text-green-700 dark:text-green-300">
                  Just one deal covers 520+ years of membership costs
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <motion.div
                className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary/10 p-8 glow-card-hover"
                whileHover={{ scale: 1.02 }}
                animate={{
                  boxShadow: [
                    "0 4px 16px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(255, 215, 0, 0.05)",
                    "0 8px 32px rgba(255, 215, 0, 0.15), 0 4px 16px rgba(255, 215, 0, 0.1)",
                    "0 4px 16px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(255, 215, 0, 0.05)"
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <motion.img
                  src="https://images.pexels.com/photos/26954166/pexels-photo-26954166.jpeg"
                  alt="Luxury Sports Car - Premium Performance"
                  className="w-full h-auto rounded-lg shadow-2xl"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent"></div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Why Premium Members Choose Us</h2>
            <p className="text-xl text-muted-foreground">Exclusive benefits that pay for themselves with your first deal</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 glow-card-hover transition-all duration-300 border-primary/20">
                <CardHeader>
                  <motion.div
                    animate={{ rotateY: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Users className="h-12 w-12 text-primary mb-4 glow-primary" />
                  </motion.div>
                  <CardTitle className="glow-text">Verified Network</CardTitle>
                  <CardDescription>
                    Access 500+ pre-screened companies with verified credentials
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 glow-card-hover transition-all duration-300 border-green-500/20">
                <CardHeader>
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <DollarSign className="h-12 w-12 text-green-500 mb-4" style={{
                      filter: "drop-shadow(0 4px 8px rgba(34, 197, 94, 0.3))"
                    }} />
                  </motion.div>
                  <CardTitle className="text-green-400">High-Value Deals</CardTitle>
                  <CardDescription>
                    Average deal value of $125,000 with payment protection included
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 glow-card-hover transition-all duration-300 border-blue-500/20">
                <CardHeader>
                  <motion.div
                    animate={{
                      rotateX: [0, 360],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <Globe className="h-12 w-12 text-blue-500 mb-4" style={{
                      filter: "drop-shadow(0 4px 8px rgba(59, 130, 246, 0.3))"
                    }} />
                  </motion.div>
                  <CardTitle className="text-blue-400">Global Reach</CardTitle>
                  <CardDescription>
                    Access deals from 50+ countries with 24/7 premium support
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Success Stories</h2>
            <p className="text-xl text-muted-foreground">Real results from our premium members</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ scale: 1.03, rotate: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 glow-card-hover border-primary/30">
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <motion.div
                      animate={{
                        rotateZ: [0, 15, -15, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    >
                      <Crown className="h-8 w-8 text-primary glow-primary" />
                    </motion.div>
                    <div>
                      <div className="font-bold glow-text">Energy Corp Solutions</div>
                      <div className="text-sm text-muted-foreground">Oil & Gas Trading</div>
                    </div>
                  </div>
                  <motion.div
                    className="text-2xl font-bold text-green-500"
                    animate={{
                      textShadow: [
                        "0 0 10px rgba(34, 197, 94, 0.5)",
                        "0 0 20px rgba(34, 197, 94, 0.8)",
                        "0 0 10px rgba(34, 197, 94, 0.5)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    $2.4M profit
                  </motion.div>
                  <div className="text-sm text-muted-foreground">in 3 months</div>
                  <div className="text-xs text-muted-foreground">ROI: 12,000,000%</div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03, rotate: -1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 glow-card-hover border-primary/30">
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <motion.div
                      animate={{
                        rotateZ: [0, -15, 15, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                    >
                      <Crown className="h-8 w-8 text-primary glow-primary" />
                    </motion.div>
                    <div>
                      <div className="font-bold glow-text">Global Commodities Ltd</div>
                      <div className="text-sm text-muted-foreground">Precious Metals</div>
                    </div>
                  </div>
                  <motion.div
                    className="text-2xl font-bold text-green-500"
                    animate={{
                      textShadow: [
                        "0 0 10px rgba(34, 197, 94, 0.5)",
                        "0 0 20px rgba(34, 197, 94, 0.8)",
                        "0 0 10px rgba(34, 197, 94, 0.5)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                  >
                    $850K profit
                  </motion.div>
                  <div className="text-sm text-muted-foreground">in 6 weeks</div>
                  <div className="text-xs text-muted-foreground">ROI: 4,250,000%</div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03, rotate: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 glow-card-hover border-primary/30">
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <motion.div
                      animate={{
                        rotateZ: [0, 20, -10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
                    >
                      <Crown className="h-8 w-8 text-primary glow-primary" />
                    </motion.div>
                    <div>
                      <div className="font-bold glow-text">International Logistics Pro</div>
                      <div className="text-sm text-muted-foreground">Supply Chain</div>
                    </div>
                  </div>
                  <motion.div
                    className="text-2xl font-bold text-green-500"
                    animate={{
                      textShadow: [
                        "0 0 10px rgba(34, 197, 94, 0.5)",
                        "0 0 20px rgba(34, 197, 94, 0.8)",
                        "0 0 10px rgba(34, 197, 94, 0.5)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                  >
                    $1.8M profit
                  </motion.div>
                  <div className="text-sm text-muted-foreground">in 4 months</div>
                  <div className="text-xs text-muted-foreground">ROI: 9,000,000%</div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold text-foreground">
            Ready to Access Million-Dollar Opportunities?
          </h2>
          <p className="text-xl text-muted-foreground">
            Join 500+ verified companies already profiting from exclusive deals
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 border-primary/50 glow-card-hover">
                <div className="text-center space-y-4">
                  <motion.div
                    animate={{
                      rotateY: [0, 360],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Crown className="h-12 w-12 text-primary mx-auto glow-primary-strong" />
                  </motion.div>
                  <div>
                    <div className="font-bold text-lg glow-text">Premium Membership</div>
                    <div className="text-sm text-muted-foreground">$20/month</div>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      className="w-full gradient-primary glow-primary-strong pulse-glow shimmer"
                      onClick={handleGetStarted}
                    >
                      Start Premium Access
                    </Button>
                  </motion.div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 border-green-500/50 glow-card-hover">
                <div className="text-center space-y-4">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto" style={{
                      filter: "drop-shadow(0 4px 8px rgba(34, 197, 94, 0.4))"
                    }} />
                  </motion.div>
                  <div>
                    <div className="font-bold text-lg text-green-400">Access Code</div>
                    <div className="text-sm text-muted-foreground">Instant verification</div>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full border-green-500 text-green-600 hover:bg-green-50 glow-accent"
                      onClick={handleGetStarted}
                    >
                      Enter Access Code
                    </Button>
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          </div>

          <p className="text-sm text-muted-foreground">
            30-day money-back guarantee • Cancel anytime • $1M+ transaction protection
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Crown className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">DEALSMARKET</span>
          </div>
          <p className="text-muted-foreground">
            © 2024 DealsMarket. All rights reserved. Where verified companies trade excellence.
          </p>
        </div>
      </footer>
    </div>
  )
}
