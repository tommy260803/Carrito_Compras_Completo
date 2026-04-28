"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actualizarItemSchema = exports.agregarItemSchema = void 0;
const zod_1 = require("zod");
exports.agregarItemSchema = zod_1.z.object({
    producto_id: zod_1.z.number().positive(),
    cantidad: zod_1.z.number().positive().min(1),
});
exports.actualizarItemSchema = zod_1.z.object({
    cantidad: zod_1.z.number().positive().min(1),
});
//# sourceMappingURL=carrito.schema.js.map