
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Star, Shield, Clock, Users } from "lucide-react"
import Link from "next/link"

export default function MembershipPage() {
  const benefits = [
    "Post up to 5 active listings",
    "Direct contact with verified companies",
    "Access to exclusive deals and opportunities", 
    "Priority customer support",
    "Market insights and analytics",
    "Secure transaction facilitation",
    "Global network access across Europe & Middle East",
    "Verification badge for your company profile"
  ]

  const memberStats = [
    { icon: Users, label: "Verified Companies", value: "2,847" },
    { icon: Clock, label: "Active Deals", value: "1,523" },
    { icon: Shield, label: "Countries", value: "47" },
    { icon: Star, label: "Success Rate", value: "94%" }
  ]

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse glow-primary"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse glow-accent" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="w-full py-6 px-6 bg-background/80 backdrop-blur-xl border-b border-border/50">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex flex-col items-start">
              <span className="text-foreground text-2xl font-bold tracking-tight gradient-text">DEALSMARKET</span>
              <span className="text-muted-foreground text-xs font-medium uppercase tracking-widest">WHERE VERIFIED COMPANIES TRADE EXCELLENCE</span>
            </Link>
            <Link href="/">
              <Button variant="outline" className="hover:bg-muted/50">
                Back to Home
              </Button>
            </Link>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-6 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Crown className="h-8 w-8 text-primary" />
              <Badge variant="outline" className="text-primary border-primary/50 bg-primary/10">
                Premium Membership
              </Badge>
            </div>
            <h1 className="text-5xl font-bold text-foreground mb-6">
              Join the Elite Network of <span className="gradient-text">Verified Companies</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Connect with Europe's and the Middle East's most trusted businesses for high-value B2B transactions
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              {memberStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mb-3 glow-primary">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Section */}
          <div className="max-w-2xl mx-auto mb-16">
            <div className="gradient-card p-8 rounded-3xl border border-primary/20 relative overflow-hidden glow-card">
              <div className="absolute top-0 right-0 bg-primary/10 text-primary px-6 py-2 rounded-bl-2xl font-semibold">
                Most Popular
              </div>
              
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Crown className="h-6 w-6 text-primary" />
                  <span className="text-2xl font-bold text-foreground">Premium Access</span>
                </div>
                
                <div className="flex items-baseline justify-center gap-2 mb-6">
                  <span className="text-5xl font-bold gradient-text">€20</span>
                  <span className="text-muted-foreground text-lg">/month</span>
                </div>
                
                <p className="text-muted-foreground mb-8">
                  Everything you need to connect with verified companies and close premium deals
                </p>

                <Button className="w-full gradient-primary text-primary-foreground hover:scale-105 px-8 py-4 rounded-2xl font-semibold text-lg shadow-2xl transition-all duration-300 glow-primary pulse-glow">
                  <Crown className="mr-2 h-5 w-5" />
                  Start Your Membership
                </Button>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              What's Included in Your <span className="gradient-text">Premium Membership</span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-4 p-6 gradient-card rounded-2xl border border-border/30 hover:border-primary/50 transition-all duration-300 glow-card">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-foreground font-medium text-lg leading-relaxed">
                      {benefit}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center gradient-card p-12 rounded-3xl border border-primary/20 glow-card">
            <Crown className="h-16 w-16 text-primary mx-auto mb-6 animate-bounce" />
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Join Europe's Premier B2B Network?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Start connecting with verified companies today and unlock exclusive high-value opportunities
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="gradient-primary text-primary-foreground hover:scale-105 px-12 py-4 rounded-2xl font-semibold text-lg shadow-2xl transition-all duration-300 glow-primary">
                <Crown className="mr-2 h-5 w-5" />
                Join Now - €20/month
              </Button>
              <Link href="/verification">
                <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10 px-12 py-4 rounded-2xl font-semibold text-lg transition-all duration-300">
                  <Shield className="mr-2 h-5 w-5" />
                  Learn About Verification
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
