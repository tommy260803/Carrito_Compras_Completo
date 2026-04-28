import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { requireRole } from '../middlewares/rbac.middleware';
import { carritoController } from '../controllers/carrito.controller';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(authenticate);
router.use(requireRole([2])); // solo clientes pueden tener carrito

router.get('/', asyncHandler(carritoController.obtenerCarrito));
router.post('/items', asyncHandler(carritoController.agregarItem));
router.put('/items/:itemId', asyncHandler(carritoController.actualizarItem));
router.delete('/items/:itemId', asyncHandler(carritoController.eliminarItem));
router.delete('/vaciar', asyncHandler(carritoController.vaciarCarrito));

export default router;