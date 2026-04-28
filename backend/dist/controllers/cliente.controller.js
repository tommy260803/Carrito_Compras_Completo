"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clienteController = void 0;
const prisma_1 = require("../config/prisma");
const zod_1 = require("zod");
const direccionSchema = zod_1.z.object({
    nombre: zod_1.z.string().min(1),
    direccion: zod_1.z.string().min(1),
    ciudad: zod_1.z.string().min(1),
    provincia: zod_1.z.string().min(1),
    codigo_postal: zod_1.z.string().min(1),
    telefono: zod_1.z.string().optional(),
    es_principal: zod_1.z.boolean().optional(),
});
exports.clienteController = {
    async listarAdmin(req, res) {
        const { search } = req.query;
        const where = {};
        if (search) {
            where.OR = [
                { email: { contains: String(search), mode: 'insensitive' } },
                { nombre: { contains: String(search), mode: 'insensitive' } },
                { apellido: { contains: String(search), mode: 'insensitive' } },
            ];
        }
        const clientes = await prisma_1.prisma.cli_clientes.findMany({
            where,
            include: {
                ordenes: { select: { id: true, total: true, fecha_orden: true, estado: { select: { nombre: true } } } },
            },
            orderBy: { created_at: 'desc' },
            take: 200,
        });
        const data = clientes.map((c) => ({
            id: c.id,
            email: c.email,
            nombre: c.nombre,
            apellido: c.apellido,
            telefono: c.telefono,
            created_at: c.created_at,
            total_ordenes: c.ordenes.length,
            gasto_total: c.ordenes.reduce((acc, o) => acc + Number(o.total ?? 0), 0),
            ultima_orden: c.ordenes[0]?.fecha_orden ?? null,
        }));
        res.json({ success: true, data });
    },
    async me(req, res) {
        const cliente = await prisma_1.prisma.cli_clientes.findUnique({
            where: { id: req.user.id },
            select: { id: true, email: true, nombre: true, apellido: true, telefono: true, created_at: true },
        });
        if (!cliente)
            return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
        res.json({ success: true, data: cliente });
    },
    async listarDirecciones(req, res) {
        const direcciones = await prisma_1.prisma.cli_direcciones.findMany({
            where: { cliente_id: req.user.id },
            orderBy: [{ es_principal: 'desc' }, { id: 'desc' }],
        });
        res.json({ success: true, data: direcciones });
    },
    async crearDireccion(req, res) {
        const validated = direccionSchema.parse(req.body);
        const dir = await prisma_1.prisma.cli_direcciones.create({
            data: { ...validated, cliente_id: req.user.id, es_principal: validated.es_principal ?? false },
        });
        res.status(201).json({ success: true, data: dir });
    },
    async actualizarDireccion(req, res) {
        const id = Number(req.params.id);
        const validated = direccionSchema.partial().parse(req.body);
        const existente = await prisma_1.prisma.cli_direcciones.findFirst({ where: { id, cliente_id: req.user.id } });
        if (!existente)
            return res.status(404).json({ success: false, message: 'Dirección no encontrada' });
        const dir = await prisma_1.prisma.cli_direcciones.update({
            where: { id },
            data: validated,
        });
        res.json({ success: true, data: dir });
    },
    async eliminarDireccion(req, res) {
        const id = Number(req.params.id);
        const existente = await prisma_1.prisma.cli_direcciones.findFirst({ where: { id, cliente_id: req.user.id } });
        if (!existente)
            return res.status(404).json({ success: false, message: 'Dirección no encontrada' });
        await prisma_1.prisma.cli_direcciones.delete({ where: { id } });
        res.json({ success: true, message: 'Dirección eliminada' });
    },
    async historialCompras(req, res) {
        const ordenes = await prisma_1.prisma.ord_ordenes.findMany({
            where: { cliente_id: req.user.id },
            include: { items: { include: { producto: true } }, estado: true },
            orderBy: { fecha_orden: 'desc' },
        });
        res.json({ success: true, data: ordenes });
    },
};
//# sourceMappingURL=cliente.controller.js.map