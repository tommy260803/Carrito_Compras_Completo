"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ordenService = void 0;
const prisma_1 = require("../config/prisma");
const ordenHelpers_1 = require("../utils/ordenHelpers");
const AppError_1 = require("../utils/AppError");
exports.ordenService = {
    async crearOrden(clienteId, carritoId, direccionId, metodoPago) {
        const itemsCarrito = await prisma_1.prisma.ord_items_carrito.findMany({
            where: { carrito_id: carritoId },
            include: { producto: true },
        });
        if (!itemsCarrito.length)
            throw new AppError_1.AppError('Carrito vacío', 400);
        let subtotal = 0;
        const itemsOrden = itemsCarrito.map((item) => {
            const precio = item.producto.precio_venta;
            const sub = Number(precio) * item.cantidad;
            subtotal += sub;
            return {
                producto_id: item.producto_id,
                cantidad: item.cantidad,
                precio_unitario: precio,
                subtotal: sub,
            };
        });
        const impuestos = (0, ordenHelpers_1.calcularImpuestos)(subtotal);
        const total = subtotal + impuestos;
        const codigo = await (0, ordenHelpers_1.generarCodigoOrden)();
        return await prisma_1.prisma.$transaction(async (tx) => {
            // Reservar stock (si existe registro; si no, crearlo)
            for (const item of itemsCarrito) {
                const stock = await tx.inv_stock_producto.findUnique({ where: { producto_id: item.producto_id } });
                if (!stock) {
                    await tx.inv_stock_producto.create({
                        data: {
                            producto_id: item.producto_id,
                            cantidad: 0,
                            reservado: item.cantidad,
                            disponible: 0,
                        },
                    });
                }
                else {
                    const nuevoReservado = stock.reservado + item.cantidad;
                    const nuevoDisponible = Math.max(0, stock.cantidad - nuevoReservado);
                    await tx.inv_stock_producto.update({
                        where: { producto_id: item.producto_id },
                        data: { reservado: nuevoReservado, disponible: nuevoDisponible },
                    });
                }
                await tx.inv_movimientos_inventario.create({
                    data: {
                        producto_id: item.producto_id,
                        tipo: 'reserva',
                        cantidad: item.cantidad,
                        referencia: `Reserva por orden ${codigo}`,
                    },
                });
            }
            const orden = await tx.ord_ordenes.create({
                data: {
                    codigo,
                    cliente_id: clienteId,
                    estado_id: 1, // pendiente pago
                    subtotal,
                    impuestos,
                    total,
                    direccion_envio_id: direccionId,
                    metodo_pago: metodoPago,
                    items: { createMany: { data: itemsOrden } },
                },
                include: { items: { include: { producto: true } }, estado: true, direccion_envio: true },
            });
            await tx.ord_items_carrito.deleteMany({ where: { carrito_id: carritoId } });
            return orden;
        });
    },
    async cambiarEstado(ordenId, nuevoEstadoId, usuarioId, comentario) {
        const orden = await prisma_1.prisma.ord_ordenes.update({
            where: { id: ordenId },
            data: { estado_id: nuevoEstadoId },
        });
        await prisma_1.prisma.ord_historial_estados.create({
            data: {
                orden_id: ordenId,
                estado_id: nuevoEstadoId,
                usuario_id: usuarioId,
                notas: comentario,
            },
        });
        // Si estado es 'entregada', liberar reserva y descontar stock físico
        if (nuevoEstadoId === 5) {
            const items = await prisma_1.prisma.ord_items_orden.findMany({ where: { orden_id: ordenId } });
            for (const item of items) {
                const stock = await prisma_1.prisma.inv_stock_producto.findUnique({ where: { producto_id: item.producto_id } });
                if (!stock)
                    continue;
                const nuevoCantidad = Math.max(0, stock.cantidad - item.cantidad);
                const nuevoReservado = Math.max(0, stock.reservado - item.cantidad);
                const nuevoDisponible = Math.max(0, nuevoCantidad - nuevoReservado);
                await prisma_1.prisma.inv_stock_producto.update({
                    where: { producto_id: item.producto_id },
                    data: {
                        cantidad: nuevoCantidad,
                        reservado: nuevoReservado,
                        disponible: nuevoDisponible,
                    },
                });
                await prisma_1.prisma.inv_movimientos_inventario.create({
                    data: {
                        producto_id: item.producto_id,
                        tipo: 'salida',
                        cantidad: item.cantidad,
                        referencia: `Salida por entrega orden ${orden.codigo}`,
                        usuario_id: usuarioId,
                    },
                });
            }
        }
        return orden;
    },
    // ... listar, cancelar, etc.
};
//# sourceMappingURL=orden.service.js.map