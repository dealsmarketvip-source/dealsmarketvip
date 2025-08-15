"use client"

import { useState, useEffect } from "react"
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
import { useNavigationWithLoading } from "@/components/page-transition-provider"

// Import the WelcomePanel component directly since lazy loading is causing issues
import { WelcomePanel } from "@/components/WelcomePanel"

export default function HomePage() {
  const [showWelcomePanel, setShowWelcomePanel] = useState(false)
  const { user } = useAuth()
  const router = useRouter()
  const { navigateTo } = useNavigationWithLoading()

  // Track page view
  useEffect(() => {
    analytics.trackView({
      page: 'homepage',
      userId: user?.id
    });
  }, []);

  // Removed auto-redirect to prevent fetch errors
  // Users can manually navigate using buttons instead

  const handleGetStarted = () => {
    analytics.trackClick({
      element: 'get_started_button',
      location: 'hero_section',
      userId: user?.id
    });

    if (user) {
      navigateTo('/marketplace')
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
                European B2B Marketplace
                <span className="text-primary block">Connecting Buyers & Sellers</span>
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Post what you're selling. Find what you need. Connect with verified European businesses for million-euro deals with complete security and verification.
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
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">€125K</div>
                  <div className="text-sm text-muted-foreground">Average Deal Value</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">847</div>
                  <div className="text-sm text-muted-foreground">Active Listings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">2,341</div>
                  <div className="text-sm text-muted-foreground">Successful Connections</div>
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
            <h2 className="text-4xl font-bold text-foreground mb-4">How DealsMarket Works</h2>
            <p className="text-xl text-muted-foreground">Connect buyers and sellers in Europe's most trusted B2B marketplace</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Store className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Post Your Services</CardTitle>
                <CardDescription>
                  List what you're selling or create a "Wanted Post" for what you need. Reach verified buyers and sellers across Europe.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-green-500 mb-4" />
                <CardTitle>Connect & Negotiate</CardTitle>
                <CardDescription>
                  Direct communication with verified businesses. Negotiate terms, pricing, and delivery details securely.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <DollarSign className="h-12 w-12 text-blue-500 mb-4" />
                <CardTitle>Close Deals Safely</CardTitle>
                <CardDescription>
                  Complete transactions with payment protection, escrow services, and legal compliance across all EU jurisdictions.
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
            <h2 className="text-4xl font-bold text-foreground mb-6">Your European B2B Connection</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Just like FindersFee connects businesses globally, DealsMarket specializes in European B2B connections. Post services, find suppliers, and create lasting business relationships.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-foreground">Marketplace for Business Services</h3>
              <p className="text-lg text-muted-foreground">
                Whether you're offering services or searching for suppliers, our platform connects European businesses for mutually beneficial partnerships. Every member is verified for authenticity and capability.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Post services or "Wanted" listings</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Connect with verified European businesses</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>10% success fee on completed transactions</span>
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
            <h2 className="text-4xl font-bold text-foreground mb-6">Services & Wanted Posts</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Two powerful ways to connect: Offer your services to European businesses or post exactly what you're looking for. Our verification system ensures quality connections.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 hover:shadow-xl transition-all hover:scale-[1.02] border-blue-500/20">
              <CardHeader>
                <ShoppingBag className="h-16 w-16 text-blue-500 mb-4 mx-auto" />
                <CardTitle className="text-xl text-center">Service Listings</CardTitle>
                <CardDescription className="text-center">
                  Showcase your business services to a network of verified European companies. From manufacturing to consulting, connect with buyers actively seeking your expertise.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-all hover:scale-[1.02] border-green-500/20">
              <CardHeader>
                <DollarSign className="h-16 w-16 text-green-500 mb-4 mx-auto" />
                <CardTitle className="text-xl text-center">Wanted Posts</CardTitle>
                <CardDescription className="text-center">
                  Tell us exactly what you need and let verified suppliers come to you. Post your requirements and receive proposals from qualified European service providers.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Card className="p-8 border-primary/20">
              <CardHeader>
                <h3 className="text-2xl font-bold text-primary mb-4">Success Fee Model</h3>
                <p className="text-lg text-muted-foreground">
                  Only pay when you succeed. We charge a 10% commission on completed transactions, aligning our success with yours. No upfront fees, no hidden costs.
                </p>
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
      <WelcomePanel
        isOpen={showWelcomePanel}
        onClose={() => setShowWelcomePanel(false)}
      />
    </div>
  )
}
