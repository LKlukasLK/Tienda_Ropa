import { Router } from 'express';
import { getPerfil, actualizarPerfil, cambiarPassword, agregarDireccion, eliminarDireccion, getWishlist, toggleWishlist } from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/perfil', authenticate, getPerfil);
router.patch('/perfil', authenticate, actualizarPerfil);
router.put('/password', authenticate, cambiarPassword);
router.post('/direcciones', authenticate, agregarDireccion);
router.delete('/direcciones/:id', authenticate, eliminarDireccion);
router.get('/wishlist', authenticate, getWishlist);
router.post('/wishlist', authenticate, toggleWishlist);

export default router;