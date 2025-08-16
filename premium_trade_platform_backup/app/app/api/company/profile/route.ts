

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { z } from "zod"

const updateCompanySchema = z.object({
  name: z.string().min(2),
  country: z.string().min(1),
  registrationNumber: z.string().min(1).optional(),
  licenseNumber: z.string().optional(),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
})

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = updateCompanySchema.parse(body)

    // Find or create company
    const company = await prisma.company.upsert({
      where: {
        userId: session.user.id
      },
      update: {
        name: validatedData.name,
        country: validatedData.country,
        registryNumber: validatedData.registrationNumber || null,
        licenseNumber: validatedData.licenseNumber || null,
        linkedinUrl: validatedData.linkedinUrl || null,
      },
      create: {
        name: validatedData.name,
        country: validatedData.country,
        userId: session.user.id,
        status: "PENDING",
        registryNumber: validatedData.registrationNumber || null,
        licenseNumber: validatedData.licenseNumber || null,
        linkedinUrl: validatedData.linkedinUrl || null,
      }
    })

    return NextResponse.json(company)
  } catch (error) {
    console.error("Error updating company:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
