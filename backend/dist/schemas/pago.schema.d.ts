import { z } from 'zod';
export declare const registrarPagoSchema: z.ZodObject<{
    orden_id: z.ZodNumber;
    metodo: z.ZodString;
    monto: z.ZodNumber;
    referencia: z.ZodOptional<z.ZodString>;
    transaccion_id: z.ZodOptional<z.ZodString>;
    estado: z.ZodOptional<z.ZodEnum<["pendiente", "pagado", "fallido", "reembolsado"]>>;
}, "strip", z.ZodTypeAny, {
    orden_id: number;
    metodo: string;
    monto: number;
    estado?: "pagado" | "pendiente" | "fallido" | "reembolsado" | undefined;
    referencia?: string | undefined;
    transaccion_id?: string | undefined;
}, {
    orden_id: number;
    metodo: string;
    monto: number;
    estado?: "pagado" | "pendiente" | "fallido" | "reembolsado" | undefined;
    referencia?: string | undefined;
    transaccion_id?: string | undefined;
}>;
export type registrarPagoDto = z.infer<typeof registrarPagoSchema>;
//# sourceMappingURL=pago.schema.d.ts.map