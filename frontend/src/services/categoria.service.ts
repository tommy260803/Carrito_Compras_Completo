import api from './api';

export const categoriaService = {
  async listar() {
    const res = await api.get('/categorias');
    return res.data.data;
  },

  async obtener(id: number) {
    const res = await api.get(`/categorias/${id}`);
    return res.data.data;
  },

  async crear(data: { nombre: string; slug?: string; padre_id?: number }) {
    const res = await api.post('/categorias', data);
    return res.data.data;
  },

  async actualizar(id: number, data: { nombre?: string; slug?: string; padre_id?: number; activo?: boolean }) {
    const res = await api.put(`/categorias/${id}`, data);
    return res.data.data;
  },

  async eliminar(id: number) {
    const res = await api.delete(`/categorias/${id}`);
    return res.data;
  }
};
