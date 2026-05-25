import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});
api.interceptors.request.use((config) => {
  // Buscamos el token justo antes de que salga la petición
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
export default api;