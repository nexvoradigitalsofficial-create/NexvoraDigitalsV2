const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ─── Order Model ──────────────────────────────────────────────
const OrderSchema = new mongoose.Schema({
  // Customer Info
  name:    { type: String, required: true, trim: true },
  email:   { type: String, required: true, lowercase: true, trim: true },
  phone:   { type: String, required: true },
  city:    { type: String, trim: true },

  // Service / Package
  serviceType: { type: String, required: true },
  packageId:   { type: String },
  packageName: { type: String },
  amount:      { type: Number },
  currency:    { type: String, default: 'INR' },

  // Custom message
  message: { type: String },

  // Order type: online (website form) | offline (admin-created)
  orderType: { type: String, enum: ['online', 'offline'], default: 'online' },

  // Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },

  // Payment
  paymentMethod: {
    type: String,
    enum: ['none', 'razorpay', 'upi', 'cash', 'bank_transfer'],
    default: 'none'
  },
  paymentStatus: {
    type: String,
    enum: ['not-required', 'pending', 'paid', 'failed', 'refunded'],
    default: 'not-required'
  },
  paymentId:      { type: String },
  upiTransactionId: { type: String },
  razorpayOrderId:  { type: String },

  // Admin notes
  adminNotes: { type: String }
}, { timestamps: true });

// ─── Portfolio Item Model ──────────────────────────────────────
const PortfolioItemSchema = new mongoose.Schema({
  serviceCategory: {
    type: String,
    enum: ['reels', 'websites', 'video', 'meta', 'poster', 'content'],
    required: true
  },
  title:       { type: String, required: true },
  description: { type: String },

  // Source type: drive | instagram | youtube | url
  sourceType: { type: String, enum: ['drive', 'instagram', 'youtube', 'url', 'link'], default: 'drive' },
  url:        { type: String, required: true },  // Drive/IG/YT/direct link

  // For website cards (no video)
  siteName:   { type: String },
  siteUrl:    { type: String },
  thumbnail:  { type: String },

  // Display control
  visible:    { type: Boolean, default: true },
  priority:   { type: Number, default: 0 },   // higher = shown first
  featured:   { type: Boolean, default: false },

}, { timestamps: true });

// ─── Admin User Model ─────────────────────────────────────────
const AdminSchema = new mongoose.Schema({
  username:  { type: String, required: true, unique: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true },
  password:  { type: String, required: true },
  role:      { type: String, enum: ['superadmin', 'admin'], default: 'admin' },
  lastLogin: { type: Date }
}, { timestamps: true });

AdminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
AdminSchema.methods.comparePassword = function(c) {
  return bcrypt.compare(c, this.password);
};

module.exports = {
  Order:         mongoose.model('Order', OrderSchema),
  PortfolioItem: mongoose.model('PortfolioItem', PortfolioItemSchema),
  Admin:         mongoose.model('Admin', AdminSchema)
};
