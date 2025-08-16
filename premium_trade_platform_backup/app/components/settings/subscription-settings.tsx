

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { 
  CreditCard, 
  Calendar, 
  AlertTriangle, 
  CheckCircle,
  Loader2
} from "lucide-react"
import { format } from "date-fns"

interface SubscriptionSettingsProps {
  user: {
    id: string
    subscription?: {
      id: string
      status: string
      currentPeriodEnd?: Date | null
    }
  }
}

export function SubscriptionSettings({ user }: SubscriptionSettingsProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleCancelSubscription = async () => {
    if (!confirm("Are you sure you want to cancel your subscription?")) {
      return
    }

    setIsLoading(true)
    
    try {
      const response = await fetch("/api/subscription/cancel", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to cancel subscription")
      }

      toast.success("Subscription cancelled successfully!")
    } catch (error) {
      toast.error("Failed to cancel subscription. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReactivateSubscription = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch("/api/subscription/reactivate", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to reactivate subscription")
      }

      toast.success("Subscription reactivated successfully!")
    } catch (error) {
      toast.error("Failed to reactivate subscription. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdatePaymentMethod = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch("/api/subscription/update-payment", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to update payment method")
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      toast.error("Failed to update payment method. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "success"
      case "CANCELED":
        return "destructive"
      case "PAST_DUE":
        return "warning"
      default:
        return "secondary"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return CheckCircle
      case "CANCELED":
      case "PAST_DUE":
        return AlertTriangle
      default:
        return CreditCard
    }
  }

  if (!user.subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Subscription</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/20">
              <CreditCard className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              No Active Subscription
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Subscribe to access premium features and start posting ads.
            </p>
            <div className="mt-6">
              <Button asChild>
                <a href="/pricing">View Plans</a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const StatusIcon = getStatusIcon(user.subscription.status)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5" />
          <span>Subscription</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Plan */}
        <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <StatusIcon className="h-5 w-5 text-gray-500" />
              <div>
                <h3 className="font-medium">Premium Plan</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  €20/month
                </p>
              </div>
            </div>
            <Badge variant={getStatusColor(user.subscription.status)}>
              {user.subscription.status.charAt(0).toUpperCase() + user.subscription.status.slice(1)}
            </Badge>
          </div>

          {user.subscription.currentPeriodEnd && (
            <div className="mt-4 flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="h-4 w-4" />
              <span>
                {user.subscription.status === "ACTIVE" ? "Renews on" : "Expires on"}{" "}
                {format(new Date(user.subscription.currentPeriodEnd), "PPP")}
              </span>
            </div>
          )}
        </div>

        {/* Plan Features */}
        <div className="space-y-3">
          <h4 className="font-medium">What's included:</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Up to 5 active ads</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Access to verified network</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Direct messaging with companies</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Priority customer support</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={handleUpdatePaymentMethod}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <CreditCard className="mr-2 h-4 w-4" />
              Update Payment Method
            </Button>

            {user.subscription.status === "ACTIVE" ? (
              <Button
                variant="outline"
                onClick={handleCancelSubscription}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Cancel Subscription
              </Button>
            ) : (
              <Button
                onClick={handleReactivateSubscription}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Reactivate Subscription
              </Button>
            )}
          </div>

          {user.subscription.status === "CANCELED" && (
            <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">
                    Subscription Cancelled
                  </p>
                  <p className="text-yellow-700 dark:text-yellow-300">
                    You'll continue to have access until your current billing period ends.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
