'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 transition-shadow duration-300 ${
        scrolled ? 'shadow-md' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
          <Link href="/" className="text-xl font-bold" style={{ color: '#0f1a1a' }}>
            CareNote<span style={{ color: '#0a7c6d' }}>.</span>
          </Link>
        </motion.div>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { href: '#features', label: 'Features' },
            { href: '#how-it-works', label: 'How It Works' },
            { href: '#demo', label: 'Demo' },
            { href: '#pricing', label: 'Pricing' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm relative group transition-colors"
              style={{ color: '#4a5568' }}
            >
              {link.label}
              <span
                className="absolute -bottom-0.5 left-0 h-px w-0 group-hover:w-full transition-all duration-300"
                style={{ backgroundColor: '#0a7c6d' }}
              />
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm relative group transition-colors"
            style={{ color: '#4a5568' }}
          >
            Log in
            <span
              className="absolute -bottom-0.5 left-0 h-px w-0 group-hover:w-full transition-all duration-300"
              style={{ backgroundColor: '#0a7c6d' }}
            />
          </Link>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.15 }}>
            <Link
              href="/book"
              className="rounded-full px-5 py-2 text-sm font-medium text-white transition-colors"
              style={{ backgroundColor: '#0a7c6d' }}
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </div>
    </nav>
  )
}
