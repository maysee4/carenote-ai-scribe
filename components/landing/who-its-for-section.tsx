import { Home, Building2, ShieldCheck, Users } from 'lucide-react'

const cards = [
  {
    icon: Home,
    title: 'Home care & in-home support providers',
  },
  {
    icon: Building2,
    title: 'Disability support organisations',
  },
  {
    icon: ShieldCheck,
    title: 'NDIS-registered providers',
  },
  {
    icon: Users,
    title: 'Team leaders and care managers handling compliance',
  },
]

export function WhoItsForSection() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        {/* Label */}
        <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#0a7c6d' }}>
          WHO IT&apos;S FOR
        </p>

        <h2 className="text-3xl sm:text-4xl font-bold mb-12" style={{ color: '#0f1a1a' }}>
          Who CareNote AI is for
        </h2>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {cards.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-gray-200 bg-white p-6 flex flex-col items-start gap-4"
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: '#f0faf8' }}
              >
                <card.icon className="h-5 w-5" style={{ color: '#0a7c6d' }} />
              </div>
              <p className="text-base font-medium leading-snug" style={{ color: '#0f1a1a' }}>
                {card.title}
              </p>
            </div>
          ))}
        </div>

        {/* Footer text */}
        <p className="text-base" style={{ color: '#4a5568' }}>
          If your staff write notes, reports, or incident documentation —{' '}
          <em className="font-serif italic font-semibold" style={{ color: '#0a7c6d' }}>
            this is built for you.
          </em>
        </p>
      </div>
    </section>
  )
}
