"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.estadisticasService = void 0;
const prisma_1 = require("../config/prisma");
exports.estadisticasService = {
    async tendenciaMensual() {
        // Implementación mínima (JSON) para no romper build.
        // Retorna total por mes (últimos 12 meses) cuando existan órdenes.
        const data = await prisma_1.prisma.$queryRaw `
      SELECT TO_CHAR(DATE_TRUNC('month', o.fecha_orden), 'YYYY-MM') as mes,
             SUM(o.total) as total
      FROM ord_ordenes o
      GROUP BY DATE_TRUNC('month', o.fecha_orden)
      ORDER BY DATE_TRUNC('month', o.fecha_orden) DESC
      LIMIT 12`;
        return data
            .reverse()
            .map((row) => ({ mes: row.mes, total: Number(row.total ?? 0) }));
    },
    async analisisABC() {
        // Placeholder funcional: top productos por ingreso.
        const data = await prisma_1.prisma.$queryRaw `
      SELECT p.id as producto_id, p.nombre as nombre, SUM(oi.subtotal) as ingreso
      FROM ord_items_orden oi
      JOIN cat_productos p ON oi.producto_id = p.id
      GROUP BY p.id, p.nombre
      ORDER BY ingreso DESC
      LIMIT 50`;
        return data.map((row) => ({ producto_id: row.producto_id, nombre: row.nombre, ingreso: Number(row.ingreso ?? 0) }));
    },
    async calcularRFM() {
        // Placeholder: devuelve clientes con conteo de órdenes y gasto total.
        const data = await prisma_1.prisma.$queryRaw `
      SELECT c.id as cliente_id, c.email as email, COUNT(o.id) as ordenes, COALESCE(SUM(o.total),0) as gasto
      FROM cli_clientes c
      LEFT JOIN ord_ordenes o ON o.cliente_id = c.id
      GROUP BY c.id, c.email
      ORDER BY gasto DESC
      LIMIT 100`;
        return data.map((row) => ({
            cliente_id: row.cliente_id,
            email: row.email,
            ordenes: Number(row.ordenes ?? 0),
            gasto: Number(row.gasto ?? 0),
        }));
    },
};
//# sourceMappingURL=estadisticas.service.js.map