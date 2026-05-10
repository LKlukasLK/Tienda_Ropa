import { Router } from 'express';
import { crearIntentoPago } from '../controllers/pago.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/crear-intento', authenticate, crearIntentoPago);

export default router;