import api from '../api/axios';
// import type { Producto } from '../types';

export const productService = {
  // Obtener todos con filtros opcionales
  getAll: async (params?: object) => {
    const { data } = await api.get('/productos', { params });
    return data; // Devuelve { info, resultados }
  },

  // Obtener opciones para filtros
  getFiltros: async () => {
    const { data } = await api.get('/productos/filtros');
    return data; // Devuelve { colores, tallas, precioMin, precioMax }
  },

  // Obtener uno por ID
  getById: async (id: string | number) => {
    const { data } = await api.get(`/productos/${id}`);
    return data;
  },

  // Obtener por SKU
  getBySku: async (sku: string) => {
    const { data } = await api.get(`/productos/buscar/${sku}`);
    return data;
  }
};