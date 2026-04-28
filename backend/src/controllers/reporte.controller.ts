import { Request, Response } from 'express';
import { reporteService } from '../services/reporte.service';

export const reporteController = {
  async kpis(req: Request, res: Response) {
    const data = await reporteService.kpis();
    res.json({ success: true, data });
  },

  async ventasDiarias(req: Request, res: Response) {
    const desde = req.query.desde ? new Date(String(req.query.desde)) : new Date(Date.now() - 7 * 86400000);
    const hasta = req.query.hasta ? new Date(String(req.query.hasta)) : new Date();
    const data = await reporteService.ventasDiarias(desde, hasta);
    res.json({ success: true, data });
  },

  async ventasPorCategoria(req: Request, res: Response) {
    const data = await reporteService.ventasPorCategoria();
    res.json({ success: true, data });
  },

  async productosMasVendidos(req: Request, res: Response) {
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const data = await reporteService.productosMasVendidos(limit);
    res.json({ success: true, data });
  },
};

