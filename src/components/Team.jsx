import React, { useRef } from 'react';
import { Phone, Mail } from 'lucide-react';

const teamMembers = [
  {
    name: 'Kathiravan.v',
    photo: '/assets/kathiravan-v.jpg',
    phone: '+91 99446 13359',
    telLink: 'tel:+919944613359',
    email: 'uththamankathiravan@gmail.com',
    emailLink: 'mailto:uththamankathiravan@gmail.com'
  },
  {
    name: 'Nithiarasu.N',
    photo: '/assets/nithiarasu-n.jpg',
    phone: '+91 7904645593',
    telLink: 'tel:+917904645593',
    email: 'nithiarasu481@gmail.com',
    emailLink: 'mailto:nithiarasu481@gmail.com'
  },
  {
    name: 'Vignesh.c',
    photo: '/assets/vignesh-c.jpg',
    phone: '+91 96268 70072',
    telLink: 'tel:+919626870072',
    email: 'Vigneshchandran492@gmail.com',
    emailLink: 'mailto:Vigneshchandran492@gmail.com'
  }
];

function PersonCard({ member }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (card) {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    }
  };

  return (
    <article 
      className="person-card"
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="person-photo">
        <img src={member.photo} alt={`${member.name} profile photo`} loading="lazy" />
      </div>
      <div className="person-info">
        <h3>{member.name}</h3>
        <a href={member.telLink} aria-label={`Call ${member.name}`}>
          <Phone size={16} color="var(--gold)" aria-hidden="true" />
          <div>
            <small>Phone</small>
            <strong>{member.phone}</strong>
          </div>
        </a>
        <a href={member.emailLink} aria-label={`Email ${member.name}`}>
          <Mail size={16} color="var(--gold)" aria-hidden="true" />
          <div>
            <small>Email</small>
            <strong>{member.email}</strong>
          </div>
        </a>
      </div>
    </article>
  );
}

export default function Team() {
  return (
    <section className="section" id="contact">
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">Contact us</div>
          <h2>
            Meet the people behind <em>AMORA.</em>
          </h2>
          <p className="lead">
            Reach out to our team using the contact details below.
          </p>
        </div>

        <div className="people-grid">
          {teamMembers.map((member, idx) => (
            <PersonCard member={member} key={idx} />
          ))}
        </div>

        <div className="official-contact">
          <div>
            <div className="eyebrow">Official AMORA contact</div>
            <h3>Connect with AMORA</h3>
          </div>
          <div className="official-links">
            <a href="mailto:amora.aitech@gmail.com" aria-label="Official email">
              <span className="icon">
                <Mail size={18} />
              </span>
              <span>amora.aitech@gmail.com</span>
            </a>
            <a href="tel:+919944613359" aria-label="Official phone">
              <span className="icon">
                <Phone size={18} />
              </span>
              <span>+91 99446 13359</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
