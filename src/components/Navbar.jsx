import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      setScrollProgress(progress);
      setScrolled(scrollTop > 20);

      const sections = ['home', 'pillars', 'about', 'mission', 'dguy', 'faq', 'contact'];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140 && rect.bottom >= 140) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <div 
        className="scroll-progress" 
        style={{ width: `${scrollProgress}%` }} 
        aria-hidden="true" 
      />
      <header className={`topbar ${scrolled ? 'scrolled' : ''}`}>
        <nav className="container" aria-label="Main navigation">
          <a className="brand" href="#home" aria-label="AMORA home" onClick={closeMenu}>
            <div className="brand-logo-frame">
              <img src="/assets/amora-logo.jpg" alt="AMORA gold dragon emblem" />
            </div>
            <span className="brand-name">AMORA</span>
          </a>

          <button
            className="menu-toggle"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-controls="navLinks"
            aria-label="Toggle navigation"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <div className={`navlinks ${isOpen ? 'open' : ''}`} id="navLinks">
            <a 
              href="#home" 
              className={activeSection === 'home' ? 'active' : ''} 
              onClick={closeMenu}
            >
              Home
            </a>
            <a 
              href="#pillars" 
              className={activeSection === 'pillars' ? 'active' : ''} 
              onClick={closeMenu}
            >
              Pillars
            </a>
            <a 
              href="#about" 
              className={activeSection === 'about' ? 'active' : ''} 
              onClick={closeMenu}
            >
              About Us
            </a>
            <a 
              href="#mission" 
              className={activeSection === 'mission' ? 'active' : ''} 
              onClick={closeMenu}
            >
              Our Mission
            </a>
            <a 
              href="#dguy" 
              className={activeSection === 'dguy' ? 'active' : ''} 
              onClick={closeMenu}
            >
              DGUY
            </a>
            <a 
              href="#faq" 
              className={activeSection === 'faq' ? 'active' : ''} 
              onClick={closeMenu}
            >
              FAQ
            </a>
            <a className="button" href="#contact" onClick={closeMenu}>
              <span>Contact Us</span>
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
        </nav>
      </header>
    </>
  );
}
