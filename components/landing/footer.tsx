'use client'

import Link from 'next/link'
import { FadeIn } from '@/components/ui/fade-in'

export function Footer() {
  return (
    <footer className="py-10 px-6" style={{ backgroundColor: '#1e3347' }}>
      <FadeIn>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-white">
            CareNote<span style={{ color: '#4db8a8' }}>.</span>
          </Link>

          {/* Center */}
          <p className="text-sm text-center" style={{ color: '#a0b8c8' }}>
            © 2026 CareNote AI. Built in Sydney for Australian SIL providers.
          </p>

          {/* Right links */}
          <div className="flex gap-6">
            <Link href="/privacy" className="text-sm hover:text-white transition-colors" style={{ color: '#a0b8c8' }}>
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm hover:text-white transition-colors" style={{ color: '#a0b8c8' }}>
              Terms
            </Link>
          </div>
        </div>
      </FadeIn>
    </footer>
  )
}
