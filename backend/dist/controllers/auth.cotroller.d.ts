import { Request, Response } from 'express';
export declare const authController: {
    register(req: Request, res: Response): Promise<void>;
    login(req: Request, res: Response): Promise<void>;
    refreshToken(req: Request, res: Response): Promise<void>;
    logout(req: Request, res: Response): Promise<void>;
    me(req: Request, res: Response): Promise<void>;
};
//# sourceMappingURL=auth.cotroller.d.ts.map