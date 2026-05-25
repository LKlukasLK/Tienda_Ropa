import api from '../api/axios';
import type { CartItem } from '../types/index';

export const cartService = {
  getCart: async (): Promise<CartItem[]> => {
    const { data } = await api.get('/carrito');
    return data;
  },

  addItem: async (varianteId: number, cantidad: number) => {
    const { data } = await api.post('/carrito', { varianteId, cantidad });
    return data;
  },

  removeItem: async (id: number) => {
    await api.delete(`/carrito/${id}`);
  },

  clearCart: async () => {
    await api.delete('/carrito');
  }
};