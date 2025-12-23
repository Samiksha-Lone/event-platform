import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://event-platform-upf6.onrender.com',  // HARDCODED
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

console.log('API_BASE_URL:', 'https://event-platform-upf6.onrender.com');
export default api;
