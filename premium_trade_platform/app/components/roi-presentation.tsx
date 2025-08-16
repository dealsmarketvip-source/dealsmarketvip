"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Clock, 
  Crown, 
  CheckCircle, 
  ArrowRight,
  Shield,
  Globe,
  Zap
} from "lucide-react"
import { motion } from "framer-motion"
import { AuthModal } from "./auth-modal"

interface ROIPresentationProps {
  onComplete: () => void
}

export function ROIPresentation({ onComplete }: ROIPresentationProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [accessCode, setAccessCode] = useState("")
  const [showCodeAuth, setShowCodeAuth] = useState(false)

  const slides = [
    {
      title: "Welcome to DealsMarket",
      subtitle: "Where Verified Companies Create Million-Dollar Opportunities",
      content: (
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">👑</div>
          <p className="text-xl text-muted-foreground">
            Join an exclusive network of verified companies making deals worth millions
          </p>
          <div className="grid grid-cols-3 gap-6 mt-8">
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
        </div>
      )
    },
    {
      title: "ROI Analysis: Why Premium Membership Pays",
      subtitle: "Real numbers from real businesses",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Monthly Investment</span>
                <DollarSign className="h-4 w-4 text-primary" />
              </div>
              <div className="text-2xl font-bold text-primary">$20</div>
              <div className="text-xs text-muted-foreground">Premium Access</div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Average Deal Value</span>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-green-500">$125,000</div>
              <div className="text-xs text-muted-foreground">Per successful deal</div>
            </Card>
          </div>
          
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-lg">
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-2">Your ROI Potential</div>
              <div className="text-4xl font-bold text-primary mb-2">625,000%</div>
              <div className="text-sm text-muted-foreground">
                Just ONE deal covers 520+ years of membership
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Monthly membership cost</span>
              <span className="font-medium">$20</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Average deals per member/month</span>
              <span className="font-medium text-green-500">2.3</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Average profit per deal</span>
              <span className="font-medium text-green-500">$125,000</span>
            </div>
            <hr className="border-border" />
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Monthly profit potential</span>
              <span className="text-green-500">$287,500</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Success Stories",
      subtitle: "Real results from our members",
      content: (
        <div className="space-y-6">
          <div className="grid gap-4">
            <Card className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Crown className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">Energy Corp Solutions</div>
                  <div className="text-sm text-muted-foreground mb-2">Oil & Gas Trading</div>
                  <div className="text-lg font-bold text-green-500">$2.4M profit in 3 months</div>
                  <div className="text-xs text-muted-foreground">ROI: 12,000,000%</div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Crown className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">Global Commodities Ltd</div>
                  <div className="text-sm text-muted-foreground mb-2">Precious Metals</div>
                  <div className="text-lg font-bold text-green-500">$850K profit in 6 weeks</div>
                  <div className="text-xs text-muted-foreground">ROI: 4,250,000%</div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Crown className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">International Logistics Pro</div>
                  <div className="text-sm text-muted-foreground mb-2">Supply Chain</div>
                  <div className="text-lg font-bold text-green-500">$1.8M profit in 4 months</div>
                  <div className="text-xs text-muted-foreground">ROI: 9,000,000%</div>
                </div>
              </div>
            </Card>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="h-4 w-4 text-amber-600" />
              <span className="font-semibold text-amber-800 dark:text-amber-200">Average Member Results</span>
            </div>
            <div className="text-sm text-amber-700 dark:text-amber-300">
              Members typically see their first profitable deal within 2-3 weeks
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Exclusive Benefits",
      subtitle: "What you get with Premium Access",
      content: (
        <div className="space-y-6">
          <div className="grid gap-4">
            <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <div className="font-medium">Verified Company Network</div>
                <div className="text-sm text-muted-foreground">Access to 500+ pre-screened companies</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <div className="font-medium">Exclusive Deal Flow</div>
                <div className="text-sm text-muted-foreground">First access to million-dollar opportunities</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <div className="font-medium">Payment Protection</div>
                <div className="text-sm text-muted-foreground">$1M+ transaction insurance included</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <div className="font-medium">24/7 Premium Support</div>
                <div className="text-sm text-muted-foreground">Dedicated account manager</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <div className="font-medium">Advanced Analytics</div>
                <div className="text-sm text-muted-foreground">Market insights and deal analytics</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <div className="font-medium">Global Market Access</div>
                <div className="text-sm text-muted-foreground">Deals from 50+ countries worldwide</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Ready to Join?",
      subtitle: "Choose your access method",
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="text-lg text-muted-foreground mb-4">
              Your investment: <span className="text-2xl font-bold text-primary">$20/month</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Cancel anytime. 30-day money-back guarantee.
            </div>
          </div>

          <div className="grid gap-4">
            <Card className="p-6 border-primary/50">
              <div className="text-center space-y-4">
                <Crown className="h-12 w-12 text-primary mx-auto" />
                <div>
                  <div className="font-bold text-lg">Premium Membership</div>
                  <div className="text-sm text-muted-foreground">Full platform access</div>
                </div>
                <Button 
                  className="w-full gradient-primary" 
                  onClick={() => setShowAuthModal(true)}
                >
                  Register & Pay $20/month
                </Button>
              </div>
            </Card>

            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-2">Or</div>
            </div>

            <Card className="p-6 border-green-500/50">
              <div className="text-center space-y-4">
                <Shield className="h-12 w-12 text-green-500 mx-auto" />
                <div>
                  <div className="font-bold text-lg">Access Code</div>
                  <div className="text-sm text-muted-foreground">Enter your invitation code</div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full border-green-500 text-green-600 hover:bg-green-50"
                  onClick={() => setShowCodeAuth(true)}
                >
                  I Have an Access Code
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )
    }
  ]

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Crown className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">DEALSMARKET</span>
          </div>
          <div className="flex justify-center space-x-2 mb-4">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentSlide ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
          <CardTitle className="text-2xl">{slides[currentSlide].title}</CardTitle>
          <CardDescription className="text-lg">{slides[currentSlide].subtitle}</CardDescription>
        </CardHeader>

        <CardContent className="min-h-[400px]">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {slides[currentSlide].content}
          </motion.div>
        </CardContent>

        <div className="p-6 border-t border-border">
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevSlide}
              disabled={currentSlide === 0}
            >
              Previous
            </Button>

            {currentSlide < slides.length - 1 ? (
              <Button onClick={nextSlide} className="gradient-primary">
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : null}
          </div>
        </div>
      </Card>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />

      {/* Access Code Modal */}
      <Dialog open={showCodeAuth} onOpenChange={setShowCodeAuth}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Enter Access Code</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="access-code">Access Code</Label>
              <Input
                id="access-code"
                placeholder="Enter your invitation code"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="text-center font-mono text-lg"
              />
            </div>
            <Button 
              className="w-full gradient-primary"
              onClick={() => {
                if (accessCode.trim()) {
                  // Handle access code authentication
                  onComplete()
                }
              }}
            >
              Access Marketplace
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Access codes provide instant verification and premium access
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
