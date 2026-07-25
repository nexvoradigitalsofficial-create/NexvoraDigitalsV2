import React from 'react';

const icons = {
  instagram: (
    <svg viewBox="0 0 64 64" fill="none" width="36" height="36">
      <rect width="64" height="64" rx="16" fill="url(#ig)" />
      <defs>
        <linearGradient id="ig" x1="0" y1="64" x2="64" y2="0">
          <stop offset="0%" stopColor="#f09433" />
          <stop offset="25%" stopColor="#e6683c" />
          <stop offset="50%" stopColor="#dc2743" />
          <stop offset="75%" stopColor="#cc2366" />
          <stop offset="100%" stopColor="#bc1888" />
        </linearGradient>
      </defs>
      <rect x="18" y="18" width="28" height="28" rx="7" stroke="white" strokeWidth="2.5" fill="none" />
      <circle cx="32" cy="32" r="7" stroke="white" strokeWidth="2.5" fill="none" />
      <circle cx="41" cy="23" r="2" fill="white" />
    </svg>
  ),
  browser: (
    <svg viewBox="0 0 64 64" fill="none" width="36" height="36">
      <rect width="64" height="64" rx="16" fill="#2563eb" />
      <rect x="12" y="18" width="40" height="28" rx="4" stroke="white" strokeWidth="2" fill="none" />
      <line x1="12" y1="26" x2="52" y2="26" stroke="white" strokeWidth="2" />
      <circle cx="19" cy="22" r="2" fill="white" />
      <circle cx="26" cy="22" r="2" fill="white" />
    </svg>
  ),
  video: (
    <svg viewBox="0 0 64 64" fill="none" width="36" height="36">
      <rect width="64" height="64" rx="16" fill="#7c3aed" />
      <rect x="8" y="20" width="36" height="24" rx="4" stroke="white" strokeWidth="2" fill="none" />
      <path d="M44 26l12-6v24l-12-6V26z" stroke="white" strokeWidth="2" fill="none" />
    </svg>
  ),
  meta: (
    <svg viewBox="0 0 64 64" fill="none" width="36" height="36">
      <rect width="64" height="64" rx="16" fill="#1877F2" />
      <path d="M12 36c5-10 10-15 15-15s10 5 15 15 10 15 15 15" stroke="white" strokeWidth="3" fill="none" />
    </svg>
  ),
  poster: (
    <svg viewBox="0 0 64 64" fill="none" width="36" height="36">
      <rect width="64" height="64" rx="16" fill="#ea580c" />
      <rect x="18" y="16" width="28" height="32" rx="4" fill="white" />
      <line x1="22" y1="22" x2="42" y2="22" stroke="#ea580c" strokeWidth="2" />
      <line x1="22" y1="28" x2="38" y2="28" stroke="#ea580c" strokeWidth="2" />
      <line x1="22" y1="34" x2="35" y2="34" stroke="#ea580c" strokeWidth="2" />
    </svg>
  ),
  content: (
    <svg viewBox="0 0 64 64" fill="none" width="36" height="36">
      <rect width="64" height="64" rx="16" fill="#6C63FF" />
      <path d="M20 44l4-12 16-16 8 8-16 16-12 4z" stroke="white" strokeWidth="2" fill="none" />
    </svg>
  )
};

export default function ServiceIcon({ type }) {
  return icons[type] || <span style={{ fontSize: 28 }}>⚡</span>;
}
