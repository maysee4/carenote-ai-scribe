export function ComplianceSection() {
  return (
    <section className="py-20" style={{ backgroundColor: '#1e3347' }}>
      <div className="max-w-4xl mx-auto px-6">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 text-sm font-medium"
          style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#f0faf8' }}
        >
          Compliance Risk
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
          Stop finding documentation issues{' '}
          <em className="font-serif italic" style={{ color: '#4db8a8' }}>during audits</em>
        </h2>

        <p className="text-base leading-relaxed mb-10" style={{ color: '#a0b8c8' }}>
          Most NDIS providers only discover documentation problems when it&apos;s too late. CareNote AI flags incidents, improves documentation quality, and ensures your reports are aligned with NDIS Practice Standards — in real time.
        </p>

        {/* Quote card */}
        <div
          className="rounded-2xl p-8 border"
          style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)' }}
        >
          <p className="text-xl italic font-medium text-white leading-relaxed">
            &ldquo;We don&apos;t replace compliance — we make it easier to get right.&rdquo;
          </p>
        </div>
      </div>
    </section>
  )
}
