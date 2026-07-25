import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useSite } from '../../context';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export default function ContactSection() {
  const { config } = useSite();
  const cardRef = useScrollReveal();
  const c = config?.contact || {};
  const brand = config?.brand || {};

  const [form, setForm] = useState({ name: '', phone: '', email: '', city: '', service: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`https://formspree.io/f/${c.formspreeId || 'xyklqbkj'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        toast.success('✓ Message sent! We\'ll reply within 24 hours.');
        setForm({ name: '', phone: '', email: '', city: '', service: '', message: '' });
      } else {
        throw new Error();
      }
    } catch {
      toast.error('Failed to send. Please contact us directly via WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section contact-section">
      <div className="blob blob-gold-tl" style={{ opacity: 0.6 }} />
      <div className="blob blob-gold-br" style={{ opacity: 0.7 }} />
      <div className="blob blob-blue-left" style={{ opacity: 0.5 }} />
      <div className="squiggle squiggle-right">
        <svg viewBox="0 0 80 90" fill="none">
          <path d="M40 80 C20 65, 60 50, 40 35 C20 20, 60 5, 40 -5" stroke="#ff9500" strokeWidth="8" strokeLinecap="round" fill="none" />
        </svg>
      </div>

      <div className="glass-card contact-card" ref={cardRef}>
        <div className="section-label">{c.label || 'GET IN TOUCH'}</div>
        <h2 className="section-title centered">
          LET'S BUILD<br /><span className="accent-text">SOMETHING GREAT</span>
        </h2>
        <p className="section-sub">{c.subtitle || 'Ready to grow your brand? Drop us a message and we\'ll get back to you within 24 hours.'}</p>

        <div className="contact-grid">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Your Name</label>
                <input name="name" value={form.name} onChange={handleChange} type="text" placeholder="Ganesh" className="form-input" required />
              </div>
              <div className="form-group">
                <label>Your Contact</label>
                <input name="phone" value={form.phone} onChange={handleChange} type="tel" placeholder="+91 XXXXX XXXXX" className="form-input" />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="you@example.com" className="form-input" required />
              </div>
              <div className="form-group">
                <label>Your City</label>
                <input name="city" value={form.city} onChange={handleChange} type="text" placeholder="Kota, Andhra Pradesh" className="form-input" />
              </div>
            </div>
            <div className="form-group">
              <label>Service You Need</label>
              <select name="service" value={form.service} onChange={handleChange} className="form-input">
                <option value="">Select a service...</option>
                {(c.services || ['Instagram Reels','Website Design','Video Editing','Meta Ads','Poster Design','Content Creation','Full Package']).map(s => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Your Message</label>
              <textarea name="message" value={form.message} onChange={handleChange} placeholder="Tell us about your project..." className="form-input form-textarea" />
            </div>
            <button className="btn-primary btn-full" type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message →'}
            </button>
          </form>

          <div className="contact-info">
            <div className="contact-item">
              <div className="contact-icon">📧</div>
              <div>
                <div className="contact-label">Email Us</div>
                <div className="contact-val">{brand.email || 'nexvoradigitalsofficial@gmail.com'}</div>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">📱</div>
              <div>
                <div className="contact-label">WhatsApp</div>
                <div className="contact-val">{brand.phone1}{brand.phone2 ? `, ${brand.phone2}` : ''}</div>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">📍</div>
              <div>
                <div className="contact-label">Location</div>
                <div className="contact-val">{brand.location || 'Kota, Andhra Pradesh'}</div>
              </div>
            </div>
            <div className="contact-socials">
              {brand.instagram && (
                <a href={brand.instagram} target="_blank" rel="noreferrer" className="social-pill">Instagram</a>
              )}
              {brand.whatsapp && (
                <a href={brand.whatsapp} target="_blank" rel="noreferrer" className="social-pill">WhatsApp</a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
