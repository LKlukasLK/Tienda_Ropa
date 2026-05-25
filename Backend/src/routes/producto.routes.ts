import { Router } from 'express';
import prisma from "../lib/prisma";
import { crearProducto, getProductos, subirGaleriaProducto, eliminarProducto, getProductoById, getProductoBySku, getOpcionesFiltro } from '../controllers/producto.controller'; // Importar el controlador
import { authenticate, isAdmin } from '../middlewares/auth.middleware'; // Importar seguridad
import { upload } from '../middlewares/upload.middleware'; 
import { createProductoSchema } from '../schemas/producto.schema';
import { validate } from '../middlewares/validate.middleware';

const router = Router();

// --- RUTAS PÚBLICAS ---

// Obtener todos los productos
router.get('/filtros', getOpcionesFiltro);

router.get('/', getProductos);

// Obtener por ID (número) -> GET /api/productos/1
router.get('/:id', getProductoById);

router.get('/buscar/:sku', getProductoBySku);


// --- RUTAS PRIVADAS (ADMIN) ---

// 3. Crear un producto
router.post('/', authenticate, isAdmin,  validate(createProductoSchema), crearProducto);

// 5. Subir galería de imágenes (múltiples - array)
router.post('/:id/galeria', authenticate, isAdmin, upload.array('fotos', 5), subirGaleriaProducto);

// 6. Eliminar un producto (Soft Delete)
// IMPORTANTE: Se usa el método DELETE y se requiere el ID en la URL
router.delete('/:id', authenticate, isAdmin, eliminarProducto);
export default router;