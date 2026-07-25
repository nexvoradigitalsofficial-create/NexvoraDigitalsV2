import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { SiteProvider, AuthProvider, useAuth } from './context';
import HomePage      from './pages/HomePage';
import PortfolioPage from './pages/PortfolioPage';
import AdminLogin    from './pages/AdminLogin';
import AdminPanel    from './pages/AdminPanel';
import PageLoader    from './components/PageLoader';
import ScrollProgress from './components/ScrollProgress';
import WhatsAppFloat from './components/WhatsAppFloat';
import CursorGlow    from './components/CursorGlow';
import './index.css';

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/admin/login" replace />;
}

function AppInner() {
  const { isLoggedIn } = useAuth();
  return (
    <>
      <Routes>
        <Route path="/"                    element={<HomePage />} />
        <Route path="/portfolio"           element={<PortfolioPage />} />
        <Route path="/portfolio/:category" element={<PortfolioPage />} />
        <Route path="/admin/login"         element={<AdminLogin />} />
        <Route path="/admin/*"             element={
          <ProtectedRoute><AdminPanel /></ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {/* WhatsApp float — hide on admin pages */}
      {!isLoggedIn && <WhatsAppFloat />}
    </>
  );
}

export default function App() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAppReady(true), 1600);
    return () => clearTimeout(t);
  }, []);

  return (
    <HelmetProvider>
      <AuthProvider>
        <SiteProvider>
          <BrowserRouter>
            {!appReady && <PageLoader />}
            <ScrollProgress />
            <CursorGlow />
            <AppInner />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'rgba(13,10,46,0.97)',
                  color: '#f0eee8',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(16px)',
                  fontSize: '0.88rem',
                  borderRadius: '12px',
                }
              }}
            />
          </BrowserRouter>
        </SiteProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}
