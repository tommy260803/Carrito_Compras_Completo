"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cambiarEstadoSchema = exports.crearOrdenSchema = void 0;
const zod_1 = require("zod");
exports.crearOrdenSchema = zod_1.z.object({
    carrito_id: zod_1.z.number().int().positive(),
    direccion_envio_id: zod_1.z.number().int().positive(),
    metodo_pago: zod_1.z.string().min(1),
});
exports.cambiarEstadoSchema = zod_1.z.object({
    estado_id: zod_1.z.number().int().positive(),
    comentario: zod_1.z.string().optional(),
});
//# sourceMappingURL=orden.schema.js.map