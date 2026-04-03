import axios from 'axios';
import tokenService from '../auth/tokenService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

const instance = axios.create({ baseURL: API_URL, withCredentials: true });

function getCookie(name: string) {
  const v = `; ${document.cookie}`;
  const parts = v.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()!.split(';').shift();
  return undefined;
}

let isRefreshing = false;
let refreshSubscribers: ((token: string | null) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string | null) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string | null) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

instance.interceptors.request.use((config) => {
  const token = tokenService.getToken();
  if (token && config.headers) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

instance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            if (token) {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
              resolve(instance(originalRequest));
            } else {
              resolve(Promise.reject(error));
            }
          });
        });
      }

      isRefreshing = true;
      try {
        const csrf = getCookie('csrfToken');
        const resp = await instance.post('/auth/refresh', null, { headers: { 'x-csrf-token': csrf || '' } });
        const newToken = resp.data.accessToken;
        tokenService.setToken(newToken);
        onRefreshed(newToken);
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return instance(originalRequest);
      } catch (e) {
        onRefreshed(null);
        tokenService.clearToken();
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
