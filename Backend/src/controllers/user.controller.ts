import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';

export const getPerfil = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const usuario = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nombre: true,
        apellidos: true,
        email: true,
        rol: true,
        telefono: true,
        avatar: true,
        createdAt: true,
        direcciones: true, // Incluimos sus direcciones guardadas
        _count: {
          select: { pedidos: true } // Contamos cuántos pedidos ha hecho
        }
      }
    });

    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el perfil" });
  }
};

export const agregarDireccion = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { titulo, calle, ciudad, codigoPostal, referencia } = req.body;

    const nuevaDireccion = await prisma.direccion.create({
      data: {
        titulo,
        calle,
        ciudad,
        codigoPostal,
        referencia,
        userId: userId!
      }
    });

    res.status(201).json(nuevaDireccion);
  } catch (error) {
    res.status(500).json({ error: "Error al crear la dirección" });
  }
};

export const eliminarDireccion = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    // Verificar que la dirección existe y pertenece al usuario
    const direccion = await prisma.direccion.findFirst({
      where: {
        id: Number(id),
        userId: userId
      }
    });

    if (!direccion) {
      return res.status(404).json({ message: "Dirección no encontrada o no tienes permiso" });
    }

    await prisma.direccion.delete({
      where: { id: Number(id) }
    });

    res.json({ message: "Dirección eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la dirección" });
  }
};

export const actualizarPerfil = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { nombre, apellidos, email, telefono } = req.body;

    if (email) {
      const exists = await prisma.user.findFirst({
        where: { email, NOT: { id: userId } }
      });
      if (exists) return res.status(400).json({ error: "El email ya está en uso" });
    }

    const usuario = await prisma.user.update({
      where: { id: userId },
      data: { nombre, apellidos, email, telefono },
      select: { id: true, nombre: true, apellidos: true, email: true, telefono: true, rol: true, avatar: true }
    });

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el perfil" });
  }
};

export const cambiarPassword = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { passwordActual, passwordNueva } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(passwordActual, user.password);
    if (!isMatch) return res.status(400).json({ error: "La contraseña actual no es correcta" });

    const hashedPassword = await bcrypt.hash(passwordNueva, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al cambiar la contraseña" });
  }
};

export const toggleWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { productoId } = req.body;

    // 1. Verificar si ya está en favoritos
    const existente = await prisma.wishlistItem.findUnique({
      where: {
        userId_productoId: {
          userId: userId!,
          productoId: Number(productoId)
        }
      }
    });

    if (existente) {
      // Si ya existe, lo quitamos (Toggle)
      await prisma.wishlistItem.delete({
        where: { id: existente.id }
      });
      return res.json({ message: "Eliminado de favoritos" });
    }

    // Si no existe, lo agregamos
    const nuevoItem = await prisma.wishlistItem.create({
      data: {
        userId: userId!,
        productoId: Number(productoId)
      }
    });

    res.status(201).json({ message: "Agregado a favoritos", nuevoItem });
  } catch (error) {
    res.status(500).json({ error: "Error al gestionar favoritos" });
  }
};

export const getWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const wishlist = await prisma.wishlistItem.findMany({
      where: { userId },
      include: { producto: true }
    });
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener favoritos" });
  }
};