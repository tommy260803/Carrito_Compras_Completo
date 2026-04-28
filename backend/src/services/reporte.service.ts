import { prisma } from '../config/prisma';

export const reporteService = {
  async kpis() {
    const [ventasAgg, ordenesPendientes, sinStock] = await Promise.all([
      prisma.ord_ordenes.aggregate({
        _sum: { total: true },
        _avg: { total: true },
      }),
      prisma.ord_ordenes.count({ where: { estado_id: 1 } }),
      prisma.inv_stock_producto.count({ where: { disponible: { lte: 0 } } }),
    ]);

    return {
      ventasTotales: Number(ventasAgg._sum.total ?? 0),
      ticketPromedio: Number(ventasAgg._avg.total ?? 0),
      ordenesPendientes,
      productosSinStock: sinStock,
    };
  },

  async ventasDiarias(desde: Date, hasta: Date) {
    const data = await prisma.$queryRaw<
      Array<{ fecha: string; total: any }>
    >`SELECT DATE(o.fecha_orden) as fecha, SUM(o.total) as total
      FROM ord_ordenes o
      WHERE o.fecha_orden >= ${desde} AND o.fecha_orden <= ${hasta}
      GROUP BY DATE(o.fecha_orden)
      ORDER BY DATE(o.fecha_orden) ASC`;

    return data.map((row) => ({ fecha: String(row.fecha), total: Number(row.total ?? 0) }));
  },

  async ventasPorCategoria() {
    const data = await prisma.$queryRaw<Array<{ categoria: string; total: any }>>`
      SELECT c.nombre as categoria, COALESCE(SUM(oi.cantidad * oi.precio_unitario), 0) as total
      FROM cat_categorias c
      LEFT JOIN cat_productos p ON c.id = p.categoria_id
      LEFT JOIN ord_items_orden oi ON p.id = oi.producto_id
      GROUP BY c.nombre
      ORDER BY total DESC`;

    return data.map((row) => ({ categoria: String(row.categoria), total: Number(row.total ?? 0) }));
  },

  async productosMasVendidos(limit: number) {
    const data = await prisma.$queryRaw<Array<{ producto_id: number; nombre: string; cantidad: any }>>`
      SELECT p.id as producto_id, p.nombre as nombre, SUM(oi.cantidad) as cantidad
      FROM ord_items_orden oi
      JOIN cat_productos p ON oi.producto_id = p.id
      GROUP BY p.id, p.nombre
      ORDER BY cantidad DESC
      LIMIT ${limit}`;

    return data.map((row) => ({ producto_id: row.producto_id, nombre: row.nombre, cantidad: Number(row.cantidad ?? 0) }));
  },
};