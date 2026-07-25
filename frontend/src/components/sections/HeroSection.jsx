import React from 'react';
import { useSite } from '../../context';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export default function HeroSection() {
  const { config } = useSite();
  const cardRef = useScrollReveal();
  const h = config?.hero || {};
  const brand = config?.brand || {};

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const titleLines = (h.title || 'CREATIVE\nDESIGN\nTHAT SELLS').split('\n');

  return (
    <section id="home" className="section home-section">
      <div className="blob blob-gold-tr" />
      <div className="blob blob-gold-br" />
      <div className="blob blob-gold-bl" />
      <div className="blob blob-blue-left" />
      <div className="squiggle">
        <svg viewBox="0 0 80 90" fill="none">
          <path d="M40 80 C20 65, 60 50, 40 35 C20 20, 60 5, 40 -5" stroke="#ff9500" strokeWidth="8" strokeLinecap="round" fill="none" />
        </svg>
      </div>

      <div className="glass-card home-card" ref={cardRef}>
        <div className="hero-layout">
          <div className="hero-content stagger">
            <div className="home-tagline">{h.tagline || 'DIGITAL MARKETING AGENCY'}</div>
            <h1 className="hero-title">
              {titleLines.map((line, i) => (
                <React.Fragment key={i}>
                  {line.includes(h.accentWord || 'THAT SELLS')
                    ? <><span className="accent-text">{line}</span><br /></>
                    : <>{line}<br /></>
                  }
                </React.Fragment>
              ))}
            </h1>
            <p className="hero-body">{h.body}</p>
            <div className="hero-btns">
              <button className="btn-primary" onClick={() => scrollTo('services')}>
                {h.primaryBtn || 'Our Services'}
              </button>
              <button className="btn-outline" onClick={() => scrollTo('contact')}>
                {h.secondaryBtn || 'Contact'}
              </button>
            </div>
          </div>

          <div className="image-wrapper">
            {h.heroImage
              ? <img src={h.heroImage} alt="Agency hero visual" className="hero-image" />
              : (
                <div style={{
                  width: 380, height: 380, borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255,149,0,0.15) 0%, transparent 90%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '8rem',borderRadius:'10px'
                }}>🚀</div>
              )
            }
          </div>
        </div>
      </div>

      <div className="orb orb-home" />
    </section>
  );
}
