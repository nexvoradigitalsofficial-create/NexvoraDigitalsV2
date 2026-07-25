import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth, useSite } from '../context';

const API = `${process.env.REACT_APP_API_URL}/api`;

const NAV = [
  { id: 'dashboard',  label: '📊 Dashboard' },
  { id: 'hero',       label: '🏠 Hero Section' },
  { id: 'about',      label: '🙋 About' },
  { id: 'services',   label: '⚡ Services' },
  { id: 'team',       label: '👥 Team' },
  { id: 'order',      label: '📦 Packages' },
  { id: 'contact',    label: '📞 Contact' },
  { id: 'brand',      label: '🎨 Brand & SEO' },
  { id: 'payment',    label: '💳 Payments' },
  { id: 'portfolio',  label: '🎬 Portfolio' },
  { id: 'orders',     label: '🛒 Orders' },
  { id: 'new-order',  label: '➕ New Offline Order' },
];

// ─── Shared helpers ───────────────────────────────────────────
function TF({ label, value, onChange, textarea, type = 'text', hint, placeholder }) {
  return (
    <div className="form-group" style={{ marginBottom: 12 }}>
      <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>{label}</label>
      {textarea
        ? <textarea className="form-input form-textarea" style={{ minHeight: 80 }} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
        : <input className="form-input" type={type} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} />}
      {hint && <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>{hint}</span>}
    </div>
  );
}

function Toggle({ label, value, onChange }) {
  return (
    <div className="toggle-switch" onClick={() => onChange(!value)} style={{ marginBottom: 12, cursor: 'pointer' }}>
      <div className={`toggle-track ${value ? 'on' : ''}`}><div className="toggle-thumb" /></div>
      <span className="toggle-label">{label}</span>
    </div>
  );
}

function SaveBtn({ onClick, loading }) {
  return (
    <button className="btn-primary" onClick={onClick} disabled={loading} style={{ marginTop: 16 }}>
      {loading ? 'Saving...' : '💾 Save Changes'}
    </button>
  );
}

// ─── Section Editors (same as before) ────────────────────────
function HeroEditor({ data, onChange }) {
  const d = data || {};
  return (
    <div>
      <Toggle label="Show Hero Section" value={d.visible !== false} onChange={v => onChange({ ...d, visible: v })} />
      <TF label="Tagline" value={d.tagline} onChange={v => onChange({ ...d, tagline: v })} />
      <TF label="Title (\\n for line break)" value={d.title} onChange={v => onChange({ ...d, title: v })} textarea />
      <TF label="Accent Word" value={d.accentWord} onChange={v => onChange({ ...d, accentWord: v })} />
      <TF label="Body Text" value={d.body} onChange={v => onChange({ ...d, body: v })} textarea />
      <TF label="Primary Button" value={d.primaryBtn} onChange={v => onChange({ ...d, primaryBtn: v })} />
      <TF label="Secondary Button" value={d.secondaryBtn} onChange={v => onChange({ ...d, secondaryBtn: v })} />
      <TF label="Hero Image URL" value={d.heroImage} onChange={v => onChange({ ...d, heroImage: v })} hint="/assets/Home.png or https://..." />
    </div>
  );
}

function AboutEditor({ data, onChange }) {
  const d = data || {};
  return (
    <div>
      <Toggle label="Show About Section" value={d.visible !== false} onChange={v => onChange({ ...d, visible: v })} />
      <TF label="Section Label" value={d.label} onChange={v => onChange({ ...d, label: v })} />
      <TF label="Title" value={d.title} onChange={v => onChange({ ...d, title: v })} textarea />
      <TF label="Accent Word" value={d.accentWord} onChange={v => onChange({ ...d, accentWord: v })} />
      <TF label="Body Paragraph 1" value={d.body1} onChange={v => onChange({ ...d, body1: v })} textarea />
      <TF label="Body Paragraph 2" value={d.body2} onChange={v => onChange({ ...d, body2: v })} textarea />
      <TF label="CTA Button" value={d.ctaLabel} onChange={v => onChange({ ...d, ctaLabel: v })} />
      <div style={{ marginTop: 16 }}>
        <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>Badges</label>
        {(d.badges || []).map((b, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input className="form-input" value={b.icon} style={{ width: 60 }} onChange={e => { const arr = [...d.badges]; arr[i] = { ...b, icon: e.target.value }; onChange({ ...d, badges: arr }); }} />
            <input className="form-input" value={b.text} onChange={e => { const arr = [...d.badges]; arr[i] = { ...b, text: e.target.value }; onChange({ ...d, badges: arr }); }} />
            <button className="btn-outline" style={{ padding: '8px 12px', fontSize: '0.75rem' }} onClick={() => onChange({ ...d, badges: d.badges.filter((_, j) => j !== i) })}>✕</button>
          </div>
        ))}
        <button className="btn-outline" style={{ fontSize: '0.82rem', padding: '8px 16px' }} onClick={() => onChange({ ...d, badges: [...(d.badges || []), { icon: '⭐', text: 'New Badge' }] })}>+ Add Badge</button>
      </div>
    </div>
  );
}

