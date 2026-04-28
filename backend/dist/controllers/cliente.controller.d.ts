import { Request, Response } from 'express';
export declare const clienteController: {
    listarAdmin(req: Request, res: Response): Promise<void>;
    me(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    listarDirecciones(req: Request, res: Response): Promise<void>;
    crearDireccion(req: Request, res: Response): Promise<void>;
    actualizarDireccion(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    eliminarDireccion(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    historialCompras(req: Request, res: Response): Promise<void>;
};
//# sourceMappingURL=cliente.controller.d.ts.map