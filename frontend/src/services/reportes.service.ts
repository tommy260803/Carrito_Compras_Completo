import api from './api';

export const reportesService = {
  async descargarVentasPDF() {
    const response = await api.get('/reportes-pdf/ventas', {
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'reporte-ventas.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  async descargarInventarioPDF() {
    const response = await api.get('/reportes-pdf/inventario', {
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'reporte-inventario.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  async descargarOrdenesPDF() {
    const response = await api.get('/reportes-pdf/ordenes', {
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'reporte-ordenes.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  async descargarPagosPDF() {
    const response = await api.get('/reportes-pdf/pagos', {
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'reporte-pagos.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
};
