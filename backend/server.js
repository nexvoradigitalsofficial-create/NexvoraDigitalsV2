require('dotenv').config();
const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');
const compression = require('compression');

const authRoutes      = require('./routes/auth');
const siteRoutes      = require('./routes/site');
const orderRoutes     = require('./routes/orders');
const paymentRoutes   = require('./routes/payments');
const adminRoutes     = require('./routes/admin');
const portfolioRoutes = require('./routes/portfolio');

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(morgan('dev'));
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://nexvora-digitals-v2.vercel.app",
    "https://nexvoradigitals.in",
    "https://www.nexvoradigitals.in"
  ],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth',      authRoutes);
app.use('/api/site',      siteRoutes);
app.use('/api/orders',    orderRoutes);
app.use('/api/payments',  paymentRoutes);
app.use('/api/admin',     adminRoutes);
app.use('/api/portfolio', portfolioRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/nexvora')
  .then(async () => {
    console.log('✅ MongoDB connected');
    const SiteConfig = require('./models/SiteConfig');
    const existing = await SiteConfig.findOne();
    if (!existing) {
      await SiteConfig.create(require('./config/defaultSiteConfig'));
      console.log('✅ Default site config seeded');
    }

    // Seed default portfolio items from the existing Drive links
    const { PortfolioItem } = require('./models');
    const count = await PortfolioItem.countDocuments();
    if (count === 0) {
      await PortfolioItem.insertMany(require('./config/defaultPortfolio'));
      console.log('✅ Default portfolio seeded');
    }

    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => { console.error('❌ MongoDB error:', err); process.exit(1); });
