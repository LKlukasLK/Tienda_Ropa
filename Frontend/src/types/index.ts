export type Producto = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string;
  sku: string;
  imagen: string | null;
  categoria: {
    nombre: string;
    slug: string;
  };
  variantes: Array<{
    id: number;
    talla: string;
    color: string;
    stock: number;
  }>;
};

export interface CartItem {
  id: number;
  cantidad: number;
  varianteId: number;
  variante: {
    id: number;
    talla: string;
    color: string;
    producto: {
      nombre: string;
      precio: string;
      imagen: string | null;
    }
  }
}