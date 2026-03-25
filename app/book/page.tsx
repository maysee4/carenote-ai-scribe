import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function BookPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Minimal navbar */}
      <nav className="border-b border-gray-100 px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold" style={{ color: '#0f1a1a' }}>
          CareNote<span style={{ color: '#0a7c6d' }}>.</span>
        </Link>
        <Link
          href="/"
          className="text-sm font-medium flex items-center gap-1 transition-colors"
          style={{ color: '#4a5568' }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to site
        </Link>
      </nav>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left side */}
          <div>
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8 text-sm font-medium border"
              style={{ borderColor: '#0a7c6d', color: '#0a7c6d', backgroundColor: '#f0faf8' }}
            >
              Book Your Setup Call
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold mb-6 leading-tight" style={{ color: '#0f1a1a' }}>
              See how CareNote AI works{' '}
              <em className="font-serif italic" style={{ color: '#0a7c6d' }}>
                in your business.
              </em>
            </h1>

            <p className="text-base leading-relaxed mb-10" style={{ color: '#4a5568' }}>
              This is a free, no-obligation walkthrough. We&apos;ll show you exactly how your team&apos;s shift notes become structured, NDIS-aligned reports — and how much time you&apos;ll save.
            </p>

            {/* What to expect */}
            <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#0a7c6d' }}>
              WHAT TO EXPECT
            </p>

            {/* Pill badges */}
            <div className="flex flex-wrap gap-2 mb-8">
              {['15 minutes', 'Video call', 'No obligation'].map((pill) => (
                <span
                  key={pill}
                  className="rounded-full px-4 py-1.5 text-sm font-medium border"
                  style={{ borderColor: '#d1d5db', color: '#4a5568' }}
                >
                  {pill}
                </span>
              ))}
            </div>

            {/* Steps */}
            <div className="space-y-6 mb-10">
              {[
                {
                  num: '01',
                  title: 'Pick a Time',
                  desc: 'Choose a 15-minute slot that works for you. We\'ll confirm instantly.',
                },
                {
                  num: '02',
                  title: 'Quick Discovery',
                  desc: 'We\'ll review your current documentation workflow and identify where time is being lost.',
                },
                {
                  num: '03',
                  title: 'Live Walkthrough',
                  desc: 'See CareNote AI turn one of your real shift notes into an audit-ready report — in under 2 minutes.',
                },
              ].map((step) => (
                <div key={step.num} className="flex gap-4">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white shrink-0 mt-0.5"
                    style={{ backgroundColor: '#0f1a1a' }}
                  >
                    {step.num}
                  </div>
                  <div>
                    <p className="font-semibold mb-1" style={{ color: '#0f1a1a' }}>
                      {step.title}
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: '#4a5568' }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs" style={{ color: '#94a3b8' }}>
              All discussions are strictly confidential. NDAs available upon request.
            </p>
          </div>

          {/* Right side: GHL calendar embed */}
          <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm min-h-[600px]">
            <iframe
              src="https://api.elevanaimarketing.com/widget/booking/cVV0q4baPRiKMHplrkqg"
              style={{ width: '100%', border: 'none', overflow: 'hidden', minHeight: '600px' }}
              scrolling="no"
              id="cVV0q4baPRiKMHplrkqg_1774478858100"
            />
            <script
              src="https://api.elevanaimarketing.com/js/form_embed.js"
              type="text/javascript"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
