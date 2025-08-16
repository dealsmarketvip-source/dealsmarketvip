import { HeroSection } from "@/components/hero-section"
import { MarketplaceSection } from "@/components/marketplace-section"
import { ServicesSection } from "@/components/services-section"
import { VipSection } from "@/components/vip-section"
import { BentoSection } from "@/components/bento-section"
import { PricingSection } from "@/components/pricing-section"
import { TestimonialGridSection } from "@/components/testimonial-grid-section"
import { FAQSection } from "@/components/faq-section"
import { CTASection } from "@/components/cta-section"
import { FooterSection } from "@/components/footer-section"
import { AnimatedSection } from "@/components/animated-section"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden pb-0">
      <div className="relative z-10">
        <main className="relative">
          <HeroSection />
        </main>

        <AnimatedSection className="relative z-10" delay={0.1}>
          <MarketplaceSection />
        </AnimatedSection>

        <AnimatedSection className="relative z-10" delay={0.2}>
          <ServicesSection />
        </AnimatedSection>

        <AnimatedSection className="relative z-10" delay={0.2}>
          <VipSection />
        </AnimatedSection>

        <AnimatedSection id="caracteristicas" className="relative z-10 max-w-[1320px] mx-auto mt-16" delay={0.2}>
          <BentoSection />
        </AnimatedSection>

        <AnimatedSection id="membresia" className="relative z-10 max-w-[1320px] mx-auto mt-8 md:mt-16" delay={0.2}>
          <PricingSection />
        </AnimatedSection>

        <AnimatedSection id="testimonios" className="relative z-10 max-w-[1320px] mx-auto mt-8 md:mt-16" delay={0.2}>
          <TestimonialGridSection />
        </AnimatedSection>

        <AnimatedSection id="faq-section" className="relative z-10 max-w-[1320px] mx-auto mt-8 md:mt-16" delay={0.2}>
          <FAQSection />
        </AnimatedSection>

        <AnimatedSection className="relative z-10 max-w-[1320px] mx-auto mt-8 md:mt-16" delay={0.2}>
          <CTASection />
        </AnimatedSection>

        <AnimatedSection className="relative z-10 max-w-[1320px] mx-auto mt-8 md:mt-16" delay={0.2}>
          <FooterSection />
        </AnimatedSection>
      </div>
    </div>
  )
}
