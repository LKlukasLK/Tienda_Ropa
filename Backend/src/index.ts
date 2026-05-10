import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import cors from 'cors';

// Rutas
import productoRoutes from './routes/producto.routes';
import authRoutes from './routes/auth.routes';
import categoriaRoutes from './routes/categoria.routes';
import pedidoRoutes from "./routes/pedido.routes"
import userRoutes from "./routes/user.routes"
import carritoRoutes from "./routes/carrito.routes"
import pagoRoutes from "./routes/pago.routes"

// Middlewares y controloes
import { globalErrorHandler } from "./middlewares/error.middleware"
import { handleStripeWebhook } from './controllers/webhook.controller';

export const app = express();
// Seguridad basica
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Vite usa 5173 por defecto
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true // Permite enviar cookies o headers de autorización
}));

// LIMITADOR GLOBAL DE PETICIONES ---
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  limit: 100, // Máximo 100 peticiones por IP cada 15 min
  message: { mensaje: "Demasiadas peticiones. Intenta más tarde." },
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});
app.use(globalLimiter);

// Bloquea IPs que intentan adivinar contraseñas
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  limit: 10, // Solo 10 intentos de login/registro por hora
  message: { mensaje: "Demasiados intentos. Por seguridad, espera una hora." },
});

// --- APLICAR LIMITADOR DE AUTH ---
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);


// 3. CONFIGURACIÓN DE WEBHOOKS (¡DEBE IR ANTES DE express.json!)
// Stripe necesita los datos en formato RAW para verificar la firma
app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }), handleStripeWebhook);


// 4. PARSEO DE JSON (Para el resto de rutas)
app.use(express.json());


// 5. REGISTRO DE RUTAS
app.use('/api/productos', productoRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use("/api/pedidos", pedidoRoutes);
app.use("/api/usuarios", userRoutes);
app.use("/api/carrito", carritoRoutes);
app.use('/api/pagos', pagoRoutes);


// 6. CONTROL DE ERRORES GLOBAL (Siempre al final)
app.use(globalErrorHandler);


// 7. INICIO DEL SERVIDOR
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor listo en http://localhost:${PORT}`);
  });
}