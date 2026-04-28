import { z } from 'zod';

export const crearOrdenSchema = z.object({
  carrito_id: z.number().int().positive(),
  direccion_envio_id: z.number().int().positive(),
  metodo_pago: z.string().min(1),
});

export const cambiarEstadoSchema = z.object({
  estado_id: z.number().int().positive(),
  comentario: z.string().optional(),
});

export type crearOrdenDto = z.infer<typeof crearOrdenSchema>;
export type cambiarEstadoDto = z.infer<typeof cambiarEstadoSchema>;

