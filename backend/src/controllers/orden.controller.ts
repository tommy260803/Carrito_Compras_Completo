import { Request, Response } from 'express';
import { ordenService } from '../services/orden.service';
import { cambiarEstadoSchema, crearOrdenSchema } from '../schemas/orden.schema';
import { prisma } from '../config/prisma';

export const ordenController = {
  async crear(req: Request, res: Response) {
    const validated = crearOrdenSchema.parse(req.body);
    const orden = await ordenService.crearOrden(
      req.user!.id,
      validated.carrito_id,
      validated.direccion_envio_id,
      validated.metodo_pago
    );
    res.status(201).json({ success: true, data: orden });
  },

  async listarMisOrdenes(req: Request, res: Response) {
    const ordenes = await prisma.ord_ordenes.findMany({
      where: { cliente_id: req.user!.id },
      include: { items: { include: { producto: true } }, estado: true, direccion_envio: true },
      orderBy: { fecha_orden: 'desc' },
    });
    res.json({ success: true, data: ordenes });
  },

  async obtenerDetalle(req: Request, res: Response) {
    const id = Number(req.params.id);
    const orden = await prisma.ord_ordenes.findFirst({
      where: { id, cliente_id: req.user!.id },
      include: {
        items: { include: { producto: true } },
        estado: true,
        direccion_envio: true,
        historial_estados: { include: { estado: true }, orderBy: { fecha: 'asc' } },
      },
    });
    if (!orden) return res.status(404).json({ success: false, message: 'Orden no encontrada' });
    res.json({ success: true, data: orden });
  },

  async cambiarEstado(req: Request, res: Response) {
    const ordenId = Number(req.params.id);
    const validated = cambiarEstadoSchema.parse(req.body);
    const orden = await ordenService.cambiarEstado(ordenId, validated.estado_id, req.user!.id, validated.comentario);
    res.json({ success: true, data: orden });
  },

  // Admin
  async listar(req: Request, res: Response) {
    const { page = 1, limit = 20, estado_id, search } = req.query as any;
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {};
    if (estado_id) where.estado_id = Number(estado_id);
    if (search) {
      where.OR = [
        { codigo: { contains: String(search), mode: 'insensitive' } },
        { cliente: { email: { contains: String(search), mode: 'insensitive' } } },
      ];
    }

    const [ordenes, total] = await Promise.all([
      prisma.ord_ordenes.findMany({
        where,
        include: { cliente: true, estado: true },
        orderBy: { fecha_orden: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.ord_ordenes.count({ where }),
    ]);

    res.json({ success: true, data: { ordenes, pagination: { page: Number(page), limit: Number(limit), total } } });
  },

  async obtener(req: Request, res: Response) {
    const id = Number(req.params.id);
    const orden = await prisma.ord_ordenes.findUnique({
      where: { id },
      include: {
        cliente: true,
        items: { include: { producto: true } },
        estado: true,
        direccion_envio: true,
        historial_estados: { include: { estado: true }, orderBy: { fecha: 'asc' } },
        pagos: { orderBy: { created_at: 'desc' } },
      },
    });
    if (!orden) return res.status(404).json({ success: false, message: 'Orden no encontrada' });
    res.json({ success: true, data: orden });
  },

  async listarEstados(req: Request, res: Response) {
    const estados = await prisma.ord_estados_orden.findMany({ orderBy: { id: 'asc' } });
    res.json({ success: true, data: estados });
  },
};

