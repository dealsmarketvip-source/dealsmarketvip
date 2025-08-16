
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { HeroSection } from "@/components/sections/hero-section"
import { FeaturesSection } from "@/components/sections/features-section"
import { CategoriesSection } from "@/components/sections/categories-section"
import { TestimonialsSection } from "@/components/sections/testimonials-section"
import { CTASection } from "@/components/sections/cta-section"

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  // Redirect authenticated verified companies to dashboard
  if (session?.user?.role === "VERIFIED_COMPANY") {
    redirect("/dashboard")
  }

  // Redirect pending applications to status page
  if (session?.user?.role === "PENDING") {
    redirect("/application-status")
  }

  return (
    <div className="flex flex-col">
      <HeroSection />
      <FeaturesSection />
      <CategoriesSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  )
}
