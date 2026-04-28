"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pagoService = void 0;
const prisma_1 = require("../config/prisma");
const AppError_1 = require("../utils/AppError");
exports.pagoService = {
    async registrarPago(clienteId, data) {
        const orden = await prisma_1.prisma.ord_ordenes.findFirst({
            where: { id: data.orden_id, cliente_id: clienteId },
        });
        if (!orden)
            throw new AppError_1.AppError('Orden no encontrada', 404);
        const pago = await prisma_1.prisma.pag_pagos.create({
            data: {
                orden_id: orden.id,
                estado: data.estado ?? 'pagado',
                metodo: data.metodo,
                monto: data.monto,
                referencia: data.referencia,
                transaccion_id: data.transaccion_id,
            },
        });
        if (pago.estado === 'pagado') {
            await prisma_1.prisma.ord_ordenes.update({
                where: { id: orden.id },
                data: {
                    fecha_pago: new Date(),
                    metodo_pago: data.metodo,
                    pago_referencia: data.referencia ?? data.transaccion_id ?? undefined,
                    // mantener estado actual si ya es >1; si está pendiente (1), pasar a "pagada" (2) si existe
                    estado_id: orden.estado_id === 1 ? 2 : orden.estado_id,
                },
            });
        }
        return pago;
    },
    async listarPagosDeOrden(clienteId, ordenId) {
        const orden = await prisma_1.prisma.ord_ordenes.findFirst({ where: { id: ordenId, cliente_id: clienteId } });
        if (!orden)
            throw new AppError_1.AppError('Orden no encontrada', 404);
        return prisma_1.prisma.pag_pagos.findMany({ where: { orden_id: ordenId }, orderBy: { created_at: 'desc' } });
    },
    // Admin
    async listarPagosAdmin(params) {
        const where = {};
        if (params.estado)
            where.estado = params.estado;
        if (params.desde || params.hasta) {
            where.created_at = {};
            if (params.desde)
                where.created_at.gte = params.desde;
            if (params.hasta)
                where.created_at.lte = params.hasta;
        }
        if (params.orden_codigo || params.cliente_email) {
            where.orden = {};
            if (params.orden_codigo)
                where.orden.codigo = { contains: params.orden_codigo, mode: 'insensitive' };
            if (params.cliente_email)
                where.orden.cliente = { email: { contains: params.cliente_email, mode: 'insensitive' } };
        }
        return prisma_1.prisma.pag_pagos.findMany({
            where,
            include: { orden: { include: { cliente: true } } },
            orderBy: { created_at: 'desc' },
            take: 200,
        });
    },
};
//# sourceMappingURL=pago.service.js.map