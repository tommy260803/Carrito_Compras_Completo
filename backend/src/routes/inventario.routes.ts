import { Router } from 'express';
import { verifyAccessToken } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/rbac.middleware';
import { inventarioController } from '../controllers/inventario.controller';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(verifyAccessToken);
router.use(requireRole([1]));

router.get('/', asyncHandler(inventarioController.list));
router.get('/stock-bajo', asyncHandler(inventarioController.stockBajo));
router.get('/agotados', asyncHandler(inventarioController.agotados));
router.get('/movimientos', asyncHandler(inventarioController.movimientos));
router.put('/stock/:productoId', asyncHandler(inventarioController.ajustarStock));
router.put('/stock-minimo/:productoId', asyncHandler(inventarioController.actualizarStockMinimo));

export default router;

