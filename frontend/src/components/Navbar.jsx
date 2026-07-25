import React, { useState, useEffect } from 'react';
import { useSite } from '../context';

export default function Navbar() {
  const { config } = useSite();
  const [scrolled, setScrolled]     = useState(false);
  const [activeSection, setActive]  = useState('home');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
      const sections = document.querySelectorAll('.section[id]');
      let current = 'home';
      sections.forEach(s => {
        const rect = s.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) current = s.id;
      });
      setActive(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile nav on route change / resize
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setMobileOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const scrollTo = (href) => {
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  const handleLink = (e, href) => {
    if (href.startsWith('/')) { setMobileOpen(false); return; } // page link
    e.preventDefault();
    scrollTo(href);
  };

  const brand = config?.brand || {};
  const nav   = config?.nav   || {};
  const links = nav.links || [
    { label: 'HOME',     href: '#home' },
    { label: 'ABOUT',    href: '#about' },
    { label: 'SERVICES', href: '#services' },
    { label: 'OUR WORK', href: '/portfolio' },
    { label: 'TEAM',     href: '#team' },
    { label: 'ORDER',    href: '#order' },
    { label: 'CONTACT',  href: '#contact' },
  ];

  return (
    <>
      <header
        className="site-nav"
        style={{ boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.5)' : 'none' }}
      >
        <div className="nav-inner">
          {/* Logo */}
          <a href="/" className="nav-logo" style={{ textDecoration: 'none' }}>
            {brand.logo
              ? <img src={brand.logo} alt={brand.name || 'Logo'} />
              : <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.5rem', letterSpacing: 3, color: 'var(--text)' }}>
                  {(brand.name || 'NexvoraDigitals').replace('Digitals', '')}
                  <span style={{ color: 'var(--accent)' }}>Digitals</span>
                </span>
            }
          </a>

          {/* Desktop Links */}
          <ul className="nav-links" role="navigation">
            {links.map((link, i) => (
              <React.Fragment key={link.href}>
                {i > 0 && <li className="nav-sep" aria-hidden="true" >·</li>}
                <li>
                  <a
                    href={link.href}
                    className={activeSection === link.href.replace('#', '') ? 'active' : ''}
                    onClick={e => handleLink(e, link.href)}
                  >
                    {link.label}
                  </a>
                </li>
              </React.Fragment>
            ))}
          </ul>

          {/* CTA */}
          <button
            className="nav-cta"
            onClick={() => scrollTo('#contact')}
            aria-label="Contact us"
          >
            {nav.ctaLabel || "Let's Talk"}
          </button>

          {/* Hamburger */}
          <button
            className={`hamburger ${mobileOpen ? 'open' : ''}`}
            onClick={() => setMobileOpen(o => !o)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <span /><span /><span />
          </button>
        </div>
      </header>

      {/* Mobile Nav */}
      <nav
        className={`mobile-nav ${mobileOpen ? 'open' : ''}`}
        aria-hidden={!mobileOpen}
      >
        {links.map(link => (
          <a
            key={link.href}
            href={link.href}
            onClick={e => handleLink(e, link.href)}
          >
            {link.label}
          </a>
        ))}
        <button
          className="nav-cta"
          style={{ marginTop: 24, fontSize: '1rem', padding: '14px 36px' }}
          onClick={() => { scrollTo('#contact'); setMobileOpen(false); }}
        >
          {nav.ctaLabel || "Let's Talk"}
        </button>
      </nav>
    </>
  );
}
