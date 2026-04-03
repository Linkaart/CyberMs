import { useState, useEffect } from 'react';
import api from '../api/apiClient';
import tokenService from '../auth/tokenService';

function getCookie(name: string) {
  const v = `; ${document.cookie}`;
  const parts = v.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()!.split(';').shift();
  return undefined;
}

export function useAuth() {
  const [isAuthenticated, setAuthenticated] = useState<boolean>(!!tokenService.getToken());
  const [isInitializing, setInitializing] = useState<boolean>(true);

  useEffect(() => {
    // on mount, try to refresh using httpOnly refresh cookie
    (async () => {
      try {
        const csrf = getCookie('csrfToken');
        const res = await api.post('/auth/refresh', null, { headers: { 'x-csrf-token': csrf || '' } });
        const token = res.data.accessToken;
        tokenService.setToken(token);
        setAuthenticated(true);
      } catch (e) {
        tokenService.clearToken();
        setAuthenticated(false);
      } finally {
        setInitializing(false);
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    const token = res.data.accessToken;
    // server sets refreshToken cookie; we store access token in memory
    tokenService.setToken(token);
    setAuthenticated(true);
    return res.data;
  };

  const logout = async () => {
    await api.post('/auth/logout').catch(() => {});
    tokenService.clearToken();
    setAuthenticated(false);
  };

  return { isAuthenticated, isInitializing, login, logout };
}
