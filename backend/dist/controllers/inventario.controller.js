"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventarioController = void 0;
const prisma_1 = require("../config/prisma");
const zod_1 = require("zod");
const ajustarSchema = zod_1.z.object({
    cantidad: zod_1.z.number().int().min(0),
});
exports.inventarioController = {
    async stockBajo(req, res) {
        const threshold = req.query.threshold ? Number(req.query.threshold) : 5;
        const data = await prisma_1.prisma.inv_stock_producto.findMany({
            where: { disponible: { lte: threshold } },
            include: { producto: true },
            orderBy: { disponible: 'asc' },
        });
        res.json({ success: true, data });
    },
    async agotados(req, res) {
        const data = await prisma_1.prisma.inv_stock_producto.findMany({
            where: { disponible: { lte: 0 } },
            include: { producto: true },
            orderBy: { disponible: 'asc' },
        });
        res.json({ success: true, data });
    },
    async ajustarStock(req, res) {
        const productoId = Number(req.params.productoId);
        const { cantidad } = ajustarSchema.parse(req.body);
        const stock = (await prisma_1.prisma.inv_stock_producto.findUnique({ where: { producto_id: productoId } })) ??
            (await prisma_1.prisma.inv_stock_producto.create({ data: { producto_id: productoId, cantidad: 0, reservado: 0, disponible: 0 } }));
        const disponible = Math.max(0, cantidad - stock.reservado);
        const updated = await prisma_1.prisma.inv_stock_producto.update({
            where: { producto_id: productoId },
            data: { cantidad, disponible },
        });
        await prisma_1.prisma.inv_movimientos_inventario.create({
            data: {
                producto_id: productoId,
                tipo: 'ajuste',
                cantidad: cantidad - stock.cantidad,
                referencia: 'Ajuste manual',
                usuario_id: req.user.id,
            },
        });
        res.json({ success: true, data: updated });
    },
};
//# sourceMappingURL=inventario.controller.js.map