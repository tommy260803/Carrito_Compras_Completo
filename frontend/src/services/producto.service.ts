import api from './api';

export const productoService = {
  async getProductos(params?: { page?: number; limit?: number; categoria?: number; search?: string }) {
    const response = await api.get('/productos', { params });
    return response.data;
  },

  async getProducto(id: number) {
    const response = await api.get(`/productos/${id}`);
    return response.data;
  },

  async createProducto(data: any) {
    const response = await api.post('/productos', data);
    return response.data;
  },

  async updateProducto(id: number, data: any) {
    const response = await api.put(`/productos/${id}`, data);
    return response.data;
  },

  async deleteProducto(id: number) {
    const response = await api.delete(`/productos/${id}`);
    return response.data;
  }
};