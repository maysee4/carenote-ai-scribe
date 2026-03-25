import { Mic, Brain, Users, Shield, Clock, Download } from 'lucide-react'

const features = [
  {
    icon: Mic,
    title: 'Voice Recording',
    description: 'Record directly in the browser. No app download required.',
  },
  {
    icon: Brain,
    title: 'Claude AI',
    description: 'Powered by Anthropic\'s Claude — accurate, nuanced, and context-aware.',
  },
  {
    icon: Users,
    title: 'Client Management',
    description: 'Keep all your clients organised with profiles and report history.',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data is encrypted in transit and at rest. GDPR compliant.',
  },
  {
    icon: Clock,
    title: 'Save Hours Daily',
    description: 'Care professionals save an average of 2+ hours every day on documentation.',
  },
  {
    icon: Download,
    title: 'Export Anywhere',
    description: 'Copy reports instantly to paste into any system you use.',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Everything you need to document faster
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Built specifically for care professionals who are tired of paperwork eating their time.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl bg-white border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(173,80%,30%)]/10 mb-4">
                <f.icon className="h-5 w-5 text-[hsl(173,80%,30%)]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
