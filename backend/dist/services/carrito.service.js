"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.carritoService = void 0;
const prisma_1 = require("../config/prisma");
exports.carritoService = {
    async obtenerCarrito(clienteId) {
        let carrito = await prisma_1.prisma.ord_carritos.findFirst({
            where: { cliente_id: clienteId, activo: true },
            include: {
                items: {
                    include: {
                        producto: {
                            include: {
                                imagenes: true,
                                categoria: true,
                            },
                        },
                    },
                },
            },
        });
        if (!carrito) {
            carrito = await prisma_1.prisma.ord_carritos.create({
                data: { cliente_id: clienteId },
                include: {
                    items: {
                        include: {
                            producto: {
                                include: {
                                    imagenes: true,
                                    categoria: true,
                                },
                            },
                        },
                    },
                },
            });
        }
        return carrito;
    },
    async agregarItem(clienteId, data) {
        const carrito = await this.obtenerCarrito(clienteId);
        const itemExistente = await prisma_1.prisma.ord_items_carrito.findFirst({
            where: {
                carrito_id: carrito.id,
                producto_id: data.producto_id,
            },
        });
        if (itemExistente) {
            return await prisma_1.prisma.ord_items_carrito.update({
                where: { id: itemExistente.id },
                data: { cantidad: itemExistente.cantidad + data.cantidad },
                include: {
                    producto: {
                        include: {
                            imagenes: true,
                            categoria: true,
                        },
                    },
                },
            });
        }
        return await prisma_1.prisma.ord_items_carrito.create({
            data: {
                carrito_id: carrito.id,
                producto_id: data.producto_id,
                cantidad: data.cantidad,
            },
            include: {
                producto: {
                    include: {
                        imagenes: true,
                        categoria: true,
                    },
                },
            },
        });
    },
    async actualizarItem(itemId, data) {
        return await prisma_1.prisma.ord_items_carrito.update({
            where: { id: itemId },
            data: { cantidad: data.cantidad },
            include: {
                producto: {
                    include: {
                        imagenes: true,
                        categoria: true,
                    },
                },
            },
        });
    },
    async eliminarItem(itemId) {
        await prisma_1.prisma.ord_items_carrito.delete({
            where: { id: itemId },
        });
    },
    async vaciarCarrito(clienteId) {
        const carrito = await this.obtenerCarrito(clienteId);
        await prisma_1.prisma.ord_items_carrito.deleteMany({
            where: { carrito_id: carrito.id },
        });
    },
};
//# sourceMappingURL=carrito.service.js.map