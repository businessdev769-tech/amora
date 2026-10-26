import React from 'react';
import { Bot, Cpu, Network, ShieldCheck } from 'lucide-react';

const pillarsData = [
  {
    icon: <Bot size={24} />,
    title: 'Autonomous Agents',
    description:
      'We design multi-agent systems and task-oriented agents that perceive environments, plan deterministic sequences, and execute enterprise software workflows autonomously.'
  },
  {
    icon: <Cpu size={24} />,
    title: 'Custom AI Engineering',
    description:
      'From proprietary model fine-tuning to specialized retrieval-augmented pipelines, our architectures are built from the ground up tailored strictly to your business logic.'
  },
  {
    icon: <Network size={24} />,
    title: 'Intelligent Infrastructure',
    description:
      'Optimizing inference pipelines, compute clustering, and continuous integration engines to deliver high-throughput, low-latency AI performance at enterprise scale.'
  },
  {
    icon: <ShieldCheck size={24} />,
    title: 'Private & Secure Systems',
    description:
      'Built with enterprise data isolation, deterministic governance layers, and zero third-party telemetry to ensure complete confidentiality for sensitive enterprise assets.'
  }
];

export default function Pillars() {
  return (
    <section className="section" id="pillars">
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">Core Capabilities</div>
          <h2>
            Pillars of <em>Engineering.</em>
          </h2>
          <p className="lead">
            AMORA combines cutting-edge AI research with battle-tested systems engineering. We deliver scalable architectures designed to withstand the operational demands of high-growth technology ecosystems.
          </p>
        </div>

        <div className="pillars-grid">
          {pillarsData.map((pillar, idx) => (
            <article className="pillar-card" key={idx}>
              <div className="pillar-icon" aria-hidden="true">
                {pillar.icon}
              </div>
              <h3>{pillar.title}</h3>
              <p>{pillar.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
