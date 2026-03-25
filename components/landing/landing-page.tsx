'use client'

import { Navbar } from './navbar'
import { HeroSection } from './hero-section'
import { HowItWorksSection } from './how-it-works-section'
import { FeaturesSection } from './features-section'
import { PricingSection } from './pricing-section'
import { CTASection } from './cta-section'
import { Footer } from './footer'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  )
}
