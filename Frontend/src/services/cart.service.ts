import api from '../api/axios';

export const cartService = {
  getCart: async () => {
    const { data } = await api.get('/carrito');
    return data;
  },

  addToCart: async (varianteId: number, cantidad: number) => {
    const { data } = await api.post('/carrito', { varianteId, cantidad });
    return data;
  },

  removeItem: async (id: number) => {
    const { data } = await api.delete(`/carrito/${id}`);
    return data;
  },

  clearCart: async () => {
    const { data } = await api.delete('/carrito');
    return data;
  }
};