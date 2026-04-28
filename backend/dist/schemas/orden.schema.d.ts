import { z } from 'zod';
export declare const crearOrdenSchema: z.ZodObject<{
    carrito_id: z.ZodNumber;
    direccion_envio_id: z.ZodNumber;
    metodo_pago: z.ZodString;
}, "strip", z.ZodTypeAny, {
    carrito_id: number;
    metodo_pago: string;
    direccion_envio_id: number;
}, {
    carrito_id: number;
    metodo_pago: string;
    direccion_envio_id: number;
}>;
export declare const cambiarEstadoSchema: z.ZodObject<{
    estado_id: z.ZodNumber;
    comentario: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    estado_id: number;
    comentario?: string | undefined;
}, {
    estado_id: number;
    comentario?: string | undefined;
}>;
export type crearOrdenDto = z.infer<typeof crearOrdenSchema>;
export type cambiarEstadoDto = z.infer<typeof cambiarEstadoSchema>;
//# sourceMappingURL=orden.schema.d.ts.map