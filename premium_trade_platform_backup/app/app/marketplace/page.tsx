
"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Search, 
  Filter,
  MapPin,
  Calendar,
  Eye,
  Star,
  TrendingUp,
  Building2,
  Globe
} from "lucide-react"
import { formatPrice, formatDate } from "@/lib/utils"

// Mock data for demo
const mockAds = [
  {
    id: "1",
    title: "Premium Crude Oil - 100,000 Barrels",
    description: "High-quality crude oil from North Sea reserves. Immediate delivery available. ISO certified and fully documented.",
    type: "SELL",
    category: { name: "Oil & Gas", slug: "oil-gas" },
    country: "Germany",
    price: 8500000,
    currency: "EUR",
    author: { name: "John Doe", company: { name: "Doe Trading LLC" } },
    createdAt: new Date("2024-01-15"),
    views: 245
  },
  {
    id: "2",
    title: "Ferrari F8 Tributo - 2023 Model",
    description: "Brand new Ferrari F8 Tributo with only 500km. Full warranty and service package included. Collector condition.",
    type: "SELL",
    category: { name: "Luxury Cars", slug: "luxury-cars" },
    country: "Germany",
    price: 285000,
    currency: "EUR",
    author: { name: "John Doe", company: { name: "Doe Trading LLC" } },
    createdAt: new Date("2024-01-20"),
    views: 89
  },
  {
    id: "3",
    title: "Seeking Gold Bullion - 10kg Minimum",
    description: "Looking to purchase certified gold bullion. Minimum quantity 10kg. Payment via escrow service preferred.",
    type: "BUY",
    category: { name: "Gold & Precious Metals", slug: "gold-metals" },
    country: "UAE",
    price: 650000,
    currency: "EUR",
    author: { name: "Ahmad Al-Rashid", company: { name: "Gulf Investments" } },
    createdAt: new Date("2024-01-18"),
    views: 156
  }
]

export default function MarketplacePage() {
  const { data: session, status } = useSession()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedCountry, setSelectedCountry] = useState("all")

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-500"></div>
      </div>
    )
  }

  if (!session?.user || session.user.role !== "VERIFIED_COMPANY") {
    redirect("/auth/signin")
  }

  const categories = [
    "Oil & Gas", "Luxury Cars", "Gold & Precious Metals", "Luxury Watches",
    "Business Acquisitions", "Hotels & Real Estate", "Yachts & Boats",
    "Private Jets", "Art & Collectibles", "Diamonds & Jewelry"
  ]

  const countries = ["Germany", "UAE", "France", "Italy", "UK", "Spain", "Netherlands"]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Premium Marketplace
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Discover exclusive opportunities from verified companies
            </p>
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrendingUp className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Active Listings
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">
                        1,234
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Building2 className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Verified Companies
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">
                        500+
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Globe className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Countries
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">
                        35+
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Search & Filter</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search listings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category.toLowerCase().replace(/ /g, '-')}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Buy & Sell</SelectItem>
                    <SelectItem value="buy">Looking to Buy</SelectItem>
                    <SelectItem value="sell">For Sale</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country.toLowerCase()}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button className="w-full">
                  Apply Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Listings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-6"
        >
          {mockAds.map((ad, index) => (
            <Card key={ad.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant={ad.type === "SELL" ? "default" : "secondary"}>
                            {ad.type === "SELL" ? "For Sale" : "Looking to Buy"}
                          </Badge>
                          <Badge variant="outline">
                            {ad.category.name}
                          </Badge>
                        </div>
                        
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          {ad.title}
                        </h3>
                        
                        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                          {ad.description}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{ad.country}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(ad.createdAt)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="h-4 w-4" />
                            <span>{ad.views} views</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-6 text-right">
                        <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                          {formatPrice(ad.price, ad.currency)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {ad.author.company?.name}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/20">
                      <Building2 className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {ad.author.name}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      <Star className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button size="sm">
                      Contact Seller
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Load More */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Button variant="outline" size="lg">
            Load More Listings
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
