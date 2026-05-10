import { Router } from 'express';
import { crearPedido, getMisPedidos, actualizarEstadoPedido } from '../controllers/pedido.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { isAdmin } from '../middlewares/auth.middleware';



const router = Router();

// Solo usuarios logueados pueden comprar
router.post('/', authenticate, crearPedido);

// Obtener pedidos del usuario logueado
router.get('/mis-pedidos', authenticate, getMisPedidos);
export default router;

router.patch('/:id/estado', authenticate, isAdmin, actualizarEstadoPedido);
