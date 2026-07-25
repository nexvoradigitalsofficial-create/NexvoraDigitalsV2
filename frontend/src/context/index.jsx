import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || '/api';

const SiteContext = createContext(null);

export function SiteProvider({ children }) {
  const [config, setConfig]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetchConfig = async () => {
    try {
      const { data } = await axios.get(`${API}/site/config`);
      setConfig(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchConfig(); }, []);

  const refresh = () => fetchConfig();

  return (
    <SiteContext.Provider value={{ config, loading, error, refresh }}>
      {children}
    </SiteContext.Provider>
  );
}

export const useSite = () => {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error('useSite must be used inside SiteProvider');
  return ctx;
};

// ─── Auth Context ─────────────────────────────────────────────
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    try { return JSON.parse(localStorage.getItem('nexvora_admin')); }
    catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem('nexvora_token') || null);

  const login = (adminData, tok) => {
    setAdmin(adminData);
    setToken(tok);
    localStorage.setItem('nexvora_admin', JSON.stringify(adminData));
    localStorage.setItem('nexvora_token', tok);
    axios.defaults.headers.common['Authorization'] = `Bearer ${tok}`;
  };

  const logout = () => {
    setAdmin(null);
    setToken(null);
    localStorage.removeItem('nexvora_admin');
    localStorage.removeItem('nexvora_token');
    delete axios.defaults.headers.common['Authorization'];
  };

  useEffect(() => {
    if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }, [token]);

  return (
    <AuthContext.Provider value={{ admin, token, login, logout, isLoggedIn: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
