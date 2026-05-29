import axios from 'axios';

// Local: http://localhost:8888/vems-backend/api  (MAMP port 8888)
// Local: http://localhost/vems-backend/api       (MAMP port 80)
// Production: set VITE_API_URL in .env file
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8888/vems-backend/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('vems_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('vems_user');
      localStorage.removeItem('vems_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
