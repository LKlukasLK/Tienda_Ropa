import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import prisma from '../lib/prisma';


export const crearPedido = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { items, direccionEnvio } = req.body;
  // items: [{ varianteId: 1, cantidad: 2 }, ...]

  try {
    // Iniciamos una transacción interactiva
    const nuevoPedido = await prisma.$transaction(async (tx) => {
      let totalVenta = 0;

      // 1. Validar stock y calcular total
      for (const item of items) {
        const variante = await tx.varianteProducto.findUnique({
          where: { id: item.varianteId },
          include: { producto: true }
        });

        if (!variante || variante.stock < item.cantidad) {
          throw new Error(`Stock insuficiente para ${variante?.producto.nombre || 'el producto'}`);
        }

        // Sumar al total (usando el precio del producto en este momento)
        totalVenta += Number(variante.producto.precio) * item.cantidad;

        // 2. Restar stock
        await tx.varianteProducto.update({
          where: { id: item.varianteId },
          data: { stock: { decrement: item.cantidad } }
        });
      }

      // 3. Crear el Pedido
      const pedido = await tx.pedido.create({
        data: {
          nroPedido: `SHOP-${Date.now()}`, // Generamos un número único simple
          total: totalVenta,
          userId: userId!,
          // Snapshot de la dirección 
          envio_titulo: direccionEnvio.titulo,
          envio_calle: direccionEnvio.calle,
          envio_ciudad: direccionEnvio.ciudad,
          envio_codigoPostal: direccionEnvio.codigoPostal,
          // Crear los detalles (DetallePedido)
          detalles: {
            create: await Promise.all(items.map(async (item: any) => {
              const v = await tx.varianteProducto.findUnique({
                where: { id: item.varianteId },
                include: { producto: true }
              });
              return {
                varianteId: item.varianteId,
                cantidad: item.cantidad,
                precioUnit: v!.producto.precio
              };
            }))
          }
        }
      });
      return pedido;
    });

    res.status(201).json(nuevoPedido);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getMisPedidos = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const pedidos = await prisma.pedido.findMany({
      where: { userId: userId },
      include: {
        detalles: {
          include: {
            variante: {
              include: {
                producto: {
                  select: { nombre: true, imagen: true } // Para que el usuario vea qué compró
                }
              }
            }
          }
        },
        historial: true // Para ver si el pedido está pagado, enviado, etc.
      },
      orderBy: {
        createdAt: 'desc' // Los más recientes primero
      }
    });

    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el historial de pedidos" });
  }
};

export const actualizarEstadoPedido = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params; // ID del pedido
    const { nuevoEstado, nota } = req.body; // Ej: { nuevoEstado: 'ENVIADO', nota: 'Guía: 12345' }

    const pedidoActualizado = await prisma.pedido.update({
      where: { id: Number(id) },
      data: {
        estado: nuevoEstado,
        historial: {
          create: {
            estado: nuevoEstado,
            nota: nota
          }
        }
      }
    });

    res.json(pedidoActualizado);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el estado" });
  }
};
