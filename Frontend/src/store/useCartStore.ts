import { create } from 'zustand';
import { cartService } from '../services/cart.service';
import type { CartItem } from '../types';

interface CartState {
    items: CartItem[];
    loading: boolean;
    fetchCart: () => Promise<void>;
    addItem: (varianteId: number, cantidad: number) => Promise<void>;
    removeItem: (id: number) => Promise<void>;
    totalItems: () => number;
    totalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
    items: [],
    loading: false,

    fetchCart: async () => {
        try {
            const items = await cartService.getCart();
            set({ items });
        } catch (error) {
            // Si el error es 401 (no autorizado), vaciamos el carrito local
            set({ items: [] });
        }
    },

    addItem: async (varianteId, cantidad) => {
        try {
            // 1. Intentar guardar en el backend
            await cartService.addItem(varianteId, cantidad);

            // 2. Si tiene éxito, forzar la recarga del carrito para sincronizar
            const updatedItems = await cartService.getCart();
            set({ items: updatedItems });

        } catch (error: any) {
            // Solo mostramos error si realmente falla la autorización
            if (error.response?.status === 401) {
                alert("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
            } else {
                console.error("Error al añadir al carrito:", error);
            }
        }
    },

    removeItem: async (id) => {
        try {
            await cartService.removeItem(id);
            set({ items: get().items.filter(item => item.id !== id) });
        } catch (error) {
            console.error("Error al eliminar item", error);
        }
    },

    totalItems: () => {
        return get().items.reduce((acc, item) => acc + item.cantidad, 0);
    },

    totalPrice: () => {
        return get().items.reduce((acc, item) => {
            const precio = parseFloat(item.variante.producto.precio);
            return acc + (precio * item.cantidad);
        }, 0);
    }
}));