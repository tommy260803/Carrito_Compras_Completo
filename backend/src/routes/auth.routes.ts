import { Router } from 'express';
import { authController } from '../controllers/auth.cotroller';
import { authenticate } from '../middlewares/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/register', asyncHandler(authController.register));
router.post('/login', asyncHandler(authController.login));
router.post('/refresh', asyncHandler(authController.refreshToken));
router.post('/logout', asyncHandler(authController.logout));
router.get('/me', authenticate, asyncHandler(authController.me));
// compat frontend
router.get('/profile', authenticate, asyncHandler(authController.me));

export default router;