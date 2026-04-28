import api from './api';

export const adminInventarioService = {
  async listar() {
    const res = await api.get('/inventario');
    return res.data;
  },

  async stockBajo() {
    const res = await api.get('/inventario/stock-bajo');
    return res.data;
  },

  async agotados() {
    const res = await api.get('/inventario/agotados');
    return res.data;
  },

  async movimientos(productoId?: number) {
    const res = await api.get('/inventario/movimientos', { params: productoId ? { productoId } : undefined });
    return res.data;
  },

  async ajustarStock(productoId: number, cantidad: number) {
    const res = await api.put(`/inventario/stock/${productoId}`, { cantidad });
    return res.data;
  },

  async actualizarStockMinimo(productoId: number, stockMinimo: number) {
    const res = await api.put(`/inventario/stock-minimo/${productoId}`, { stock_minimo: stockMinimo });
    return res.data;
  },
};

