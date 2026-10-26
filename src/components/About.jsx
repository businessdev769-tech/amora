import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Terminal, 
  ArrowRight, 
  Lock, 
  Layers, 
  Flame, 
  Zap, 
  CheckCircle2, 
  Compass, 
  Sparkles,
  GitBranch
} from 'lucide-react';

const dimensions = [
  {
    id: 'origin',
    badge: '01 / The Origin',
    title: 'Engineered for Production, Not Prototyping',
    subtitle: 'Bridging the chasm between speculative AI hype and deterministic enterprise realities.',
    description:
      'AMORA was established with a singular engineering mandate: to replace fragile, surface-level wrappers with hardened, sovereign artificial intelligence. We architect cognitive software and multi-agent systems designed from ground zero to execute with precision in high-stakes enterprise environments.',
    highlights: [
      'Deterministic agent planning & execution cycles',
      'Zero reliance on opaque third-party black boxes',
      'Enterprise-grade fault tolerance and automated rollback'
    ],
    metric: '100%',
    metricLabel: 'Sovereign Architecture',
    accentColor: '#d7b56d'
  },
  {
    id: 'sovereignty',
    badge: '02 / Data Sovereignty',
    title: 'Absolute Privacy & Zero-Telemetry Isolation',
    subtitle: 'Your proprietary algorithms, data lakes, and codebases never leak.',
    description:
      'Enterprise AI is only as powerful as its security perimeter. AMORA engineers private model inference, dedicated compute clusters, and air-gap compatible pipelines. Your internal intelligence remains entirely yours—never used for public retraining, never observed by external parties.',
    highlights: [
      'Strict air-gapped deployment readiness',
      'Zero telemetry leakage to foreign cloud providers',
      'Granular cryptographic role-based access'
    ],
    metric: '0.0%',
    metricLabel: 'External Data Exposure',
    accentColor: '#f4c85f'
  },
  {
    id: 'dguy',
    badge: '03 / Flagship Innovation',
    title: 'Pioneering Autonomous Developer Agents',
    subtitle: 'Home of DGUY—our state-of-the-art autonomous developer agent.',
    description:
      'Modern software complexity requires cognitive acceleration. Through DGUY, AMORA is pioneering autonomous developer agents capable of deep multi-repository context synthesis, automated test generation, and intelligent pipeline optimization, freeing elite human engineers to invent.',
    highlights: [
      'Multi-repository context tree comprehension',
      'Automated regression detection and self-healing fixes',
      'Native Git & CI/CD workflow synchronization'
    ],
    metric: '10x',
    metricLabel: 'Engineering Velocity',
    accentColor: '#ff9e3b'
  },
  {
    id: 'ethos',
    badge: '04 / The Dragon Ethos',
    title: 'Vigilant Guardian of Enterprise Intelligence',
    subtitle: 'The golden dragon emblem symbolizes power, protection, and tireless momentum.',
    description:
      'In mythology, the dragon guards invaluable treasure with unyielding vigilance. At AMORA, the dragon represents our commitment to safeguarding your institutional knowledge while unleashing an untamed engine of innovation that propels your business ahead of the curve.',
    highlights: [
      'Relentless system stability under peak loads',
      'Proactive autonomous threat & drift detection',
      'Continuous algorithmic evolution'
    ],
    metric: '24/7',
    metricLabel: 'Autonomous Vigilance',
    accentColor: '#ffd166'
  }
];

const architecturePillars = [
  {
    step: 'LAYER 01',
    icon: <Terminal size={20} />,
    title: 'Context & Ingestion Matrix',
    detail: 'AST code indexing, multi-modal enterprise schema parsing, and low-latency knowledge graphs.'
  },
  {
    step: 'LAYER 02',
    icon: <Cpu size={20} />,
    title: 'Cognitive Reasoning Engine',
    detail: 'Fine-tuned domain weights, proprietary planning algorithms, and self-directed verification.'
  },
  {
    step: 'LAYER 03',
    icon: <GitBranch size={20} />,
    title: 'Autonomous Multi-Agent Loop',
    detail: 'Parallel task orchestration, deterministic branch synthesis, and continuous CI/CD integration.'
  },
  {
    step: 'LAYER 04',
    icon: <ShieldCheck size={20} />,
    title: 'Cryptographic Fortification',
    detail: 'Zero-telemetry boundaries, isolated model inference nodes, and enterprise compliance audits.'
  }
];

