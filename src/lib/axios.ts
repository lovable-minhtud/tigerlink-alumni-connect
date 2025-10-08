import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://10.1.11.26:8080';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for handling 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth state and redirect to login
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
