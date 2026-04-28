import { Request, Response } from 'express';
export declare const ordenController: {
    crear(req: Request, res: Response): Promise<void>;
    listarMisOrdenes(req: Request, res: Response): Promise<void>;
    obtenerDetalle(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    cambiarEstado(req: Request, res: Response): Promise<void>;
    listar(req: Request, res: Response): Promise<void>;
    obtener(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    listarEstados(req: Request, res: Response): Promise<void>;
};
//# sourceMappingURL=orden.controller.d.ts.map