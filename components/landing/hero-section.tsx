import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function HeroSection() {
  return (
    <>
      {/* Hero */}
      <section className="pt-24 pb-0 bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center pt-16 pb-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 mb-8">
            <span className="text-sm font-medium" style={{ color: '#4a5568' }}>Built for NDIS providers</span>
          </div>

          {/* H1 */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-8" style={{ color: '#0f1a1a' }}>
            Turn messy shift notes, voice recordings, and incomplete forms into fully completed, audit-ready NDIS documentation — in minutes.
          </h1>

          {/* Subtext */}
          <p className="text-lg sm:text-xl max-w-3xl mx-auto mb-10 leading-relaxed" style={{ color: '#4a5568' }}>
            Save 5–8 hours per staff per week, catch compliance risks before audits, and automatically complete your incident reports, care plans, and clinical documentation — without changing how your team works.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/book"
              className="rounded-full px-6 py-3 text-base font-semibold text-white inline-flex items-center justify-center gap-2"
              style={{ backgroundColor: '#0a7c6d' }}
            >
              Send Us a Note — Get It Back Audit-Ready (Free)
            </Link>
            <Link
              href="#how-it-works"
              className="rounded-full px-6 py-3 text-base font-semibold border border-gray-300 inline-flex items-center justify-center gap-2"
              style={{ color: '#0f1a1a' }}
            >
              See How It Works in Your Business
            </Link>
          </div>

          {/* Small text */}
          <p className="text-sm" style={{ color: '#4a5568' }}>
            From messy notes → fully completed NDIS forms in minutes. No new systems. Works with AlayaCare. Built for NDIS providers.
          </p>
        </div>

        {/* Dark navy bottom strip */}
        <div className="w-full py-12 px-6" style={{ backgroundColor: '#1e3347' }}>
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 text-sm font-medium"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#f0faf8' }}
            >
              ⚠ Less than 5 months away
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              July 1, 2026:{' '}
              <em className="font-serif italic">Mandatory SIL Registration</em>
            </h2>

            <p className="text-base leading-relaxed mb-8" style={{ color: '#a0b8c8' }}>
              All SIL providers must register with the NDIS Commission. New Practice Standards demand stronger evidence of service quality. Start building audit-ready documentation habits now.
            </p>

            <Link
              href="/book"
              className="rounded-full px-6 py-3 text-base font-semibold text-white inline-flex items-center justify-center gap-2"
              style={{ backgroundColor: '#0a7c6d' }}
            >
              Get Audit-Ready <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
