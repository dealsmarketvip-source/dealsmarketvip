"use client"

import { Button } from "@/components/ui/button"
import { Crown, Users, DollarSign, Globe } from "lucide-react"

export default function HomePage() {
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
                <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80">
                  Join Now
                </Button>
                <Button variant="outline" size="lg">
                  View ROI Analysis
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
