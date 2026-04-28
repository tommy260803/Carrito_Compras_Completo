import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { z } from 'zod';

const direccionSchema = z.object({
  nombre: z.string().min(1),
  direccion: z.string().min(1),
  ciudad: z.string().min(1),
  provincia: z.string().min(1),
  codigo_postal: z.string().min(1),
  telefono: z.string().optional(),
  es_principal: z.boolean().optional(),
});

export const clienteController = {
  async listarAdmin(req: Request, res: Response) {
    const { search } = req.query as any;
    const where: any = {};
    if (search) {
      where.OR = [
        { email: { contains: String(search), mode: 'insensitive' } },
        { nombre: { contains: String(search), mode: 'insensitive' } },
        { apellido: { contains: String(search), mode: 'insensitive' } },
      ];
    }

    const clientes = await prisma.cli_clientes.findMany({
      where,
      include: {
        ordenes: { select: { id: true, total: true, fecha_orden: true, estado: { select: { nombre: true } } } },
      },
      orderBy: { created_at: 'desc' },
      take: 200,
    });

    const data = clientes.map((c) => ({
      id: c.id,
      email: c.email,
      nombre: c.nombre,
      apellido: c.apellido,
      telefono: c.telefono,
      created_at: c.created_at,
      total_ordenes: c.ordenes.length,
      gasto_total: c.ordenes.reduce((acc, o) => acc + Number(o.total ?? 0), 0),
      ultima_orden: c.ordenes[0]?.fecha_orden ?? null,
    }));

    res.json({ success: true, data });
  },

  async me(req: Request, res: Response) {
    const cliente = await prisma.cli_clientes.findUnique({
      where: { id: req.user!.id },
      select: { id: true, email: true, nombre: true, apellido: true, telefono: true, created_at: true },
    });
    if (!cliente) return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
    res.json({ success: true, data: cliente });
  },

  async listarDirecciones(req: Request, res: Response) {
    const direcciones = await prisma.cli_direcciones.findMany({
      where: { cliente_id: req.user!.id },
      orderBy: [{ es_principal: 'desc' }, { id: 'desc' }],
    });
    res.json({ success: true, data: direcciones });
  },

  async crearDireccion(req: Request, res: Response) {
    const validated = direccionSchema.parse(req.body);
    const dir = await prisma.cli_direcciones.create({
      data: { ...validated, cliente_id: req.user!.id, es_principal: validated.es_principal ?? false },
    });
    res.status(201).json({ success: true, data: dir });
  },

  async actualizarDireccion(req: Request, res: Response) {
    const id = Number(req.params.id);
    const validated = direccionSchema.partial().parse(req.body);

    const existente = await prisma.cli_direcciones.findFirst({ where: { id, cliente_id: req.user!.id } });
    if (!existente) return res.status(404).json({ success: false, message: 'Dirección no encontrada' });

    const dir = await prisma.cli_direcciones.update({
      where: { id },
      data: validated,
    });
    res.json({ success: true, data: dir });
  },

  async eliminarDireccion(req: Request, res: Response) {
    const id = Number(req.params.id);
    const existente = await prisma.cli_direcciones.findFirst({ where: { id, cliente_id: req.user!.id } });
    if (!existente) return res.status(404).json({ success: false, message: 'Dirección no encontrada' });
    await prisma.cli_direcciones.delete({ where: { id } });
    res.json({ success: true, message: 'Dirección eliminada' });
  },

  async historialCompras(req: Request, res: Response) {
    const ordenes = await prisma.ord_ordenes.findMany({
      where: { cliente_id: req.user!.id },
      include: { items: { include: { producto: true } }, estado: true },
      orderBy: { fecha_orden: 'desc' },
    });
    res.json({ success: true, data: ordenes });
  },
};

