import axios from 'axios';

// Determine API base URL: prioritize env var, then check NODE_ENV for production
const getAPIBaseURL = () => {
  // First, check if VITE_API_URL is explicitly set in environment
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // For production builds deployed to Vercel, default to Render backend
  if (import.meta.env.PROD) {
    return 'https://event-platform-upf6.onrender.com';
  }

  // Development: use localhost
  return 'http://localhost:3000';
};

export const API_BASE_URL = getAPIBaseURL();

// Log API base URL for debugging (dev only)
if (import.meta.env.DEV) {
  console.log('API_BASE_URL:', API_BASE_URL);
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

export default api;
