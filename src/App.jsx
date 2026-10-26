import React from 'react';
import NeuralCanvas from './components/NeuralCanvas';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Pillars from './components/Pillars';
import About from './components/About';
import Mission from './components/Mission';
import Dguy from './components/Dguy';
import Metrics from './components/Metrics';
import Team from './components/Team';
import FAQ from './components/FAQ';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';

export default function App() {
  return (
    <>
      <NeuralCanvas />
      <Navbar />
      <main>
        <Hero />
        <Pillars />
        <About />
        <Mission />
        <Dguy />
        <Metrics />
        <Team />
        <FAQ />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
