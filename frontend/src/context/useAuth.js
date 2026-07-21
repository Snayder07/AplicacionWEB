import { useState, useCallback } from 'react';

const STORAGE_KEY = 'rgbr_auth';

export function useAuth() {
  const [usuario, setUsuario] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        return data.usuario || null;
      } catch { return null; }
    }
    return null;
  });

  const isAuthenticated = useCallback(() => {
    return !!usuario;
  }, [usuario]);

  const login = useCallback((user) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ usuario: user, loggedInAt: Date.now() }));
    setUsuario(user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUsuario(null);
  }, []);

  return { usuario, isAuthenticated, login, logout };
}
