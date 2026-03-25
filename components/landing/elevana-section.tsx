'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { FadeIn } from '@/components/ui/fade-in'

const products = [
  {
    name: 'ComplianceSnap AI',
    description: 'AI compliance assistant for electricians, plumbers and HVAC installers.',
    logo: '/logos/compliancesnap.png',
    highlighted: false,
    darkBg: false,
  },
  {
    name: 'CareNote AI',
    description: 'AI documentation and incident reporting platform built for NDIS providers.',
    logo: '/logos/carenote.png',
    highlighted: true,
    darkBg: false,
  },
  {
    name: 'Elevana AI Marketing',
    description: 'AI growth systems helping service businesses automate lead handling, bookings and marketing.',
    logo: '/logos/elevana.png',
    highlighted: false,
    darkBg: true,
  },
]

export function ElevanaSection() {
  return (
    <section className="py-20" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="max-w-5xl mx-auto px-6 text-center">
        {/* Label + H2 + body */}
        <FadeIn>
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#0a7c6d' }}>
            BUILT BY ELEVANA AI
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#0f1a1a' }}>
            AI Platforms Built by <span className="font-serif italic">Elevana.</span>
          </h2>
          <p className="text-base leading-relaxed mb-12 max-w-2xl mx-auto" style={{ color: '#4a5568' }}>
            We design and launch AI systems used across regulated industries where documentation, compliance, and operational efficiency are critical.
          </p>
        </FadeIn>

        <div className="grid sm:grid-cols-3 gap-6 mb-10">
          {products.map((product, index) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.1 }}
              whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.1)' }}
              className="rounded-2xl border p-6 text-center cursor-default"
              style={
                product.highlighted
                  ? { borderColor: '#0a7c6d', borderWidth: '2px', backgroundColor: '#f0faf8' }
                  : { borderColor: '#e5e7eb', backgroundColor: '#ffffff' }
              }
            >
              <div
                className="h-24 rounded-xl mb-4 flex items-center justify-center overflow-hidden"
                style={{ backgroundColor: product.darkBg ? '#1a1a2e' : '#f8f9fa' }}
              >
                <Image
                  src={product.logo}
                  alt={product.name}
                  width={120}
                  height={80}
                  className="object-contain"
                  style={{ maxHeight: '80px' }}
                />
              </div>

              <h3 className="text-base font-bold mb-2" style={{ color: '#0f1a1a' }}>
                {product.name}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: '#4a5568' }}>
                {product.description}
              </p>
            </motion.div>
          ))}
        </div>

        <FadeIn delay={0.3}>
          <p className="text-sm" style={{ color: '#4a5568' }}>
            Founded by <strong style={{ color: '#0f1a1a' }}>Maverick Baker</strong> — AI systems builder focused on automation for regulated industries.
          </p>
        </FadeIn>
      </div>
    </section>
  )
}
