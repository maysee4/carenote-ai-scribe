'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Mic, ArrowRight, CheckCircle } from 'lucide-react'

const proof = [
  'Used by 500+ care professionals',
  'GDPR compliant',
  'Saves 2+ hours per day',
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[hsl(173,80%,97%)] to-white pt-32 pb-20">
      {/* Background orbs */}
      <div className="absolute top-20 left-1/4 h-64 w-64 rounded-full bg-[hsl(173,80%,30%)]/8 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 h-48 w-48 rounded-full bg-[hsl(173,80%,30%)]/6 blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-[hsl(173,80%,30%)]/10 px-4 py-1.5 mb-6">
            <Mic className="h-3.5 w-3.5 text-[hsl(173,80%,30%)]" />
            <span className="text-sm font-medium text-[hsl(173,80%,30%)]">AI-powered care documentation</span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Care notes written{' '}
            <span className="text-[hsl(173,80%,30%)]">in seconds,</span>
            <br />not hours
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Record your voice notes after a visit. CareNote AI transcribes and transforms them into professional,
            structured care reports — instantly.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <Link href="/signup">
              <Button size="lg" className="gap-2 text-base h-12 px-8">
                Start free today <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-base h-12 px-8">
                Sign in
              </Button>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            {proof.map((item) => (
              <div key={item} className="flex items-center gap-1.5 text-sm text-gray-500">
                <CheckCircle className="h-4 w-4 text-[hsl(173,80%,30%)]" />
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Mock UI */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden"
        >
          <div className="flex items-center gap-1.5 px-4 py-3 bg-gray-50 border-b border-gray-100">
            <div className="h-3 w-3 rounded-full bg-red-400" />
            <div className="h-3 w-3 rounded-full bg-yellow-400" />
            <div className="h-3 w-3 rounded-full bg-green-400" />
            <span className="ml-3 text-xs text-gray-400 font-mono">carenote.ai/reports/new</span>
          </div>
          <div className="p-8 grid sm:grid-cols-2 gap-6 text-left">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Your voice note</p>
              <div className="rounded-lg bg-gray-50 border border-dashed border-gray-200 p-4 text-sm text-gray-500 leading-relaxed italic">
                &ldquo;Visited Mrs. Johnson at 9am. She was in good spirits, had breakfast, took her medications.
                Some light confusion about the day. Assisted with morning hygiene...&rdquo;
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-[hsl(173,80%,30%)] uppercase tracking-wider mb-3">Generated report</p>
              <div className="rounded-lg bg-[hsl(173,80%,30%)]/5 border border-[hsl(173,80%,30%)]/20 p-4 text-sm space-y-2">
                <p className="font-semibold text-gray-800">Summary</p>
                <p className="text-gray-600 leading-relaxed">Morning care visit conducted at 09:00. Client presented in positive mood with good appetite. All medications administered as prescribed.</p>
                <p className="font-semibold text-gray-800 mt-2">Concerns</p>
                <p className="text-gray-600">Mild temporal disorientation noted. Monitor and report if recurring.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
