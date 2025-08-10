"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Crown, Sparkles, ArrowRight, TrendingUp } from "lucide-react"
import Link from "next/link"
import { LoadingAnimation, SectionReveal, NavLinkAnimation, CategoryCardAnimation } from "@/components/loading-animation"
import { usePageLoading } from "@/hooks/use-page-loading"
import { CrownLogoWithBrand } from "@/components/ui/crown-logo"
import { AuthModal } from "@/components/auth/auth-modal"

export default function StaticLandingPage() {
  const { isLoading, navigateWithLoading } = usePageLoading()
  const [activeSection, setActiveSection] = useState("home")
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authDefaultTab, setAuthDefaultTab] = useState<"login" | "register">("login")
  const categories = [
    { name: "Oil & Gas", icon: "⛽" },
    { name: "Commodities", icon: "📦" },
    { name: "Luxury Assets", icon: "💎" },
    { name: "Real Estate", icon: "🏢" },
    { name: "Financial Instruments", icon: "💰" },
    { name: "Luxury Vehicles", icon: "🏎️" },
    { name: "Energy & Renewables", icon: "🔋" },
    { name: "Investment Opportunities", icon: "📈" },
  ]

  return (
    <>
      {/* Global Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center">
          <LoadingAnimation isLoading={true}>
            <div></div>
          </LoadingAnimation>
        </div>
      )}

      <div className="min-h-screen bg-background relative overflow-hidden pb-0">
      <div className="relative z-10">
        <main className="relative">
          <section className="flex flex-col items-center relative mx-auto overflow-hidden min-h-screen">
            {/* Background Effects - Restored Strong Glows */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse glow-primary"></div>
              <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse glow-accent" style={{animationDelay: '1s'}}></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl glow-primary-strong"></div>
            </div>

            <div className="w-full relative z-10">
              {/* Header */}
              <header className="w-full py-6 px-6 bg-background/80 backdrop-blur-xl border-b border-border/50 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-8">
                      <CrownLogoWithBrand />
                      <nav className="hidden md:flex items-center gap-2">
                        <NavLinkAnimation isActive={activeSection === "marketplace"}>
                          <Link
                            href="/marketplace"
                            className="text-muted-foreground hover:text-primary px-4 py-2 rounded-full font-medium transition-all duration-300 hover:bg-muted/50"
                            onClick={(e) => {
                              e.preventDefault()
                              navigateWithLoading("marketplace", () => {
                                setActiveSection("marketplace")
                                window.location.href = "/marketplace"
                              })
                            }}
                          >
                            Marketplace
                          </Link>
                        </NavLinkAnimation>
                        <NavLinkAnimation isActive={activeSection === "membership"}>
                          <Link
                            href="/membership"
                            className="text-muted-foreground hover:text-primary px-4 py-2 rounded-full font-medium transition-all duration-300 hover:bg-muted/50"
                            onClick={(e) => {
                              e.preventDefault()
                              navigateWithLoading("membership", () => {
                                setActiveSection("membership")
                                window.location.href = "/membership"
                              })
                            }}
                          >
                            Membership
                          </Link>
                        </NavLinkAnimation>
                        <NavLinkAnimation isActive={activeSection === "verification"}>
                          <Link
                            href="/verification"
                            className="text-muted-foreground hover:text-primary px-4 py-2 rounded-full font-medium transition-all duration-300 hover:bg-muted/50"
                            onClick={(e) => {
                              e.preventDefault()
                              navigateWithLoading("verification", () => {
                                setActiveSection("verification")
                                window.location.href = "/verification"
                              })
                            }}
                          >
                            Verification
                          </Link>
                        </NavLinkAnimation>
                      </nav>
                    </div>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setAuthDefaultTab("login")
                          setAuthModalOpen(true)
                        }}
                        className="border-primary/20 text-foreground hover:text-primary hover:border-primary/40 px-6 py-2 rounded-full font-medium transition-all duration-300"
                      >
                        Iniciar Sesión
                      </Button>
                      <Button
                        onClick={() => {
                          setAuthDefaultTab("register")
                          setAuthModalOpen(true)
                        }}
                        className="gradient-primary text-primary-foreground hover:scale-105 px-6 py-2 rounded-full font-medium shadow-lg transition-all duration-300"
                      >
                        Únete Ahora
                      </Button>
                    </div>
                  </div>

                  {/* Search Bar */}
                  <div className="max-w-2xl mx-auto">
                    <div className="flex items-center gap-0 rounded-2xl overflow-hidden transition-all duration-300 shadow-lg">
                      <Select>
                        <SelectTrigger className="w-[160px] bg-card border-0 rounded-none h-14 text-foreground glow-card">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="oil-gas">Oil & Gas</SelectItem>
                          <SelectItem value="commodities">Commodities</SelectItem>
                          <SelectItem value="real-estate">Real Estate</SelectItem>
                          <SelectItem value="luxury">Luxury Assets</SelectItem>
                          <SelectItem value="financial">Financial Instruments</SelectItem>
                          <SelectItem value="vehicles">Luxury Vehicles</SelectItem>
                          <SelectItem value="energy">Energy & Renewables</SelectItem>
                          <SelectItem value="investment">Investment Opportunities</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="relative flex-1">
                        <Input
                          className="border-0 rounded-none h-14 bg-card text-foreground placeholder:text-muted-foreground focus:ring-0 focus:ring-offset-0 glow-card"
                          placeholder="What premium deal are you looking for?"
                        />
                      </div>
                      <Button className="h-14 px-6 gradient-primary rounded-none hover:scale-105 transition-all duration-300 glow-primary">
                        <Search className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </header>
            </div>

            {/* VIP Banner */}
            <div className="w-full gradient-primary py-4 px-6 relative overflow-hidden glow-primary-strong">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-2 left-10">
                  <Sparkles className="h-4 w-4 text-primary-foreground animate-pulse" />
                </div>
                <div className="absolute top-1 right-20">
                  <Crown className="h-5 w-5 text-primary-foreground animate-pulse" style={{animationDelay: '0.5s'}} />
                </div>
              </div>
              <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 relative z-10">
                <Crown className="h-6 w-6 text-primary-foreground animate-bounce" />
                <span className="text-primary-foreground font-bold text-lg">
                  Join Verified Companies - $20/month Premium Access
                </span>
                <Button variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary transition-all duration-300 hover:scale-105">
                  <Crown className="mr-2 h-4 w-4" />
                  Get Verified
                </Button>
              </div>
            </div>

            {/* Hero Content */}
            <div className="w-full flex-1 py-20 px-4 relative z-10">
              <div className="max-w-6xl mx-auto text-center">
                <div className="mb-12">
                  <h1 className="text-foreground text-5xl md:text-7xl font-bold mb-6 leading-tight">
                    EXCLUSIVE <span className="gradient-text inline-block animate-pulse glow-text">B2B DEALS</span>
                  </h1>
                  <div className="mb-8">
                    <img
                      src="https://djx5h8pabpett.cloudfront.net/wp-content/uploads/2022/09/Lamborghini_Manchester_2_2022_620-1-scaled.jpg"
                      alt="Luxury Vehicle Showroom - Premium B2B Trading"
                      className="w-full max-w-4xl mx-auto rounded-3xl shadow-2xl border border-border/20 hover:scale-[1.02] transition-transform duration-700 glow-card"
                    />
                  </div>
                  <p className="text-muted-foreground text-xl md:text-2xl max-w-3xl mx-auto">
                    Connecting verified companies across Europe and the Middle East for high-value commodity trading, luxury assets, and premium business opportunities
                  </p>
                </div>

                <SectionReveal delay={0.3}>
                  <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
                    <Button
                      className="group gradient-primary text-primary-foreground hover:scale-105 px-12 py-5 rounded-2xl font-semibold text-lg shadow-2xl transition-all duration-300 glow-primary pulse-glow"
                      onClick={() => {
                        navigateWithLoading("marketplace", () => {
                          setActiveSection("marketplace")
                          window.location.href = "/marketplace"
                        })
                      }}
                    >
                      <Sparkles className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                      Browse Marketplace
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button
                      className="group bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent text-accent-foreground hover:scale-105 px-12 py-5 rounded-2xl font-semibold text-lg shadow-2xl transition-all duration-300 glow-accent"
                      onClick={() => {
                        navigateWithLoading("membership", () => {
                          setActiveSection("membership")
                          window.location.href = "/membership"
                        })
                      }}
                    >
                      <Crown className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                      Join €20/month
                    </Button>
                  </div>
                </SectionReveal>

                {/* Categories Grid - New Design */}
                <SectionReveal delay={0.4}>
                  <div className="mb-20">
                    <h2 className="text-3xl font-bold text-foreground mb-8 gradient-text">Our Premium Categories</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {categories.map((category, index) => (
                        <CategoryCardAnimation key={index} index={index}>
                          <div className="group">
                            <div className="gradient-card p-6 rounded-2xl border border-border/30 hover:border-primary/50 transition-all duration-300 hover:scale-105 glow-card-hover cursor-pointer">
                              <div className="flex flex-col items-center gap-4 text-center">
                                <div className="text-4xl group-hover:scale-110 transition-transform duration-500 mb-2">
                                  {category.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                                  {category.name}
                                </h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                  {category.name === 'Oil & Gas' && 'Premium energy commodities and petroleum products'}
                                  {category.name === 'Commodities' && 'Raw materials and bulk goods trading'}
                                  {category.name === 'Luxury Assets' && 'High-value collectibles and premium items'}
                                  {category.name === 'Real Estate' && 'Commercial and luxury property investments'}
                                  {category.name === 'Financial Instruments' && 'Investment products and financial assets'}
                                  {category.name === 'Luxury Vehicles' && 'Premium automobiles and collector cars'}
                                  {category.name === 'Energy & Renewables' && 'Sustainable energy solutions and technologies'}
                                  {category.name === 'Investment Opportunities' && 'Exclusive business and investment deals'}
                                </p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-primary hover:text-primary-foreground hover:bg-primary transition-all duration-300"
                                  onClick={() => {
                                    navigateWithLoading("marketplace", () => {
                                      setActiveSection("marketplace")
                                      window.location.href = `/marketplace?category=${category.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`
                                    })
                                  }}
                                >
                                  Explore <ArrowRight className="ml-1 h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CategoryCardAnimation>
                      ))}
                    </div>
                  </div>
                </SectionReveal>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authDefaultTab}
      />
      </div>
    </>
  )
}
