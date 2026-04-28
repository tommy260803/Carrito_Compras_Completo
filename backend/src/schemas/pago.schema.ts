import { z } from 'zod';

export const registrarPagoSchema = z.object({
  orden_id: z.number().int().positive(),
  metodo: z.string().min(1),
  monto: z.number().positive(),
  referencia: z.string().optional(),
  transaccion_id: z.string().optional(),
  estado: z.enum(['pendiente', 'pagado', 'fallido', 'reembolsado']).optional(),
});

export type registrarPagoDto = z.infer<typeof registrarPagoSchema>;

