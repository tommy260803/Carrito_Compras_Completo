import api from './api';

export const pagoService = {
  async registrarPago(data: {
    orden_id: number;
    metodo: string;
    monto: number;
    referencia?: string;
    transaccion_id?: string;
    estado?: 'pendiente' | 'pagado' | 'fallido' | 'reembolsado';
  }) {
    const res = await api.post('/pagos', data);
    return res.data;
  },

  async pagosDeOrden(ordenId: number) {
    const res = await api.get(`/pagos/orden/${ordenId}`);
    return res.data;
  },
};

