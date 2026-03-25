'use client'

import Link from 'next/link'
import { Send, ArrowRight, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export function HeroSection() {
  return (
    <>
      {/* Hero */}
      <section className="pt-24 pb-0" style={{ backgroundColor: '#f0faf8' }}>
        <div className="max-w-4xl mx-auto px-6 text-center pt-20 pb-16">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 mb-10"
            style={{ borderColor: '#0a7c6d', backgroundColor: 'transparent' }}
          >
            <Sparkles className="h-3.5 w-3.5" style={{ color: '#0a7c6d' }} />
            <span className="text-sm font-medium" style={{ color: '#0a7c6d' }}>Built for NDIS providers</span>
          </motion.div>

          {/* H1 */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold leading-tight mb-8 tracking-tight"
            style={{ color: '#0d1f1e' }}
          >
            Turn messy shift notes, voice recordings, and incomplete forms into fully completed, audit-ready NDIS documentation —{' '}
            <span className="font-serif italic" style={{ color: '#0a7c6d' }}>in minutes.</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
            className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: '#4a6670' }}
          >
            Save 5–8 hours per staff per week, catch compliance risks before audits, and automatically complete your incident reports, care plans, and clinical documentation — without changing how your team works.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 justify-center mb-10"
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.15 }}>
              <Link
                href="/book"
                className="rounded-full px-6 py-3 text-base font-semibold text-white inline-flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#0a7c6d' }}
              >
                <Send className="h-4 w-4" />
                Send Us a Note — Get It Back Audit-Ready (Free)
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.15 }}>
              <Link
                href="#how-it-works"
                className="rounded-full px-6 py-3 text-base font-semibold border inline-flex items-center justify-center gap-2 transition-colors hover:bg-white"
                style={{ borderColor: '#d1d5db', color: '#0d1f1e', backgroundColor: 'transparent' }}
              >
                <ArrowRight className="h-4 w-4" />
                See How It Works in Your Business
              </Link>
            </motion.div>
          </motion.div>

          {/* Info card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.4 }}
            className="max-w-2xl mx-auto rounded-xl border px-8 py-5"
            style={{ borderColor: '#c8e6e2', backgroundColor: 'rgba(255,255,255,0.6)' }}
          >
            <p className="font-semibold text-base mb-1" style={{ color: '#0d1f1e' }}>
              From messy notes → fully completed NDIS forms in minutes.
            </p>
            <p className="text-sm" style={{ color: '#4a6670' }}>
              No new systems. Works with AlayaCare. Built for NDIS providers.
            </p>
          </motion.div>
        </div>

        {/* Dark navy bottom strip */}
        <div className="w-full py-14 px-6" style={{ backgroundColor: '#1e3347' }}>
          <div className="max-w-3xl mx-auto text-center">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 text-sm font-medium"
              style={{ backgroundColor: 'rgba(255,200,50,0.15)', color: '#f5d76e', border: '1px solid rgba(245,215,110,0.3)' }}
            >
              ⚠ Less than 5 months away
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              July 1, 2026:{' '}
              <span className="font-serif italic" style={{ color: '#4db8aa' }}>Mandatory SIL Registration</span>
            </h2>

            <p className="text-base leading-relaxed mb-8" style={{ color: '#8fb5c5' }}>
              All SIL providers must register with the NDIS Commission. New Practice Standards demand stronger evidence of service quality. Start building audit-ready documentation habits now.
            </p>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.15 }} className="inline-block">
              <Link
                href="/book"
                className="rounded-full px-6 py-3 text-base font-semibold text-white inline-flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#0a7c6d' }}
              >
                Get Audit-Ready <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
