import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function FinalCTASection() {
  return (
    <section className="py-20" style={{ backgroundColor: '#f0faf8' }}>
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#0f1a1a' }}>
          Send us one real shift note —{' '}
          <em className="font-serif italic" style={{ color: '#0a7c6d' }}>
            we&apos;ll convert it for free.
          </em>
        </h2>

        <p className="text-base leading-relaxed mb-10" style={{ color: '#4a5568' }}>
          Send us one real shift note or incident report — we&apos;ll convert it into a fully completed, audit-ready document for you (free).
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/book"
            className="rounded-full px-6 py-3 text-base font-semibold text-white inline-flex items-center gap-2"
            style={{ backgroundColor: '#0a7c6d' }}
          >
            Send Us a Note — Get It Back Audit-Ready
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <p className="mt-6 text-sm" style={{ color: '#4a5568' }}>
          or email{' '}
          <a
            href="mailto:carenoteaisupport@gmail.com"
            className="font-medium hover:underline"
            style={{ color: '#0a7c6d' }}
          >
            carenoteaisupport@gmail.com
          </a>
        </p>
      </div>
    </section>
  )
}
