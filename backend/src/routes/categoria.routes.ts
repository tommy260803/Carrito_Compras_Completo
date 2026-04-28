import { Router } from 'express';
import { categoriaController } from '../controllers/categoria.controller';
import { verifyAccessToken } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/rbac.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/', asyncHandler(categoriaController.list));
router.get('/:id', asyncHandler(categoriaController.getById));
router.post('/', verifyAccessToken, requireRole([1]), asyncHandler(categoriaController.create));
router.put('/:id', verifyAccessToken, requireRole([1]), asyncHandler(categoriaController.update));
router.delete('/:id', verifyAccessToken, requireRole([1]), asyncHandler(categoriaController.delete));

export default router;
