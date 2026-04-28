import { Request, Response } from 'express';
import { categoriaService } from '../services/categoria.service';

export const categoriaController = {
  async list(req: Request, res: Response) {
    const categorias = await categoriaService.list();
    res.json({ success: true, data: categorias });
  },

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const categoria = await categoriaService.getById(Number(id));
    res.json({ success: true, data: categoria });
  },

  async create(req: Request, res: Response) {
    const newCategoria = await categoriaService.create(req.body);
    res.status(201).json({ success: true, data: newCategoria });
  },

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const updatedCategoria = await categoriaService.update(Number(id), req.body);
    res.json({ success: true, data: updatedCategoria });
  },

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await categoriaService.delete(Number(id));
    res.json({ success: true, message: 'Categoría eliminada correctamente' });
  }
};
