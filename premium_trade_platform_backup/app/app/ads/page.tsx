

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { AdsListings } from "@/components/ads/ads-listings"

export default async function AdsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== "VERIFIED_COMPANY") {
    redirect("/auth/signin")
  }

  // Get user's ads
  const userAds = await prisma.ad.findMany({
    where: {
      authorId: session.user.id
    },
    include: {
      author: {
        include: {
          company: true
        }
      },
      category: true
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          My Ads
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your active listings and create new ones
        </p>
      </div>

      <AdsListings ads={userAds} isOwner={true} />
    </div>
  )
}
