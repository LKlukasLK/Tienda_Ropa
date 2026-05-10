import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { stripe } from '../lib/stripe';

export const crearIntentoPago = async (req: Request, res: Response) => {
  try {
    const { pedidoId } = req.body;

    // 1. Buscar el pedido
    const pedido = await prisma.pedido.findUnique({
      where: { id: Number(pedidoId) },
      include: { user: true }
    });

    if (!pedido) return res.status(404).json({ error: "Pedido no encontrado" });

    // 2. Crear el intento de pago en Stripe
    // El total debe estar en céntimos (ej: 10.00€ -> 1000)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(pedido.total) * 100),
      currency: 'eur', // o 'usd', 'mxn', etc.
      automatic_payment_methods: { enabled: true },
      metadata: { pedidoId: pedido.id.toString() }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      total: pedido.total
    });

  } catch (error: any) {
    res.status(500).json({ error: "Error al procesar pago", detalle: error.message });
  }
};