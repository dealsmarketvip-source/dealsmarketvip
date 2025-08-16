"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  ShoppingCart, 
  Eye, 
  Heart,
  Users,
  Calendar,
  Download,
  Filter
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth-instant"
import { createClient } from "@/lib/supabase"
import { toast } from "sonner"

interface AnalyticsData {
  overview: {
    totalEarnings: number
    totalProducts: number
    totalViews: number
    totalFavorites: number
    conversionRate: number
    avgOrderValue: number
  }
  salesData: Array<{
    date: string
    sales: number
    revenue: number
  }>
  productPerformance: Array<{
    id: string
    title: string
    views: number
    favorites: number
    sales: number
    revenue: number
  }>
  categoryBreakdown: Array<{
    category: string
    count: number
    revenue: number
  }>
  buyerInsights: Array<{
    date: string
    newBuyers: number
    returningBuyers: number
  }>
  searchTerms: Array<{
    term: string
    count: number
    conversions: number
  }>
}

const COLORS = ['#F59E0B', '#3B82F6', '#10B981', '#EF4444', '#8B5CF6', '#F97316']

export default function AnalyticsPage() {
  const { user, userProfile } = useAuth()
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30') // days
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    overview: {
      totalEarnings: 0,
      totalProducts: 0,
      totalViews: 0,
      totalFavorites: 0,
      conversionRate: 0,
      avgOrderValue: 0
    },
    salesData: [],
    productPerformance: [],
    categoryBreakdown: [],
    buyerInsights: [],
    searchTerms: []
  })

  useEffect(() => {
    if (userProfile) {
      fetchAnalytics()
    }
  }, [userProfile, timeRange])

  const fetchAnalytics = async () => {
    if (!userProfile) return

    try {
      setLoading(true)
      const supabase = createClient()
      
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(endDate.getDate() - parseInt(timeRange))

      // Fetch overview data
      const [
        productsResult,
        ordersResult,
        transactionsResult,
        favoritesResult,
        searchesResult
      ] = await Promise.all([
        supabase
          .from('products')
          .select('*')
          .eq('seller_id', userProfile.id),
        supabase
          .from('orders')
          .select('*')
          .eq('seller_id', userProfile.id)
          .gte('created_at', startDate.toISOString()),
        supabase
          .from('transactions')
          .select('*')
          .eq('user_id', userProfile.id)
          .eq('type', 'sale')
          .gte('created_at', startDate.toISOString()),
        supabase
          .from('user_favorites')
          .select('product_id, created_at, products!inner(seller_id)')
          .eq('products.seller_id', userProfile.id)
          .gte('created_at', startDate.toISOString()),
        supabase
          .from('user_searches')
          .select('*')
          .eq('clicked_product_id', userProfile.id)
          .gte('created_at', startDate.toISOString())
      ])

      const products = productsResult.data || []
      const orders = ordersResult.data || []
      const transactions = transactionsResult.data || []
      const favorites = favoritesResult.data || []
      const searches = searchesResult.data || []

      // Calculate overview metrics
      const totalEarnings = transactions.reduce((sum, t) => sum + t.amount, 0)
      const totalViews = products.reduce((sum, p) => sum + p.views_count, 0)
      const totalFavorites = products.reduce((sum, p) => sum + p.favorites_count, 0)
      const conversionRate = totalViews > 0 ? (orders.length / totalViews) * 100 : 0
      const avgOrderValue = orders.length > 0 ? totalEarnings / orders.length : 0

      // Generate sales data for chart
      const salesData = generateDailyData(startDate, endDate, orders, transactions)

      // Product performance
      const productPerformance = products.map(product => {
        const productOrders = orders.filter(o => o.product_id === product.id)
        const productRevenue = productOrders.reduce((sum, o) => sum + o.total_amount, 0)
        
        return {
          id: product.id,
          title: product.title,
          views: product.views_count,
          favorites: product.favorites_count,
          sales: productOrders.length,
          revenue: productRevenue
        }
      }).sort((a, b) => b.revenue - a.revenue)

      // Category breakdown
      const categoryMap = new Map()
      products.forEach(product => {
        const category = product.category || 'Sin categoría'
        const existing = categoryMap.get(category) || { count: 0, revenue: 0 }
        const productOrders = orders.filter(o => o.product_id === product.id)
        const productRevenue = productOrders.reduce((sum, o) => sum + o.total_amount, 0)
        
        categoryMap.set(category, {
          count: existing.count + 1,
          revenue: existing.revenue + productRevenue
        })
      })

      const categoryBreakdown = Array.from(categoryMap.entries()).map(([category, data]) => ({
        category,
        count: data.count,
        revenue: data.revenue
      }))

      // Search terms analysis
      const searchTermsMap = new Map()
      searches.forEach(search => {
        const term = search.search_query.toLowerCase()
        const existing = searchTermsMap.get(term) || { count: 0, conversions: 0 }
        searchTermsMap.set(term, {
          count: existing.count + 1,
          conversions: existing.conversions + (search.clicked_product_id ? 1 : 0)
        })
      })

      const searchTerms = Array.from(searchTermsMap.entries())
        .map(([term, data]) => ({
          term,
          count: data.count,
          conversions: data.conversions
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)

      setAnalytics({
        overview: {
          totalEarnings,
          totalProducts: products.length,
          totalViews,
          totalFavorites,
          conversionRate,
          avgOrderValue
        },
        salesData,
        productPerformance: productPerformance.slice(0, 10),
        categoryBreakdown,
        buyerInsights: generateBuyerInsights(orders, startDate, endDate),
        searchTerms
      })

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.error('Error fetching analytics:', {
        message: errorMessage,
        error: error instanceof Error ? error.stack : error
      })
      toast.error(`Error al cargar las analíticas: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const generateDailyData = (startDate: Date, endDate: Date, orders: any[], transactions: any[]) => {
    const data = []
    const currentDate = new Date(startDate)

    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0]
      const dayOrders = orders.filter(o => o.created_at.split('T')[0] === dateStr)
      const dayTransactions = transactions.filter(t => t.created_at.split('T')[0] === dateStr)
      
      data.push({
        date: dateStr,
        sales: dayOrders.length,
        revenue: dayTransactions.reduce((sum, t) => sum + t.amount, 0)
      })

      currentDate.setDate(currentDate.getDate() + 1)
    }

    return data
  }

  const generateBuyerInsights = (orders: any[], startDate: Date, endDate: Date) => {
    // Simplified buyer insights - in a real app you'd track returning customers
    const data = []
    const currentDate = new Date(startDate)

    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0]
      const dayOrders = orders.filter(o => o.created_at.split('T')[0] === dateStr)
      
      data.push({
        date: dateStr,
        newBuyers: dayOrders.length, // Simplified
        returningBuyers: 0 // Would need customer tracking
      })

      currentDate.setDate(currentDate.getDate() + 1)
    }

    return data
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const exportData = () => {
    const csvData = analytics.productPerformance.map(product => ({
      Producto: product.title,
      Visualizaciones: product.views,
      Favoritos: product.favorites,
      Ventas: product.sales,
      Ingresos: product.revenue
    }))

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  if (!user || !userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <Card className="max-w-md mx-auto bg-gray-800 border-gray-700">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-300">
              Debes iniciar sesión para ver las analíticas
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Analíticas de Venta
            </h1>
            <p className="text-gray-300">
              Insights detallados sobre el rendimiento de tus productos
            </p>
          </div>
          
          <div className="flex gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Últimos 7 días</SelectItem>
                <SelectItem value="30">Últimos 30 días</SelectItem>
                <SelectItem value="90">Últimos 90 días</SelectItem>
                <SelectItem value="365">Último año</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={exportData}
              variant="outline"
              className="border-gray-600"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={`analytics-loading-${i}`} className="bg-gray-800 border-gray-700 animate-pulse">
                <CardContent className="pt-6">
                  <div className="bg-gray-700 h-6 rounded mb-2"></div>
                  <div className="bg-gray-700 h-8 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-500/20 p-3 rounded-lg">
                      <DollarSign className="h-6 w-6 text-green-400" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Ingresos Totales</p>
                      <p className="text-2xl font-bold text-white">
                        {formatCurrency(analytics.overview.totalEarnings)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500/20 p-3 rounded-lg">
                      <Package className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Productos Activos</p>
                      <p className="text-2xl font-bold text-white">
                        {analytics.overview.totalProducts}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-500/20 p-3 rounded-lg">
                      <Eye className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Visualizaciones</p>
                      <p className="text-2xl font-bold text-white">
                        {analytics.overview.totalViews.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-500/20 p-3 rounded-lg">
                      <Heart className="h-6 w-6 text-red-400" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Tasa de Conversión</p>
                      <p className="text-2xl font-bold text-white">
                        {analytics.overview.conversionRate.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Sales Chart */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Ventas e Ingresos</CardTitle>
                  <CardDescription>Evolución diaria de ventas y ingresos</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={analytics.salesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#9CA3AF"
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => new Date(value).toLocaleDateString()}
                      />
                      <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '6px',
                          color: '#F9FAFB'
                        }}
                        formatter={(value: any, name: string) => [
                          name === 'revenue' ? formatCurrency(value) : value,
                          name === 'revenue' ? 'Ingresos' : 'Ventas'
                        ]}
                        labelFormatter={(label) => new Date(label).toLocaleDateString()}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stackId="1" 
                        stroke="#F59E0B" 
                        fill="#F59E0B" 
                        fillOpacity={0.3}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="sales" 
                        stackId="2" 
                        stroke="#3B82F6" 
                        fill="#3B82F6" 
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Category Breakdown */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Distribución por Categoría</CardTitle>
                  <CardDescription>Ingresos por categoría de producto</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analytics.categoryBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ category, percent }) => `${category} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="revenue"
                      >
                        {analytics.categoryBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '6px',
                          color: '#F9FAFB'
                        }}
                        formatter={(value: any) => formatCurrency(value)}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Product Performance Table */}
            <Card className="bg-gray-800 border-gray-700 mb-8">
              <CardHeader>
                <CardTitle className="text-white">Rendimiento de Productos</CardTitle>
                <CardDescription>Top 10 productos por ingresos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left text-gray-300 pb-3">Producto</th>
                        <th className="text-right text-gray-300 pb-3">Vistas</th>
                        <th className="text-right text-gray-300 pb-3">Favoritos</th>
                        <th className="text-right text-gray-300 pb-3">Ventas</th>
                        <th className="text-right text-gray-300 pb-3">Ingresos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.productPerformance.map((product, index) => (
                        <tr key={product.id} className="border-b border-gray-700/50">
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <span className="bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs">
                                {index + 1}
                              </span>
                              <span className="text-white font-medium truncate max-w-xs">
                                {product.title}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 text-right text-gray-300">{product.views}</td>
                          <td className="py-3 text-right text-gray-300">{product.favorites}</td>
                          <td className="py-3 text-right text-gray-300">{product.sales}</td>
                          <td className="py-3 text-right text-white font-medium">
                            {formatCurrency(product.revenue)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Search Terms Analysis */}
            {analytics.searchTerms.length > 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Términos de Búsqueda</CardTitle>
                  <CardDescription>Términos más buscados que llevaron a tus productos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.searchTerms.map((term, index) => (
                      <div key={term.term} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs">
                            {index + 1}
                          </span>
                          <span className="text-white font-medium">{term.term}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-300">{term.count} búsquedas</span>
                          <Badge variant="outline" className="border-green-500 text-green-400">
                            {term.conversions} clicks
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  )
}
