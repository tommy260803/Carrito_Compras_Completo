import { Request, Response } from 'express';
import { estadisticasService } from '../services/estadisticas.service';

export const estadisticasController = {
  async tendenciaVentas(req: Request, res: Response) {
    const data = await estadisticasService.tendenciaMensual();
    res.json({ success: true, data });
  },
  async analisisABC(req: Request, res: Response) {
    const abc = await estadisticasService.analisisABC();
    res.json({ success: true, data: abc });
  },
  async rfmSegmentacion(req: Request, res: Response) {
    const rfm = await estadisticasService.calcularRFM();
    res.json({ success: true, data: rfm });
  },
  // ... resto de endpoints
};
