"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventarioService = void 0;
const prisma_1 = require("../config/prisma");
const AppError_1 = require("../utils/AppError");
exports.inventarioService = {
    async list() {
        const productos = await prisma_1.prisma.cat_productos.findMany({
            where: { activo: true },
            include: {
                categoria: true,
                stock: true
            },
            orderBy: { nombre: 'asc' }
        });
        return productos;
    },
    async stockBajo() {
        const productos = await prisma_1.prisma.cat_productos.findMany({
            where: { activo: true },
            include: {
                categoria: true,
                stock: true
            }
        });
        // Filtrar productos con stock disponible <= stock_minimo
        return productos.filter(p => p.stock && p.stock.disponible <= p.stock_minimo);
    },
    async agotados() {
        const productos = await prisma_1.prisma.cat_productos.findMany({
            where: {
                activo: true,
                stock: {
                    disponible: 0
                }
            },
            include: {
                categoria: true,
                stock: true
            }
        });
        return productos;
    },
    async movimientos(productoId) {
        const where = {};
        if (productoId) {
            where.producto_id = productoId;
        }
        const movimientos = await prisma_1.prisma.inv_movimientos_inventario.findMany({
            where,
            include: {
                producto: {
                    include: {
                        categoria: true
                    }
                },
                usuario: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true
                    }
                }
            },
            orderBy: { created_at: 'desc' },
            take: 100
        });
        return movimientos;
    },
    async ajustarStock(productoId, cantidad, userId) {
        const stock = await prisma_1.prisma.inv_stock_producto.findUnique({
            where: { producto_id: productoId }
        });
        if (!stock) {
            throw new AppError_1.AppError('Stock no encontrado para este producto', 404);
        }
        const nuevoDisponible = stock.disponible + cantidad;
        if (nuevoDisponible < 0) {
            throw new AppError_1.AppError('Stock no puede ser negativo', 400);
        }
        const updatedStock = await prisma_1.prisma.inv_stock_producto.update({
            where: { producto_id: productoId },
            data: {
                cantidad: stock.cantidad + cantidad,
                disponible: nuevoDisponible
            }
        });
        // Registrar movimiento
        await prisma_1.prisma.inv_movimientos_inventario.create({
            data: {
                producto_id: productoId,
                tipo: cantidad > 0 ? 'entrada' : 'salida',
                cantidad: Math.abs(cantidad),
                referencia: 'Ajuste manual',
                usuario_id: userId
            }
        });
        return updatedStock;
    },
    async actualizarStockMinimo(productoId, stockMinimo) {
        const producto = await prisma_1.prisma.cat_productos.findUnique({
            where: { id: productoId }
        });
        if (!producto) {
            throw new AppError_1.AppError('Producto no encontrado', 404);
        }
        if (stockMinimo < 0) {
            throw new AppError_1.AppError('Stock mínimo no puede ser negativo', 400);
        }
        const updated = await prisma_1.prisma.cat_productos.update({
            where: { id: productoId },
            data: { stock_minimo: stockMinimo }
        });
        return updated;
    }
};
//# sourceMappingURL=inventario.service.js.map