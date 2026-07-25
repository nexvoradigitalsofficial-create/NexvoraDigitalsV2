import React, { useEffect } from 'react';
import { useSite } from '../../context';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import ServiceIcon from '../ServiceIcon';

// ─── About ────────────────────────────────────────────────────
export function AboutSection() {
  const { config } = useSite();
  const cardRef = useScrollReveal();
  const a = config?.about || {};

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const titleLines = (a.title || 'WE BUILD\nBRANDS THAT\nDOMINATE').split('\n');

  return (
    <section id="about" className="section about-section">
      <div className="blob blob-gold-tl" style={{ opacity: 0.7 }} />
      <div className="blob blob-gold-br" style={{ opacity: 0.6 }} />
      <div className="blob blob-blue-right" />
      <div className="squiggle squiggle-right">
        <svg viewBox="0 0 80 90" fill="none">
          <path d="M40 80 C20 65, 60 50, 40 35 C20 20, 60 5, 40 -5" stroke="#ff9500" strokeWidth="8" strokeLinecap="round" fill="none" />
        </svg>
      </div>

      <div className="glass-card about-card" ref={cardRef}>
        <div className="section-label">{a.label || 'WHO WE ARE'}</div>
        <div className="about-grid">
          <div className="about-left stagger">
            <h2 className="section-title">
              {titleLines.map((line, i) => (
                <React.Fragment key={i}>
                  {line === (a.accentWord || 'DOMINATE')
                    ? <span className="accent-text">{line}</span>
                    : line
                  }
                  <br />
                </React.Fragment>
              ))}
            </h2>
            <p className="about-body" style={{ marginTop: 20 }}>{a.body1}</p>
            <p className="about-body" style={{ marginTop: 12 }}>{a.body2}</p>
            <button className="btn-outline" style={{ marginTop: 24 }} onClick={() => scrollTo('services')}>
              {a.ctaLabel || 'See Our Work'}
            </button>
          </div>
          <div className="about-right">
            <div className="about-orb-wrap stagger">
              {(a.badges || []).map((badge, i) => (
                <div key={i} className="about-badge">{badge.icon} {badge.text}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Services ─────────────────────────────────────────────────
export function ServicesSection() {
  const { config } = useSite();
  const cardRef = useScrollReveal();
  const s = config?.services || {};
  const items = (s.items || []).filter(item => item.visible !== false);

  useEffect(() => {
    const cards = document.querySelectorAll('.service-card');
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => { entry.target.classList.add('in-view'); obs.unobserve(entry.target); }, i * 100);
        }
      });
    }, { threshold: 0.05 });
    cards.forEach(c => observer.observe(c));
    return () => observer.disconnect();
  }, [items.length]);

  return (
    <section id="services" className="section services-section">
      <div className="blob blob-gold-tr" style={{ opacity: 0.65 }} />
      <div className="blob blob-gold-bl" style={{ opacity: 0.65 }} />
      <div className="blob blob-blue-left" style={{ opacity: 0.5 }} />
      <div className="squiggle">
        <svg viewBox="0 0 80 90" fill="none">
          <path d="M40 80 C20 65, 60 50, 40 35 C20 20, 60 5, 40 -5" stroke="#ff9500" strokeWidth="8" strokeLinecap="round" fill="none" />
        </svg>
      </div>

      <div className="glass-card services-card" ref={cardRef}>
        <div className="section-label">{s.label || 'WHAT WE DO'}</div>
        <h2 className="section-title centered">
          OUR <span className="accent-text">SERVICES</span>
        </h2>
        <p className="section-sub">{s.subtitle || 'Everything your brand needs to grow in the digital world.'}</p>

        <div className="services-grid">
          {items.map(item => (
            <div key={item.id} className="service-card">
              <div className="service-icon-wrap">
                <ServiceIcon type={item.icon} />
              </div>
              <div className="service-info">
                <h3 className="service-heading">{item.title}</h3>
                <p className="service-sub">{item.description}</p>
              </div>
              <a href={`/portfolio/${item.id}`} className="explore-link">Explore Work →</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Team ─────────────────────────────────────────────────────
export function TeamSection() {
  const { config } = useSite();
  const cardRef = useScrollReveal();
  const t = config?.team || {};
  const members = t.members || [];

  return (
    <section id="team" className="section team-section">
      <div className="blob blob-gold-tl" style={{ opacity: 0.6 }} />
      <div className="blob blob-gold-br" style={{ opacity: 0.7 }} />
      <div className="blob blob-blue-left" style={{ opacity: 0.5 }} />
      <div className="squiggle squiggle-right">
        <svg viewBox="0 0 80 90" fill="none">
          <path d="M40 80 C20 65, 60 50, 40 35 C20 20, 60 5, 40 -5" stroke="#ff9500" strokeWidth="8" strokeLinecap="round" fill="none" />
        </svg>
      </div>

      <div className="glass-card team-card" ref={cardRef}>
        <h2 className="section-title centered">{t.title || 'Our Team'}</h2>
        {members.map(m => (
          <div key={m.id} className={`team-row ${m.reversed ? 'reverse' : ''}`}>
            <div className="team-avatar">
              {m.avatar
                ? <img src={m.avatar} alt={m.name} />
                : <div style={{ width: '100%', height: '100%', background: 'rgba(255,149,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>👤</div>
              }
            </div>
            <div className="team-info">
              <h3>{m.name}</h3>
              <p className="role">{m.role}</p>
              <p className="desc">{m.bio}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
