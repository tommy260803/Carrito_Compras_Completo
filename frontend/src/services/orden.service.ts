import api from './api';

export const ordenService = {
  async crearOrden(data: { carrito_id: number; direccion_envio_id: number; metodo_pago: string }) {
    const res = await api.post('/ordenes', data);
    return res.data;
  },

  async misOrdenes() {
    const res = await api.get('/ordenes/mis-ordenes');
    return res.data;
  },

  async detalleMiOrden(id: number) {
    const res = await api.get(`/ordenes/mis-ordenes/${id}`);
    return res.data;
  },
};

