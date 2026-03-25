import { Navbar } from './navbar'
import { HeroSection } from './hero-section'
import { WhoItsForSection } from './who-its-for-section'
import { LiveDemoSection } from './live-demo-section'
import { AIAgentsSection } from './ai-agents-section'
import { HowItWorksSection } from './how-it-works-section'
import { ComplianceSection } from './compliance-section'
import { GuaranteeSection } from './guarantee-section'
import { PricingSection } from './pricing-section'
import { ElevanaSection } from './elevana-section'
import { FinalCTASection } from './final-cta-section'
import { Footer } from './footer'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <WhoItsForSection />
      <LiveDemoSection />
      <AIAgentsSection />
      <HowItWorksSection />
      <ComplianceSection />
      <GuaranteeSection />
      <PricingSection />
      <ElevanaSection />
      <FinalCTASection />
      <Footer />
    </div>
  )
}
