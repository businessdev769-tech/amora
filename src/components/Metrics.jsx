import React from 'react';

const metrics = [
  { value: '10x', label: 'Faster Cycles', desc: 'Accelerating product delivery from design to production' },
  { value: '100%', label: 'Private & Secure', desc: 'Enterprise data remains strictly within your perimeter' },
  { value: '24/7', label: 'Autonomous Agents', desc: 'Continuous workflow optimization and execution' },
  { value: 'Zero', label: 'Data Leakage', desc: 'Air-gapped security and deterministic governance' }
];

export default function Metrics() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head" style={{ textAlign: 'center', marginInline: 'auto' }}>
          <div className="eyebrow" style={{ justifyContent: 'center' }}>Enterprise Impact</div>
          <h2>
            Engineered for <em>Measurable Value.</em>
          </h2>
          <p className="lead" style={{ marginInline: 'auto' }}>
            We measure our AI solutions not just by technical novelty, but by the tangible operational acceleration and competitive advantage they deliver to our partners.
          </p>
        </div>

        <div className="metrics-grid">
          {metrics.map((item, idx) => (
            <div className="metric-card" key={idx}>
              <div className="metric-value">{item.value}</div>
              <div className="metric-label">{item.label}</div>
              <p style={{ color: 'var(--muted)', fontSize: '.84rem', marginTop: '8px', marginBottom: 0 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
