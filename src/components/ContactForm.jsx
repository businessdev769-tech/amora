import React, { useState } from 'react';
import { Send, CheckCircle2, Copy } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    // Create mailto link for direct submission
    const subject = encodeURIComponent(`Enterprise AI Consultation Request: ${formData.company || formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nCompany: ${formData.company}\n\nProject Requirements:\n${formData.message}`
    );
    window.location.href = `mailto:amora.aitech@gmail.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2500);
  };

  return (
    <section className="section" id="inquire" style={{ paddingTop: '20px' }}>
      <div className="container">
        <div className="contact-panel">
          <div>
            <div className="eyebrow">Direct Engagement</div>
            <h2>
              Start the <em>Conversation.</em>
            </h2>
            <p className="lead" style={{ marginBottom: '24px' }}>
              Whether you are looking to deploy autonomous AI agents, optimize developer workflows, or engineer proprietary models, our leadership team is ready to assist.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--line)'
                }}
              >
                <div>
                  <small style={{ color: 'var(--muted)', display: 'block', fontSize: '.75rem', textTransform: 'uppercase' }}>Direct Email</small>
                  <strong style={{ color: 'var(--gold-light)', fontSize: '.95rem' }}>amora.aitech@gmail.com</strong>
                </div>
                <button 
                  onClick={() => copyToClipboard('amora.aitech@gmail.com', 'email')}
                  style={{ color: 'var(--gold)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '.84rem' }}
                >
                  <Copy size={16} />
                  <span>{copied === 'email' ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--line)'
                }}
              >
                <div>
                  <small style={{ color: 'var(--muted)', display: 'block', fontSize: '.75rem', textTransform: 'uppercase' }}>Executive Phone</small>
                  <strong style={{ color: 'var(--gold-light)', fontSize: '.95rem' }}>+91 99446 13359</strong>
                </div>
                <button 
                  onClick={() => copyToClipboard('+919944613359', 'phone')}
                  style={{ color: 'var(--gold)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '.84rem' }}
                >
                  <Copy size={16} />
                  <span>{copied === 'phone' ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ background: 'var(--panel)', padding: '30px', borderRadius: '20px', border: '1px solid var(--line)' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '20px', color: '#fff' }}>Consultation Inquiry</h3>
            
            <div className="form-group">
              <label htmlFor="name">Your Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                placeholder="e.g. John Doe"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Work Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                placeholder="name@company.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="company">Company / Organization</label>
              <input
                type="text"
                id="company"
                name="company"
                className="form-control"
                placeholder="Company Name"
                value={formData.company}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Project Scope / Requirements *</label>
              <textarea
                id="message"
                name="message"
                className="form-control"
                placeholder="Describe your AI objectives, timeline, or infrastructure requirements..."
                required
                value={formData.message}
                onChange={handleChange}
              ></textarea>
            </div>

            <button type="submit" className="button" style={{ width: '100%', marginTop: '8px' }}>
              <span>Send Inquiry to AMORA</span>
              <Send size={16} aria-hidden="true" />
            </button>

            {submitted && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gold-light)', marginTop: '16px', fontSize: '.9rem' }}>
                <CheckCircle2 size={18} color="var(--gold)" />
                <span>Redirecting to email client to send your inquiry.</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
