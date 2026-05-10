import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    nombre: z.string().min(2, "Nombre muy corto"),
    apellidos: z.string().min(2, "Apellidos muy cortos"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres")
  })
});