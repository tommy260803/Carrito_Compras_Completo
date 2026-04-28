import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { requireAdmin, requireRole } from '../middlewares/rbac.middleware';
import { pagoController } from '../controllers/pago.controller';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(authenticate);

// Cliente
router.post('/', requireRole([2]), asyncHandler(pagoController.registrar));
router.get('/orden/:ordenId', requireRole([2]), asyncHandler(pagoController.listarPorOrden));

// Admin
router.get('/', requireAdmin, asyncHandler(pagoController.listarAdmin));

export default router;

