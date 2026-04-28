import { Request, Response } from 'express';
import { productoService } from '../services/producto.service';
import { createProductoSchema } from '../schemas/producto.schema';

export const productoController = {
  async list(req: Request, res: Response) {
    const { page = 1, limit = 12, ...filters } = req.query;
    const result = await productoService.list({
      page: Number(page),
      limit: Number(limit),
      filters,
    });
    res.json({ success: true, data: result });
  },

  async create(req: Request, res: Response) {
    const validated = createProductoSchema.parse(req.body);
    const newProducto = await productoService.create(validated, req.user!.id);
    res.status(201).json({ success: true, data: newProducto });
  },

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const producto = await productoService.getById(Number(id));
    res.json({ success: true, data: producto });
  },

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const validated = createProductoSchema.parse(req.body);
    const updatedProducto = await productoService.update(Number(id), validated, req.user!.id);
    res.json({ success: true, data: updatedProducto });
  },

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await productoService.delete(Number(id), req.user!.id);
    res.json({ success: true, message: 'Producto eliminado correctamente' });
  },
};