export default function About() {
  const [activeDimension, setActiveDimension] = useState(0);
  const current = dimensions[activeDimension];

  return (
    <section className="section alt about-section" id="about">
      <div className="container">
        {/* Section Header */}
        <div className="section-head text-center-mobile">
          <div className="eyebrow">
            <span className="live-dot" aria-hidden="true" />
            About AMORA · Intelligence by Design
          </div>
          <h2>
            Who <em>We Are</em>
          </h2>
          <p className="lead">
            AMORA builds sovereign, next-generation Artificial Intelligence solutions for forward-thinking enterprises and ambitious software ecosystems. We engineer bespoke intelligence tailored strictly to your operations.
          </p>
        </div>

        {/* Creative Interactive Dimension Studio */}
        <div className="about-creative-grid">
          {/* Left Column: Interactive Dimension Switcher */}
          <div className="about-tabs-col">
            <div className="about-tabs-label">
              <Compass size={16} className="text-gold" />
              <span>EXPLORE AMORA’S CORE PILLARS</span>
            </div>

            <div className="about-dimension-tabs" role="tablist">
              {dimensions.map((dim, index) => {
                const isActive = activeDimension === index;
                return (
                  <button
                    key={dim.id}
                    role="tab"
                    aria-selected={isActive}
                    className={`about-dimension-tab ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveDimension(index)}
                  >
                    <div className="tab-indicator" />
                    <div className="tab-text">
                      <span className="tab-badge">{dim.badge}</span>
                      <span className="tab-title">{dim.title}</span>
                    </div>
                    <ArrowRight size={16} className="tab-arrow" />
                  </button>
                );
              })}
            </div>

            {/* Quick action buttons */}
            <div className="about-quick-links">
              <a href="#dguy" className="about-chip-link">
                <Sparkles size={14} />
                <span>Meet DGUY Agent</span>
              </a>
              <a href="#team" className="about-chip-link">
                <span>Meet Our Founders</span>
              </a>
              <a href="#contact" className="about-chip-link highlight">
                <span>Engage Our Team</span>
                <ArrowRight size={14} />
              </a>
            </div>
          </div>

          {/* Right Column: Dynamic Dimension Showcase Card */}
          <div className="about-display-col">
            <div className="about-showcase-card">
              {/* Top Bar with Status and Metric */}
              <div className="card-top-bar">
                <div className="card-badge-wrap">
                  <span className="flame-spark">⚡</span>
                  <span className="card-badge-text">{current.badge}</span>
                </div>
                <div className="card-metric-block">
                  <span className="metric-num">{current.metric}</span>
                  <span className="metric-tag">{current.metricLabel}</span>
                </div>
              </div>

              {/* Title & Subtitle */}
              <h3 className="card-title">{current.title}</h3>
              <p className="card-subtitle">{current.subtitle}</p>

              {/* In-depth narrative */}
              <p className="card-narrative">{current.description}</p>

              {/* Bullet highlights */}
              <div className="card-highlights">
                {current.highlights.map((item, idx) => (
                  <div key={idx} className="highlight-row">
                    <CheckCircle2 size={18} className="highlight-icon" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Visual Card Accent Line */}
              <div 
                className="card-glow-bar" 
                style={{ background: `linear-gradient(90deg, ${current.accentColor}, transparent)` }} 
                aria-hidden="true" 
              />
            </div>
          </div>
        </div>

        {/* Creative Section: The AMORA 4-Layer Architecture Matrix */}
        <div className="about-architecture-wrap">
          <div className="arch-header">
            <div className="eyebrow">Technical Architecture</div>
            <h3>How AMORA <em>Engineers Intelligence</em></h3>
            <p className="arch-lead">
              Our full-stack framework unites cognitive models with hardened enterprise software primitives.
            </p>
          </div>

          <div className="arch-pillars-grid">
            {architecturePillars.map((p, i) => (
              <div key={i} className="arch-pillar-box">
                <div className="arch-step-tag">{p.step}</div>
                <div className="arch-icon-wrap">{p.icon}</div>
                <h4>{p.title}</h4>
                <p>{p.detail}</p>
                <div className="arch-box-sheen" aria-hidden="true" />
              </div>
            ))}
          </div>
        </div>

        {/* Founder & Engineering Credo Manifesto Banner */}
        <div className="about-credo-banner">
          <div className="credo-icon">
            <Flame size={28} />
          </div>
          <div className="credo-content">
            <blockquote>
              “We do not build technology to replace human ingenuity; we build autonomous systems that give engineering teams superpowers to solve problems once thought intractable.”
            </blockquote>
            <cite>— AMORA Engineering & Leadership Team</cite>
          </div>
        </div>
      </div>
    </section>
  );
}
