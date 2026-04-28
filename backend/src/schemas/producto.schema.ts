import { z } from 'zod';

const productoBaseSchema = z.object({
  sku: z.string().min(1, 'SKU es requerido').optional(),
  nombre: z.string().min(1, 'Nombre es requerido'),
  descripcion_corta: z.string().optional(),
  descripcion_larga: z.string().optional(),
  categoria_id: z.number().positive('Categoría es requerida'),
  marca_id: z.number().positive().optional(),
  unidad_medida_id: z.number().positive().optional(),
  precio_costo: z.number().min(0).optional(),
  precio_venta: z.number().positive('Precio de venta es requerido'),
  precio_oferta: z.number().positive().optional(),
  oferta_inicio: z.string().datetime().optional(),
  oferta_fin: z.string().datetime().optional(),
  peso: z.number().positive().optional(),
  dimensiones: z.string().optional(),
  stock_minimo: z.number().min(0).default(0),
  activo: z.boolean().default(true)
});

export const createProductoSchema = productoBaseSchema.extend({
  stock: z.number().min(0).default(0)
});

export const updateProductoSchema = productoBaseSchema.partial().extend({
  stock: z.number().min(0).optional()
});

export const queryProductoSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(12),
  categoria: z.coerce.number().positive().optional(),
  search: z.string().optional()
});

export type CreateProductoDto = z.infer<typeof createProductoSchema>;
export type UpdateProductoDto = z.infer<typeof updateProductoSchema>;
export type QueryProductoDto = z.infer<typeof queryProductoSchema>;