import api from './api';

export const clienteService = {
  async getMe() {
    const res = await api.get('/clientes/me');
    return res.data;
  },

  async listarDirecciones() {
    const res = await api.get('/clientes/direcciones');
    return res.data;
  },

  async crearDireccion(data: {
    nombre: string;
    direccion: string;
    ciudad: string;
    provincia: string;
    codigo_postal: string;
    telefono?: string;
    es_principal?: boolean;
  }) {
    const res = await api.post('/clientes/direcciones', data);
    return res.data;
  },

  async historialCompras() {
    const res = await api.get('/clientes/historial-compras');
    return res.data;
  },
};

