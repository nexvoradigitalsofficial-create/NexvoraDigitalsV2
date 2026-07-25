const router = require('express').Router();
const auth   = require('../middleware/auth');
const { Order, PortfolioItem } = require('../models');

// GET /api/admin/stats
router.get('/stats', auth, async (req, res) => {
  try {
    const [total, pending, confirmed, completed, cancelled, onlineCount, offlineCount, revenue, portfolioCount] =
      await Promise.all([
        Order.countDocuments(),
        Order.countDocuments({ status: 'pending' }),
        Order.countDocuments({ status: 'confirmed' }),
        Order.countDocuments({ status: 'completed' }),
        Order.countDocuments({ status: 'cancelled' }),
        Order.countDocuments({ orderType: 'online' }),
        Order.countDocuments({ orderType: 'offline' }),
        Order.aggregate([
          { $match: { paymentStatus: 'paid' } },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ]),
        PortfolioItem.countDocuments()
      ]);

    res.json({
      totalOrders:     total,
      pendingOrders:   pending,
      confirmedOrders: confirmed,
      completedOrders: completed,
      cancelledOrders: cancelled,
      onlineOrders:    onlineCount,
      offlineOrders:   offlineCount,
      totalRevenue:    revenue[0]?.total || 0,
      portfolioItems:  portfolioCount
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
