import { Router } from 'express';
import { verifyAccessToken } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/rbac.middleware';
import { reportesController } from '../controllers/reportes.controller';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(verifyAccessToken);
router.use(requireRole([1]));

router.get('/ventas', asyncHandler(reportesController.ventasPDF));
router.get('/inventario', asyncHandler(reportesController.inventarioPDF));
router.get('/ordenes', asyncHandler(reportesController.ordenesPDF));
router.get('/pagos', asyncHandler(reportesController.pagosPDF));

export default router;