function ServicesEditor({ data, onChange }) {
  const d = data || {}; const items = d.items || [];
  const ICONS = ['instagram','browser','video','meta','poster','content'];
  return (
    <div>
      <Toggle label="Show Services Section" value={d.visible !== false} onChange={v => onChange({ ...d, visible: v })} />
      <TF label="Section Label" value={d.label} onChange={v => onChange({ ...d, label: v })} />
      <TF label="Subtitle" value={d.subtitle} onChange={v => onChange({ ...d, subtitle: v })} />
      {items.map((item, i) => (
        <div key={item.id} className="admin-card" style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <strong style={{ fontSize: '0.9rem' }}>{item.title}</strong>
            <Toggle label="Visible" value={item.visible !== false} onChange={v => { const a = [...items]; a[i] = { ...item, visible: v }; onChange({ ...d, items: a }); }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div className="form-group"><label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Title</label><input className="form-input" value={item.title} onChange={e => { const a = [...items]; a[i] = { ...item, title: e.target.value }; onChange({ ...d, items: a }); }} /></div>
            <div className="form-group"><label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Icon</label>
              <select className="form-input" value={item.icon} onChange={e => { const a = [...items]; a[i] = { ...item, icon: e.target.value }; onChange({ ...d, items: a }); }}>{ICONS.map(ic => <option key={ic}>{ic}</option>)}</select>
            </div>
          </div>
          <div className="form-group"><label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Description</label><textarea className="form-input" style={{ minHeight: 60 }} value={item.description} onChange={e => { const a = [...items]; a[i] = { ...item, description: e.target.value }; onChange({ ...d, items: a }); }} /></div>
        </div>
      ))}
      <button className="btn-outline" style={{ fontSize: '0.82rem', padding: '8px 16px' }} onClick={() => onChange({ ...d, items: [...items, { id: `svc_${Date.now()}`, icon: 'content', title: 'New Service', description: '', visible: true }] })}>+ Add Service</button>
    </div>
  );
}

function TeamEditor({ data, onChange }) {
  const d = data || {}; const members = d.members || [];
  return (
    <div>
      <Toggle label="Show Team Section" value={d.visible !== false} onChange={v => onChange({ ...d, visible: v })} />
      <TF label="Section Title" value={d.title} onChange={v => onChange({ ...d, title: v })} />
      {members.map((m, i) => (
        <div key={m.id} className="admin-card" style={{ marginBottom: 12 }}>
          <strong style={{ display: 'block', marginBottom: 10 }}>{m.name}</strong>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div className="form-group"><label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Name</label><input className="form-input" value={m.name} onChange={e => { const a = [...members]; a[i] = { ...m, name: e.target.value }; onChange({ ...d, members: a }); }} /></div>
            <div className="form-group"><label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Role</label><input className="form-input" value={m.role} onChange={e => { const a = [...members]; a[i] = { ...m, role: e.target.value }; onChange({ ...d, members: a }); }} /></div>
          </div>
          <div className="form-group"><label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Bio</label><textarea className="form-input" style={{ minHeight: 70 }} value={m.bio} onChange={e => { const a = [...members]; a[i] = { ...m, bio: e.target.value }; onChange({ ...d, members: a }); }} /></div>
          <div className="form-group"><label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Avatar URL</label><input className="form-input" value={m.avatar || ''} onChange={e => { const a = [...members]; a[i] = { ...m, avatar: e.target.value }; onChange({ ...d, members: a }); }} /></div>
          <Toggle label="Reverse layout" value={m.reversed} onChange={v => { const a = [...members]; a[i] = { ...m, reversed: v }; onChange({ ...d, members: a }); }} />
          <button className="btn-outline" style={{ fontSize: '0.75rem', padding: '6px 12px', marginTop: 8 }} onClick={() => onChange({ ...d, members: members.filter((_, j) => j !== i) })}>Remove</button>
        </div>
      ))}
      <button className="btn-outline" style={{ fontSize: '0.82rem', padding: '8px 16px' }} onClick={() => onChange({ ...d, members: [...members, { id: `m_${Date.now()}`, name: 'New Member', role: 'Role', bio: 'Bio', avatar: '', reversed: false }] })}>+ Add Member</button>
    </div>
  );
}

function OrderEditor({ data, onChange }) {
  const d = data || {}; const packages = d.packages || [];
  return (
    <div>
      <Toggle label="Show Order Section" value={d.visible !== false} onChange={v => onChange({ ...d, visible: v })} />
      <TF label="Subtitle" value={d.subtitle} onChange={v => onChange({ ...d, subtitle: v })} textarea />
      {packages.map((pkg, i) => (
        <div key={pkg.id} className="admin-card" style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <strong>{pkg.name}</strong>
            <div style={{ display: 'flex', gap: 12 }}>
              <Toggle label="Popular" value={pkg.popular} onChange={v => { const a = [...packages]; a[i] = { ...pkg, popular: v }; onChange({ ...d, packages: a }); }} />
              <Toggle label="Visible" value={pkg.visible !== false} onChange={v => { const a = [...packages]; a[i] = { ...pkg, visible: v }; onChange({ ...d, packages: a }); }} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 8 }}>
            <div className="form-group"><label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Name</label><input className="form-input" value={pkg.name} onChange={e => { const a = [...packages]; a[i] = { ...pkg, name: e.target.value }; onChange({ ...d, packages: a }); }} /></div>
            <div className="form-group"><label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Price (₹)</label><input className="form-input" type="number" value={pkg.price} onChange={e => { const a = [...packages]; a[i] = { ...pkg, price: Number(e.target.value) }; onChange({ ...d, packages: a }); }} /></div>
          </div>
          <div className="form-group"><label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Description</label><input className="form-input" value={pkg.description} onChange={e => { const a = [...packages]; a[i] = { ...pkg, description: e.target.value }; onChange({ ...d, packages: a }); }} /></div>
          <div className="form-group"><label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Features (one per line)</label><textarea className="form-input" style={{ minHeight: 80 }} value={(pkg.features || []).join('\n')} onChange={e => { const a = [...packages]; a[i] = { ...pkg, features: e.target.value.split('\n').filter(Boolean) }; onChange({ ...d, packages: a }); }} /></div>
          <button className="btn-outline" style={{ fontSize: '0.75rem', padding: '6px 12px' }} onClick={() => onChange({ ...d, packages: packages.filter((_, j) => j !== i) })}>Remove</button>
        </div>
      ))}
      <button className="btn-outline" style={{ fontSize: '0.82rem', padding: '8px 16px' }} onClick={() => onChange({ ...d, packages: [...packages, { id: `pkg_${Date.now()}`, name: 'New Package', price: 4999, description: '', features: [], popular: false, visible: true }] })}>+ Add Package</button>
    </div>
  );
}

