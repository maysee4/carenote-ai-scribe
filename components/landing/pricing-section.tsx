'use client'

import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { FadeIn } from '@/components/ui/fade-in'

const features = [
  'Free trial with your real shift notes',
  'Priority access to new features',
  'Direct input into product development',
  'Locked-in early pricing when we launch',
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        {/* Label + H2 */}
        <FadeIn>
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#0a7c6d' }}>
            PRICING
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-12" style={{ color: '#0f1a1a' }}>
            Simple pricing for <em className="font-serif italic">SIL providers</em>
          </h2>
        </FadeIn>

        {/* Single card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
          className="rounded-2xl border-2 p-8"
          style={{ borderColor: '#0a7c6d', backgroundColor: '#f9fffe' }}
        >
          {/* Badge */}
          <div
            className="inline-block rounded-full px-4 py-1 text-xs font-semibold mb-6"
            style={{ backgroundColor: '#0a7c6d', color: '#ffffff' }}
          >
            Limited spots
          </div>

          <h3 className="text-2xl font-bold mb-2" style={{ color: '#0f1a1a' }}>
            Early Access Program
          </h3>

          <p className="text-base mb-8" style={{ color: '#4a5568' }}>
            We&apos;re working with a small group of SIL providers to refine CareNote AI.
          </p>

          {/* Checklist */}
          <ul className="space-y-3 mb-8">
            {features.map((feature, index) => (
              <motion.li
                key={feature}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, ease: 'easeOut', delay: 0.2 + index * 0.08 }}
                className="flex items-center gap-3 text-sm"
                style={{ color: '#0f1a1a' }}
              >
                <CheckCircle className="h-4 w-4 shrink-0" style={{ color: '#0a7c6d' }} />
                {feature}
              </motion.li>
            ))}
          </ul>

          {/* Button */}
          <motion.div
            whileHover={{ scale: 1.02, filter: 'brightness(1.08)' }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15 }}
          >
            <Link
              href="/book"
              className="block w-full rounded-full py-3 text-center text-base font-semibold text-white transition-colors"
              style={{ backgroundColor: '#0a7c6d' }}
            >
              Apply for Early Access →
            </Link>
          </motion.div>

          {/* Footer */}
          <p className="mt-6 text-sm text-center" style={{ color: '#4a5568' }}>
            Questions about pricing? Get in touch — we&apos;re happy to chat.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
