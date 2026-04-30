"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryProductoSchema = exports.updateProductoSchema = exports.createProductoSchema = void 0;
const zod_1 = require("zod");
const productoBaseSchema = zod_1.z.object({
    sku: zod_1.z.string().min(1, 'SKU es requerido').optional(),
    nombre: zod_1.z.string().min(1, 'Nombre es requerido'),
    descripcion_corta: zod_1.z.string().optional(),
    descripcion_larga: zod_1.z.string().optional(),
    categoria_id: zod_1.z.number().positive('Categoría es requerida'),
    marca_id: zod_1.z.number().positive().optional(),
    unidad_medida_id: zod_1.z.number().positive().optional(),
    precio_costo: zod_1.z.number().min(0).optional(),
    precio_venta: zod_1.z.number().positive('Precio de venta es requerido'),
    precio_oferta: zod_1.z.number().positive().optional(),
    oferta_inicio: zod_1.z.string().datetime().optional(),
    oferta_fin: zod_1.z.string().datetime().optional(),
    peso: zod_1.z.number().positive().optional(),
    dimensiones: zod_1.z.string().optional(),
    stock_minimo: zod_1.z.number().min(0).default(0),
    activo: zod_1.z.boolean().default(true)
});
exports.createProductoSchema = productoBaseSchema.extend({
    stock: zod_1.z.number().min(0).default(0)
});
exports.updateProductoSchema = productoBaseSchema.partial().extend({
    stock: zod_1.z.number().min(0).optional()
});
exports.queryProductoSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().min(1).default(1),
    limit: zod_1.z.coerce.number().min(1).max(100).default(12),
    categoria: zod_1.z.coerce.number().positive().optional(),
    search: zod_1.z.string().optional()
});
//# sourceMappingURL=producto.schema.js.map