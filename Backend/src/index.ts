import express from 'express';
import productoRoutes from './routes/producto.routes'; // La que ya tenías
import authRoutes from './routes/auth.routes';
import categoriaRoutes from './routes/categoria.routes';
import pedipedidoRoutes  from "./routes/pedido.routes"
import userRoutes  from "./routes/user.routes"
import carritoRoutes  from "./routes/carrito.routes"
import {globalErrorHandler}  from "./middlewares/error.middleware"

const app = express();
app.use(express.json()); // Importante para recibir JSON en el body

// Rutas
app.use('/api/productos', productoRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use("/api/pedidos", pedipedidoRoutes);
app.use("/api/usarios", userRoutes);
app.use("/api/carrito", carritoRoutes);

//* Control de errores
app.use(globalErrorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor listo en http://localhost:${PORT}`);
});