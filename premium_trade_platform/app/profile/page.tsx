"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { 
  User, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  Settings, 
  Edit, 
  Save,
  Eye,
  Star,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Shield,
  CreditCard,
  BarChart3,
  Heart
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth-instant"
import { createClient, db } from "@/lib/supabase"
import { toast } from "sonner"
import { UserProfile, Product, Order, Transaction, UserLimits } from "@/lib/types/database"
import Link from "next/link"

interface UserStats {
  totalSales: number
  totalPurchases: number
  activeProducts: number
  completedOrders: number
  totalEarnings: number
  currentMonthSales: number
  accountBalance: number
}

interface ExtendedUserProfile extends UserProfile {
  user_limits?: UserLimits[]
  subscription?: any
}

export default function ProfilePage() {
  const { user, userProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [userStats, setUserStats] = useState<UserStats>({
    totalSales: 0,
    totalPurchases: 0,
    activeProducts: 0,
    completedOrders: 0,
    totalEarnings: 0,
    currentMonthSales: 0,
    accountBalance: 0
  })
  const [userProducts, setUserProducts] = useState<Product[]>([])
  const [userOrders, setUserOrders] = useState<Order[]>([])
  const [userTransactions, setUserTransactions] = useState<Transaction[]>([])
  const [userLimits, setUserLimits] = useState<UserLimits | null>(null)
  const [editForm, setEditForm] = useState({
    full_name: '',
    phone: '',
    address: '',
    city: '',
    country: ''
  })

  useEffect(() => {
    if (userProfile) {
      setEditForm({
        full_name: userProfile.full_name || '',
        phone: userProfile.phone || '',
        address: userProfile.address || '',
        city: userProfile.city || '',
        country: userProfile.country || ''
      })
      fetchUserData()
    }
  }, [userProfile])

  const fetchUserData = async () => {
    if (!userProfile) return

    try {
      setLoading(true)
      
      const [
        productsResult,
        ordersResult,
        transactionsResult,
        limitsResult
      ] = await Promise.all([
        db.products.getByUserId(userProfile.id),
        db.orders.getByUserId(userProfile.id),
        db.transactions.getByUserId(userProfile.id),
        db.limits.check(userProfile.id, 'products')
      ])

      // Set products
      if (productsResult.data) {
        setUserProducts(productsResult.data)
      }

      // Set orders
      if (ordersResult.data) {
        setUserOrders(ordersResult.data)
      }

      // Set transactions
      if (transactionsResult.data) {
        setUserTransactions(transactionsResult.data)
      }

      // Get user limits
      const supabase = createClient()
      const { data: limits } = await supabase
        .from('user_limits')
        .select('*')
        .eq('user_id', userProfile.id)
        .single()
      
      if (limits) {
        setUserLimits(limits)
      }

      // Calculate stats
      calculateUserStats(productsResult.data || [], ordersResult.data || [], transactionsResult.data || [])
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.error('Error fetching user data:', {
        message: errorMessage,
        error: error instanceof Error ? error.stack : error
      })
      toast.error(`Error al cargar los datos del perfil: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const calculateUserStats = (products: Product[], orders: Order[], transactions: Transaction[]) => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    const activeProducts = products.filter(p => p.status === 'active').length
    const totalSales = orders.filter(o => o.seller_id === userProfile?.id).length
    const totalPurchases = orders.filter(o => o.buyer_id === userProfile?.id).length
    const completedOrders = orders.filter(o => o.status === 'delivered').length
    
    const totalEarnings = transactions
      .filter(t => t.type === 'sale' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0)

    const currentMonthSales = transactions
      .filter(t => {
        const transactionDate = new Date(t.created_at)
        return t.type === 'sale' && 
               t.status === 'completed' &&
               transactionDate.getMonth() === currentMonth &&
               transactionDate.getFullYear() === currentYear
      })
      .reduce((sum, t) => sum + t.amount, 0)

    setUserStats({
      totalSales,
      totalPurchases,
      activeProducts,
      completedOrders,
      totalEarnings,
      currentMonthSales,
      accountBalance: userProfile?.account_balance || 0
    })
  }

  const handleSaveProfile = async () => {
    if (!userProfile) return

    try {
      setLoading(true)
      const { error } = await db.users.update(userProfile.id, editForm)
      
      if (error) throw error

      toast.success("Perfil actualizado correctamente")
      setEditing(false)
      window.location.reload()
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error("Error al actualizar el perfil")
    } finally {
      setLoading(false)
    }
  }

  if (!user || !userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <Card className="max-w-md mx-auto bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <p className="text-center text-gray-300">
              Debes iniciar sesión para ver tu perfil
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getVerificationBadge = () => {
    switch (userProfile.verification_status) {
      case 'verified':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Verificado</Badge>
      case 'in_review':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">En Revisión</Badge>
      case 'rejected':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Rechazado</Badge>
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Sin Verificar</Badge>
    }
  }

  const getSubscriptionBadge = () => {
    if (userProfile.subscription_type === 'premium') {
      return <Badge className="bg-primary/20 text-primary border-primary/30">Premium</Badge>
    }
    return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Gratuito</Badge>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Profile Header */}
        <div className="mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={userProfile.profile_image_url} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {userProfile.full_name?.charAt(0) || userProfile.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-white">
                      {userProfile.full_name || 'Usuario sin nombre'}
                    </h1>
                    {getVerificationBadge()}
                    {getSubscriptionBadge()}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Mail className="h-4 w-4" />
                      {userProfile.email}
                    </div>
                    {userProfile.phone && (
                      <div className="flex items-center gap-2 text-gray-300">
                        <Phone className="h-4 w-4" />
                        {userProfile.phone}
                      </div>
                    )}
                    {userProfile.city && userProfile.country && (
                      <div className="flex items-center gap-2 text-gray-300">
                        <MapPin className="h-4 w-4" />
                        {userProfile.city}, {userProfile.country}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-400">
                      Miembro desde {new Date(userProfile.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => setEditing(!editing)}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {editing ? 'Cancelar' : 'Editar Perfil'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Edit Profile Form */}
        {editing && (
          <div className="mb-8">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Editar Perfil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="full_name" className="text-gray-300">Nombre Completo</Label>
                    <Input
                      id="full_name"
                      value={editForm.full_name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-gray-300">Teléfono</Label>
                    <Input
                      id="phone"
                      value={editForm.phone}
                      onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city" className="text-gray-300">Ciudad</Label>
                    <Input
                      id="city"
                      value={editForm.city}
                      onChange={(e) => setEditForm(prev => ({ ...prev, city: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country" className="text-gray-300">País</Label>
                    <Input
                      id="country"
                      value={editForm.country}
                      onChange={(e) => setEditForm(prev => ({ ...prev, country: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address" className="text-gray-300">Dirección</Label>
                  <Textarea
                    id="address"
                    value={editForm.address}
                    onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Cambios
                  </Button>
                  <Button 
                    onClick={() => setEditing(false)}
                    variant="outline"
                    className="border-gray-600"
                  >
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="bg-primary/20 p-3 rounded-lg">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Saldo de Cuenta</p>
                  <p className="text-2xl font-bold text-white">
                    €{userStats.accountBalance.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="bg-green-500/20 p-3 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Ganancias Totales</p>
                  <p className="text-2xl font-bold text-white">
                    €{userStats.totalEarnings.toFixed(2)}
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
                    {userStats.activeProducts}
                  </p>
                  {userLimits && (
                    <p className="text-xs text-gray-500">
                      de {userLimits.max_products} permitidos
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="bg-purple-500/20 p-3 rounded-lg">
                  <ShoppingCart className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Compras Totales</p>
                  <p className="text-2xl font-bold text-white">
                    {userStats.totalPurchases}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Plan Limits Card */}
        {userLimits && (
          <Card className="mb-8 bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Límites del Plan {userProfile.subscription_type === 'premium' ? 'Premium' : 'Gratuito'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Productos para vender</span>
                    <span className="text-white">
                      {userLimits.current_products}/{userLimits.max_products}
                    </span>
                  </div>
                  <Progress 
                    value={(userLimits.current_products / Math.max(userLimits.max_products, 1)) * 100} 
                    className="h-2"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Compras este mes</span>
                    <span className="text-white">
                      {userLimits.current_purchases}/{userLimits.max_purchases}
                    </span>
                  </div>
                  <Progress 
                    value={(userLimits.current_purchases / Math.max(userLimits.max_purchases, 1)) * 100} 
                    className="h-2"
                  />
                </div>
              </div>
              {userProfile.subscription_type === 'free' && (
                <div className="mt-4 text-center">
                  <Link href="/membership">
                    <Button className="bg-primary hover:bg-primary/90">
                      Actualizar a Premium
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Tabs Section */}
        <Tabs defaultValue="products" className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <TabsList className="grid grid-cols-3 bg-gray-800 border-gray-700">
              <TabsTrigger value="products" className="data-[state=active]:bg-primary">
                Mis Productos
              </TabsTrigger>
              <TabsTrigger value="purchases" className="data-[state=active]:bg-primary">
                Compras
              </TabsTrigger>
              <TabsTrigger value="sales" className="data-[state=active]:bg-primary">
                Ventas
              </TabsTrigger>
            </TabsList>

            <Link href="/analytics">
              <Button className="bg-primary hover:bg-primary/90">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analíticas Detalladas
              </Button>
            </Link>
          </div>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white">Mis Productos</CardTitle>
                  <Link href="/upload">
                    <Button className="bg-primary hover:bg-primary/90">
                      <Package className="h-4 w-4 mr-2" />
                      Subir Producto
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {userProducts.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">No tienes productos publicados</p>
                    <Link href="/upload">
                      <Button className="mt-4 bg-primary hover:bg-primary/90">
                        Subir tu primer producto
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {userProducts.map((product) => (
                      <div key={product.id} className="border border-gray-600 rounded-lg p-4">
                        <div className="aspect-square bg-gray-700 rounded-lg mb-3 flex items-center justify-center">
                          {product.images?.length > 0 ? (
                            <img 
                              src={product.images[0]} 
                              alt={product.title}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Package className="h-12 w-12 text-gray-400" />
                          )}
                        </div>
                        <h3 className="text-white font-medium mb-1 truncate">{product.title}</h3>
                        <p className="text-primary font-bold mb-2">€{product.price}</p>
                        <div className="flex items-center justify-between">
                          <Badge 
                            className={
                              product.status === 'active' 
                                ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                            }
                          >
                            {product.status}
                          </Badge>
                          <div className="flex items-center gap-1 text-gray-400 text-sm">
                            <Eye className="h-4 w-4" />
                            {product.views_count}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Purchases Tab */}
          <TabsContent value="purchases">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Mis Compras</CardTitle>
              </CardHeader>
              <CardContent>
                {userOrders.filter(o => o.buyer_id === userProfile.id).length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">No has realizado compras aún</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userOrders.filter(o => o.buyer_id === userProfile.id).map((order) => (
                      <div key={order.id} className="border border-gray-600 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-white font-medium">Pedido #{order.id.slice(0, 8)}</p>
                            <p className="text-gray-400 text-sm">
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                            <p className="text-primary font-bold mt-1">€{order.total_amount}</p>
                          </div>
                          <Badge className={
                            order.status === 'delivered' 
                              ? 'bg-green-500/20 text-green-400 border-green-500/30'
                              : order.status === 'cancelled'
                              ? 'bg-red-500/20 text-red-400 border-red-500/30'
                              : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                          }>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sales Tab */}
          <TabsContent value="sales">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Mis Ventas</CardTitle>
              </CardHeader>
              <CardContent>
                {userOrders.filter(o => o.seller_id === userProfile.id).length === 0 ? (
                  <div className="text-center py-8">
                    <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">No has realizado ventas aún</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userOrders.filter(o => o.seller_id === userProfile.id).map((order) => (
                      <div key={order.id} className="border border-gray-600 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-white font-medium">Venta #{order.id.slice(0, 8)}</p>
                            <p className="text-gray-400 text-sm">
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                            <p className="text-green-400 font-bold mt-1">+€{order.total_amount}</p>
                          </div>
                          <Badge className={
                            order.status === 'delivered' 
                              ? 'bg-green-500/20 text-green-400 border-green-500/30'
                              : order.status === 'cancelled'
                              ? 'bg-red-500/20 text-red-400 border-red-500/30'
                              : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                          }>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Resumen de Actividad</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Ventas este mes</span>
                    <span className="text-white font-bold">€{userStats.currentMonthSales.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Total de pedidos</span>
                    <span className="text-white font-bold">{userStats.completedOrders}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Productos favoritos</span>
                    <span className="text-white font-bold">
                      {userProducts.reduce((sum, p) => sum + p.favorites_count, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Total de visualizaciones</span>
                    <span className="text-white font-bold">
                      {userProducts.reduce((sum, p) => sum + p.views_count, 0)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Transacciones Recientes</CardTitle>
                </CardHeader>
                <CardContent>
                  {userTransactions.length === 0 ? (
                    <p className="text-gray-400 text-center py-4">No hay transacciones</p>
                  ) : (
                    <div className="space-y-3">
                      {userTransactions.slice(0, 5).map((transaction) => (
                        <div key={transaction.id} className="flex justify-between items-center">
                          <div>
                            <p className="text-white text-sm">
                              {transaction.type === 'sale' ? 'Venta' : 
                               transaction.type === 'purchase' ? 'Compra' : 
                               transaction.type}
                            </p>
                            <p className="text-gray-400 text-xs">
                              {new Date(transaction.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`font-bold ${
                            transaction.type === 'sale' ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {transaction.type === 'sale' ? '+' : '-'}€{transaction.amount.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
