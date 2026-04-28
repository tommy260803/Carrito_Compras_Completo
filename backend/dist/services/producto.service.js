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
        const producto = await prisma_1.prisma.cat_productos.create({
            data: {
                ...data,
                created_by: userId,
                updated_by: userId
            },
            include: {
                categoria: true,
                marca: true,
                unidad_medida: true
            }
        });
        // Crear registro de stock
        await prisma_1.prisma.inv_stock_producto.create({
            data: {
                producto_id: producto.id,
                cantidad: data.stock || 0,
                disponible: data.stock || 0
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
        const producto = await prisma_1.prisma.cat_productos.update({
            where: { id },
            data: {
                ...data,
                updated_by: userId
            },
            include: {
                categoria: true,
                marca: true,
                unidad_medida: true
            }
        });
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