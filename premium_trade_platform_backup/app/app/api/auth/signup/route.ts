
import { NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { z } from "zod"
import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  country: z.string().min(2, "Please select a country"),
  registryNumber: z.string().optional(),
  licenseNumber: z.string().optional(),
  linkedinUrl: z.string().url("Please enter a valid LinkedIn URL").optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      email,
      password,
      companyName,
      country,
      registryNumber,
      licenseNumber,
      linkedinUrl,
    } = signupSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Create user and company in transaction
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "PENDING",
        company: {
          create: {
            name: companyName,
            country,
            registryNumber,
            licenseNumber,
            linkedinUrl,
            status: "PENDING",
          },
        },
      },
      include: {
        company: true,
      },
    })

    // Create verification request
    await prisma.companyVerification.create({
      data: {
        companyId: user.company!.id,
        status: "PENDING",
      },
    })

    return NextResponse.json(
      {
        message: "Application submitted successfully. We will review your request and notify you via email.",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Signup error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
