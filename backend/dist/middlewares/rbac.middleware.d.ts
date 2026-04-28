import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
export declare const requireRole: (allowedRoles: number[]) => (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const requireAdmin: (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=rbac.middleware.d.ts.map