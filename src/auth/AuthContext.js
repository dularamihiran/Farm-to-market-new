// Local (self-hosted) authentication. Exposes an API compatible with the
// previous Auth0 hook so existing components keep working unchanged.
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { API_URL } from '../config/apiBase';

const SESSION_KEY = 'harvest_session';
const API = `${API_URL}/api/auth`;

const AuthContext = createContext(null);

const readSession = () => {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY)) || null;
  } catch {
    return null;
  }
};

const applySession = (session) => {
  if (session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    localStorage.setItem('userRole', session.user.role);
    localStorage.setItem('user_id', session.user.sub);
    localStorage.setItem('user_email', session.user.email);
  } else {
    ['harvest_session', 'userRole', 'user_id', 'user_email', 'merchantDetails'].forEach((k) =>
      localStorage.removeItem(k)
    );
  }
};

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    const s = readSession();
    if (s) applySession(s);
    return s;
  });

  const request = useCallback(async (path, body) => {
    const res = await fetch(`${API}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || 'Request failed');
    applySession(data);
    setSession(data);
    return data.user;
  }, []);

  const value = useMemo(
    () => ({
      isLoading: false,
      isAuthenticated: !!session,
      user: session ? session.user : undefined,
      login: (email, password) => request('/login', { email, password }),
      register: (payload) => request('/register', payload),
      loginWithRedirect: () => {
        window.location.href = '/login';
      },
      logout: (opts = {}) => {
        applySession(null);
        setSession(null);
        const target = opts.returnTo || (opts.logoutParams && opts.logoutParams.returnTo) || '/login';
        window.location.href = target;
      },
      getAccessTokenSilently: async () => (session ? session.token : ''),
      getIdTokenClaims: async () => (session ? { ...session.user } : undefined)
    }),
    [session, request]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Same name as the Auth0 hook so existing imports only need a path change.
export function useAuth0() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth0 must be used inside AuthProvider');
  return ctx;
}
