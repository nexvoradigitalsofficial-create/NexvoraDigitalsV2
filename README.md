# NexvoraDigital — Full Stack React + Node.js

## Complete Feature List

### Public Website
- Glassmorphism design (exact match to original)
- Page loader animation (1.6s brand reveal)
- Scroll progress bar (orange, top of screen)
- Cursor glow effect (desktop)
- WhatsApp float button (bottom-right, bounces)
- Scroll reveal animations on all sections
- Premium noise texture + section divider glows
- **Fully mobile responsive** (320px → desktop)

### Pages
| Route | Description |
|-------|-------------|
| `/` | Home — Hero, About, Services, Team, Order, Contact |
| `/portfolio` | All work, all categories |
| `/portfolio/:category` | Filtered: reels, video, poster, content, meta, websites |
| `/admin/login` | Admin sign-in |
| `/admin` | Full CMS dashboard |

### Portfolio System
- **All Drive links pre-loaded** (reels, videos, posters, content, meta, websites)
- Videos play inline (click to play) — Google Drive embeds
- Reels/Content = 9:16 vertical | Others = 16:9
- Instagram links open on Instagram
- Website cards open the live site
- Admin: set **priority** (higher number = shown first)
- Admin: toggle **visible/hidden** per item
- Admin: mark **featured** (badge on card)
- Admin: add/edit/delete any item
- Filter tabs on portfolio page (sticky, glassmorphism)

### Order System
- Package cards with pricing
- Inline order form (name, email, phone, city, notes)
- **Online payment** via Razorpay (card, net banking, wallet)
- **UPI payment** — shows QR + UPI ID, customer enters UTR
- **No payment** mode — plain order placement
- Admin can enable/disable Razorpay + UPI independently

### Offline Orders (Admin)
- Log walk-in / WhatsApp / phone clients manually
- Record cash / UPI / bank transfer payments
- Set payment status on creation

### Orders Dashboard
- Filter: all / online / offline
- Click row to expand: UTR number, admin notes, payment ID
- Update order status (pending → confirmed → in-progress → completed)
- Update payment status
- **Confirm UPI** button appears when UTR is submitted — one click verifies

### Admin Panel Sections
| Section | What you can edit |
|---------|-------------------|
| Hero | Tagline, title, accent word, body, buttons, image |
| About | Label, title, paragraphs, badges (add/remove) |
| Services | All 6 services — title, icon, description, visibility |
| Team | Members — name, role, bio, avatar, layout |
| Packages | Add/edit/remove pricing packages |
| Contact | Formspree ID, labels |
| Brand & SEO | Name, logo, phones, socials, meta title/desc/keywords, OG image |
| Payments | Razorpay keys + UPI ID + QR image URL |

### SEO
- Dynamic `<title>` and `<meta description>` from DB
- Open Graph + Twitter Card tags
- JSON-LD LocalBusiness schema
- Canonical URL tag
- `robots: index, follow`
- Semantic HTML throughout

---

## Setup

### 1. Backend
```bash
cd backend
npm install
# Edit .env — set MONGO_URI and JWT_SECRET
npm run dev        # port 5000
```

### 2. Frontend
```bash
cd frontend
npm install
npm start          # port 3000
```

### 3. Create Admin Account (first time only)
```bash
curl -X POST http://localhost:5000/api/auth/setup \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","email":"admin@nexvora.com","password":"YourPass123"}'
```
Then go to `http://localhost:3000/admin/login`

### 4. Add your assets
Copy to `frontend/public/assets/`:
- `logo.png` — your logo
- `Home.png` — hero image

---

## Enabling UPI Payments

1. In Admin Panel → **Payment Settings**
2. Toggle **UPI ENABLED** → ON
3. Enter your **UPI ID** (e.g. `nexvora@paytm` or `9949742547@ybl`)
4. Upload your UPI QR to [ImgBB](https://imgbb.com) or [Cloudinary](https://cloudinary.com) — paste URL
5. Save Changes

When a customer pays:
- They see the QR and UPI ID, click "Open UPI App"
- After paying, they enter their **UTR/Transaction ID**
- You see it in Orders → expand row → click **✅ Confirm UPI**

---

## Enabling Razorpay Payments

1. Sign up at [razorpay.com](https://razorpay.com)
2. Settings → API Keys → Copy Key ID + Key Secret
3. Admin Panel → Payment Settings → Razorpay → ON
4. Paste keys → Save
5. Toggle off Test Mode for live payments

---

## Portfolio Management

All your existing Drive videos are **pre-loaded**. To manage:
1. Admin Panel → **Portfolio** tab
2. Use filter buttons to see by category
3. **Priority**: set a number (higher = shown first on website)
4. **Visible**: toggle ON/OFF (hidden items stay in DB, not shown to public)
5. **Featured**: adds a gold "⭐ Featured" badge
6. **Add Item**: paste any Drive `/preview` link, Instagram URL, YouTube, or website URL

To get a Drive embed URL:
1. Open file in Google Drive → Share → Copy link
2. Change `/view?usp=sharing` → `/preview`
3. Paste in Admin → Source Type: Google Drive

---

## Production Deploy

### Backend (Railway / Render / DigitalOcean)
```env
PORT=5000
MONGO_URI=mongodb+srv://...   # MongoDB Atlas
JWT_SECRET=your_secret_key
CLIENT_URL=https://nexvoradigital.com
NODE_ENV=production
```

### Frontend (Vercel)
```env
REACT_APP_API_URL=https://your-backend.railway.app/api
```
Build: `npm run build` → deploy `build/` folder

