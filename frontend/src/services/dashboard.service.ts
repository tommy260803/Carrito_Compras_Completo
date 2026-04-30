import api from './api';

export const dashboardService = {
  async getKPIs() {
    const res = await api.get('/reportes/kpis');
    return res.data.data;
  },

  async getVentasDiarias() {
    const res = await api.get('/reportes/ventas-diarias');
    return res.data.data;
  },

  async getVentasPorCategoria() {
    const res = await api.get('/reportes/ventas-por-categoria');
    return res.data.data;
  },

  async getProductosMasVendidos(limit: number = 10) {
    const res = await api.get(`/reportes/productos-mas-vendidos?limit=${limit}`);
    return res.data.data;
  }
};
