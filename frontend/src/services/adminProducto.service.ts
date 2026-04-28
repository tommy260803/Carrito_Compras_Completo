import api from './api';

export const adminProductoService = {
  async listar(params?: { page?: number; limit?: number; categoria?: number; search?: string }) {
    const res = await api.get('/productos', { params });
    return res.data;
  },

  async crear(data: any) {
    const res = await api.post('/productos', data);
    return res.data;
  },

  async actualizar(id: number, data: any) {
    const res = await api.put(`/productos/${id}`, data);
    return res.data;
  },

  async eliminar(id: number) {
    const res = await api.delete(`/productos/${id}`);
    return res.data;
  },
};

