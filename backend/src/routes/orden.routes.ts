import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { requireAdmin, requireRole } from '../middlewares/rbac.middleware';
import { ordenController } from '../controllers/orden.controller';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(authenticate);

// Cliente (shop)
router.post('/', requireRole([2]), asyncHandler(ordenController.crear));
router.get('/mis-ordenes', requireRole([2]), asyncHandler(ordenController.listarMisOrdenes));
router.get('/mis-ordenes/:id', requireRole([2]), asyncHandler(ordenController.obtenerDetalle));

// Admin
router.get('/', requireAdmin, asyncHandler(ordenController.listar));
router.get('/estados', requireAdmin, asyncHandler(ordenController.listarEstados));
router.get('/:id', requireAdmin, asyncHandler(ordenController.obtener));
router.put('/:id/estado', requireAdmin, asyncHandler(ordenController.cambiarEstado));

export default router;

