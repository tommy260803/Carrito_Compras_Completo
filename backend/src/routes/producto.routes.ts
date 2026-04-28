import { Router } from 'express';
import { productoController } from '../controllers/producto.controller';
import { verifyAccessToken } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/rbac.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/', asyncHandler(productoController.list));
router.get('/:id', asyncHandler(productoController.getById));
router.post('/', verifyAccessToken, requireRole([1]), asyncHandler(productoController.create));
router.put('/:id', verifyAccessToken, requireRole([1]), asyncHandler(productoController.update));
router.delete('/:id', verifyAccessToken, requireRole([1]), asyncHandler(productoController.delete));

export default router;
