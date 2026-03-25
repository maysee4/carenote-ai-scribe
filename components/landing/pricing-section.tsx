import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'

const plans = [
  {
    name: 'Free',
    price: '£0',
    period: 'forever',
    description: 'Get started with AI care notes.',
    features: ['5 reports per month', 'Unlimited clients', 'Voice recording', 'Basic export'],
    cta: 'Start free',
    href: '/signup',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '£19',
    period: 'per month',
    description: 'For active care professionals.',
    features: ['Unlimited reports', 'Unlimited clients', 'Priority AI generation', 'All export formats', 'Email support'],
    cta: 'Start Pro',
    href: '/signup',
    highlighted: true,
  },
  {
    name: 'Team',
    price: '£49',
    period: 'per month',
    description: 'For care teams and agencies.',
    features: ['Everything in Pro', 'Up to 10 users', 'Shared client records', 'Admin dashboard', 'Priority support'],
    cta: 'Contact us',
    href: '/signup',
    highlighted: false,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h2>
          <p className="text-lg text-gray-500">Start free. Upgrade when you need more.</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-7 flex flex-col ${
                plan.highlighted
                  ? 'border-[hsl(173,80%,30%)] bg-[hsl(173,80%,30%)]/5 shadow-lg'
                  : 'border-gray-200 bg-white'
              }`}
            >
              {plan.highlighted && (
                <div className="inline-block rounded-full bg-[hsl(173,80%,30%)] text-white text-xs px-3 py-1 font-medium mb-4 self-start">
                  Most popular
                </div>
              )}
              <div className="mb-5">
                <h3 className="font-bold text-xl text-gray-900">{plan.name}</h3>
                <p className="text-gray-500 text-sm mt-1">{plan.description}</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-500 text-sm ml-1">/{plan.period}</span>
              </div>
              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-[hsl(173,80%,30%)] shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={plan.href}>
                <Button
                  className="w-full"
                  variant={plan.highlighted ? 'default' : 'outline'}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
