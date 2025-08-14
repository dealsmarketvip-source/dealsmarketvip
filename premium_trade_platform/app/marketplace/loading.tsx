import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart } from "lucide-react"

export default function MarketplaceLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold text-white">Marketplace</h1>
          </div>
          <div className="h-4 bg-gray-700 rounded w-64 mb-6"></div>
          
          {/* Search Bar Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2">
              <div className="h-12 bg-gray-700 rounded"></div>
            </div>
            <div className="h-12 bg-gray-700 rounded"></div>
            <div className="h-6 bg-gray-700 rounded"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar Skeleton */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="h-4 bg-gray-700 rounded w-20"></div>
                  <div className="h-10 bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-700 rounded w-24"></div>
                  <div className="h-6 bg-gray-700 rounded"></div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products Grid Skeleton */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-0">
                    <div className="aspect-square bg-gray-700 rounded-t-lg"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                      <div className="h-6 bg-gray-700 rounded w-1/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
