const router = require('express').Router();
const { Order } = require('../models');
const auth = require('../middleware/auth');

// POST /api/orders  – public: customer places order online
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, city, serviceType, packageId, packageName, amount, currency, message } = req.body;
    if (!name || !email || !phone || !serviceType)
      return res.status(400).json({ message: 'Name, email, phone and service are required' });

    const order = await Order.create({
      name, email, phone, city, serviceType, packageId, packageName,
      amount, currency: currency || 'INR', message,
      orderType: 'online'
    });
    res.status(201).json({ message: 'Order placed successfully', orderId: order._id, order });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// POST /api/orders/offline  – admin: create offline order manually
router.post('/offline', auth, async (req, res) => {
  try {
    const {
      name, email, phone, city, serviceType, packageName,
      amount, message, adminNotes, paymentMethod, paymentStatus
    } = req.body;

    if (!name || !phone || !serviceType)
      return res.status(400).json({ message: 'Name, phone and service are required' });

    const order = await Order.create({
      name, email: email || 'offline@nexvora.local', phone, city,
      serviceType, packageName,
      amount: amount || 0, currency: 'INR', message,
      orderType: 'offline',
      adminNotes,
      paymentMethod: paymentMethod || 'cash',
      paymentStatus: paymentStatus || 'not-required',
      status: 'confirmed'
    });
    res.status(201).json({ message: 'Offline order created', orderId: order._id, order });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// GET /api/orders  – admin: list all orders
router.get('/', auth, async (req, res) => {
  try {
    const { status, orderType, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (orderType) filter.orderType = orderType;
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Order.countDocuments(filter);
    res.json({ orders, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// PATCH /api/orders/:id  – admin: update
router.patch('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order updated', order });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// DELETE /api/orders/:id  – admin
router.delete('/:id', auth, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
