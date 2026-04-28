import api from './api';

export const carritoService = {
  async getCarrito() {
    const response = await api.get('/carrito');
    return response.data;
  },

  async agregarItem(data: { producto_id: number; cantidad: number }) {
    const response = await api.post('/carrito/items', data);
    return response.data;
  },

  async actualizarItem(itemId: number, data: { cantidad: number }) {
    const response = await api.put(`/carrito/items/${itemId}`, data);
    return response.data;
  },

  async eliminarItem(itemId: number) {
    const response = await api.delete(`/carrito/items/${itemId}`);
    return response.data;
  },

  async vaciarCarrito() {
    const response = await api.delete('/carrito/vaciar');
    return response.data;
  }
};
