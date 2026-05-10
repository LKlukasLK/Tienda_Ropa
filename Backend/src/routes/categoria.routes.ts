import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// Obtener categorías con el conteo de productos activos
router.get('/', async (req, res) => {
  try {
    const categorias = await prisma.categoria.findMany({
      include: {
        _count: {
          select: { productos: true }
        }
      }
    });
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener categorías" });
  }
});

// Obtener una categoría por slug (para filtrar productos)
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const categoria = await prisma.categoria.findUnique({
      where: { slug },
      include: { productos: { where: { activo: true } } }
    });
    
    if (!categoria) return res.status(404).json({ message: "Categoría no encontrada" });
    res.json(categoria);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la categoría" });
  }
});

export default router;