import axios from 'axios';

const API_URL = 'https://carrito-compras-complete.onrender.com/api/v1';

export const productoService = {
  async getProductos(params?: { page?: number; limit?: number; categoria?: number; search?: string }) {
    const response = await axios.get(`${API_URL}/productos`, { params });
    return response.data;
  },

  async getProducto(id: number) {
    const response = await axios.get(`${API_URL}/productos/${id}`);
    return response.data;
  },

  async createProducto(data: any) {
    const response = await axios.post(`${API_URL}/productos`, data);
    return response.data;
  },

  async updateProducto(id: number, data: any) {
    const response = await axios.put(`${API_URL}/productos/${id}`, data);
    return response.data;
  },

  async deleteProducto(id: number) {
    const response = await axios.delete(`${API_URL}/productos/${id}`);
    return response.data;
  }
};