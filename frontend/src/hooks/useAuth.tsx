import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { authApi } from '../lib/api';
import type { AdminUser } from '../types';

interface AuthContextType {
  admin: AdminUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

function parseJwt(token: string): AdminUser | null {
  try {
    const base64 = token.split('.')[1];
    const decoded = JSON.parse(atob(base64));
    // Check expiry
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      return null;
    }
    return { email: decoded.sub };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    const stored = localStorage.getItem('dc_admin_token');
    if (stored && parseJwt(stored)) return stored;
    localStorage.removeItem('dc_admin_token');
    return null;
  });

  const [admin, setAdmin] = useState<AdminUser | null>(() => {
    const stored = localStorage.getItem('dc_admin_token');
    return stored ? parseJwt(stored) : null;
  });

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    const { access_token } = res.data;
    localStorage.setItem('dc_admin_token', access_token);
    setToken(access_token);
    setAdmin(parseJwt(access_token));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('dc_admin_token');
    setToken(null);
    setAdmin(null);
  }, []);

  return (
    <AuthContext.Provider value={{ admin, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
