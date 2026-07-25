const router    = require('express').Router();
const auth      = require('../middleware/auth');
const SiteConfig = require('../models/SiteConfig');
const { Order } = require('../models');

// ─── Razorpay: create order ───────────────────────────────────
router.post('/create-order', async (req, res) => {
  try {
    const config = await SiteConfig.findOne();
    if (!config?.payment?.enabled)
      return res.status(403).json({ message: 'Online payments are currently disabled' });

    const Razorpay = require('razorpay');
    const rzp = new Razorpay({
      key_id:     config.payment.razorpayKeyId,
      key_secret: config.payment.razorpayKeySecret
    });

    const { amount, currency = 'INR', orderId, receipt } = req.body;
    const rzpOrder = await rzp.orders.create({
      amount:   amount * 100,
      currency,
      receipt:  receipt || `rcpt_${Date.now()}`,
      notes:    { orderId }
    });

    if (orderId) {
      await Order.findByIdAndUpdate(orderId, {
        razorpayOrderId: rzpOrder.id,
        paymentStatus:   'pending',
        paymentMethod:   'razorpay'
      });
    }

    res.json({
      orderId:  rzpOrder.id,
      amount:   rzpOrder.amount,
      currency: rzpOrder.currency,
      keyId:    config.payment.razorpayKeyId
    });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ─── Razorpay: verify ─────────────────────────────────────────
router.post('/verify', async (req, res) => {
  try {
    const config = await SiteConfig.findOne();
    const crypto = require('crypto');
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const expected = crypto
      .createHmac('sha256', config.payment.razorpayKeySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expected !== razorpay_signature)
      return res.status(400).json({ message: 'Payment verification failed' });

    if (orderId) {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: 'paid',
        paymentId:     razorpay_payment_id,
        status:        'confirmed'
      });
    }
    res.json({ message: 'Payment verified', paymentId: razorpay_payment_id });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ─── UPI: mark payment submitted (customer side) ──────────────
// Customer submits UTR/transaction ID after paying via UPI QR
router.post('/upi-submit', async (req, res) => {
  try {
    const { orderId, upiTransactionId } = req.body;
    if (!orderId || !upiTransactionId)
      return res.status(400).json({ message: 'orderId and upiTransactionId are required' });

    const order = await Order.findByIdAndUpdate(orderId, {
      upiTransactionId,
      paymentMethod: 'upi',
      paymentStatus: 'pending'   // admin will verify and change to 'paid'
    }, { new: true });

    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'UPI transaction submitted for verification', order });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ─── UPI: admin confirms payment ──────────────────────────────
router.post('/upi-confirm/:orderId', auth, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.orderId, {
      paymentStatus: 'paid',
      status:        'confirmed'
    }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'UPI payment confirmed', order });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ─── Payment status (public) ──────────────────────────────────
router.get('/status', async (req, res) => {
  try {
    const config = await SiteConfig.findOne();
    res.json({
      enabled:    config?.payment?.enabled   || false,
      upiEnabled: config?.payment?.upiEnabled || false,
      upiId:      config?.payment?.upiEnabled ? config.payment.upiId : null,
      upiName:    config?.payment?.upiName || null,
      upiQr:      config?.payment?.upiEnabled ? config.payment.upiQrImage : null
    });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
