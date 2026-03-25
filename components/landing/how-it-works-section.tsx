import { Mic, Wand2, FileText } from 'lucide-react'

const steps = [
  {
    icon: Mic,
    number: '01',
    title: 'Record your voice',
    description: 'After a visit, simply press record and speak naturally about what happened. No forms, no typing.',
  },
  {
    icon: Wand2,
    number: '02',
    title: 'AI transcribes & analyses',
    description: 'Claude AI transcribes your audio and extracts the key observations, actions, and concerns.',
  },
  {
    icon: FileText,
    number: '03',
    title: 'Professional report ready',
    description: 'A structured, professional care report is generated instantly — ready to save, share, or copy.',
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            From voice to report in 3 steps
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            No more spending evenings catching up on paperwork. Document on the go.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(173,80%,30%)]/10">
                  <step.icon className="h-5 w-5 text-[hsl(173,80%,30%)]" />
                </div>
                <span className="text-2xl font-bold text-gray-200">{step.number}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-500 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
