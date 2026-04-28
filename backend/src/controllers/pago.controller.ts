import { Request, Response } from 'express';
import { registrarPagoSchema } from '../schemas/pago.schema';
import { pagoService } from '../services/pago.service';

export const pagoController = {
  async registrar(req: Request, res: Response) {
    const validated = registrarPagoSchema.parse(req.body);
    const pago = await pagoService.registrarPago(req.user!.id, validated);
    res.status(201).json({ success: true, data: pago });
  },

  async listarPorOrden(req: Request, res: Response) {
    const ordenId = Number(req.params.ordenId);
    const pagos = await pagoService.listarPagosDeOrden(req.user!.id, ordenId);
    res.json({ success: true, data: pagos });
  },

  // Admin
  async listarAdmin(req: Request, res: Response) {
    const { estado, desde, hasta, orden_codigo, cliente_email } = req.query as any;
    const pagos = await pagoService.listarPagosAdmin({
      estado: estado ? String(estado) : undefined,
      desde: desde ? new Date(String(desde)) : undefined,
      hasta: hasta ? new Date(String(hasta)) : undefined,
      orden_codigo: orden_codigo ? String(orden_codigo) : undefined,
      cliente_email: cliente_email ? String(cliente_email) : undefined,
    });
    res.json({ success: true, data: pagos });
  },
};