function BrandEditor({ data, seo, onChangeBrand, onChangeSeo }) {
  const d = data || {}; const s = seo || {};
  return (
    <div>
      <div className="admin-card" style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 16 }}>Brand Identity</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <TF label="Brand Name" value={d.name} onChange={v => onChangeBrand({ ...d, name: v })} />
          <TF label="Logo URL" value={d.logo} onChange={v => onChangeBrand({ ...d, logo: v })} />
          <TF label="Phone 1" value={d.phone1} onChange={v => onChangeBrand({ ...d, phone1: v })} />
          <TF label="Phone 2" value={d.phone2} onChange={v => onChangeBrand({ ...d, phone2: v })} />
          <TF label="Email" value={d.email} onChange={v => onChangeBrand({ ...d, email: v })} />
          <TF label="Location" value={d.location} onChange={v => onChangeBrand({ ...d, location: v })} />
          <TF label="Instagram URL" value={d.instagram} onChange={v => onChangeBrand({ ...d, instagram: v })} />
          <TF label="WhatsApp URL" value={d.whatsapp} onChange={v => onChangeBrand({ ...d, whatsapp: v })} />
        </div>
      </div>
      <div className="admin-card">
        <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 16 }}>SEO Settings</h3>
        <TF label="Site Title" value={s.siteTitle} onChange={v => onChangeSeo({ ...s, siteTitle: v })} hint="Shows in browser tab & Google" />
        <TF label="Meta Description" value={s.metaDescription} onChange={v => onChangeSeo({ ...s, metaDescription: v })} textarea hint="Max 160 chars" />
        <TF label="Meta Keywords" value={s.metaKeywords} onChange={v => onChangeSeo({ ...s, metaKeywords: v })} hint="Comma-separated" />
        <TF label="Canonical URL" value={s.canonicalUrl} onChange={v => onChangeSeo({ ...s, canonicalUrl: v })} />
        <TF label="OG Image URL" value={s.ogImage} onChange={v => onChangeSeo({ ...s, ogImage: v })} hint="1200×630px recommended" />
        <TF label="Twitter Handle" value={s.twitterHandle} onChange={v => onChangeSeo({ ...s, twitterHandle: v })} />
      </div>
    </div>
  );
}

