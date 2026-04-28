import { Router } from 'express';
import { verifyAccessToken } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/rbac.middleware';
import { reporteController } from '../controllers/reporte.controller';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(verifyAccessToken);
router.use(requireRole([1]));

router.get('/kpis', asyncHandler(reporteController.kpis));
router.get('/ventas-diarias', asyncHandler(reporteController.ventasDiarias));
router.get('/ventas-por-categoria', asyncHandler(reporteController.ventasPorCategoria));
router.get('/productos-mas-vendidos', asyncHandler(reporteController.productosMasVendidos));

export default router;

