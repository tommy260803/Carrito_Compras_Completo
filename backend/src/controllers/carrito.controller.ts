import { Request, Response } from 'express';
import { carritoService } from '../services/carrito.service';
import { agregarItemSchema, actualizarItemSchema } from '../schemas/carrito.schema';

export const carritoController = {
  async obtenerCarrito(req: Request, res: Response) {
    const carrito = await carritoService.obtenerCarrito(req.user!.id);
    res.json({ success: true, data: carrito });
  },

  async agregarItem(req: Request, res: Response) {
    const validated = agregarItemSchema.parse(req.body);
    const item = await carritoService.agregarItem(req.user!.id, validated);
    res.status(201).json({ success: true, data: item });
  },

  async actualizarItem(req: Request, res: Response) {
    const { itemId } = req.params;
    const validated = actualizarItemSchema.parse(req.body);
    const item = await carritoService.actualizarItem(Number(itemId), validated);
    res.json({ success: true, data: item });
  },

  async eliminarItem(req: Request, res: Response) {
    const { itemId } = req.params;
    await carritoService.eliminarItem(Number(itemId));
    res.json({ success: true, message: 'Item eliminado del carrito' });
  },

  async vaciarCarrito(req: Request, res: Response) {
    await carritoService.vaciarCarrito(req.user!.id);
    res.json({ success: true, message: 'Carrito vaciado' });
  },
};