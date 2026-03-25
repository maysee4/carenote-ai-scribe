'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FadeIn } from '@/components/ui/fade-in'

type IncidentType = 'medication' | 'behaviour'
type ViewType = 'raw' | 'audit'

const rawNotes: Record<IncidentType, string> = {
  medication:
    "sarah missed her morning meds again, she was still sleeping when i came at 7. tried to wake her up but she said go away. gave meds at 9:30 instead. she was bit drowsy after. called the house manager about it. also her skin looks dry need cream maybe. she ate lunch ok.",
  behaviour:
    "james had a meltdown at lunch, started throwing plates and screaming. think another resident took his seat. took about 20 min to calm down. we had to guide him to his room. he hit the wall a few times. no injuries. wrote it in the book.",
}

const auditContent: Record<IncidentType, {
  tags: string[]
  body: string
  footer: string
}> = {
  medication: {
    tags: ['4.4 — Medication Management', '1.4 — Independence and Informed Choice', '2.3 — Risk Management'],
    body: `Medication administration was delayed for participant Sarah [surname withheld] on this date. The participant was asleep at the scheduled administration time of 07:00 and declined to be woken. Medications were subsequently administered at 09:30 — a delay of 2.5 hours from the prescribed schedule. The participant exhibited mild drowsiness following administration, which may be consistent with delayed intake. The on-duty house manager was notified verbally. Additionally, a skin integrity concern was observed (dry skin), which requires further assessment and the application of appropriate moisturising cream as per the care plan. The participant consumed lunch without issue.`,
    footer: '⚠ Reportable Incident Detected — Medication | Severity: Medium | Deadline: Within 24 hours',
  },
  behaviour: {
    tags: ['2.3 — Risk Management', '1.5 — Violence and Abuse Free Environment', 'HI.2 — Complex Behaviour Support'],
    body: `A behavioural incident occurred involving participant James [surname withheld] during the lunch period. The participant displayed significant distress, presenting with plate-throwing and vocalisation (screaming). The antecedent is believed to be the occupation of his preferred seating position by another resident. De-escalation took approximately 20 minutes, during which staff guided the participant to his room in accordance with the support plan. Physical contact with the wall (self-directed) was observed on multiple occasions; no injuries were sustained by the participant or others. The incident was recorded in the on-site communication book. No formal incident report has been filed at this stage.`,
    footer: '⚠ Reportable Incident Detected — Behaviour / Restrictive Practice (Possible) | Severity: High | Deadline: Within 24 hours to NDIS Commission',
  },
}

export function LiveDemoSection() {
  const [incident, setIncident] = useState<IncidentType>('medication')
  const [view, setView] = useState<ViewType>('raw')

  const content = auditContent[incident]

  return (
    <section id="demo" className="py-20" style={{ backgroundColor: '#f0faf8' }}>
      <div className="max-w-5xl mx-auto px-6">
        {/* Label + H2 + subtitle */}
        <FadeIn>
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#0a7c6d' }}>
            LIVE DEMO
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: '#0f1a1a' }}>
            From <em className="font-serif italic">this</em> → to <em className="font-serif italic">this</em>
          </h2>
          <p className="text-lg mb-10" style={{ color: '#4a5568' }}>
            In seconds. Not hours.
          </p>
        </FadeIn>

        {/* Toggle row 1: Incident type */}
        <div className="flex gap-2 mb-3">
          {(['medication', 'behaviour'] as IncidentType[]).map((type, index) => (
            <motion.button
              key={type}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: 'easeOut', delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIncident(type)}
              className="rounded-full px-5 py-2 text-sm font-medium border transition-colors"
              style={
                incident === type
                  ? { backgroundColor: '#0a7c6d', color: '#ffffff', borderColor: '#0a7c6d' }
                  : { backgroundColor: '#ffffff', color: '#4a5568', borderColor: '#d1d5db' }
              }
            >
              {type === 'medication' ? 'Medication Incident' : 'Behaviour Incident'}
            </motion.button>
          ))}
        </div>

        {/* Toggle row 2: View type */}
        <div className="flex gap-2 mb-8">
          {(['raw', 'audit'] as ViewType[]).map((v, index) => (
            <motion.button
              key={v}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: 'easeOut', delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setView(v)}
              className="rounded-full px-5 py-2 text-sm font-medium border transition-colors"
              style={
                view === v
                  ? { backgroundColor: '#0a7c6d', color: '#ffffff', borderColor: '#0a7c6d' }
                  : { backgroundColor: '#ffffff', color: '#4a5568', borderColor: '#d1d5db' }
              }
            >
              {v === 'raw' ? 'Raw Staff Note' : 'Audit-Ready Evidence'}
            </motion.button>
          ))}
        </div>

        {/* Content card with AnimatePresence */}
        <div className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
          <AnimatePresence mode="wait">
            {view === 'raw' ? (
              <motion.div
                key={`raw-${incident}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="p-8"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-500"></span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-red-500">
                    Raw shift note — as written by staff
                  </span>
                </div>
                <p className="text-base leading-relaxed italic" style={{ color: '#4a5568' }}>
                  &ldquo;{rawNotes[incident]}&rdquo;
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={`audit-${incident}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="p-8"
              >
                {/* High confidence badge + NDIS tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
                    style={{ backgroundColor: '#d1fae5', color: '#065f46' }}
                  >
                    <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
                    High Confidence
                  </span>
                  {content.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full px-3 py-1 text-xs font-medium border"
                      style={{ borderColor: '#0a7c6d', color: '#0a7c6d', backgroundColor: '#f0faf8' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Report body */}
                <p className="text-sm leading-relaxed mb-6" style={{ color: '#0f1a1a' }}>
                  {content.body}
                </p>

                {/* Footer warning */}
                <div
                  className="rounded-lg p-4 text-sm font-medium"
                  style={{ backgroundColor: '#fff7ed', color: '#92400e', borderLeft: '4px solid #f59e0b' }}
                >
                  {content.footer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
