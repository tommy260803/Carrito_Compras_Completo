import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { requireRole } from '../middlewares/rbac.middleware';
import { wishlistController } from '../controllers/wishlist.controller';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(authenticate);
router.use(requireRole([2]));

router.get('/', asyncHandler(wishlistController.obtener));
router.post('/items', asyncHandler(wishlistController.agregar));
router.delete('/items/:productoId', asyncHandler(wishlistController.quitar));

export default router;

