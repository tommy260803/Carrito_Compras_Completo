"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reporteController = void 0;
const reporte_service_1 = require("../services/reporte.service");
exports.reporteController = {
    async kpis(req, res) {
        const data = await reporte_service_1.reporteService.kpis();
        res.json({ success: true, data });
    },
    async ventasDiarias(req, res) {
        const desde = req.query.desde ? new Date(String(req.query.desde)) : new Date(Date.now() - 7 * 86400000);
        const hasta = req.query.hasta ? new Date(String(req.query.hasta)) : new Date();
        const data = await reporte_service_1.reporteService.ventasDiarias(desde, hasta);
        res.json({ success: true, data });
    },
    async ventasPorCategoria(req, res) {
        const data = await reporte_service_1.reporteService.ventasPorCategoria();
        res.json({ success: true, data });
    },
    async productosMasVendidos(req, res) {
        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const data = await reporte_service_1.reporteService.productosMasVendidos(limit);
        res.json({ success: true, data });
    },
};
//# sourceMappingURL=reporte.controller.js.map