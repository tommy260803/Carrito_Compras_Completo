import { Request, Response } from 'express';
import { inventarioService } from '../services/inventario.service';
import { z } from 'zod';

const ajustarSchema = z.object({
  cantidad: z.number().int().min(0),
});

const stockMinimoSchema = z.object({
  stock_minimo: z.number().int().min(0),
});

export const inventarioController = {
  async list(req: Request, res: Response) {
    const data = await inventarioService.list();
    res.json({ success: true, data });
  },

  async stockBajo(req: Request, res: Response) {
    const data = await inventarioService.stockBajo();
    res.json({ success: true, data });
  },

  async agotados(req: Request, res: Response) {
    const data = await inventarioService.agotados();
    res.json({ success: true, data });
  },

  async movimientos(req: Request, res: Response) {
    const productoId = req.query.productoId ? Number(req.query.productoId) : undefined;
    const data = await inventarioService.movimientos(productoId);
    res.json({ success: true, data });
  },

  async ajustarStock(req: Request, res: Response) {
    const productoId = Number(req.params.productoId);
    const { cantidad } = ajustarSchema.parse(req.body);
    const data = await inventarioService.ajustarStock(productoId, cantidad, req.user!.id);
    res.json({ success: true, data });
  },

  async actualizarStockMinimo(req: Request, res: Response) {
    const productoId = Number(req.params.productoId);
    const { stock_minimo } = stockMinimoSchema.parse(req.body);
    const data = await inventarioService.actualizarStockMinimo(productoId, stock_minimo);
    res.json({ success: true, data });
  },
};

