import React from 'react';
import { useSite } from '../context';

export default function Footer() {
  const { config } = useSite();
  const brand = config?.brand || {};
  const footer = config?.footer || {};

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="site-footer">
      <div className="footer-glow" />
      <div className="footer-inner">
        <div>
          <div className="footer-logo-name">
            {brand.name || 'NexvoraDigitals'}
          </div>
          <p className="footer-tag">{footer.tagline || 'Creative digital solutions for modern brands.'}</p>
        </div>

        <nav className="footer-links" aria-label="Footer navigation">
          {['home','about','services','team','order','contact'].map(id => (
            <a key={id} href={`#${id}`} onClick={e => { e.preventDefault(); scrollTo(id); }}>
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </a>
          ))}
        </nav>

        <div className="footer-socials">
          {brand.instagram && (
            <a href={brand.instagram} target="_blank" rel="noreferrer" className="social-icon ig" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="17" cy="7" r="1.2" fill="currentColor" />
              </svg>
            </a>
          )}
          {brand.whatsapp && (
            <a href={brand.whatsapp} target="_blank" rel="noreferrer" className="social-icon wa" aria-label="WhatsApp">
              <svg viewBox="0 0 32 32" fill="none" width="18" height="18">
                <path fill="currentColor" d="M19.11 17.23c-.29-.15-1.7-.84-1.96-.94-.26-.1-.45-.15-.64.15-.19.29-.74.94-.91 1.13-.17.19-.34.22-.63.07-.29-.15-1.23-.45-2.34-1.43-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.43-.51.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.64-1.54-.88-2.1-.23-.56-.46-.48-.64-.49h-.55c-.19 0-.51.07-.78.36-.27.29-1.02 1-1.02 2.44 0 1.44 1.05 2.84 1.2 3.04.15.19 2.07 3.16 5.01 4.43.7.3 1.25.48 1.67.62.7.22 1.34.19 1.85.12.56-.08 1.7-.69 1.94-1.35.24-.66.24-1.22.17-1.34-.07-.12-.26-.19-.55-.34z" />
                <path fill="currentColor" d="M16 2.67C8.64 2.67 2.67 8.64 2.67 16c0 2.8.82 5.41 2.24 7.6L3 29.33l5.9-1.55A13.28 13.28 0 0016 29.33c7.36 0 13.33-5.97 13.33-13.33S23.36 2.67 16 2.67zm0 24c-2.37 0-4.59-.7-6.47-1.9l-.46-.28-3.5.92.94-3.41-.3-.48A10.66 10.66 0 015.33 16c0-5.88 4.79-10.67 10.67-10.67 5.88 0 10.67 4.79 10.67 10.67 0 5.88-4.79 10.67-10.67 10.67z" />
              </svg>
            </a>
          )}
          <a href="#" className="social-icon yt" aria-label="YouTube">
            <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
              <rect x="3" y="6" width="18" height="12" rx="4" stroke="currentColor" strokeWidth="1.8" />
              <polygon points="10,9 16,12 10,15" fill="currentColor" />
            </svg>
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        {footer.copyright || `© ${new Date().getFullYear()} NexvoraDigitals. All rights reserved.`}
      </div>
    </footer>
  );
}
