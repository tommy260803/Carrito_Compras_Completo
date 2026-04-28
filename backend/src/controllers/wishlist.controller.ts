import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { z } from 'zod';

const addSchema = z.object({
  producto_id: z.number().int().positive(),
});

export const wishlistController = {
  async obtener(req: Request, res: Response) {
    const lista = await prisma.cli_lista_deseos.findUnique({
      where: { cliente_id: req.user!.id },
      include: { productos: { include: { producto: { include: { imagenes: true, categoria: true, stock: true } } } } },
    });
    res.json({ success: true, data: lista ?? { cliente_id: req.user!.id, productos: [] } });
  },

  async agregar(req: Request, res: Response) {
    const { producto_id } = addSchema.parse(req.body);

    const lista =
      (await prisma.cli_lista_deseos.findUnique({ where: { cliente_id: req.user!.id } })) ??
      (await prisma.cli_lista_deseos.create({ data: { cliente_id: req.user!.id } }));

    const item = await prisma.cli_lista_deseos_productos.upsert({
      where: { lista_id_producto_id: { lista_id: lista.id, producto_id } },
      create: { lista_id: lista.id, producto_id },
      update: {},
    });

    res.status(201).json({ success: true, data: item });
  },

  async quitar(req: Request, res: Response) {
    const productoId = Number(req.params.productoId);
    const lista = await prisma.cli_lista_deseos.findUnique({ where: { cliente_id: req.user!.id } });
    if (!lista) return res.json({ success: true, message: 'Wishlist vacía' });

    await prisma.cli_lista_deseos_productos.deleteMany({
      where: { lista_id: lista.id, producto_id: productoId },
    });
    res.json({ success: true, message: 'Eliminado de wishlist' });
  },
};

