

"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  MapPin, 
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown
} from "lucide-react"
import { formatDistance } from "date-fns"

interface Ad {
  id: string
  title: string
  description: string | null
  type: "BUY" | "SELL"
  category: {
    name: string
  }
  country: string
  contactInfo: string
  status: "ACTIVE" | "INACTIVE" | "EXPIRED" | "DELETED"
  createdAt: Date
  updatedAt: Date
  author: {
    company: {
      name: string
      country: string
    } | null
  }
}

interface AdsListingsProps {
  ads: Ad[]
  isOwner?: boolean
}

export function AdsListings({ ads, isOwner = false }: AdsListingsProps) {
  const [filter, setFilter] = useState<"ALL" | "BUY" | "SELL">("ALL")

  const filteredAds = ads.filter(ad => {
    if (filter === "ALL") return true
    return ad.type === filter
  })

  const getTypeColor = (type: "BUY" | "SELL") => {
    return type === "BUY" ? "text-green-600 dark:text-green-400" : "text-blue-600 dark:text-blue-400"
  }

  const getTypeIcon = (type: "BUY" | "SELL") => {
    return type === "BUY" ? TrendingDown : TrendingUp
  }

  if (ads.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/20">
            <Plus className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            No ads yet
          </h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            {isOwner 
              ? "Get started by creating your first ad listing."
              : "No ads available at the moment."
            }
          </p>
          {isOwner && (
            <div className="mt-6">
              <Button asChild>
                <Link href="/ads/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Ad
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-2">
          <Button
            variant={filter === "ALL" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("ALL")}
          >
            All ({ads.length})
          </Button>
          <Button
            variant={filter === "BUY" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("BUY")}
          >
            <TrendingDown className="mr-1 h-4 w-4" />
            Buy ({ads.filter(ad => ad.type === "BUY").length})
          </Button>
          <Button
            variant={filter === "SELL" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("SELL")}
          >
            <TrendingUp className="mr-1 h-4 w-4" />
            Sell ({ads.filter(ad => ad.type === "SELL").length})
          </Button>
        </div>

        {isOwner && (
          <Button asChild>
            <Link href="/ads/new">
              <Plus className="mr-2 h-4 w-4" />
              Create New Ad
            </Link>
          </Button>
        )}
      </div>

      {/* Ads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAds.map((ad, index) => {
          const TypeIcon = getTypeIcon(ad.type)
          
          return (
            <motion.div
              key={ad.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <TypeIcon className={`h-5 w-5 ${getTypeColor(ad.type)}`} />
                      <Badge variant={ad.type === "BUY" ? "secondary" : "default"}>
                        {ad.type}
                      </Badge>
                    </div>
                    <Badge variant={ad.status === "ACTIVE" ? "success" : "secondary"}>
                      {ad.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">
                    {ad.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                    {ad.description}
                  </p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                      <DollarSign className="h-4 w-4" />
                      <span>{ad.category.name}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                      <MapPin className="h-4 w-4" />
                      <span>{ad.country}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDistance(new Date(ad.createdAt), new Date(), { addSuffix: true })}</span>
                    </div>
                  </div>

                  {!isOwner && ad.author.company && (
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {ad.author.company.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {ad.author.company.country}
                      </p>
                    </div>
                  )}

                  <div className="flex space-x-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="mr-1 h-4 w-4" />
                      View
                    </Button>
                    {isOwner && (
                      <>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
