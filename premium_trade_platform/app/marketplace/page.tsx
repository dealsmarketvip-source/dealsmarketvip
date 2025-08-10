
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, MapPin, Calendar, Euro, Shield, Sparkles, Eye, Building2 } from "lucide-react"
import Link from "next/link"

export default function MarketplacePage() {
  // Sample data - in a real app this would come from a database
  const featuredDeals = [
    {
      id: 1,
      title: "Premium Crude Oil Futures Contract",
      category: "Oil & Gas",
      location: "Dubai, UAE",
      price: "€2,450,000",
      company: "Emirates Energy Trading",
      verified: true,
      description: "High-grade Brent crude oil futures for Q4 delivery. Volume: 50,000 barrels.",
      postedDate: "2 days ago",
      image: "⛽"
    },
    {
      id: 2,
      title: "Luxury Commercial Tower - Prime Location",
      category: "Real Estate",
      location: "London, UK",
      price: "€45,000,000",
      company: "Crown Property Holdings",
      verified: true,
      description: "26-floor commercial tower in Canary Wharf. Fully leased with blue-chip tenants.",
      postedDate: "1 week ago",
      image: "🏢"
    },
    {
      id: 3,
      title: "Rare Vintage Car Collection",
      category: "Luxury Vehicles",
      location: "Monaco",
      price: "€3,200,000",
      company: "Monaco Classic Cars",
      verified: true,
      description: "Collection of 12 pristine vintage vehicles including Ferrari 250 GT and Porsche 911.",
      postedDate: "3 days ago",
      image: "🏎️"
    },
    {
      id: 4,
      title: "Gold Bullion - Investment Grade",
      category: "Commodities",
      location: "Zurich, Switzerland",
      price: "€8,750,000",
      company: "Swiss Precious Metals AG",
      verified: true,
      description: "500kg of 99.99% pure gold bullion. Certified and insured with full documentation.",
      postedDate: "5 days ago",
      image: "💰"
    },
    {
      id: 5,
      title: "Renewable Energy Wind Farm Project",
      category: "Energy & Renewables",
      location: "Hamburg, Germany",
      price: "€125,000,000",
      company: "GreenTech Energy Solutions",
      verified: true,
      description: "Turn-key wind farm project with 50 turbines. 20-year energy purchase agreement included.",
      postedDate: "1 week ago",
      image: "🔋"
    },
    {
      id: 6,
      title: "Diamond Investment Portfolio",
      category: "Luxury Assets",
      location: "Antwerp, Belgium",
      price: "€15,600,000",
      company: "Belgian Diamond Consortium",
      verified: true,
      description: "Portfolio of certified investment-grade diamonds. GIA certified with full provenance.",
      postedDate: "4 days ago",
      image: "💎"
    }
  ]

  const categories = [
    "All Categories",
    "Oil & Gas",
    "Commodities", 
    "Luxury Assets",
    "Real Estate",
    "Financial Instruments",
    "Luxury Vehicles",
    "Energy & Renewables",
    "Investment Opportunities"
  ]

  const locations = [
    "All Locations",
    "United Kingdom",
    "Germany", 
    "France",
    "Spain",
    "Italy",
    "Netherlands",
    "Switzerland",
    "UAE",
    "Saudi Arabia",
    "Qatar"
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
            <div className="flex items-center gap-4">
              <Link href="/membership">
                <Button className="gradient-primary text-primary-foreground hover:scale-105 px-6 py-2 rounded-full font-medium shadow-lg transition-all duration-300 glow-primary">
                  Join Now
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-16">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-foreground mb-6">
              Premium <span className="gradient-text">Marketplace</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Discover exclusive B2B opportunities from verified companies across Europe and the Middle East
            </p>

            {/* Search and Filters */}
            <div className="max-w-4xl mx-auto mb-8">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Input
                      className="h-14 bg-card border-border/50 text-foreground placeholder:text-muted-foreground pl-12 pr-4 rounded-2xl glow-card"
                      placeholder="Search deals, companies, or keywords..."
                    />
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
                <Select>
                  <SelectTrigger className="w-full md:w-[200px] h-14 bg-card border-border/50 rounded-2xl glow-card">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category.toLowerCase().replace(/\s+/g, '-')}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-full md:w-[200px] h-14 bg-card border-border/50 rounded-2xl glow-card">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location.toLowerCase().replace(/\s+/g, '-')}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button className="gradient-primary h-14 px-8 rounded-2xl hover:scale-105 transition-all duration-300 glow-primary">
                  <Filter className="mr-2 h-5 w-5" />
                  Filter
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                <span>{featuredDeals.length} Active Deals</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-accent" />
                <span>All Companies Verified</span>
              </div>
            </div>
          </div>

          {/* Deals Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredDeals.map((deal, index) => (
              <div key={deal.id} className="group gradient-card rounded-3xl border border-border/30 hover:border-primary/50 transition-all duration-500 overflow-hidden glow-card-hover">
                {/* Deal Image/Icon */}
                <div className="relative p-8 text-center bg-gradient-to-br from-primary/5 to-accent/5">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-500">
                    {deal.image}
                  </div>
                  <div className="absolute top-4 right-4">
                    {deal.verified && (
                      <Badge className="bg-accent/10 text-accent border-accent/30">
                        <Shield className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Deal Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <Badge variant="outline" className="text-primary border-primary/30 bg-primary/10">
                      {deal.category}
                    </Badge>
                    <div className="text-right">
                      <div className="text-2xl font-bold gradient-text">{deal.price}</div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {deal.title}
                  </h3>

                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {deal.description}
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building2 className="w-4 h-4 text-accent" />
                      <span className="font-medium">{deal.company}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{deal.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Posted {deal.postedDate}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button className="flex-1 bg-primary/10 text-primary border border-primary/30 hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button className="gradient-primary text-primary-foreground hover:scale-105 transition-all duration-300 glow-primary">
                      <Euro className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button className="gradient-primary text-primary-foreground hover:scale-105 px-12 py-4 rounded-2xl font-semibold text-lg shadow-2xl transition-all duration-300 glow-primary">
              <Sparkles className="mr-2 h-5 w-5" />
              Load More Deals
            </Button>
            <p className="text-muted-foreground text-sm mt-4">
              Join our premium membership to access all deals and contact companies directly
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
