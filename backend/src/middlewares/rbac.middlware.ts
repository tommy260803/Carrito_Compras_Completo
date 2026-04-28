import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';

export const requireRole = (allowedRoles: number[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ success: false, message: 'No autenticado' });
    if (!allowedRoles.includes(req.user.rol)) {
      return res.status(403).json({ success: false, message: 'Permisos insuficientes' });
    }
    next();
  };
};
