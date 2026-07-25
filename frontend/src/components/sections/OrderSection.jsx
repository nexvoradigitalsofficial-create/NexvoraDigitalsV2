import React, { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useSite } from '../../context';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const API = `${process.env.REACT_APP_API_URL}/api`;

// ─── UPI Payment Modal ────────────────────────────────────────
function UpiModal({ config, orderId, amount, onClose, onSuccess }) {
  const [utr, setUtr] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const payment = config?.payment || {};
  const upiId   = payment.upiId   || 'nexvora@upi';
  const upiName = payment.upiName || 'NexvoraDigitals';
  const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${amount}&cu=INR`;

  const handleSubmit = async () => {
    if (!utr.trim()) { toast.error('Please enter your UPI Transaction ID / UTR number'); return; }
    setSubmitting(true);
    try {
      await axios.post(`${API}/payments/upi-submit`, { orderId, upiTransactionId: utr });
      toast.success('✅ UTR submitted! We will verify and confirm your order within 2 hours.');
      onSuccess();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Submission failed. Try again.');
    } finally { setSubmitting(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2 className="modal-title">Pay via UPI</h2>
        <p className="modal-sub">Amount: <strong style={{ color: 'var(--accent)', fontSize: '1.3rem' }}>₹{amount?.toLocaleString('en-IN')}</strong></p>

        <div className="upi-steps">
          {/* Step 1: QR */}
          <div className="upi-step">
            <div className="upi-step-num">1</div>
            <div>
              <div className="upi-step-label">Scan QR or use UPI ID</div>
              {payment.upiQrImage ? (
                <img src={payment.upiQrImage} alt="UPI QR" className="upi-qr-img" />
              ) : (
                <div className="upi-qr-placeholder">
                  <div style={{ fontSize: '3rem' }}>📱</div>
                  <div>QR not configured yet</div>
                </div>
              )}
              <div className="upi-id-box">
                <span className="upi-id-label">UPI ID:</span>
                <span className="upi-id-val">{upiId}</span>
                <button className="upi-copy-btn" onClick={() => { navigator.clipboard.writeText(upiId); toast.success('Copied!'); }}>Copy</button>
              </div>
              <a href={upiLink} className="btn-primary upi-app-btn" style={{ display: 'block', textAlign: 'center', marginTop: 10, textDecoration: 'none' }}>
                Open UPI App →
              </a>
            </div>
          </div>

          {/* Step 2: UTR */}
          <div className="upi-step" style={{ marginTop: 20 }}>
            <div className="upi-step-num">2</div>
            <div style={{ flex: 1 }}>
              <div className="upi-step-label">Enter Transaction ID / UTR</div>
              <input
                className="form-input"
                style={{ marginTop: 8 }}
                value={utr}
                onChange={e => setUtr(e.target.value)}
                placeholder="e.g. 426812345678"
              />
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 6 }}>
                Find this in your UPI app under transaction details
              </p>
            </div>
          </div>
        </div>

        <button
          className="btn-primary btn-full"
          style={{ marginTop: 20 }}
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit UTR & Confirm Order'}
        </button>
      </div>
    </div>
  );
}

// ─── OrderSection ─────────────────────────────────────────────
export default function OrderSection() {
  const { config } = useSite();
  const cardRef    = useScrollReveal();
  const o          = config?.order   || {};
  const payment    = config?.payment || {};
  const packages   = (o.packages || []).filter(p => p.visible !== false);

  const [selected, setSelected] = useState(null);
  const [form, setForm]         = useState({ name: '', email: '', phone: '', city: '', message: '' });
  const [loading, setLoading]   = useState(false);
  const [upiModal, setUpiModal] = useState(null); // { orderId, amount }
  const [payMode, setPayMode]   = useState('razorpay'); // 'razorpay' | 'upi'

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const canRazorpay = payment.enabled;
  const canUpi      = payment.upiEnabled;
  const hasAnyPay   = canRazorpay || canUpi;

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!selected) { toast.error('Please select a package first'); return; }
    if (!form.name || !form.email || !form.phone) { toast.error('Please fill required fields'); return; }
    setLoading(true);

    try {
      // 1. Create order in DB
      const { data } = await axios.post(`${API}/orders`, {
        ...form,
        serviceType: selected.name,
        packageId:   selected.id,
        packageName: selected.name,
        amount:      selected.price,
        currency:    selected.currency || 'INR'
      });

      const orderId = data.orderId;

      // 2a. Razorpay flow
      if (hasAnyPay && payMode === 'razorpay' && canRazorpay && selected.price > 0) {
        const { data: rzp } = await axios.post(`${API}/payments/create-order`, {
          amount: selected.price, currency: 'INR', orderId
        });
        const rzpOptions = {
          key:         rzp.keyId,
          amount:      rzp.amount,
          currency:    rzp.currency,
          name:        config?.brand?.name || 'NexvoraDigitals',
          description: selected.name,
          order_id:    rzp.orderId,
          handler: async (response) => {
            try {
              await axios.post(`${API}/payments/verify`, { ...response, orderId });
              toast.success('🎉 Payment successful! We\'ll contact you soon.');
              resetForm();
            } catch { toast.error('Payment verification failed. Contact support.'); }
          },
          prefill: { name: form.name, email: form.email, contact: form.phone },
          theme: { color: '#ff9500' }
        };
        if (window.Razorpay) {
          new window.Razorpay(rzpOptions).open();
        } else {
          toast.error('Payment gateway not loaded. Please refresh.');
        }
        return;
      }

      // 2b. UPI flow
      if (hasAnyPay && payMode === 'upi' && canUpi && selected.price > 0) {
        setUpiModal({ orderId, amount: selected.price });
        return;
      }

      // 2c. No payment – plain order
      toast.success('🎉 Order placed! We\'ll reach out within 24 hours.');
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally { setLoading(false); }
  };

  const resetForm = () => {
    setForm({ name: '', email: '', phone: '', city: '', message: '' });
    setSelected(null);
    setUpiModal(null);
  };

  return (
    <>
      <section id="order" className="section order-section">
        <div className="blob blob-gold-tl" style={{ opacity: 0.5 }} />
        <div className="blob blob-blue-right" style={{ opacity: 0.4 }} />

        <div className="glass-card order-card" ref={cardRef}>
          <div className="section-label">PLACE AN ORDER</div>
          <h2 className="section-title centered">
            ORDER A <span className="accent-text">SERVICE</span>
          </h2>
          <p className="section-sub">{o.subtitle || 'Select a package and get started. We\'ll reach out within 24 hours.'}</p>

          {/* Package Cards */}
          <div className="packages-grid">
            {packages.map(pkg => (
              <div
                key={pkg.id}
                className={`package-card ${pkg.popular ? 'popular' : ''}`}
                style={selected?.id === pkg.id ? { borderColor: 'var(--accent)', boxShadow: '0 0 28px rgba(255,149,0,0.25)' } : {}}
              >
                {pkg.popular && <span className="popular-badge">MOST POPULAR</span>}
                <div className="package-name">{pkg.name}</div>
                <div className="package-price">
                  ₹{pkg.price?.toLocaleString('en-IN')}
                  <span>/mo</span>
                </div>
                <p className="package-desc">{pkg.description}</p>
                <ul className="package-features">
                  {(pkg.features || []).map((f, i) => <li key={i}>{f}</li>)}
                </ul>
                <button
                  className={selected?.id === pkg.id ? 'btn-primary package-cta' : 'btn-outline package-cta'}
                  onClick={() => setSelected(pkg)}
                >
                  {selected?.id === pkg.id ? '✓ Selected' : 'Select Package'}
                </button>
              </div>
            ))}
          </div>

          {/* Order Form */}
          {selected && (
            <div className="order-form-section">
              <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.6rem', letterSpacing: 2, textAlign: 'center', marginBottom: 24 }}>
                Complete Your Order — <span style={{ color: 'var(--accent)' }}>{selected.name}</span>
              </h3>

              <form onSubmit={handleOrder} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label>Your Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} className="form-input" placeholder="John Doe" required />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} className="form-input" placeholder="you@example.com" required />
                </div>
                <div className="form-group">
                  <label>Phone *</label>
                  <input name="phone" value={form.phone} onChange={handleChange} className="form-input" placeholder="+91 XXXXX XXXXX" required />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input name="city" value={form.city} onChange={handleChange} className="form-input" placeholder="Your city" />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Additional Notes</label>
                  <textarea name="message" value={form.message} onChange={handleChange} className="form-input form-textarea" placeholder="Tell us more about your needs..." />
                </div>

                {/* Payment method selector */}
                {hasAnyPay && selected.price > 0 && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.5px', display: 'block', marginBottom: 10 }}>
                      PAYMENT METHOD
                    </label>
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                      {canRazorpay && (
                        <button type="button"
                          className={payMode === 'razorpay' ? 'btn-primary' : 'btn-outline'}
                          style={{ padding: '10px 20px', fontSize: '0.85rem' }}
                          onClick={() => setPayMode('razorpay')}
                        >
                          💳 Card / Net Banking / Wallet
                        </button>
                      )}
                      {canUpi && (
                        <button type="button"
                          className={payMode === 'upi' ? 'btn-primary' : 'btn-outline'}
                          style={{ padding: '10px 20px', fontSize: '0.85rem' }}
                          onClick={() => setPayMode('upi')}
                        >
                          📱 UPI / QR Code
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginTop: 8 }}>
                  <button type="submit" className="btn-primary" disabled={loading} style={{ minWidth: 220 }}>
                    {loading ? 'Processing...'
                      : hasAnyPay && selected.price > 0
                        ? `Pay ₹${selected.price?.toLocaleString('en-IN')} →`
                        : 'Place Order →'}
                  </button>
                  <button type="button" className="btn-outline" onClick={() => setSelected(null)}>
                    Change Package
                  </button>
                  {hasAnyPay && (
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      🔒 {payment.displayNote || 'Secure payment'}
                    </span>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* UPI Modal */}
      {upiModal && (
        <UpiModal
          config={config}
          orderId={upiModal.orderId}
          amount={upiModal.amount}
          onClose={() => setUpiModal(null)}
          onSuccess={resetForm}
        />
      )}
    </>
  );
}
