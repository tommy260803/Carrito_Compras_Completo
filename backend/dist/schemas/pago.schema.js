"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registrarPagoSchema = void 0;
const zod_1 = require("zod");
exports.registrarPagoSchema = zod_1.z.object({
    orden_id: zod_1.z.number().int().positive(),
    metodo: zod_1.z.string().min(1),
    monto: zod_1.z.number().positive(),
    referencia: zod_1.z.string().optional(),
    transaccion_id: zod_1.z.string().optional(),
    estado: zod_1.z.enum(['pendiente', 'pagado', 'fallido', 'reembolsado']).optional(),
});
//# sourceMappingURL=pago.schema.js.map