

import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().min(2),
  subject: z.string().min(1),
  message: z.string().min(10),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = contactSchema.parse(body)

    // In a real application, you would:
    // 1. Save to database
    // 2. Send email notification
    // 3. Integrate with support system
    
    console.log("Contact form submission:", validatedData)
    
    // For now, we'll just simulate success
    await new Promise(resolve => setTimeout(resolve, 1000))

    return NextResponse.json({ 
      success: true,
      message: "Contact form submitted successfully" 
    })
  } catch (error) {
    console.error("Error processing contact form:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
