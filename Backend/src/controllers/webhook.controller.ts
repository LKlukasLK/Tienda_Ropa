import { Request, Response } from 'express';
import { stripe } from '../lib/stripe';
import prisma from '../lib/prisma';

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!endpointSecret) {
    console.error("❌ Falta STRIPE_WEBHOOK_SECRET en las variables de entorno");
    return res.status(500).send("Configuración del servidor incompleta");
  }

  let event;

  try {
    // Verificamos que la petición sea realmente de Stripe usando la firma
    // req.body aquí es el formato "raw" gracias a la configuración de index.ts
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err: any) {
    console.error(`⚠️ Error de firma en Webhook: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Manejamos el evento de pago exitoso
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as any;
    
    // Recuperamos el ID del pedido que guardamos en los metadatos al crear el intento
    const pedidoId = paymentIntent.metadata.pedidoId;

    if (pedidoId) {
      console.log(`✅ ¡Pago confirmado para el pedido #${pedidoId}! Actualizando base de datos...`);

      try {
        await prisma.pedido.update({
          where: { id: Number(pedidoId) },
          data: { 
            estado: 'PAGADO',
            metodoPago: 'STRIPE'
          }
        });
        console.log(`📱 Pedido #${pedidoId} marcado como PAGADO.`);
      } catch (dbError) {
        console.error("❌ Error al actualizar el pedido en la base de datos:", dbError);
      }
    }
  }

  // Respondemos a Stripe con un 200 para que sepa que recibimos el aviso
  res.json({ received: true });
};