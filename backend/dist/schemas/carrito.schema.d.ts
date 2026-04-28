import { z } from 'zod';
export declare const agregarItemSchema: z.ZodObject<{
    producto_id: z.ZodNumber;
    cantidad: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    producto_id: number;
    cantidad: number;
}, {
    producto_id: number;
    cantidad: number;
}>;
export declare const actualizarItemSchema: z.ZodObject<{
    cantidad: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    cantidad: number;
}, {
    cantidad: number;
}>;
export type agregarItemDto = z.infer<typeof agregarItemSchema>;
export type actualizarItemDto = z.infer<typeof actualizarItemSchema>;
//# sourceMappingURL=carrito.schema.d.ts.map