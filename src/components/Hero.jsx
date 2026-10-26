import React from 'react';
import { ArrowRight } from 'lucide-react';
import DragonFlameLogo from './DragonFlameLogo';

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="container hero-grid">
        <div>
          <div className="eyebrow">Next-generation artificial intelligence</div>
          <h1>
            Intelligence built for <em>what’s next.</em>
          </h1>
          <p className="hero-copy">
            AMORA builds tailored AI solutions for enterprises, growing businesses, and modern software ecosystems—from custom AI engineering to autonomous developer tools.
          </p>
          <div className="actions">
            <a className="button" href="#about">
              <span>Discover AMORA</span>
              <ArrowRight size={16} aria-hidden="true" />
            </a>
            <a className="button secondary" href="#contact">
              Talk to our team
            </a>
          </div>
        </div>

        <div className="hero-logo-wrap" aria-label="AMORA brand emblem">
          <DragonFlameLogo />
        </div>
      </div>
    </section>
  );
}
