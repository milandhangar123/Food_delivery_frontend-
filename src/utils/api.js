import axios from 'axios';

// Get API base URL from environment variable
// In production, set VITE_API_URL to your backend URL (e.g., https://api.yourdomain.com)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Set to true if using cookies
});

// Request interceptor - add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Support both 'token' header and 'Authorization' header
      config.headers.token = token;
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        isNetworkError: true,
      });
    }

    // Handle 401 Unauthorized - token expired or invalid
    if (error.response.status === 401) {
      localStorage.removeItem('token');
      // Redirect to login if not already there
      if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
        window.location.href = '/login';
      }
      return Promise.reject({
        message: 'Session expired. Please login again.',
        isAuthError: true,
      });
    }

    // Handle other errors
    const errorMessage = error.response?.data?.message || 'An error occurred';
    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

export default api;
export { API_BASE_URL };

