"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventarioController = void 0;
const inventario_service_1 = require("../services/inventario.service");
const zod_1 = require("zod");
const ajustarSchema = zod_1.z.object({
    cantidad: zod_1.z.number().int(),
});
const stockMinimoSchema = zod_1.z.object({
    stock_minimo: zod_1.z.number().int().min(0),
});
exports.inventarioController = {
    async list(req, res) {
        const data = await inventario_service_1.inventarioService.list();
        res.json({ success: true, data });
    },
    async stockBajo(req, res) {
        const data = await inventario_service_1.inventarioService.stockBajo();
        res.json({ success: true, data });
    },
    async agotados(req, res) {
        const data = await inventario_service_1.inventarioService.agotados();
        res.json({ success: true, data });
    },
    async movimientos(req, res) {
        const productoId = req.query.productoId ? Number(req.query.productoId) : undefined;
        const data = await inventario_service_1.inventarioService.movimientos(productoId);
        res.json({ success: true, data });
    },
    async ajustarStock(req, res) {
        const productoId = Number(req.params.productoId);
        const { cantidad } = ajustarSchema.parse(req.body);
        const data = await inventario_service_1.inventarioService.ajustarStock(productoId, cantidad, req.user.id);
        res.json({ success: true, data });
    },
    async actualizarStockMinimo(req, res) {
        const productoId = Number(req.params.productoId);
        const { stock_minimo } = stockMinimoSchema.parse(req.body);
        const data = await inventario_service_1.inventarioService.actualizarStockMinimo(productoId, stock_minimo);
        res.json({ success: true, data });
    },
};
//# sourceMappingURL=inventario.controller.js.map