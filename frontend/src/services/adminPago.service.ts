import api from './api';

export const adminPagoService = {
  async listar(params?: {
    estado?: string;
    desde?: string;
    hasta?: string;
    orden_codigo?: string;
    cliente_email?: string;
  }) {
    const res = await api.get('/pagos', { params });
    return res.data;
  },
};

