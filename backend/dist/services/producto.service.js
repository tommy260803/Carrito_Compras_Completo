"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productoService = void 0;
const prisma_1 = require("../config/prisma");
const AppError_1 = require("../utils/AppError");
exports.productoService = {
    async list({ page, limit, filters }) {
        const skip = (page - 1) * limit;
        const where = { activo: true };
        if (filters?.categoria) {
            where.categoria_id = Number(filters.categoria);
        }
        if (filters?.search) {
            where.OR = [
                { nombre: { contains: filters.search, mode: 'insensitive' } },
                { descripcion_corta: { contains: filters.search, mode: 'insensitive' } }
            ];
        }
        const [productos, total] = await Promise.all([
            prisma_1.prisma.cat_productos.findMany({
                where,
                include: {
                    categoria: true,
                    marca: true,
                    unidad_medida: true,
                    imagenes: true,
                    stock: true
                },
                skip,
                take: limit,
                orderBy: { created_at: 'desc' }
            }),
            prisma_1.prisma.cat_productos.count({ where })
        ]);
        return {
            productos,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        };
    },
    async getById(id) {
        const producto = await prisma_1.prisma.cat_productos.findFirst({
            where: { id, activo: true },
            include: {
                categoria: true,
                marca: true,
                unidad_medida: true,
                imagenes: true,
                stock: true,
                atributos: true
            }
        });
        if (!producto) {
            throw new AppError_1.AppError('Producto no encontrado', 404);
        }
        return producto;
    },
    async create(data, userId) {
        // Extraer stock para manejarlo por separado
        const { stock, stock_minimo, ...productoData } = data;
        // Generar SKU automáticamente si no se proporciona
        let sku = productoData.sku;
        if (!sku) {
            const categoria = await prisma_1.prisma.cat_categorias.findUnique({
                where: { id: productoData.categoria_id }
            });
            const prefix = categoria ? categoria.nombre.substring(0, 3).toUpperCase() : 'PRD';
            const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
            sku = `${prefix}-${random}`;
        }
        const producto = await prisma_1.prisma.cat_productos.create({
            data: {
                ...productoData,
                sku,
                stock_minimo: stock_minimo || 0,
                created_by: userId,
                updated_by: userId
            },
            include: {
                categoria: true,
                marca: true,
                unidad_medida: true
            }
        });
        // Crear registro de stock (usar upsert para evitar duplicados)
        await prisma_1.prisma.inv_stock_producto.upsert({
            where: { producto_id: producto.id },
            update: {
                cantidad: stock || 0,
                disponible: stock || 0
            },
            create: {
                producto_id: producto.id,
                cantidad: stock || 0,
                disponible: stock || 0
            }
        });
        return producto;
    },
    async update(id, data, userId) {
        const productoExistente = await prisma_1.prisma.cat_productos.findFirst({
            where: { id, activo: true }
        });
        if (!productoExistente) {
            throw new AppError_1.AppError('Producto no encontrado', 404);
        }
        // Extraer stock para manejarlo por separado
        const { stock, stock_minimo, ...productoData } = data;
        const producto = await prisma_1.prisma.cat_productos.update({
            where: { id },
            data: {
                ...productoData,
                stock_minimo: stock_minimo !== undefined ? stock_minimo : undefined,
                updated_by: userId
            },
            include: {
                categoria: true,
                marca: true,
                unidad_medida: true
            }
        });
        // Actualizar stock si se proporciona
        if (stock !== undefined) {
            await prisma_1.prisma.inv_stock_producto.upsert({
                where: { producto_id: producto.id },
                update: {
                    cantidad: stock,
                    disponible: stock
                },
                create: {
                    producto_id: producto.id,
                    cantidad: stock,
                    disponible: stock
                }
            });
        }
        return producto;
    },
    async delete(id, userId) {
        const productoExistente = await prisma_1.prisma.cat_productos.findFirst({
            where: { id, activo: true }
        });
        if (!productoExistente) {
            throw new AppError_1.AppError('Producto no encontrado', 404);
        }
        // Soft delete
        await prisma_1.prisma.cat_productos.update({
            where: { id },
            data: {
                activo: false,
                updated_by: userId
            }
        });
    }
};
//# sourceMappingURL=producto.service.js.map