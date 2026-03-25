import { Mic, Bot, Copy } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: Mic,
    title: 'Paste or Speak',
    description: 'Drop in messy notes or voice recordings — no formatting needed.',
  },
  {
    number: '02',
    icon: Bot,
    title: 'AI Completes the Form',
    description: 'Our AI agents structure, rewrite, and fully complete your documentation.',
  },
  {
    number: '03',
    icon: Copy,
    title: 'Copy Into Your System',
    description: 'Paste directly into AlayaCare or your existing workflow.',
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        {/* Label */}
        <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#0a7c6d' }}>
          HOW IT WORKS
        </p>

        <h2 className="text-3xl sm:text-4xl font-bold mb-14" style={{ color: '#0f1a1a' }}>
          Up and running in <em className="font-serif italic">minutes</em>
        </h2>

        <div className="grid sm:grid-cols-3 gap-10">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                {/* Dark circle number */}
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white shrink-0"
                  style={{ backgroundColor: '#0f1a1a' }}
                >
                  {step.number}
                </div>
                {/* Teal icon circle */}
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full shrink-0"
                  style={{ backgroundColor: '#f0faf8' }}
                >
                  <step.icon className="h-5 w-5" style={{ color: '#0a7c6d' }} />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2" style={{ color: '#0f1a1a' }}>
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#4a5568' }}>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
