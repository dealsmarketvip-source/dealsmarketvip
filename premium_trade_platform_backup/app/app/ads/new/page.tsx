

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { CreateAdForm } from "@/components/ads/create-ad-form"

export default async function NewAdPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== "VERIFIED_COMPANY") {
    redirect("/auth/signin")
  }

  // Check if user has active subscription
  if (!session.user.subscription || session.user.subscription.status !== "ACTIVE") {
    redirect("/pricing")
  }

  // Check current ad count
  const currentAdCount = await prisma.ad.count({
    where: {
      authorId: session.user.id,
      status: "ACTIVE"
    }
  })

  if (currentAdCount >= 5) {
    redirect("/ads?error=limit_reached")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Create New Ad
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Post a new listing to connect with potential buyers or sellers
        </p>
        <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
          You have {5 - currentAdCount} ad slots remaining
        </p>
      </div>

      <CreateAdForm />
    </div>
  )
}
