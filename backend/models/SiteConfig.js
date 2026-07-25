const mongoose = require('mongoose');

// ─── SiteConfig (single document – admin edits this) ──────────
const SiteConfigSchema = new mongoose.Schema({
  seo: { type: mongoose.Schema.Types.Mixed, default: {} },
  brand: { type: mongoose.Schema.Types.Mixed, default: {} },
  nav: { type: mongoose.Schema.Types.Mixed, default: {} },
  hero: { type: mongoose.Schema.Types.Mixed, default: {} },
  about: { type: mongoose.Schema.Types.Mixed, default: {} },
  services: { type: mongoose.Schema.Types.Mixed, default: {} },
  team: { type: mongoose.Schema.Types.Mixed, default: {} },
  order: { type: mongoose.Schema.Types.Mixed, default: {} },
  contact: { type: mongoose.Schema.Types.Mixed, default: {} },
  footer: { type: mongoose.Schema.Types.Mixed, default: {} },
  payment: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

module.exports = mongoose.model('SiteConfig', SiteConfigSchema);
