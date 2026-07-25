const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { Admin } = require('../models');

const SECRET = process.env.JWT_SECRET || 'nexvora_secret_2026';

// POST /api/auth/setup  – create first admin (only if none exist)
router.post('/setup', async (req, res) => {
  try {
    const count = await Admin.countDocuments();
    if (count > 0) return res.status(403).json({ message: 'Setup already complete' });
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ message: 'All fields required' });
    const admin = await Admin.create({ username, email, password, role: 'superadmin' });
    res.json({ message: 'Admin created', id: admin._id });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });
    admin.lastLogin = new Date();
    await admin.save();
    const token = jwt.sign(
      { id: admin._id, username: admin.username, role: admin.role },
      SECRET, { expiresIn: '7d' }
    );
    res.json({ token, admin: { id: admin._id, username: admin.username, email: admin.email, role: admin.role } });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// GET /api/auth/check – verify token
router.get('/check', require('../middleware/auth'), (req, res) => {
  res.json({ valid: true, admin: req.admin });
});

module.exports = router;
