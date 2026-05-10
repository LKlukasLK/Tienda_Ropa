import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import prisma from '../lib/prisma';

// 1. Obtener el carrito del usuario logueado
export const getCarrito = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const items = await prisma.carritoItem.findMany({
      where: { userId: userId },
      include: {
        variante: {
          include: {
            producto: true // Traemos los datos del producto (nombre, precio, imagen)
          }
        }
      }
    });

    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el carrito" });
  }
};

// 2. Agregar o actualizar cantidad en el carrito
export const agregarAlCarrito = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { varianteId, cantidad } = req.body;

    // Buscamos si el item ya existe en el carrito del usuario
    const itemExistente = await prisma.carritoItem.findUnique({
      where: {
        userId_varianteId: {
          userId: userId!,
          varianteId: varianteId
        }
      }
    });

    if (itemExistente) {
      // Si ya existe, actualizamos la cantidad
      const itemActualizado = await prisma.carritoItem.update({
        where: { id: itemExistente.id },
        data: { cantidad: itemExistente.cantidad + cantidad }
      });
      return res.json(itemActualizado);
    }

    // Si no existe, lo creamos
    const nuevoItem = await prisma.carritoItem.create({
      data: {
        userId: userId!,
        varianteId: varianteId,
        cantidad: cantidad
      }
    });

    res.status(201).json(nuevoItem);
  } catch (error) {
    res.status(500).json({ error: "Error al agregar al carrito" });
  }
};

// 3. Eliminar un item del carrito
export const eliminarDelCarrito = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    // Verificamos que el item pertenezca al usuario
    const item = await prisma.carritoItem.findFirst({
      where: { id: Number(id), userId: userId }
    });

    if (!item) return res.status(404).json({ message: "Item no encontrado" });

    await prisma.carritoItem.delete({ where: { id: Number(id) } });

    res.json({ message: "Item eliminado del carrito" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar item" });
  }
};

// 4. Vaciar carrito completo (útil después de comprar)
export const vaciarCarrito = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    await prisma.carritoItem.deleteMany({ where: { userId: userId } });
    res.json({ message: "Carrito vaciado" });
  } catch (error) {
    res.status(500).json({ error: "Error al vaciar carrito" });
  }
};