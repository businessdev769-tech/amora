import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'What types of custom AI engineering does AMORA specialize in?',
    a: 'AMORA engineers tailored AI architectures for enterprise software stacks. This includes autonomous task agents, custom LLM fine-tuning, retrieval-augmented generation (RAG) systems, automated developer tooling, and edge-optimized inference pipelines designed specifically around your operational domain.'
  },
  {
    q: 'How does AMORA ensure enterprise data privacy and sovereignty?',
    a: 'Data sovereignty is central to our engineering philosophy. We build solutions with air-gapped or private cloud deployments, strict tenant isolation, and zero third-party telemetry, ensuring your proprietary codebases and business data remain entirely confidential.'
  },
  {
    q: 'What is DGUY, and how will it integrate with development workflows?',
    a: 'DGUY is our flagship autonomous AI Developer Agent designed to automate complex development cycles, system refactoring, and quality assurance. As detailed capabilities are announced, DGUY will integrate natively with standard version control, CI/CD pipelines, and issue trackers.'
  },
  {
    q: 'How can enterprises partner or consult with the AMORA team?',
    a: 'You can connect directly with our founding engineering team via phone or email, or submit the consultation form below. We discuss your technical specifications, infrastructure requirements, and evaluate high-impact opportunities for custom AI integration.'
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  return (
    <section className="section alt" id="faq">
      <div className="container">
        <div className="section-head" style={{ textAlign: 'center', marginInline: 'auto' }}>
          <div className="eyebrow" style={{ justifyContent: 'center' }}>Knowledge Base</div>
          <h2>
            Frequently Asked <em>Questions.</em>
          </h2>
          <p className="lead" style={{ marginInline: 'auto' }}>
            Learn more about our technology stack, private deployment architecture, and how AMORA partners with organizations to build intelligent systems.
          </p>
        </div>

        <div className="faq-grid">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div className={`faq-item ${isOpen ? 'open' : ''}`} key={idx}>
                <button 
                  className="faq-question" 
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <ChevronDown className="faq-arrow" size={20} />
                </button>
                {isOpen && (
                  <div className="faq-answer">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
