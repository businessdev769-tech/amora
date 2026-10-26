import React from 'react';
import { Terminal, Code2, GitBranch, Layers } from 'lucide-react';

export default function Dguy() {
  const capabilitiesPreview = [
    {
      icon: <Code2 size={20} />,
      title: 'Contextual Synthesis',
      desc: 'Deep multi-repository code understanding and deterministic implementation.'
    },
    {
      icon: <GitBranch size={20} />,
      title: 'Self-Directed QA',
      desc: 'Autonomous branch execution, test suite synthesis, and regression verification.'
    },
    {
      icon: <Terminal size={20} />,
      title: 'Intelligent Refactoring',
      desc: 'Systemic architectural upgrades, dead-code removal, and performance optimization.'
    },
    {
      icon: <Layers size={20} />,
      title: 'CI/CD Pipeline Harmony',
      desc: 'Seamless integration with existing developer toolchains and review cycles.'
    }
  ];

  return (
    <section className="section alt" id="dguy">
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">Our flagship agent</div>
          <h2>
            Meet <em>DGUY.</em>
          </h2>
          <p className="lead">
            DGUY is AMORA’s flagship autonomous AI Developer Agent. Its detailed capabilities and supported workflows will be announced as they are defined.
          </p>
        </div>

        <div className="agent-grid">
          <div className="agent-mark" aria-hidden="true">
            <span>D</span>
          </div>

          <div className="agent-copy">
            <h3>Autonomous AI Developer Agent</h3>
            <p>
              Designed as part of AMORA’s AI engineering vision, DGUY represents our focus on helping organizations improve software development and build intelligent infrastructure.
            </p>
            <span className="pill">Capabilities: to be defined</span>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '14px',
              marginTop: '28px',
              borderTop: '1px solid rgba(215, 181, 109, 0.15)',
              paddingTop: '20px'
            }}>
              {capabilitiesPreview.map((cap, i) => (
                <div 
                  key={i} 
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gold-light)', marginBottom: '4px', fontSize: '.88rem', fontWeight: 600 }}>
                    <span style={{ color: 'var(--gold)' }}>{cap.icon}</span>
                    <span>{cap.title}</span>
                  </div>
                  <div style={{ fontSize: '.8rem', color: 'var(--muted)', lineHeight: '1.5' }}>
                    {cap.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
