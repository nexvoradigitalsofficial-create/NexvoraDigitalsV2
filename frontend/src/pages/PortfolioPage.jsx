import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API = process.env.REACT_APP_API_URL || '/api';

const CATEGORIES = [
  { id: 'all',      label: 'All Work',          emoji: '✨' },
  { id: 'reels',    label: 'Instagram Reels',   emoji: '🎬' },
  { id: 'video',    label: 'Video Edits',        emoji: '🎞️' },
  { id: 'poster',   label: 'Poster Design',      emoji: '🎨' },
  { id: 'content',  label: 'Content Creation',   emoji: '✍️' },
  { id: 'meta',     label: 'Meta Ads',           emoji: '📢' },
  { id: 'websites', label: 'Websites',           emoji: '🌐' },
];

// Convert a Drive "preview" url to embeddable preview
function getDriveEmbed(url) {
  // Already a preview link
  if (url.includes('/preview')) return url;
  // Convert /view to /preview
  return url.replace('/view', '/preview');
}

function VideoCard({ item }) {
  const [playing, setPlaying] = useState(false);
  const isLink = item.sourceType === 'link' || item.sourceType === 'url';
  const isInstagram = item.url?.includes('instagram.com');

  if (isLink) {
    // Website card
    return (
      <div className="port-card port-card--link">
        {item.featured && <span className="port-featured-badge">⭐ Featured</span>}
        <div className="port-link-body">
          <div className="port-link-icon">🌐</div>
          <h3 className="port-card-title">{item.title}</h3>
          {item.description && <p className="port-card-desc">{item.description}</p>}
          {item.siteName && <p className="port-site-name">{item.siteName}</p>}
        </div>
        <a
          href={item.siteUrl || item.url}
          target="_blank"
          rel="noreferrer"
          className="btn-primary port-link-btn"
        >
          Visit Site →
        </a>
      </div>
    );
  }

  if (isInstagram) {
    return (
      <div className="port-card">
        {item.featured && <span className="port-featured-badge">⭐ Featured</span>}
        <div className="port-video-wrap">
          <a href={item.url} target="_blank" rel="noreferrer" className="port-ig-link">
            <div className="port-ig-placeholder">
              <span className="port-ig-icon">📷</span>
              <span>View on Instagram</span>
            </div>
          </a>
        </div>
        <div className="port-card-info">
          <h3 className="port-card-title">{item.title}</h3>
          {item.description && <p className="port-card-desc">{item.description}</p>}
        </div>
      </div>
    );
  }

  // Drive / YouTube embed
  const isVertical = ['reels','content'].includes(item.serviceCategory);

  return (
    <div className={`port-card ${isVertical ? 'port-card--reel' : ''}`}>
      {item.featured && <span className="port-featured-badge">⭐ Featured</span>}
      <div className="port-video-wrap" style={ isVertical ? { paddingTop: '177.78%' } : {} }>
        {playing ? (
          <iframe
            className="port-iframe"
            src={getDriveEmbed(item.url)}
            allow="autoplay; fullscreen"
            allowFullScreen
            title={item.title}
          />
        ) : (
          <div className="port-thumb" onClick={() => setPlaying(true)}>
            <div className="port-play-btn">
              <svg viewBox="0 0 24 24" fill="none" width="32" height="32">
                <circle cx="12" cy="12" r="11" fill="rgba(255,149,0,0.9)" />
                <polygon points="10,8 18,12 10,16" fill="white" />
              </svg>
            </div>
            <div className="port-thumb-label">Click to play</div>
          </div>
        )}
      </div>
      <div className="port-card-info">
        <h3 className="port-card-title">{item.title}</h3>
        {item.description && <p className="port-card-desc">{item.description}</p>}
      </div>
    </div>
  );
}

export default function PortfolioPage() {
  const { category: paramCat } = useParams();
  const navigate = useNavigate();
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState(paramCat || 'all');

  useEffect(() => {
    setLoading(true);
    const cat = activeTab === 'all' ? '' : activeTab;
    axios.get(`${API}/portfolio${cat ? `?category=${cat}` : ''}`)
      .then(r => setItems(r.data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [activeTab]);

  const handleTab = (id) => {
    setActiveTab(id);
    navigate(id === 'all' ? '/portfolio' : `/portfolio/${id}`, { replace: true });
  };

  const catLabel = CATEGORIES.find(c => c.id === activeTab)?.label || 'All Work';

  return (
    <>
      <Helmet>
        <title>{catLabel} – NexvoraDigital Portfolio</title>
        <meta name="description" content="Explore NexvoraDigital's portfolio: Instagram Reels, Video Edits, Poster Designs, Meta Ads, Websites and Content Creation." />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <Navbar />

      <main style={{ minHeight: '100vh', background: 'var(--bg2)', paddingTop: 'var(--nav-h)' }}>
        {/* Hero */}
        <div className="port-hero">
          <div className="blob blob-gold-tr" style={{ opacity: 0.5, filter: 'blur(80px)' }} />
          <div className="blob blob-blue-left" style={{ opacity: 0.4, filter: 'blur(80px)' }} />
          <h1 className="port-hero-title">Our <span className="accent-text">Work</span></h1>
          <p className="port-hero-sub">Every pixel crafted with one goal — <strong>results</strong>.</p>
        </div>

        {/* Category tabs */}
        <div className="port-tabs-wrap">
          <div className="port-tabs">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                className={`port-tab ${activeTab === cat.id ? 'active' : ''}`}
                onClick={() => handleTab(cat.id)}
              >
                <span>{cat.emoji}</span> {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="port-grid-wrap">
          {loading ? (
            <div className="port-loading">
              <div className="loader-bar" style={{ width: 120 }}><div className="loader-bar-fill" /></div>
              <span>Loading portfolio...</span>
            </div>
          ) : items.length === 0 ? (
            <div className="port-empty">
              <div style={{ fontSize: '3rem' }}>🎬</div>
              <p>No items in this category yet. Check back soon!</p>
            </div>
          ) : (
            <div className="port-grid">
              {items.map(item => (
                <VideoCard key={item._id} item={item} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
