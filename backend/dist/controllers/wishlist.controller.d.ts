import { Request, Response } from 'express';
export declare const wishlistController: {
    obtener(req: Request, res: Response): Promise<void>;
    agregar(req: Request, res: Response): Promise<void>;
    quitar(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
};
//# sourceMappingURL=wishlist.controller.d.ts.map