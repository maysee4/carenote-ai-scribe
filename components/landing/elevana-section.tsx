const products = [
  {
    name: 'ComplianceSnap AI',
    description: 'Automated compliance documentation for regulated industries.',
    highlighted: false,
  },
  {
    name: 'CareNote AI',
    description: 'NDIS-aligned documentation automation for SIL providers.',
    highlighted: true,
  },
  {
    name: 'Elevana AI Marketing',
    description: 'AI-powered marketing systems for service businesses.',
    highlighted: false,
  },
]

export function ElevanaSection() {
  return (
    <section className="py-20" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="max-w-5xl mx-auto px-6">
        {/* Label */}
        <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#0a7c6d' }}>
          BUILT BY ELEVANA AI
        </p>

        <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#0f1a1a' }}>
          AI Platforms Built by <em className="font-serif italic">Elevana.</em>
        </h2>

        <p className="text-base leading-relaxed mb-12 max-w-2xl" style={{ color: '#4a5568' }}>
          We design and launch AI systems used across regulated industries where documentation, compliance, and operational efficiency are critical.
        </p>

        {/* Product cards */}
        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          {products.map((product) => (
            <div
              key={product.name}
              className="rounded-2xl border p-6 bg-white"
              style={
                product.highlighted
                  ? { borderColor: '#0a7c6d', borderWidth: '2px' }
                  : { borderColor: '#e5e7eb' }
              }
            >
              {/* Logo placeholder */}
              <div
                className="h-12 w-12 rounded-xl mb-4 flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: product.highlighted ? '#0a7c6d' : '#94a3b8' }}
              >
                {product.name.slice(0, 2).toUpperCase()}
              </div>

              <h3 className="text-base font-bold mb-2" style={{ color: '#0f1a1a' }}>
                {product.name}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: '#4a5568' }}>
                {product.description}
              </p>

              {product.highlighted && (
                <div
                  className="mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold"
                  style={{ backgroundColor: '#f0faf8', color: '#0a7c6d' }}
                >
                  You are here
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <p className="text-sm" style={{ color: '#4a5568' }}>
          Founded by <strong style={{ color: '#0f1a1a' }}>Maverick Baker</strong> — AI systems builder focused on automation for regulated industries.
        </p>
      </div>
    </section>
  )
}
