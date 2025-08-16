

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { z } from "zod"

const createAdSchema = z.object({
  title: z.string().min(10).max(100),
  description: z.string().min(50).max(1000),
  type: z.enum(["BUY", "SELL"]),
  category: z.string().min(1),
  country: z.string().min(1),
  contactEmail: z.string().email(),
  contactPhone: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "VERIFIED_COMPANY") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Check if user has active subscription
    if (!session.user.subscription || session.user.subscription.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Active subscription required" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = createAdSchema.parse(body)

    // Check current ad count
    const currentAdCount = await prisma.ad.count({
      where: {
        authorId: session.user.id,
        status: "ACTIVE"
      }
    })

    if (currentAdCount >= 5) {
      return NextResponse.json(
        { error: "Maximum ad limit reached" },
        { status: 400 }
      )
    }

    // Find or create category
    let category = await prisma.category.findFirst({
      where: { name: validatedData.category }
    })

    if (!category) {
      category = await prisma.category.create({
        data: {
          name: validatedData.category,
          slug: validatedData.category.toLowerCase().replace(/\s+/g, '-')
        }
      })
    }

    // Prepare contact info
    const contactInfo = JSON.stringify({
      email: validatedData.contactEmail,
      phone: validatedData.contactPhone
    })

    const ad = await prisma.ad.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        type: validatedData.type,
        categoryId: category.id,
        country: validatedData.country,
        contactInfo,
        authorId: session.user.id,
        status: "ACTIVE",
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      }
    })

    return NextResponse.json(ad)
  } catch (error) {
    console.error("Error creating ad:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const category = searchParams.get("category")
    const country = searchParams.get("country")

    const ads = await prisma.ad.findMany({
      where: {
        status: "ACTIVE",
        ...(type && { type: type as "BUY" | "SELL" }),
        ...(category && { 
          category: {
            name: category
          }
        }),
        ...(country && { country }),
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

    return NextResponse.json(ads)
  } catch (error) {
    console.error("Error fetching ads:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
