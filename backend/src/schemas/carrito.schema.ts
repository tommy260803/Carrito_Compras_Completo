import { z } from 'zod';

export const agregarItemSchema = z.object({
  producto_id: z.number().positive(),
  cantidad: z.number().positive().min(1),
});

export const actualizarItemSchema = z.object({
  cantidad: z.number().positive().min(1),
});

export type agregarItemDto = z.infer<typeof agregarItemSchema>;
export type actualizarItemDto = z.infer<typeof actualizarItemSchema>;
