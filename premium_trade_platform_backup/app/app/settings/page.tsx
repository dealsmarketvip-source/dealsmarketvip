

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { SettingsForm } from "@/components/settings/settings-form"
import { AccountSettings } from "@/components/settings/account-settings"
import { SubscriptionSettings } from "@/components/settings/subscription-settings"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/auth/signin")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your account and subscription settings
        </p>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6">
          <AccountSettings user={session.user} />
        </TabsContent>

        <TabsContent value="company" className="space-y-6">
          <SettingsForm user={session.user} />
        </TabsContent>

        <TabsContent value="subscription" className="space-y-6">
          <SubscriptionSettings user={session.user} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
