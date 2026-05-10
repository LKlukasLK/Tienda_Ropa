import { z } from 'zod';

export const createProductoSchema = z.object({
  body: z.object({
    nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    descripcion: z.string().optional(),
    precio: z.number().positive("El precio debe ser un número positivo"),
    sku: z.string().min(4, "El SKU debe tener al menos 4 caracteres"),
    categoriaId: z.number().int().positive("ID de categoría inválido"),
    variantes: z.array(z.object({
      talla: z.string().min(1, "Talla requerida"),
      color: z.string().min(3, "Color requerido"),
      stock: z.number().int().min(0, "El stock no puede ser negativo")
    })).min(1, "Debe tener al menos una variante")
  })
});