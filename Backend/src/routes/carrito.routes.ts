import { Router } from 'express';
import { 
  getCarrito, 
  agregarAlCarrito, 
  eliminarDelCarrito, 
  vaciarCarrito 
} from '../controllers/carrito.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Todas las rutas de carrito requieren estar logueado
router.use(authenticate);

router.get('/', getCarrito);
router.post('/', agregarAlCarrito);
router.delete('/:id', eliminarDelCarrito);
router.delete('/', vaciarCarrito);

export default router;