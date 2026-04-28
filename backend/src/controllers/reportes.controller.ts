import { Request, Response } from 'express';
import { reportesService } from '../services/reportes.service';

export const reportesController = {
  async ventasPDF(req: Request, res: Response) {
    try {
      const ventas = await reportesService.reporteVentas();
      const pdfBuffer = await reportesService.generarPDFVentas(ventas);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=reporte-ventas.pdf');
      res.send(pdfBuffer);
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al generar reporte de ventas' });
    }
  },

  async inventarioPDF(req: Request, res: Response) {
    try {
      const inventario = await reportesService.reporteInventario();
      const pdfBuffer = await reportesService.generarPDFInventario(inventario);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=reporte-inventario.pdf');
      res.send(pdfBuffer);
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al generar reporte de inventario' });
    }
  },

  async ordenesPDF(req: Request, res: Response) {
    try {
      const ordenes = await reportesService.reporteOrdenes();
      const pdfBuffer = await reportesService.generarPDFOrdenes(ordenes);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=reporte-ordenes.pdf');
      res.send(pdfBuffer);
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al generar reporte de órdenes' });
    }
  },

  async pagosPDF(req: Request, res: Response) {
    try {
      const pagos = await reportesService.reportePagos();
      const pdfBuffer = await reportesService.generarPDFPagos(pagos);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=reporte-pagos.pdf');
      res.send(pdfBuffer);
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al generar reporte de pagos' });
    }
  }
};
