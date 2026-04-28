import { prisma } from '../config/prisma';
import PDFDocument from 'pdfkit';
import { AppError } from '../utils/AppError';

export const reportesService = {
  async reporteVentas() {
    const ordenes = await prisma.ord_ordenes.findMany({
      include: {
        cliente: true,
        items: {
          include: {
            producto: true
          }
        },
        pagos: true,
        estado: true
      },
      orderBy: { fecha_orden: 'desc' }
    });

    return ordenes;
  },

  async reporteInventario() {
    const productos = await prisma.cat_productos.findMany({
      where: { activo: true },
      include: {
        categoria: true,
        stock: true
      },
      orderBy: { nombre: 'asc' }
    });

    return productos;
  },

  async reporteOrdenes() {
    const ordenes = await prisma.ord_ordenes.findMany({
      include: {
        cliente: true,
        items: {
          include: {
            producto: true
          }
        },
        estado: true
      },
      orderBy: { fecha_orden: 'desc' }
    });

    return ordenes;
  },

  async reportePagos() {
    const pagos = await prisma.pag_pagos.findMany({
      include: {
        orden: {
          include: {
            cliente: true
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    return pagos;
  },

  generarPDFVentas(ordenes: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 60, size: 'A4' });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Encabezado
      doc.fontSize(24).font('Helvetica-Bold').fill('#1e3a8a').text('Sistema de E-Commerce', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(18).font('Helvetica').fill('#374151').text('Reporte de Ventas', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica').fill('#6b7280').text(`Fecha de generación: ${new Date().toLocaleString('es-ES')}`, { align: 'right' });
      doc.moveDown();

      // Línea separadora
      doc.moveTo(60, doc.y).lineTo(535, doc.y).lineWidth(1).stroke('#e5e7eb');
      doc.moveDown();

      if (ordenes.length === 0) {
        doc.fontSize(12).font('Helvetica').fill('#6b7280').text('No hay ventas registradas', { align: 'center' });
      } else {
        // Tabla principal
        const tableTop = doc.y;
        const headers = ['Cliente', 'Fecha', 'Total', 'Método', 'Estado'];
        const colWidths = [140, 100, 80, 80, 80];
        const rowHeight = 25;

        // Encabezados de tabla
        doc.fontSize(10).font('Helvetica-Bold').fill('#1e3a8a');
        let x = 60;
        headers.forEach((header, i) => {
          doc.text(header, x, tableTop, { width: colWidths[i] });
          x += colWidths[i];
        });
        doc.moveDown();

        // Línea debajo de encabezados
        doc.moveTo(60, doc.y).lineTo(535, doc.y).lineWidth(0.5).stroke('#d1d5db');
        doc.moveDown(0.3);

        // Filas de datos
        doc.fontSize(9).font('Helvetica').fill('#374151');
        ordenes.forEach((orden: any, index: number) => {
          const cliente = `${orden.cliente?.nombre || 'N/A'} ${orden.cliente?.apellido || ''}`.substring(0, 20);
          const fecha = new Date(orden.fecha_orden).toLocaleDateString('es-ES');
          const total = `$${Number(orden.total).toFixed(2)}`;
          const metodo = orden.pagos?.[0]?.metodo || orden.metodo_pago || 'N/A';
          const estado = orden.estado?.nombre || 'N/A';

          x = 60;
          doc.text(cliente, x, doc.y, { width: colWidths[0] });
          x += colWidths[0];
          doc.text(fecha, x, doc.y, { width: colWidths[1] });
          x += colWidths[1];
          doc.text(total, x, doc.y, { width: colWidths[2] });
          x += colWidths[2];
          doc.text(metodo.substring(0, 10), x, doc.y, { width: colWidths[3] });
          x += colWidths[3];
          doc.text(estado.substring(0, 10), x, doc.y, { width: colWidths[4] });
          doc.moveDown(0.5);

          // Línea entre filas
          if (index < ordenes.length - 1) {
            doc.moveTo(60, doc.y).lineTo(535, doc.y).lineWidth(0.3).stroke('#f3f4f6');
            doc.moveDown(0.3);
          }
        });

        // Resumen
        doc.moveDown();
        doc.moveTo(60, doc.y).lineTo(535, doc.y).lineWidth(1).stroke('#e5e7eb');
        doc.moveDown();
        const totalVentas = ordenes.reduce((sum: number, o: any) => sum + Number(o.total), 0);
        doc.fontSize(12).font('Helvetica-Bold').fill('#1e3a8a').text(`Total de ventas: $${totalVentas.toFixed(2)}`, { align: 'right' });
        doc.fontSize(10).font('Helvetica').fill('#6b7280').text(`Cantidad de órdenes: ${ordenes.length}`, { align: 'right' });
      }

      // Pie de página
      doc.fontSize(8).font('Helvetica').fill('#9ca3af').text('Documento generado automáticamente por Sistema de E-Commerce', { align: 'center' });

      doc.end();
    });
  },

  generarPDFInventario(productos: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 60, size: 'A4' });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Encabezado
      doc.fontSize(24).font('Helvetica-Bold').fill('#1e3a8a').text('Sistema de E-Commerce', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(18).font('Helvetica').fill('#374151').text('Reporte de Inventario', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica').fill('#6b7280').text(`Fecha de generación: ${new Date().toLocaleString('es-ES')}`, { align: 'right' });
      doc.moveDown();

      // Línea separadora
      doc.moveTo(60, doc.y).lineTo(535, doc.y).lineWidth(1).stroke('#e5e7eb');
      doc.moveDown();

      if (productos.length === 0) {
        doc.fontSize(12).font('Helvetica').fill('#6b7280').text('No hay productos en inventario', { align: 'center' });
      } else {
        // Tabla principal
        const tableTop = doc.y;
        const headers = ['Producto', 'Categoría', 'Stock Actual', 'Stock Mínimo', 'Estado'];
        const colWidths = [150, 100, 80, 80, 80];

        // Encabezados de tabla
        doc.fontSize(10).font('Helvetica-Bold').fill('#1e3a8a');
        let x = 60;
        headers.forEach((header, i) => {
          doc.text(header, x, tableTop, { width: colWidths[i] });
          x += colWidths[i];
        });
        doc.moveDown();

        // Línea debajo de encabezados
        doc.moveTo(60, doc.y).lineTo(535, doc.y).lineWidth(0.5).stroke('#d1d5db');
        doc.moveDown(0.3);

        // Filas de datos
        doc.fontSize(9).font('Helvetica').fill('#374151');
        productos.forEach((producto: any, index: number) => {
          const disponible = producto.stock?.disponible ?? 0;
          const minimo = producto.stock_minimo;
          const estado = disponible === 0 ? 'Agotado' : disponible <= minimo ? 'Bajo' : 'Normal';

          x = 60;
          doc.text(producto.nombre.substring(0, 25), x, doc.y, { width: colWidths[0] });
          x += colWidths[0];
          doc.text(producto.categoria?.nombre || 'N/A', x, doc.y, { width: colWidths[1] });
          x += colWidths[1];
          doc.text(disponible.toString(), x, doc.y, { width: colWidths[2] });
          x += colWidths[2];
          doc.text(minimo.toString(), x, doc.y, { width: colWidths[3] });
          x += colWidths[3];
          doc.text(estado, x, doc.y, { width: colWidths[4] });
          doc.moveDown(0.5);

          // Línea entre filas
          if (index < productos.length - 1) {
            doc.moveTo(60, doc.y).lineTo(535, doc.y).lineWidth(0.3).stroke('#f3f4f6');
            doc.moveDown(0.3);
          }
        });

        // Resumen
        doc.moveDown();
        doc.moveTo(60, doc.y).lineTo(535, doc.y).lineWidth(1).stroke('#e5e7eb');
        doc.moveDown();
        const agotados = productos.filter((p: any) => (p.stock?.disponible ?? 0) === 0).length;
        const bajoStock = productos.filter((p: any) => (p.stock?.disponible ?? 0) <= p.stock_minimo && (p.stock?.disponible ?? 0) > 0).length;
        doc.fontSize(12).font('Helvetica-Bold').fill('#1e3a8a').text(`Total productos: ${productos.length}`, { align: 'right' });
        doc.fontSize(10).font('Helvetica').fill('#dc2626').text(`Agotados: ${agotados}`, { align: 'right' });
        doc.fontSize(10).font('Helvetica').fill('#f59e0b').text(`Stock bajo: ${bajoStock}`, { align: 'right' });
      }

      // Pie de página
      doc.fontSize(8).font('Helvetica').fill('#9ca3af').text('Documento generado automáticamente por Sistema de E-Commerce', { align: 'center' });

      doc.end();
    });
  },

  generarPDFOrdenes(ordenes: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 60, size: 'A4' });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Encabezado
      doc.fontSize(24).font('Helvetica-Bold').fill('#1e3a8a').text('Sistema de E-Commerce', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(18).font('Helvetica').fill('#374151').text('Reporte de Órdenes', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica').fill('#6b7280').text(`Fecha de generación: ${new Date().toLocaleString('es-ES')}`, { align: 'right' });
      doc.moveDown();

      // Línea separadora
      doc.moveTo(60, doc.y).lineTo(535, doc.y).lineWidth(1).stroke('#e5e7eb');
      doc.moveDown();

      if (ordenes.length === 0) {
        doc.fontSize(12).font('Helvetica').fill('#6b7280').text('No hay órdenes registradas', { align: 'center' });
      } else {
        // Tabla principal
        const tableTop = doc.y;
        const headers = ['Orden', 'Cliente', 'Fecha', 'Total', 'Estado'];
        const colWidths = [80, 140, 100, 80, 80];

        // Encabezados de tabla
        doc.fontSize(10).font('Helvetica-Bold').fill('#1e3a8a');
        let x = 60;
        headers.forEach((header, i) => {
          doc.text(header, x, tableTop, { width: colWidths[i] });
          x += colWidths[i];
        });
        doc.moveDown();

        // Línea debajo de encabezados
        doc.moveTo(60, doc.y).lineTo(535, doc.y).lineWidth(0.5).stroke('#d1d5db');
        doc.moveDown(0.3);

        // Filas de datos
        doc.fontSize(9).font('Helvetica').fill('#374151');
        ordenes.forEach((orden: any, index: number) => {
          const cliente = `${orden.cliente?.nombre || 'N/A'} ${orden.cliente?.apellido || ''}`.substring(0, 20);
          const fecha = new Date(orden.fecha_orden).toLocaleDateString('es-ES');
          const total = `$${Number(orden.total).toFixed(2)}`;
          const estado = orden.estado?.nombre || 'N/A';

          x = 60;
          doc.text(orden.codigo.substring(0, 12), x, doc.y, { width: colWidths[0] });
          x += colWidths[0];
          doc.text(cliente, x, doc.y, { width: colWidths[1] });
          x += colWidths[1];
          doc.text(fecha, x, doc.y, { width: colWidths[2] });
          x += colWidths[2];
          doc.text(total, x, doc.y, { width: colWidths[3] });
          x += colWidths[3];
          doc.text(estado.substring(0, 10), x, doc.y, { width: colWidths[4] });
          doc.moveDown(0.5);

          // Línea entre filas
          if (index < ordenes.length - 1) {
            doc.moveTo(60, doc.y).lineTo(535, doc.y).lineWidth(0.3).stroke('#f3f4f6');
            doc.moveDown(0.3);
          }
        });

        // Resumen
        doc.moveDown();
        doc.moveTo(60, doc.y).lineTo(535, doc.y).lineWidth(1).stroke('#e5e7eb');
        doc.moveDown();
        const totalOrdenes = ordenes.reduce((sum: number, o: any) => sum + Number(o.total), 0);
        doc.fontSize(12).font('Helvetica-Bold').fill('#1e3a8a').text(`Total de órdenes: $${totalOrdenes.toFixed(2)}`, { align: 'right' });
        doc.fontSize(10).font('Helvetica').fill('#6b7280').text(`Cantidad de órdenes: ${ordenes.length}`, { align: 'right' });
      }

      // Pie de página
      doc.fontSize(8).font('Helvetica').fill('#9ca3af').text('Documento generado automáticamente por Sistema de E-Commerce', { align: 'center' });

      doc.end();
    });
  },

  generarPDFPagos(pagos: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 60, size: 'A4' });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Encabezado
      doc.fontSize(24).font('Helvetica-Bold').fill('#1e3a8a').text('Sistema de E-Commerce', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(18).font('Helvetica').fill('#374151').text('Reporte de Pagos', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica').fill('#6b7280').text(`Fecha de generación: ${new Date().toLocaleString('es-ES')}`, { align: 'right' });
      doc.moveDown();

      // Línea separadora
      doc.moveTo(60, doc.y).lineTo(535, doc.y).lineWidth(1).stroke('#e5e7eb');
      doc.moveDown();

      if (pagos.length === 0) {
        doc.fontSize(12).font('Helvetica').fill('#6b7280').text('No hay pagos registrados', { align: 'center' });
      } else {
        // Tabla principal
        const tableTop = doc.y;
        const headers = ['Cliente', 'Monto', 'Método', 'Fecha', 'Estado'];
        const colWidths = [140, 80, 80, 100, 80];

        // Encabezados de tabla
        doc.fontSize(10).font('Helvetica-Bold').fill('#1e3a8a');
        let x = 60;
        headers.forEach((header, i) => {
          doc.text(header, x, tableTop, { width: colWidths[i] });
          x += colWidths[i];
        });
        doc.moveDown();

        // Línea debajo de encabezados
        doc.moveTo(60, doc.y).lineTo(535, doc.y).lineWidth(0.5).stroke('#d1d5db');
        doc.moveDown(0.3);

        // Filas de datos
        doc.fontSize(9).font('Helvetica').fill('#374151');
        pagos.forEach((pago: any, index: number) => {
          const cliente = `${pago.orden?.cliente?.nombre || 'N/A'} ${pago.orden?.cliente?.apellido || ''}`.substring(0, 20);
          const monto = `$${Number(pago.monto).toFixed(2)}`;
          const metodo = pago.metodo || 'N/A';
          const fecha = new Date(pago.created_at).toLocaleDateString('es-ES');
          const estado = pago.estado || 'N/A';

          x = 60;
          doc.text(cliente, x, doc.y, { width: colWidths[0] });
          x += colWidths[0];
          doc.text(monto, x, doc.y, { width: colWidths[1] });
          x += colWidths[1];
          doc.text(metodo.substring(0, 10), x, doc.y, { width: colWidths[2] });
          x += colWidths[2];
          doc.text(fecha, x, doc.y, { width: colWidths[3] });
          x += colWidths[3];
          doc.text(estado.substring(0, 10), x, doc.y, { width: colWidths[4] });
          doc.moveDown(0.5);

          // Línea entre filas
          if (index < pagos.length - 1) {
            doc.moveTo(60, doc.y).lineTo(535, doc.y).lineWidth(0.3).stroke('#f3f4f6');
            doc.moveDown(0.3);
          }
        });

        // Resumen
        doc.moveDown();
        doc.moveTo(60, doc.y).lineTo(535, doc.y).lineWidth(1).stroke('#e5e7eb');
        doc.moveDown();
        const totalPagos = pagos.reduce((sum: number, p: any) => sum + Number(p.monto), 0);
        const pagados = pagos.filter((p: any) => p.estado === 'pagado').length;
        const pendientes = pagos.filter((p: any) => p.estado === 'pendiente').length;
        doc.fontSize(12).font('Helvetica-Bold').fill('#1e3a8a').text(`Total pagado: $${totalPagos.toFixed(2)}`, { align: 'right' });
        doc.fontSize(10).font('Helvetica').fill('#10b981').text(`Pagados: ${pagados}`, { align: 'right' });
        doc.fontSize(10).font('Helvetica').fill('#f59e0b').text(`Pendientes: ${pendientes}`, { align: 'right' });
      }

      // Pie de página
      doc.fontSize(8).font('Helvetica').fill('#9ca3af').text('Documento generado automáticamente por Sistema de E-Commerce', { align: 'center' });

      doc.end();
    });
  }
};
