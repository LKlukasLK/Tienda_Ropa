import api from '../api/axios';

export const authService = {
  login: async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    return data; // Devuelve { user, token }
  },
  
  register: async (userData: any) => {
    const { data } = await api.post('/auth/register', userData);
    return data;
  }
};