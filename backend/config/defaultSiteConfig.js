module.exports = {
  // ─── SEO / Meta ───────────────────────────────────────────────
  seo: {
    siteTitle: 'NexvoraDigital – Creative Design That Sells',
    metaDescription: 'NexvoraDigital is a full-spectrum digital marketing agency crafting scroll-stopping reels, stunning websites, and cinematic video edits that grow your brand online fast.',
    metaKeywords: 'digital marketing agency, instagram reels, website design, video editing, meta ads, poster design, content creation, Andhra Pradesh',
    ogImage: '/assets/og-image.jpg',
    twitterHandle: '@nexvora_digitals',
    canonicalUrl: 'https://nexvoradigital.com',
    schemaOrg: {
      name: 'NexvoraDigital',
      type: 'LocalBusiness',
      address: 'Kota, Andhra Pradesh, India',
      telephone: '+919949742547'
    }
  },

  // ─── Brand ────────────────────────────────────────────────────
  brand: {
    name: 'NexvoraDigital',
    logo: '/assets/logo.png',
    tagline: 'Creative Digital Solutions for Modern Brands',
    accentColor: '#ff9500',
    email: 'nexvoradigitalsofficial@gmail.com',
    phone1: '+91 99497 42547',
    phone2: '+91 94910 57500',
    location: 'Kota, Andhra Pradesh',
    instagram: 'https://www.instagram.com/nexvora_digitals_official',
    whatsapp: 'https://wa.me/9949742547?text=Hi%20Nexvora%20Digitals,%20I%20am%20interested%20in%20your%20services',
    youtube: '#'
  },

  // ─── Nav ──────────────────────────────────────────────────────
  nav: {
    links: [
      { label: 'HOME', href: '#home' },
      { label: 'ABOUT US', href: '#about' },
      { label: 'SERVICES', href: '#services' },
      { label: 'TEAM', href: '#team' },
      { label: 'ORDER', href: '#order' },
      { label: 'CONTACT', href: '#contact' }
    ],
    ctaLabel: "Let's Talk"
  },

  // ─── Hero Section ─────────────────────────────────────────────
  hero: {
    visible: true,
    tagline: 'DIGITAL MARKETING AGENCY',
    title: 'CREATIVE\nDESIGN\nTHAT SELLS',
    accentWord: 'THAT SELLS',
    body: 'We craft scroll-stopping reels, stunning websites, and cinematic video edits that grow your brand online — fast.',
    primaryBtn: 'Our Services',
    secondaryBtn: 'Contact',
    heroImage: '/assets/Home.png',
    stats: [
      { num: '200+', label: 'Projects Done', visible: false },
      { num: '98%', label: 'Client Satisfaction', visible: false },
      { num: '5+', label: 'Years Experience', visible: false }
    ]
  },

  // ─── About Section ────────────────────────────────────────────
  about: {
    visible: true,
    label: 'WHO WE ARE',
    title: 'WE BUILD\nBRANDS THAT\nDOMINATE',
    accentWord: 'DOMINATE',
    body1: 'NEXVORA-DIGITALS is a full-spectrum digital marketing agency built for the attention economy. We don\'t just make content — we engineer growth.',
    body2: 'From viral Instagram Reels to high-converting websites and cinematic video edits, every pixel we produce is crafted with one goal: results.',
    ctaLabel: 'See Our Work',
    badges: [
      { icon: '🎯', text: 'Strategy First' },
      { icon: '🚀', text: 'Fast Delivery' },
      { icon: '✨', text: 'Premium Quality' },
      { icon: '📈', text: 'Growth Focused' },
      { icon: '🤝', text: 'Client Support' }
    ]
  },

  // ─── Services Section ─────────────────────────────────────────
  services: {
    visible: true,
    label: 'WHAT WE DO',
    title: 'OUR SERVICES',
    subtitle: 'Everything your brand needs to grow in the digital world.',
    items: [
      {
        id: 'reels',
        icon: 'instagram',
        title: 'Instagram Reels',
        description: 'Scroll-stopping short-form video content crafted to go viral and grow your following organically.',
        projectLink: '/projects/reels',
        visible: true
      },
      {
        id: 'websites',
        icon: 'browser',
        title: 'Website Design',
        description: 'High-converting, blazing-fast websites that reflect your brand and turn visitors into customers.',
        projectLink: '/projects/website',
        visible: true
      },
      {
        id: 'video',
        icon: 'video',
        title: 'Video Editing',
        description: 'Cinematic edits with motion graphics, color grading, and sound design that captivate your audience.',
        projectLink: '/projects/videos',
        visible: true
      },
      {
        id: 'meta',
        icon: 'meta',
        title: 'Meta Ads',
        description: 'High-converting Facebook & Instagram ad campaigns designed to maximize ROI and drive targeted traffic.',
        projectLink: null,
        visible: true
      },
      {
        id: 'poster',
        icon: 'poster',
        title: 'Poster Design',
        description: 'Eye-catching posters and creatives that communicate your brand message clearly and attract attention instantly.',
        projectLink: '/projects/poster',
        visible: true
      },
      {
        id: 'content',
        icon: 'content',
        title: 'Content Creation',
        description: 'Engaging and strategic content tailored to your audience to boost brand presence and engagement.',
        projectLink: '/projects/content',
        visible: true
      }
    ]
  },

  // ─── Team Section ─────────────────────────────────────────────
  team: {
    visible: true,
    title: 'Our Team',
    members: [
      {
        id: 'nithin',
        name: 'Nithin B',
        role: 'Founder & Video Editor',
        bio: 'Crafting high-quality reels and videos that capture attention and drive engagement. Focused on storytelling, editing precision, and delivering visually impactful content for brands.',
        avatar: '/assets/Nithin.jpeg',
        reversed: false
      },
      {
        id: 'ganesh',
        name: 'Ganesh A',
        role: 'Co-Founder & Web Developer',
        bio: 'Building fast, modern, and responsive websites that enhance user experience and business growth. Passionate about clean design, performance, and scalable digital solutions.',
        avatar: '/assets/Gani.jpeg',
        reversed: true
      }
    ]
  },

  // ─── Order Section ────────────────────────────────────────────
  order: {
    visible: true,
    title: 'ORDER A SERVICE',
    subtitle: 'Ready to grow? Place your order and we\'ll reach out within 24 hours.',
    packages: [
      {
        id: 'starter',
        name: 'Starter Pack',
        price: 4999,
        currency: 'INR',
        description: 'Perfect for small businesses getting started.',
        features: ['5 Instagram Reels', '2 Poster Designs', 'Basic Content Plan', '24/7 Support'],
        popular: false,
        visible: true
      },
      {
        id: 'growth',
        name: 'Growth Pack',
        price: 9999,
        currency: 'INR',
        description: 'For brands ready to scale their digital presence.',
        features: ['10 Instagram Reels', '5 Poster Designs', 'Meta Ads Campaign', 'Website Landing Page', 'Content Strategy', '24/7 Priority Support'],
        popular: true,
        visible: true
      },
      {
        id: 'premium',
        name: 'Premium Pack',
        price: 19999,
        currency: 'INR',
        description: 'Full-spectrum digital domination for serious brands.',
        features: ['20 Instagram Reels', '10 Poster Designs', 'Full Meta Ads Management', 'Complete Website', 'Video Editing (4 videos)', 'Monthly Content Calendar', 'Dedicated Account Manager'],
        popular: false,
        visible: true
      }
    ]
  },

  // ─── Contact Section ──────────────────────────────────────────
  contact: {
    visible: true,
    label: 'GET IN TOUCH',
    title: 'LET\'S BUILD\nSOMETHING GREAT',
    subtitle: 'Ready to grow your brand? Drop us a message and we\'ll get back to you within 24 hours.',
    formspreeId: 'xyklqbkj',
    services: ['Instagram Reels', 'Website Design', 'Video Editing', 'Meta Ads', 'Poster Design', 'Content Creation', 'Full Package']
  },

  // ─── Footer ───────────────────────────────────────────────────
  footer: {
    tagline: 'Creative digital solutions for modern brands.',
    copyright: '© 2026 NexvoraDigital. All rights reserved.'
  },

  // ─── Payment Settings ─────────────────────────────────────────
  payment: {
    enabled: false,
    // Razorpay
    razorpayKeyId: '',
    razorpayKeySecret: '',
    currency: 'INR',
    testMode: true,
    displayNote: 'Secure payment powered by Razorpay',
    // UPI
    upiEnabled: false,
    upiId: '',          // e.g. nexvora@upi
    upiName: 'NexvoraDigital',
    upiQrImage: ''      // URL to QR image (upload to Cloudinary or paste base64)
  }
};
