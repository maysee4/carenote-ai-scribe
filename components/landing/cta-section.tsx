import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function CTASection() {
  return (
    <section className="py-20 bg-[hsl(173,80%,30%)]">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Start documenting smarter today
        </h2>
        <p className="text-lg text-white/80 mb-8">
          Join hundreds of care professionals saving time every day.
          No credit card required.
        </p>
        <Link href="/signup">
          <Button size="lg" className="bg-white text-[hsl(173,80%,30%)] hover:bg-white/90 gap-2 h-12 px-8 text-base font-semibold">
            Get started free <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  )
}
