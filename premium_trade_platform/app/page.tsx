"use client"

import { useState, useEffect, Suspense, lazy } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown, Users, DollarSign, Globe, ArrowRight, CheckCircle, Zap, Shield } from "lucide-react"
import { motion } from "framer-motion"
import { Store, ShoppingBag } from "lucide-react"
import { useAuth } from "@/hooks/use-auth-instant"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { analytics } from "@/lib/analytics"

// Lazy load heavy components for better performance
const { WelcomePanel } = await import("@/components/WelcomePanel")

export default function HomePage() {
  const [showWelcomePanel, setShowWelcomePanel] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  // Track page view
  useEffect(() => {
    analytics.trackView('homepage');
  }, []);

  // Removed auto-redirect to prevent fetch errors
  // Users can manually navigate using buttons instead

  const handleGetStarted = () => {
    analytics.trackClick('get_started_button', {
      authenticated: !!user,
      location: 'hero_section'
    });

    if (user) {
      window.location.href = '/marketplace'
    } else {
      setShowWelcomePanel(true)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-center gap-3 mb-6">
                <Crown className="h-8 w-8 text-primary" />
                <span className="text-primary font-bold text-lg">DEALSMARKET</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                Where Verified Companies
                <span className="text-primary block">Trade Excellence</span>
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Exclusive B2B marketplace connecting verified companies in Europe and the Middle East for premium deals worth millions.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-primary/80"
                  onClick={handleGetStarted}
                >
                  Instant Access
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg" onClick={handleGetStarted}>
                  View ROI Analysis
                </Button>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">€50M+</div>
                  <div className="text-sm text-muted-foreground">Monthly Volume</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">500+</div>
                  <div className="text-sm text-muted-foreground">Verified Companies</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">98%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 1, -1, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Image
                  src="https://images.pexels.com/photos/28891887/pexels-photo-28891887.jpeg"
                  alt="Modern Luxury Car Dealership - Premium Business Environment"
                  width={800}
                  height={600}
                  className="w-full h-auto rounded-xl shadow-2xl glow-primary"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{
                    filter: "drop-shadow(0 0 20px rgba(255, 215, 0, 0.3))"
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent"></div>
              </motion.div>
            </div>
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

      {/* What We Do Section */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">What We Do</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              DealsMarket is Europe's premier B2B marketplace where verified companies create million-dollar opportunities through secure, high-value transactions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-foreground">Connecting Enterprise Excellence</h3>
              <p className="text-lg text-muted-foreground">
                We facilitate exclusive business relationships between verified companies across Europe and the Middle East, ensuring every transaction meets the highest standards of security and profitability.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Rigorous company verification process</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Secure payment protection on all deals</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Real-time market intelligence and analytics</span>
                </li>
              </ul>
            </div>
            <div className="relative">
              <Image
                src="https://images.pexels.com/photos/7415132/pexels-photo-7415132.jpeg"
                alt="Business meeting - Professional collaboration"
                width={600}
                height={400}
                className="rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How We Help Progress Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">How We Help Your Business Progress</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform provides the tools, connections, and security your enterprise needs to scale internationally and achieve unprecedented growth.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 hover:shadow-xl transition-all hover:scale-[1.02] border-primary/20">
              <CardHeader>
                <Globe className="h-16 w-16 text-primary mb-4 mx-auto" />
                <CardTitle className="text-xl text-center">Global Market Access</CardTitle>
                <CardDescription className="text-center">
                  Expand your reach across 50+ countries with our verified partner network, opening doors to markets previously inaccessible.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-all hover:scale-[1.02] border-green-500/20">
              <CardHeader>
                <DollarSign className="h-16 w-16 text-green-500 mb-4 mx-auto" />
                <CardTitle className="text-xl text-center">Revenue Acceleration</CardTitle>
                <CardDescription className="text-center">
                  Our members report 300% average revenue growth within 12 months of joining, with deals averaging $125,000.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-all hover:scale-[1.02] border-blue-500/20">
              <CardHeader>
                <Zap className="h-16 w-16 text-blue-500 mb-4 mx-auto" />
                <CardTitle className="text-xl text-center">Operational Excellence</CardTitle>
                <CardDescription className="text-center">
                  Streamline your B2B operations with our advanced analytics, automated matching, and 24/7 premium support.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">Why Stay With DealsMarket</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Once you experience the power of our platform, you'll understand why 98% of our members renew their subscriptions year after year.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <Shield className="h-8 w-8 text-primary mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Unmatched Security</h3>
                  <p className="text-muted-foreground">
                    Every transaction is protected by our enterprise-grade security protocols, with full escrow services and legal compliance across all jurisdictions.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Users className="h-8 w-8 text-blue-500 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Exclusive Network</h3>
                  <p className="text-muted-foreground">
                    Join an elite community of verified companies that have already proven their success. Network with industry leaders and build relationships that last.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <DollarSign className="h-8 w-8 text-green-500 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">ROI Guarantee</h3>
                  <p className="text-muted-foreground">
                    We're so confident in our platform that we guarantee you'll see positive ROI within 90 days, or we'll refund your membership completely.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Card className="p-6 text-center border-primary/20">
                <div className="text-3xl font-bold text-primary mb-2">€2.5M</div>
                <div className="text-sm text-muted-foreground">Average Annual Deal Volume per Member</div>
              </Card>
              <Card className="p-6 text-center border-green-500/20">
                <div className="text-3xl font-bold text-green-500 mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">Premium Support Available</div>
              </Card>
              <Card className="p-6 text-center border-blue-500/20">
                <div className="text-3xl font-bold text-blue-500 mb-2">15min</div>
                <div className="text-sm text-muted-foreground">Average Response Time</div>
              </Card>
              <Card className="p-6 text-center border-purple-500/20">
                <div className="text-3xl font-bold text-purple-500 mb-2">150+</div>
                <div className="text-sm text-muted-foreground">Industries Represented</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to Join Europe's Most Exclusive B2B Marketplace?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Start connecting with verified companies and close your next million-dollar deal
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-primary/80 text-lg px-8 py-4"
              onClick={handleGetStarted}
            >
              <Crown className="mr-2 h-5 w-5" />
              Instant Access
            </Button>
          </div>
        </div>
      </section>

      {/* Welcome Panel */}
      <Suspense fallback={null}>
        <WelcomePanel
          isOpen={showWelcomePanel}
          onClose={() => setShowWelcomePanel(false)}
        />
      </Suspense>
    </div>
  )
}
