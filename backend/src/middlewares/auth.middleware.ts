import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';

export interface AuthRequest extends Request {
  user?: { id: number; email: string; rol: number };
}

export const verifyAccessToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.JWT_ACCESS_SECRET) as any;
    req.user = { id: decoded.id, email: decoded.email, rol: decoded.rol };
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Token inválido o expirado' });
  }
};
