
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Check, Clock, FileCheck, Building2, Globe, Star, Award } from "lucide-react"
import Link from "next/link"

export default function VerificationPage() {
  const verificationSteps = [
    {
      icon: FileCheck,
      title: "Document Submission",
      description: "Submit your company registration, business license, and tax documents",
      timeline: "1-2 business days"
    },
    {
      icon: Building2,
      title: "Business Verification",
      description: "Our team verifies your company's legal status and operational history",
      timeline: "3-5 business days"
    },
    {
      icon: Globe,
      title: "Background Check",
      description: "Comprehensive review of business reputation and compliance records",
      timeline: "2-3 business days"
    },
    {
      icon: Award,
      title: "Final Approval",
      description: "Receive your verified badge and gain access to premium features",
      timeline: "1 business day"
    }
  ]

  const requirements = [
    "Valid business registration certificate",
    "Corporate bank account documentation",
    "Tax identification number (VAT/TIN)",
    "Proof of business address",
    "Director/owner identification documents",
    "Professional business insurance (if applicable)",
    "Trade license (for specific industries)",
    "Company profile and business description"
  ]

  const verifiedBenefits = [
    "Verified company badge on your profile",
    "Higher search ranking in marketplace",
    "Access to exclusive verified-only deals",
    "Enhanced trust from potential partners",
    "Priority customer support",
    "Advanced security features",
    "Detailed company analytics",
    "Premium networking opportunities"
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
              <Shield className="h-8 w-8 text-accent animate-pulse" />
              <Badge variant="outline" className="text-accent border-accent/50 bg-accent/10">
                Company Verification
              </Badge>
            </div>
            <h1 className="text-5xl font-bold text-foreground mb-6">
              Get Your Company <span className="gradient-text">Verified</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Build trust with potential partners through our comprehensive verification process
            </p>
            
            <div className="flex items-center justify-center gap-8 mb-12">
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text mb-2">7-10 days</div>
                <div className="text-sm text-muted-foreground">Average Processing</div>
              </div>
              <div className="h-12 w-px bg-border"></div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text mb-2">96%</div>
                <div className="text-sm text-muted-foreground">Approval Rate</div>
              </div>
              <div className="h-12 w-px bg-border"></div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text mb-2">FREE</div>
                <div className="text-sm text-muted-foreground">Verification Cost</div>
              </div>
            </div>
          </div>

          {/* Verification Process */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Our <span className="gradient-text">Verification Process</span>
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {verificationSteps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="gradient-card p-6 rounded-2xl border border-border/30 hover:border-accent/50 transition-all duration-300 glow-card text-center h-full">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    
                    <div className="mt-4 mb-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-2xl mb-4">
                        <step.icon className="h-8 w-8 text-accent" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                        {step.description}
                      </p>
                      <div className="inline-flex items-center gap-2 text-accent font-medium text-sm">
                        <Clock className="h-4 w-4" />
                        {step.timeline}
                      </div>
                    </div>
                  </div>
                  
                  {/* Connector line */}
                  {index < verificationSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-gradient-to-r from-accent to-transparent"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Requirements and Benefits */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Requirements */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-8">
                Required <span className="gradient-text">Documents</span>
              </h2>
              
              <div className="space-y-4">
                {requirements.map((requirement, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 gradient-card rounded-xl border border-border/30 hover:border-accent/50 transition-all duration-300">
                    <div className="flex-shrink-0 w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center mt-1">
                      <Check className="h-4 w-4 text-accent" />
                    </div>
                    <p className="text-foreground font-medium">{requirement}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-8">
                Verification <span className="gradient-text">Benefits</span>
              </h2>
              
              <div className="space-y-4">
                {verifiedBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 gradient-card rounded-xl border border-border/30 hover:border-primary/50 transition-all duration-300">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                      <Star className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-foreground font-medium">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center gradient-card p-12 rounded-3xl border border-accent/20 glow-card">
            <Shield className="h-16 w-16 text-accent mx-auto mb-6 animate-pulse" />
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Get Verified?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of verified companies and build trust with your business partners
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground hover:scale-105 px-12 py-4 rounded-2xl font-semibold text-lg shadow-2xl transition-all duration-300 glow-accent">
                <Shield className="mr-2 h-5 w-5" />
                Start Verification Process
              </Button>
              <Link href="/membership">
                <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10 px-12 py-4 rounded-2xl font-semibold text-lg transition-all duration-300">
                  View Membership Benefits
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
