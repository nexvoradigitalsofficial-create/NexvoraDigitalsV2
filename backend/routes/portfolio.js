const router = require('express').Router();
const { PortfolioItem } = require('../models');
const auth = require('../middleware/auth');

// GET /api/portfolio  – public: get visible items, sorted by priority desc
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { visible: true };
    if (category) filter.serviceCategory = category;
    const items = await PortfolioItem.find(filter).sort({ priority: -1, createdAt: -1 });
    res.json(items);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// GET /api/portfolio/all  – admin: get ALL items (incl. hidden)
router.get('/all', auth, async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { serviceCategory: category } : {};
    const items = await PortfolioItem.find(filter).sort({ priority: -1, createdAt: -1 });
    res.json(items);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// POST /api/portfolio  – admin: add item
router.post('/', auth, async (req, res) => {
  try {
    const item = await PortfolioItem.create(req.body);
    res.status(201).json(item);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// PATCH /api/portfolio/:id  – admin: update (visibility, priority, etc.)
router.patch('/:id', auth, async (req, res) => {
  try {
    const item = await PortfolioItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// DELETE /api/portfolio/:id  – admin
router.delete('/:id', auth, async (req, res) => {
  try {
    await PortfolioItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// POST /api/portfolio/bulk-priority  – admin: reorder priorities in one shot
router.post('/bulk-priority', auth, async (req, res) => {
  try {
    // req.body = [{ id, priority }, ...]
    await Promise.all(req.body.map(({ id, priority }) =>
      PortfolioItem.findByIdAndUpdate(id, { priority })
    ));
    res.json({ message: 'Priorities updated' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
