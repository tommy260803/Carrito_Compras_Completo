import { Request, Response } from 'express';
export declare const inventarioController: {
    list(req: Request, res: Response): Promise<void>;
    stockBajo(req: Request, res: Response): Promise<void>;
    agotados(req: Request, res: Response): Promise<void>;
    movimientos(req: Request, res: Response): Promise<void>;
    ajustarStock(req: Request, res: Response): Promise<void>;
    actualizarStockMinimo(req: Request, res: Response): Promise<void>;
};
//# sourceMappingURL=inventario.controller.d.ts.map