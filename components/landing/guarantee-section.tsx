import { ShieldCheck } from 'lucide-react'

export function GuaranteeSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <div
          className="rounded-2xl border-2 p-10 text-center"
          style={{ borderColor: '#0a7c6d' }}
        >
          <div
            className="inline-flex h-14 w-14 items-center justify-center rounded-full mb-6"
            style={{ backgroundColor: '#f0faf8' }}
          >
            <ShieldCheck className="h-7 w-7" style={{ color: '#0a7c6d' }} />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold mb-4" style={{ color: '#0f1a1a' }}>
            We&apos;ll prove it saves your team time —{' '}
            <em className="font-serif italic" style={{ color: '#0a7c6d' }}>
              or we do the work for you.
            </em>
          </h2>

          <p className="text-base leading-relaxed" style={{ color: '#4a5568' }}>
            If CareNote AI doesn&apos;t save your team at least 5 hours per week, we&apos;ll manually complete your documentation until it does.
          </p>
        </div>
      </div>
    </section>
  )
}
