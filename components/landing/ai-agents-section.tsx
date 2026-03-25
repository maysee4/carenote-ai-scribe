'use client'

import { useState } from 'react'
import { FileText, Heart, ClipboardList } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { FadeIn } from '@/components/ui/fade-in'

type TabType = 'support' | 'nurse' | 'smart'

const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
  { id: 'support', label: 'Support Worker Docs', icon: FileText },
  { id: 'nurse', label: 'Nurse & Clinical', icon: Heart },
  { id: 'smart', label: 'Smart Form Completion', icon: ClipboardList },
]

const tabContent: Record<TabType, { title: string; description: string }[]> = {
  support: [
    {
      title: 'Shift Notes → Structured Reports',
      description: 'Messy shift notes become audit-ready, professional documentation instantly.',
    },
    {
      title: 'Incident Forms → Fully Completed',
      description: 'Incidents are auto-detected, severity-flagged, and forms completed with all required fields.',
    },
    {
      title: 'Feedback Forms → Professional Summaries',
      description: 'Raw feedback transformed into clear, structured summaries ready for review.',
    },
  ],
  nurse: [
    {
      title: 'Care Plans → Structured & Goal-Aligned',
      description: 'Care plans generated with proper clinical structure aligned to participant goals.',
    },
    {
      title: 'Risk Assessments → Audit-Ready Summaries',
      description: 'Risk data extracted and formatted into compliant assessment documentation.',
    },
    {
      title: 'Condition Reports → Clinical Language',
      description: 'Raw observations converted into professional clinical language and terminology.',
    },
  ],
  smart: [
    {
      title: 'Extracts Key Details',
      description: 'AI identifies names, dates, incidents, medications, and all relevant data points from rough input.',
    },
    {
      title: 'Asks for Missing Information',
      description: 'Flags gaps in documentation and prompts for the specific details needed to complete the form.',
    },
    {
      title: 'Completes Every Section',
      description: 'Fills out every required field of the form — no blank sections, no guesswork.',
    },
    {
      title: 'Copy-Ready for AlayaCare',
      description: 'Outputs formatted documentation ready to paste directly into AlayaCare or your existing workflow.',
    },
  ],
}

export function AIAgentsSection() {
  const [activeTab, setActiveTab] = useState<TabType>('support')

  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        {/* Label + H2 + subtitle */}
        <FadeIn>
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#0a7c6d' }}>
            AI AGENTS
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: '#0f1a1a' }}>
            We don&apos;t just clean notes —{' '}
            <em className="font-serif italic">we complete your documentation for you.</em>
          </h2>
          <p className="text-lg mb-10" style={{ color: '#4a5568' }}>
            AI Agents built for every NDIS form
          </p>
        </FadeIn>

        {/* Tab pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          {tabs.map((tab, index) => (
            <motion.button
              key={tab.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: 'easeOut', delay: index * 0.1 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab(tab.id)}
              className="rounded-full px-5 py-2.5 text-sm font-medium border transition-colors inline-flex items-center gap-2"
              style={
                activeTab === tab.id
                  ? { backgroundColor: '#0a7c6d', color: '#ffffff', borderColor: '#0a7c6d' }
                  : { backgroundColor: '#ffffff', color: '#4a5568', borderColor: '#d1d5db' }
              }
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Content grid with AnimatePresence */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="grid sm:grid-cols-2 gap-6"
          >
            {tabContent[activeTab].map((item) => (
              <motion.div
                key={item.title}
                whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.1)' }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl border border-gray-200 bg-white p-6 cursor-default"
              >
                <h3 className="text-base font-bold mb-2" style={{ color: '#0f1a1a' }}>
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#4a5568' }}>
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
