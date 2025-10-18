import axios, { AxiosError, type AxiosRequestConfig } from 'axios';

import { getAuthTokens, refreshToken } from './auth-client.ts';

export const baseURL = import.meta.env.VITE_API_URL;
export const webSocketURL = import.meta.env.VITE_API_WEB_SOCKET_URL;

interface RetryQueueItem {
  resolve: (value?: unknown) => void;
  reject: (error?: unknown) => void;
  config: AxiosRequestConfig;
}

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

let isRefreshing = false;
const refreshAndRetryQueue: RetryQueueItem[] = [];

const processQueue = (tokens: any, error: Error | null = null) => {
  refreshAndRetryQueue.forEach(({ config, resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      // Update the token in the request
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${tokens.idToken}`;
      // Retry the request
      api(config)
        .then(response => resolve(response))
        .catch(err => reject(err));
    }
  });
  refreshAndRetryQueue.length = 0;
};

// Request interceptor
api.interceptors.request.use(
  config => {
    const url = config.url ?? '';
    if (!url.endsWith('/login')) {
      const tokens = getAuthTokens();
      if (tokens?.idToken) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${tokens.idToken}`;
      }
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (originalRequest && error.response?.status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshResponse = await refreshToken();
          const { tokens, user } = refreshResponse.data;

          localStorage.setItem('authTokens', JSON.stringify(tokens));
          localStorage.setItem('userDetails', JSON.stringify({ user }));

          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${tokens.idToken}`;

          processQueue(tokens);

          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('authTokens');
          localStorage.removeItem('userDetails');

          processQueue(null, refreshError as Error);
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise((resolve, reject) => {
        refreshAndRetryQueue.push({
          config: originalRequest,
          resolve,
          reject,
        });
      });
    }

    return Promise.reject(error);
  }
);

export default api;
