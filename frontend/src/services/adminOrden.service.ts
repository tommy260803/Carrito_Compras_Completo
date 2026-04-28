import api from './api';

export const adminOrdenService = {
  async listar(params?: { page?: number; limit?: number; estado_id?: number; search?: string }) {
    const res = await api.get('/ordenes', { params });
    return res.data;
  },

  async estados() {
    const res = await api.get('/ordenes/estados');
    return res.data;
  },

  async obtener(id: number) {
    const res = await api.get(`/ordenes/${id}`);
    return res.data;
  },

  async cambiarEstado(id: number, data: { estado_id: number; comentario?: string }) {
    const res = await api.put(`/ordenes/${id}/estado`, data);
    return res.data;
  },
};

