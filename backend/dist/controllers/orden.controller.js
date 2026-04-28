"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ordenController = void 0;
const orden_service_1 = require("../services/orden.service");
const orden_schema_1 = require("../schemas/orden.schema");
const prisma_1 = require("../config/prisma");
exports.ordenController = {
    async crear(req, res) {
        const validated = orden_schema_1.crearOrdenSchema.parse(req.body);
        const orden = await orden_service_1.ordenService.crearOrden(req.user.id, validated.carrito_id, validated.direccion_envio_id, validated.metodo_pago);
        res.status(201).json({ success: true, data: orden });
    },
    async listarMisOrdenes(req, res) {
        const ordenes = await prisma_1.prisma.ord_ordenes.findMany({
            where: { cliente_id: req.user.id },
            include: { items: { include: { producto: true } }, estado: true, direccion_envio: true },
            orderBy: { fecha_orden: 'desc' },
        });
        res.json({ success: true, data: ordenes });
    },
    async obtenerDetalle(req, res) {
        const id = Number(req.params.id);
        const orden = await prisma_1.prisma.ord_ordenes.findFirst({
            where: { id, cliente_id: req.user.id },
            include: {
                items: { include: { producto: true } },
                estado: true,
                direccion_envio: true,
                historial_estados: { include: { estado: true }, orderBy: { fecha: 'asc' } },
            },
        });
        if (!orden)
            return res.status(404).json({ success: false, message: 'Orden no encontrada' });
        res.json({ success: true, data: orden });
    },
    async cambiarEstado(req, res) {
        const ordenId = Number(req.params.id);
        const validated = orden_schema_1.cambiarEstadoSchema.parse(req.body);
        const orden = await orden_service_1.ordenService.cambiarEstado(ordenId, validated.estado_id, req.user.id, validated.comentario);
        res.json({ success: true, data: orden });
    },
    // Admin
    async listar(req, res) {
        const { page = 1, limit = 20, estado_id, search } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const where = {};
        if (estado_id)
            where.estado_id = Number(estado_id);
        if (search) {
            where.OR = [
                { codigo: { contains: String(search), mode: 'insensitive' } },
                { cliente: { email: { contains: String(search), mode: 'insensitive' } } },
            ];
        }
        const [ordenes, total] = await Promise.all([
            prisma_1.prisma.ord_ordenes.findMany({
                where,
                include: { cliente: true, estado: true },
                orderBy: { fecha_orden: 'desc' },
                skip,
                take: Number(limit),
            }),
            prisma_1.prisma.ord_ordenes.count({ where }),
        ]);
        res.json({ success: true, data: { ordenes, pagination: { page: Number(page), limit: Number(limit), total } } });
    },
    async obtener(req, res) {
        const id = Number(req.params.id);
        const orden = await prisma_1.prisma.ord_ordenes.findUnique({
            where: { id },
            include: {
                cliente: true,
                items: { include: { producto: true } },
                estado: true,
                direccion_envio: true,
                historial_estados: { include: { estado: true }, orderBy: { fecha: 'asc' } },
                pagos: { orderBy: { created_at: 'desc' } },
            },
        });
        if (!orden)
            return res.status(404).json({ success: false, message: 'Orden no encontrada' });
        res.json({ success: true, data: orden });
    },
    async listarEstados(req, res) {
        const estados = await prisma_1.prisma.ord_estados_orden.findMany({ orderBy: { id: 'asc' } });
        res.json({ success: true, data: estados });
    },
};
//# sourceMappingURL=orden.controller.js.map