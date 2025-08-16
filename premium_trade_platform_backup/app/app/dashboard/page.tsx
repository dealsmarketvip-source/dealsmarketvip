
"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  TrendingUp, 
  Users, 
  Calendar,
  Activity,
  Building2,
  Eye,
  MessageSquare
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { data: session, status } = useSession()

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

  const stats = [
    {
      name: "Active Listings",
      value: "3",
      change: "+2",
      changeType: "positive",
      icon: TrendingUp,
    },
    {
      name: "Total Views",
      value: "1,284",
      change: "+12%",
      changeType: "positive",
      icon: Eye,
    },
    {
      name: "Inquiries",
      value: "24",
      change: "+4",
      changeType: "positive",
      icon: MessageSquare,
    },
    {
      name: "Days Active",
      value: "47",
      change: "+1",
      changeType: "neutral",
      icon: Calendar,
    },
  ]

  const recentActivity = [
    {
      type: "listing",
      title: "New inquiry for Ferrari F8 Tributo",
      time: "2 hours ago",
      status: "new"
    },
    {
      type: "view",
      title: "Premium Crude Oil listing viewed 15 times",
      time: "4 hours ago",
      status: "info"
    },
    {
      type: "listing",
      title: "Luxury Watch listing expires in 3 days",
      time: "1 day ago",
      status: "warning"
    },
  ]

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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Welcome back, {session.user.name}
              </h1>
              <p className="mt-1 text-gray-600 dark:text-gray-300">
                {session.user.company?.name} • {session.user.company?.country}
              </p>
            </div>
            <div className="mt-4 flex space-x-3 sm:mt-0">
              <Badge variant="success" className="flex items-center space-x-1">
                <Building2 className="h-3 w-3" />
                <span>Verified Company</span>
              </Badge>
              <Button asChild>
                <Link href="/ads/new" className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>New Listing</span>
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((item) => (
            <Card key={item.name} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <item.icon className="h-8 w-8 text-yellow-500" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        {item.name}
                      </dt>
                      <dd>
                        <div className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                            {item.value}
                          </div>
                          <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                            item.changeType === 'positive' 
                              ? 'text-green-600 dark:text-green-400' 
                              : item.changeType === 'negative'
                              ? 'text-red-600 dark:text-red-400'
                              : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            {item.change}
                          </div>
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-yellow-500" />
                  <span>Recent Activity</span>
                </CardTitle>
                <CardDescription>
                  Latest updates on your listings and account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`flex h-2 w-2 mt-2 rounded-full ${
                        activity.status === 'new' 
                          ? 'bg-green-500' 
                          : activity.status === 'warning'
                          ? 'bg-yellow-500'
                          : 'bg-blue-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 dark:text-white">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Button variant="outline" className="w-full">
                    View All Activity
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common tasks and shortcuts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button asChild className="w-full justify-start" variant="outline">
                    <Link href="/ads/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Listing
                    </Link>
                  </Button>
                  <Button asChild className="w-full justify-start" variant="outline">
                    <Link href="/ads">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Manage My Listings
                    </Link>
                  </Button>
                  <Button asChild className="w-full justify-start" variant="outline">
                    <Link href="/marketplace">
                      <Users className="mr-2 h-4 w-4" />
                      Browse Marketplace
                    </Link>
                  </Button>
                  <Button asChild className="w-full justify-start" variant="outline">
                    <Link href="/settings">
                      <Building2 className="mr-2 h-4 w-4" />
                      Company Settings
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Subscription Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8"
        >
          <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">
                    Premium Membership Active
                  </h3>
                  <p className="text-sm text-yellow-600 dark:text-yellow-300">
                    You can post up to 5 active listings • Next billing: March 15, 2024
                  </p>
                </div>
                <Badge className="bg-yellow-500 text-black">
                  €20/month
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
