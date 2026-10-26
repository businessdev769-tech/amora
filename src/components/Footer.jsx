import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <div className="container footer-inner">
        <a className="footer-brand" href="#home" aria-label="AMORA home">
          <img src="/assets/amora-logo.jpg" alt="AMORA emblem" />
          <span>AMORA</span>
        </a>
        <span>© {currentYear} AMORA. All rights reserved.</span>
        <div className="footer-links">
          <a href="#home">Home</a>
          <a href="#about">About Us</a>
          <a href="#contact">Contact Us</a>
        </div>
      </div>
    </footer>
  );
}
