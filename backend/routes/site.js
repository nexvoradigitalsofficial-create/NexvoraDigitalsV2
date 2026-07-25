const router = require('express').Router();
const SiteConfig = require('../models/SiteConfig');
const auth = require('../middleware/auth');

// GET /api/site/config – public, for frontend rendering
router.get('/config', async (req, res) => {
  try {
    let config = await SiteConfig.findOne();
    if (!config) {
      config = await SiteConfig.create(require('../config/defaultSiteConfig'));
    }
    // Never send payment secrets to public
    const safe = config.toObject();
    if (safe.payment) {
      delete safe.payment.razorpayKeySecret;
    }
    res.json(safe);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// PUT /api/site/config – admin only, update any section
router.put('/config', auth, async (req, res) => {
  try {
    let config = await SiteConfig.findOne();
    if (!config) config = new SiteConfig();
    // Merge each section
    const sections = ['seo', 'brand', 'nav', 'hero', 'about', 'services', 'team', 'order', 'contact', 'footer', 'payment'];
    sections.forEach(s => {
      if (req.body[s] !== undefined) config[s] = req.body[s];
    });
    config.markModified('seo');
    config.markModified('brand');
    config.markModified('nav');
    config.markModified('hero');
    config.markModified('about');
    config.markModified('services');
    config.markModified('team');
    config.markModified('order');
    config.markModified('contact');
    config.markModified('footer');
    config.markModified('payment');
    await config.save();
    res.json({ message: 'Config updated', config });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// PATCH /api/site/config/:section – update single section
router.patch('/config/:section', auth, async (req, res) => {
  try {
    const { section } = req.params;
    const allowed = ['seo','brand','nav','hero','about','services','team','order','contact','footer','payment'];
    if (!allowed.includes(section)) return res.status(400).json({ message: 'Invalid section' });
    let config = await SiteConfig.findOne();
    if (!config) config = new SiteConfig();
    config[section] = req.body;
    config.markModified(section);
    await config.save();
    res.json({ message: `${section} updated`, data: config[section] });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
