'use client'

import Link from 'next/link'

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold" style={{ color: '#0f1a1a' }}>
          CareNote<span style={{ color: '#0a7c6d' }}>.</span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm transition-colors" style={{ color: '#4a5568' }}>
            Features
          </Link>
          <Link href="#how-it-works" className="text-sm transition-colors" style={{ color: '#4a5568' }}>
            How It Works
          </Link>
          <Link href="#demo" className="text-sm transition-colors" style={{ color: '#4a5568' }}>
            Demo
          </Link>
          <Link href="#pricing" className="text-sm transition-colors" style={{ color: '#4a5568' }}>
            Pricing
          </Link>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm transition-colors" style={{ color: '#4a5568' }}>
            Log in
          </Link>
          <Link
            href="/book"
            className="rounded-full px-5 py-2 text-sm font-medium text-white transition-colors"
            style={{ backgroundColor: '#0a7c6d' }}
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  )
}
