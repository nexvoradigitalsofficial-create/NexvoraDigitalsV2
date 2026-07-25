import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSite } from '../context';
import Navbar from '../components/Navbar';
import { AboutSection, ServicesSection, TeamSection } from '../components/sections/AboutSection';
import HeroSection from '../components/sections/HeroSection';
import OrderSection from '../components/sections/OrderSection';
import ContactSection from '../components/sections/ContactSection';
import Footer from '../components/Footer';

export default function HomePage() {
  const { config, loading } = useSite();
  const seo   = config?.seo   || {};
  const brand = config?.brand || {};

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": brand.name || 'NexvoraDigitals',
    "description": seo.metaDescription || '',
    "url": seo.canonicalUrl || 'https://nexvoradigital.com',
    "telephone": brand.phone1 || '',
    "address": { "@type": "PostalAddress", "addressLocality": "Kota", "addressRegion": "Andhra Pradesh", "addressCountry": "IN" },
    "sameAs": [brand.instagram, brand.whatsapp].filter(Boolean)
  };

  useEffect(() => {
    if (config?.payment?.enabled && config?.payment?.razorpayKeyId) {
      window.__RAZORPAY_KEY__ = config.payment.razorpayKeyId;
    }
  }, [config]);

  if (loading) return null;

  return (
    <>
      <Helmet>
        <title>{seo.siteTitle || 'NexvoraDigitals – Creative Design That Sells'}</title>
        <meta name="description" content={seo.metaDescription || ''} />
        <meta name="keywords" content={seo.metaKeywords || ''} />
        <meta property="og:title" content={seo.siteTitle || 'NexvoraDigital'} />
        <meta property="og:description" content={seo.metaDescription || ''} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={seo.canonicalUrl || ''} />
        {seo.ogImage && <meta property="og:image" content={seo.ogImage} />}
        <meta name="twitter:card" content="summary_large_image" />
        {seo.twitterHandle && <meta name="twitter:site" content={seo.twitterHandle} />}
        <meta name="robots" content="index, follow" />
        {seo.canonicalUrl && <link rel="canonical" href={seo.canonicalUrl} />}
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>
      <Navbar />
      <main>
        {config?.hero?.visible    !== false && <HeroSection />}
        {config?.about?.visible   !== false && <AboutSection />}
        {config?.services?.visible !== false && <ServicesSection />}
        {config?.team?.visible    !== false && <TeamSection />}
        {config?.order?.visible   !== false && <OrderSection />}
        {config?.contact?.visible !== false && <ContactSection />}
      </main>
      <Footer />
    </>
  );
}
