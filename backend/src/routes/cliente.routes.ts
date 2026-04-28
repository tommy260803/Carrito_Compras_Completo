import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { requireAdmin, requireRole } from '../middlewares/rbac.middleware';
import { clienteController } from '../controllers/cliente.controller';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(authenticate);

// Admin
router.get('/admin', requireAdmin, asyncHandler(clienteController.listarAdmin));

// Cliente
router.use(requireRole([2]));

router.get('/me', asyncHandler(clienteController.me));
router.get('/historial-compras', asyncHandler(clienteController.historialCompras));

router.get('/direcciones', asyncHandler(clienteController.listarDirecciones));
router.post('/direcciones', asyncHandler(clienteController.crearDireccion));
router.put('/direcciones/:id', asyncHandler(clienteController.actualizarDireccion));
router.delete('/direcciones/:id', asyncHandler(clienteController.eliminarDireccion));

export default router;

