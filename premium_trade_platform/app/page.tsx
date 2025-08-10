"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown, Users, DollarSign, Globe, ArrowRight, CheckCircle, Zap } from "lucide-react"
import { motion } from "framer-motion"
import { ROIPresentation } from "./components/roi-presentation"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { SupabaseConfigGuide } from "@/components/supabase-config-guide"

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
      {/* Header */}
      <header className="w-full py-6 px-6 bg-background/80 backdrop-blur-xl border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Crown className="h-8 w-8 text-primary" />
            <div>
              <div className="text-2xl font-bold text-foreground">DEALSMARKET</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">
                WHERE VERIFIED COMPANIES TRADE EXCELLENCE
              </div>
            </div>
          </div>
          <Button onClick={handleGetStarted} className="gradient-primary">
            <Crown className="mr-2 h-4 w-4" />
            Join Premium
          </Button>
        </div>
      </header>

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
                <Badge className="gradient-primary text-primary-foreground font-bold text-lg px-4 py-2">
                  Join Verified Companies - $20/month Premium Access
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold text-foreground">
                  Million-Dollar
                  <span className="gradient-text block">
                    Opportunities
                  </span>
                  <span className="text-3xl lg:text-4xl text-muted-foreground block mt-2">
                    For Verified Companies
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground">
                  Access exclusive deals from 500+ verified companies worldwide. 
                  Premium members see average profits of $125,000 per deal.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">$50M+</div>
                  <div className="text-sm text-muted-foreground">Monthly Volume</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">500+</div>
                  <div className="text-sm text-muted-foreground">Verified Companies</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">98%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="gradient-primary text-lg h-14 px-8"
                  onClick={handleGetStarted}
                >
                  <Crown className="mr-2 h-5 w-5" />
                  Start Premium Access
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg h-14 px-8"
                  onClick={handleGetStarted}
                >
                  View ROI Analysis
                </Button>
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
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary/10 p-8">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Fbb4e3e92cab047208a04cf5bc83d08ce%2F0283b7c72289489999c68d7349faf914?format=webp&width=800"
                  alt="Premium Trading Platform"
                  className="w-full h-auto rounded-lg shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent"></div>
              </div>
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
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Verified Network</CardTitle>
                <CardDescription>
                  Access 500+ pre-screened companies with verified credentials
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <DollarSign className="h-12 w-12 text-green-500 mb-4" />
                <CardTitle>High-Value Deals</CardTitle>
                <CardDescription>
                  Average deal value of $125,000 with payment protection included
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Globe className="h-12 w-12 text-blue-500 mb-4" />
                <CardTitle>Global Reach</CardTitle>
                <CardDescription>
                  Access deals from 50+ countries with 24/7 premium support
                </CardDescription>
              </CardHeader>
            </Card>
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
            <Card className="p-6">
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Crown className="h-8 w-8 text-primary" />
                  <div>
                    <div className="font-bold">Energy Corp Solutions</div>
                    <div className="text-sm text-muted-foreground">Oil & Gas Trading</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-green-500">$2.4M profit</div>
                <div className="text-sm text-muted-foreground">in 3 months</div>
                <div className="text-xs text-muted-foreground">ROI: 12,000,000%</div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Crown className="h-8 w-8 text-primary" />
                  <div>
                    <div className="font-bold">Global Commodities Ltd</div>
                    <div className="text-sm text-muted-foreground">Precious Metals</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-green-500">$850K profit</div>
                <div className="text-sm text-muted-foreground">in 6 weeks</div>
                <div className="text-xs text-muted-foreground">ROI: 4,250,000%</div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Crown className="h-8 w-8 text-primary" />
                  <div>
                    <div className="font-bold">International Logistics Pro</div>
                    <div className="text-sm text-muted-foreground">Supply Chain</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-green-500">$1.8M profit</div>
                <div className="text-sm text-muted-foreground">in 4 months</div>
                <div className="text-xs text-muted-foreground">ROI: 9,000,000%</div>
              </CardContent>
            </Card>
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
            <Card className="p-6 border-primary/50">
              <div className="text-center space-y-4">
                <Crown className="h-12 w-12 text-primary mx-auto" />
                <div>
                  <div className="font-bold text-lg">Premium Membership</div>
                  <div className="text-sm text-muted-foreground">$20/month</div>
                </div>
                <Button 
                  className="w-full gradient-primary" 
                  onClick={handleGetStarted}
                >
                  Start Premium Access
                </Button>
              </div>
            </Card>

            <Card className="p-6 border-green-500/50">
              <div className="text-center space-y-4">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <div>
                  <div className="font-bold text-lg">Access Code</div>
                  <div className="text-sm text-muted-foreground">Instant verification</div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full border-green-500 text-green-600 hover:bg-green-50"
                  onClick={handleGetStarted}
                >
                  Enter Access Code
                </Button>
              </div>
            </Card>
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
