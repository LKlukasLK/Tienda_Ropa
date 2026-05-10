import { Router } from 'express';
import { getPerfil, agregarDireccion, eliminarDireccion, getWishlist, toggleWishlist } from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Ruta protegida: GET /api/usuarios/perfil
router.get('/perfil', authenticate, getPerfil);
router.post('/direcciones', authenticate, agregarDireccion);
router.delete('/direcciones/:id', authenticate, eliminarDireccion);
router.get('/wishlist', authenticate, getWishlist);
router.post('/wishlist', authenticate, toggleWishlist);

export default router;