// ─── Payment Editor (with UPI) ────────────────────────────────
function PaymentEditor({ data, onChange }) {
  const d = data || {};
  return (
    <div>
      {/* Razorpay */}
      <div className="admin-card" style={{ marginBottom: 16, background: d.enabled ? 'rgba(34,197,94,0.05)' : 'rgba(239,68,68,0.04)', borderColor: d.enabled ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.15)' }}>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12 }}>💳 Razorpay (Card / Net Banking / Wallet)</h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 12 }}>When enabled, customers can pay online at checkout via Razorpay.</p>
        <Toggle label={d.enabled ? '✅ Razorpay ENABLED' : '🔴 Razorpay DISABLED'} value={d.enabled} onChange={v => onChange({ ...d, enabled: v })} />
        {d.enabled && (
          <>
            <TF label="Razorpay Key ID" value={d.razorpayKeyId} onChange={v => onChange({ ...d, razorpayKeyId: v })} hint="Razorpay Dashboard → Settings → API Keys" />
            <TF label="Razorpay Key Secret" value={d.razorpayKeySecret} onChange={v => onChange({ ...d, razorpayKeySecret: v })} type="password" hint="Never share this" />
            <TF label="Currency" value={d.currency || 'INR'} onChange={v => onChange({ ...d, currency: v })} />
            <TF label="Checkout Note" value={d.displayNote} onChange={v => onChange({ ...d, displayNote: v })} />
            <Toggle label="Test Mode (use test keys)" value={d.testMode} onChange={v => onChange({ ...d, testMode: v })} />
          </>
        )}
      </div>

      {/* UPI */}
      <div className="admin-card" style={{ background: d.upiEnabled ? 'rgba(34,197,94,0.05)' : 'rgba(239,68,68,0.04)', borderColor: d.upiEnabled ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.15)' }}>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12 }}>📱 UPI / QR Code Payments</h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 12 }}>Customers scan your QR or use UPI ID, then enter their transaction ID for verification.</p>
        <Toggle label={d.upiEnabled ? '✅ UPI ENABLED' : '🔴 UPI DISABLED'} value={d.upiEnabled} onChange={v => onChange({ ...d, upiEnabled: v })} />
        {d.upiEnabled && (
          <>
            <TF label="UPI ID" value={d.upiId} onChange={v => onChange({ ...d, upiId: v })} placeholder="yourname@upi" hint="e.g. nexvora@paytm or 9949742547@ybl" />
            <TF label="UPI Name (shown to customer)" value={d.upiName} onChange={v => onChange({ ...d, upiName: v })} placeholder="NexvoraDigital" />
            <TF label="QR Code Image URL" value={d.upiQrImage} onChange={v => onChange({ ...d, upiQrImage: v })} hint="Upload your UPI QR to Cloudinary/ImgBB and paste the link here" />
            {d.upiQrImage && (
              <div style={{ marginTop: 8, textAlign: 'center' }}>
                <img src={d.upiQrImage} alt="UPI QR preview" style={{ maxWidth: 160, borderRadius: 12, border: '1px solid var(--glass-border)' }} />
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>QR Preview</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Portfolio Manager ────────────────────────────────────────
const CAT_OPTS = [
  { value: 'reels',    label: 'Instagram Reels' },
  { value: 'video',    label: 'Video Edits' },
  { value: 'poster',   label: 'Poster Design' },
  { value: 'content',  label: 'Content Creation' },
  { value: 'meta',     label: 'Meta Ads' },
  { value: 'websites', label: 'Websites' },
];
const SOURCE_OPTS = [
  { value: 'drive',     label: 'Google Drive' },
  { value: 'instagram', label: 'Instagram Link' },
  { value: 'youtube',   label: 'YouTube' },
  { value: 'link',      label: 'Website Link' },
];

function PortfolioManager() {
  const [items, setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCat, setFilterCat] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ serviceCategory: 'reels', title: '', description: '', sourceType: 'drive', url: '', siteName: '', siteUrl: '', visible: true, priority: 0, featured: false });
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const url = filterCat === 'all' ? `${API}/portfolio/all` : `${API}/portfolio/all?category=${filterCat}`;
      const { data } = await axios.get(url);
      setItems(data);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  }, [filterCat]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleSave = async () => {
    if (!form.url || !form.title) { toast.error('Title and URL are required'); return; }
    setSaving(true);
    try {
      if (editId) {
        await axios.patch(`${API}/portfolio/${editId}`, form);
        toast.success('Updated!');
      } else {
        await axios.post(`${API}/portfolio`, form);
        toast.success('Added!');
      }
      setShowForm(false); setEditId(null);
      setForm({ serviceCategory: 'reels', title: '', description: '', sourceType: 'drive', url: '', siteName: '', siteUrl: '', visible: true, priority: 0, featured: false });
      fetchItems();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleEdit = (item) => {
    setForm({ serviceCategory: item.serviceCategory, title: item.title, description: item.description || '', sourceType: item.sourceType, url: item.url, siteName: item.siteName || '', siteUrl: item.siteUrl || '', visible: item.visible, priority: item.priority, featured: item.featured });
    setEditId(item._id); setShowForm(true);
  };

  const toggleVisible = async (item) => {
    try {
      await axios.patch(`${API}/portfolio/${item._id}`, { visible: !item.visible });
      fetchItems();
    } catch { toast.error('Failed'); }
  };

  const setPriority = async (item, priority) => {
    try {
      await axios.patch(`${API}/portfolio/${item._id}`, { priority: Number(priority) });
      fetchItems();
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this portfolio item?')) return;
    try { await axios.delete(`${API}/portfolio/${id}`); fetchItems(); toast.success('Deleted'); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div>
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div><h1>Portfolio Manager</h1><p>Control which work is visible, set priority (higher = shown first), add/remove items.</p></div>
        <button className="btn-primary" onClick={() => { setShowForm(true); setEditId(null); }}>+ Add Item</button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {[{ value: 'all', label: 'All' }, ...CAT_OPTS].map(c => (
          <button key={c.value} className={filterCat === c.value ? 'btn-primary' : 'btn-outline'} style={{ padding: '6px 14px', fontSize: '0.82rem' }} onClick={() => setFilterCat(c.value)}>{c.label}</button>
        ))}
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div className="admin-card" style={{ marginBottom: 24, border: '1px solid rgba(255,149,0,0.3)', background: 'rgba(255,149,0,0.03)' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 16 }}>{editId ? 'Edit Item' : 'Add New Item'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Category *</label>
              <select className="form-input" value={form.serviceCategory} onChange={e => setForm(f => ({ ...f, serviceCategory: e.target.value }))}>
                {CAT_OPTS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Source Type *</label>
              <select className="form-input" value={form.sourceType} onChange={e => setForm(f => ({ ...f, sourceType: e.target.value }))}>
                {SOURCE_OPTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Title *</label>
              <input className="form-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Brand Reel #10" />
            </div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {form.sourceType === 'drive' ? 'Google Drive Preview URL *' : form.sourceType === 'instagram' ? 'Instagram Post/Reel URL *' : form.sourceType === 'link' ? 'Website URL *' : 'URL *'}
              </label>
              <input className="form-input" value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder={
                form.sourceType === 'drive' ? 'https://drive.google.com/file/d/xxx/preview' :
                form.sourceType === 'instagram' ? 'https://www.instagram.com/reel/xxx' :
                form.sourceType === 'link' ? 'https://yoursite.com' : 'https://...'
              } />
              {form.sourceType === 'drive' && <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>💡 In Google Drive: Share → Copy link, then change /view to /preview</span>}
            </div>
            {form.sourceType === 'link' && (
              <>
                <div className="form-group"><label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Site Name</label><input className="form-input" value={form.siteName} onChange={e => setForm(f => ({ ...f, siteName: e.target.value }))} placeholder="Client Website" /></div>
                <div className="form-group"><label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Site URL (if different)</label><input className="form-input" value={form.siteUrl} onChange={e => setForm(f => ({ ...f, siteUrl: e.target.value }))} /></div>
              </>
            )}
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Description (optional)</label>
              <input className="form-input" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="form-group">
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Priority (higher = first)</label>
              <input className="form-input" type="number" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: Number(e.target.value) }))} />
            </div>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', paddingTop: 20 }}>
              <Toggle label="Visible" value={form.visible} onChange={v => setForm(f => ({ ...f, visible: v }))} />
              <Toggle label="Featured" value={form.featured} onChange={v => setForm(f => ({ ...f, featured: v }))} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <button className="btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : editId ? 'Update Item' : 'Add Item'}</button>
            <button className="btn-outline" onClick={() => { setShowForm(false); setEditId(null); }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Items Table */}
      {loading ? <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Loading...</div> : (
        <div className="admin-card" style={{ padding: 0, overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr><th>Title</th><th>Category</th><th>Source</th><th>Priority</th><th>Visible</th><th>Featured</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No items yet</td></tr>
              ) : items.map(item => (
                <tr key={item._id}>
                  <td style={{ fontSize: '0.88rem' }}><strong>{item.title}</strong></td>
                  <td><span className="badge badge-confirmed">{item.serviceCategory}</span></td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.sourceType}</td>
                  <td>
                    <input type="number" className="form-input" style={{ width: 70, padding: '4px 8px', fontSize: '0.82rem' }}
                      defaultValue={item.priority}
                      onBlur={e => setPriority(item, e.target.value)} />
                  </td>
                  <td>
                    <button
                      className={item.visible ? 'btn-primary' : 'btn-outline'}
                      style={{ padding: '4px 12px', fontSize: '0.75rem' }}
                      onClick={() => toggleVisible(item)}
                    >{item.visible ? '👁 Visible' : '🙈 Hidden'}</button>
                  </td>
                  <td style={{ textAlign: 'center' }}>{item.featured ? '⭐' : '—'}</td>
                  <td style={{ display: 'flex', gap: 6, padding: '10px 14px' }}>
                    <button className="btn-outline" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => handleEdit(item)}>Edit</button>
                    <button className="btn-outline" style={{ padding: '4px 10px', fontSize: '0.75rem', borderColor: '#ef4444', color: '#ef4444' }} onClick={() => handleDelete(item._id)}>Del</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── New Offline Order Form ───────────────────────────────────
function NewOfflineOrder() {
  const SERVICES = ['Instagram Reels','Website Design','Video Editing','Meta Ads','Poster Design','Content Creation','Full Package','Custom'];
  const [form, setForm] = useState({ name: '', email: '', phone: '', city: '', serviceType: '', packageName: '', amount: '', message: '', adminNotes: '', paymentMethod: 'cash', paymentStatus: 'paid' });
  const [saving, setSaving] = useState(false);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    if (!form.name || !form.phone || !form.serviceType) { toast.error('Name, phone and service are required'); return; }
    setSaving(true);
    try {
      await axios.post(`${API}/orders/offline`, form);
      toast.success('✅ Offline order created!');
      setForm({ name: '', email: '', phone: '', city: '', serviceType: '', packageName: '', amount: '', message: '', adminNotes: '', paymentMethod: 'cash', paymentStatus: 'paid' });
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <div className="admin-header"><h1>New Offline Order</h1><p>Manually add a client order (walk-in, phone, WhatsApp, etc.)</p></div>
      <div className="admin-card">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group"><label>Client Name *</label><input name="name" className="form-input" value={form.name} onChange={handle} placeholder="Client Name" /></div>
          <div className="form-group"><label>Phone *</label><input name="phone" className="form-input" value={form.phone} onChange={handle} placeholder="+91 XXXXX XXXXX" /></div>
          <div className="form-group"><label>Email</label><input name="email" type="email" className="form-input" value={form.email} onChange={handle} placeholder="client@email.com" /></div>
          <div className="form-group"><label>City</label><input name="city" className="form-input" value={form.city} onChange={handle} placeholder="City" /></div>
          <div className="form-group">
            <label>Service *</label>
            <select name="serviceType" className="form-input" value={form.serviceType} onChange={handle}>
              <option value="">Select service...</option>
              {SERVICES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group"><label>Package Name</label><input name="packageName" className="form-input" value={form.packageName} onChange={handle} placeholder="e.g. Growth Pack" /></div>
          <div className="form-group"><label>Amount (₹)</label><input name="amount" type="number" className="form-input" value={form.amount} onChange={handle} placeholder="0" /></div>
          <div className="form-group">
            <label>Payment Method</label>
            <select name="paymentMethod" className="form-input" value={form.paymentMethod} onChange={handle}>
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="razorpay">Razorpay</option>
              <option value="none">None / To be collected</option>
            </select>
          </div>
          <div className="form-group">
            <label>Payment Status</label>
            <select name="paymentStatus" className="form-input" value={form.paymentStatus} onChange={handle}>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="not-required">Not Required</option>
            </select>
          </div>
          <div className="form-group" style={{ gridColumn: '1/-1' }}><label>Client Message / Requirements</label><textarea name="message" className="form-input form-textarea" value={form.message} onChange={handle} placeholder="What does the client need?" /></div>
          <div className="form-group" style={{ gridColumn: '1/-1' }}><label>Admin Notes (internal only)</label><textarea name="adminNotes" className="form-input form-textarea" value={form.adminNotes} onChange={handle} placeholder="Internal notes, delivery date, etc." /></div>
        </div>
        <button className="btn-primary" style={{ marginTop: 16 }} onClick={handleSave} disabled={saving}>
          {saving ? 'Creating...' : '✅ Create Offline Order'}
        </button>
      </div>
    </div>
  );
}

// ─── Orders Table ─────────────────────────────────────────────
function OrdersTable() {
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = filterType !== 'all' ? `?orderType=${filterType}` : '';
      const { data } = await axios.get(`${API}/orders${params}`);
      setOrders(data.orders);
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  }, [filterType]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateOrder = async (id, body) => {
    try { await axios.patch(`${API}/orders/${id}`, body); toast.success('Updated'); fetchOrders(); }
    catch { toast.error('Update failed'); }
  };

  const confirmUpi = async (id) => {
    try { await axios.post(`${API}/payments/upi-confirm/${id}`); toast.success('UPI payment confirmed ✅'); fetchOrders(); }
    catch { toast.error('Failed'); }
  };

  const STATUSES   = ['pending','confirmed','in-progress','completed','cancelled'];
  const PAY_STATUS = ['not-required','pending','paid','failed','refunded'];

  return (
    <div>
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div><h1>Orders</h1><p>{orders.length} total</p></div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['all','online','offline'].map(t => (
            <button key={t} className={filterType === t ? 'btn-primary' : 'btn-outline'} style={{ padding: '6px 14px', fontSize: '0.82rem', textTransform: 'capitalize' }} onClick={() => setFilterType(t)}>{t}</button>
          ))}
          <button className="btn-outline" style={{ padding: '6px 14px', fontSize: '0.82rem' }} onClick={fetchOrders}>↻ Refresh</button>
        </div>
      </div>

      <div className="admin-card" style={{ padding: 0, overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr><th>Customer</th><th>Service</th><th>Type</th><th>Amount</th><th>Payment</th><th>Status</th><th>Date</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Loading...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No orders yet</td></tr>
            ) : orders.map(o => (
              <React.Fragment key={o._id}>
                <tr onClick={() => setExpandedId(expandedId === o._id ? null : o._id)} style={{ cursor: 'pointer' }}>
                  <td>
                    <strong style={{ fontSize: '0.88rem' }}>{o.name}</strong>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{o.phone}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{o.email !== 'offline@nexvora.local' ? o.email : ''}</div>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{o.packageName || o.serviceType}</td>
                  <td><span className={`badge ${o.orderType === 'offline' ? 'badge-pending' : 'badge-confirmed'}`}>{o.orderType}</span></td>
                  <td style={{ fontSize: '0.85rem' }}>{o.amount ? `₹${o.amount?.toLocaleString('en-IN')}` : '—'}</td>
                  <td>
                    <div><span className={`badge badge-${o.paymentStatus?.replace('-','')}`}>{o.paymentStatus}</span></div>
                    {o.paymentMethod && o.paymentMethod !== 'none' && <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>{o.paymentMethod}</div>}
                    {o.upiTransactionId && o.paymentStatus === 'pending' && (
                      <button className="btn-primary" style={{ padding: '3px 10px', fontSize: '0.7rem', marginTop: 4 }} onClick={e => { e.stopPropagation(); confirmUpi(o._id); }}>✅ Confirm UPI</button>
                    )}
                  </td>
                  <td>
                    <select className="form-input" style={{ fontSize: '0.78rem', padding: '4px 8px' }} value={o.status} onChange={e => { e.stopPropagation(); updateOrder(o._id, { status: e.target.value }); }}>
                      {STATUSES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                  <td>
                    <button className="btn-outline" style={{ padding: '3px 8px', fontSize: '0.72rem', borderColor: '#ef4444', color: '#ef4444' }}
                      onClick={e => { e.stopPropagation(); if(window.confirm('Delete order?')) axios.delete(`${API}/orders/${o._id}`).then(fetchOrders); }}>Del</button>
                  </td>
                </tr>
                {expandedId === o._id && (
                  <tr><td colSpan={8} style={{ background: 'rgba(255,149,0,0.04)', padding: '12px 16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12, fontSize: '0.82rem' }}>
                      {o.city && <div><span style={{ color: 'var(--text-muted)' }}>City: </span>{o.city}</div>}
                      {o.message && <div><span style={{ color: 'var(--text-muted)' }}>Message: </span>{o.message}</div>}
                      {o.adminNotes && <div><span style={{ color: 'var(--text-muted)' }}>Admin Notes: </span>{o.adminNotes}</div>}
                      {o.upiTransactionId && <div><span style={{ color: 'var(--text-muted)' }}>UPI UTR: </span><strong style={{ color: 'var(--accent)' }}>{o.upiTransactionId}</strong></div>}
                      {o.paymentId && <div><span style={{ color: 'var(--text-muted)' }}>Payment ID: </span>{o.paymentId}</div>}
                    </div>
                    <div style={{ marginTop: 12 }}>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Payment Status:</label>
                      <select className="form-input" style={{ fontSize: '0.82rem', width: 200 }} value={o.paymentStatus} onChange={e => updateOrder(o._id, { paymentStatus: e.target.value })}>
                        {PAY_STATUS.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                  </td></tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────
function Dashboard() {
  const [stats, setStats] = useState(null);
  useEffect(() => { axios.get(`${API}/admin/stats`).then(r => setStats(r.data)).catch(() => {}); }, []);

  const statCards = [
    { label: 'Total Orders',    value: stats?.totalOrders ?? '—',    color: 'var(--accent)' },
    { label: 'Pending',         value: stats?.pendingOrders ?? '—',  color: '#eab308' },
    { label: 'Confirmed',       value: stats?.confirmedOrders ?? '—',color: '#3b82f6' },
    { label: 'Completed',       value: stats?.completedOrders ?? '—',color: '#22c55e' },
    { label: 'Online Orders',   value: stats?.onlineOrders ?? '—',   color: 'var(--accent)' },
    { label: 'Offline Orders',  value: stats?.offlineOrders ?? '—',  color: '#a855f7' },
    { label: 'Revenue (paid)',  value: stats ? `₹${stats.totalRevenue?.toLocaleString('en-IN')}` : '—', color: '#22c55e' },
    { label: 'Portfolio Items', value: stats?.portfolioItems ?? '—', color: 'var(--accent)' },
  ];

  return (
    <div>
      <div className="admin-header"><h1>Dashboard</h1><p>NexvoraDigital overview</p></div>
      <div className="admin-grid" style={{ marginBottom: 24 }}>
        {statCards.map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>
      <div className="admin-card">
        <h3 style={{ fontSize:'0.9rem', fontWeight:600, marginBottom:12 }}>Quick Guide</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 2 }}>
          👈 Use the sidebar to manage every part of your website.<br/>
          🎬 <strong>Portfolio</strong> — All your Drive videos are already loaded. Add/remove/reorder/hide work per category.<br/>
          📱 <strong>Payments</strong> — Enable Razorpay (cards) + UPI independently. Add your UPI ID &amp; QR image.<br/>
          ➕ <strong>New Offline Order</strong> — Log walk-in / WhatsApp / phone clients manually with cash/UPI payment.<br/>
          🛒 <strong>Orders</strong> — Filter online vs offline. Click any row to expand details. Confirm UPI payments here.<br/>
          🌐 <strong>View Website</strong> / <strong>View Portfolio</strong> — open site in new tab to preview changes.
        </p>
      </div>
    </div>
  );
}

// ─── MAIN PANEL ───────────────────────────────────────────────
export default function AdminPanel() {
  const { logout }              = useAuth();
  const { config, refresh }     = useSite();
  const navigate                = useNavigate();
  const [active, setActive]     = useState('dashboard');
  const [localConfig, setLocal] = useState(null);
  const [saving, setSaving]     = useState(false);
  const [mobileSidebar, setMobileSidebar] = useState(false);

  useEffect(() => { if (config) setLocal(JSON.parse(JSON.stringify(config))); }, [config]);

  const updateSection = (section, data) => setLocal(prev => ({ ...prev, [section]: data }));

  const save = async () => {
    setSaving(true);
    try {
      await axios.put(`${API}/api/site/config`, localConfig);
      toast.success('✅ Saved!');
      await refresh();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleNav = (id) => { setActive(id); setMobileSidebar(false); };

  return (
    <div className="admin-layout">
      {/* Mobile top bar */}
      <div className="admin-mobile-topbar">
        <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.2rem', letterSpacing: 2 }}>
          Nexvora<span style={{ color: 'var(--accent)' }}>Admin</span>
        </span>
        <button className="hamburger" style={{ display: 'flex' }} onClick={() => setMobileSidebar(o => !o)}>
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileSidebar && (
        <div className="admin-sidebar-overlay" onClick={() => setMobileSidebar(false)} />
      )}

      <aside className={`admin-sidebar ${mobileSidebar ? 'admin-sidebar--open' : ''}`}>
        <div className="admin-sidebar-logo">Nexvora<span>Admin</span></div>
        {NAV.map(n => (
          <button key={n.id} className={`admin-nav-item ${active === n.id ? 'active' : ''}`} onClick={() => handleNav(n.id)}>
            {n.label}
          </button>
        ))}
        <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--glass-border)' }}>
          <a href="/" target="_blank" rel="noreferrer" className="admin-nav-item" style={{ display: 'flex' }}>🌐 View Website</a>
          <a href="/portfolio" target="_blank" rel="noreferrer" className="admin-nav-item" style={{ display: 'flex' }}>🎬 View Portfolio</a>
          <button className="admin-nav-item" onClick={() => { logout(); navigate('/admin/login'); }} style={{ color: '#ef4444' }}>🚪 Logout</button>
        </div>
      </aside>

      <main className="admin-main">
        {active === 'dashboard'  && <Dashboard />}
        {active === 'portfolio'  && <PortfolioManager />}
        {active === 'orders'     && <OrdersTable />}
        {active === 'new-order'  && <NewOfflineOrder />}

        {!['dashboard','portfolio','orders','new-order'].includes(active) && localConfig && (
          <div>
            <div className="admin-header">
              <h1>{NAV.find(n => n.id === active)?.label}</h1>
              <p>Edit and click Save Changes</p>
            </div>
            <div className="admin-card">
              {active === 'hero'     && <HeroEditor    data={localConfig.hero}     onChange={d => updateSection('hero', d)} />}
              {active === 'about'    && <AboutEditor   data={localConfig.about}    onChange={d => updateSection('about', d)} />}
              {active === 'services' && <ServicesEditor data={localConfig.services} onChange={d => updateSection('services', d)} />}
              {active === 'team'     && <TeamEditor    data={localConfig.team}     onChange={d => updateSection('team', d)} />}
              {active === 'order'    && <OrderEditor   data={localConfig.order}    onChange={d => updateSection('order', d)} />}
              {active === 'payment'  && <PaymentEditor data={localConfig.payment}  onChange={d => updateSection('payment', d)} />}
              {active === 'contact'  && (
                <div>
                  <Toggle label="Show Contact Section" value={localConfig.contact?.visible !== false} onChange={v => updateSection('contact', { ...localConfig.contact, visible: v })} />
                  <TF label="Section Label" value={localConfig.contact?.label} onChange={v => updateSection('contact', { ...localConfig.contact, label: v })} />
                  <TF label="Subtitle" value={localConfig.contact?.subtitle} onChange={v => updateSection('contact', { ...localConfig.contact, subtitle: v })} textarea />
                  <TF label="Formspree Form ID" value={localConfig.contact?.formspreeId} onChange={v => updateSection('contact', { ...localConfig.contact, formspreeId: v })} hint="From formspree.io — the part after /f/" />
                </div>
              )}
              {active === 'brand' && (
                <BrandEditor data={localConfig.brand} seo={localConfig.seo}
                  onChangeBrand={d => updateSection('brand', d)}
                  onChangeSeo={d => updateSection('seo', d)} />
              )}
              <SaveBtn onClick={save} loading={saving} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
