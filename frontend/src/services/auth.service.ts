import axios from 'axios';

const API_URL = 'https://carrito-compras-complete.onrender.com/api/v1';

// Crear instancia de axios para auth (sin token para login/register)
const authClient = axios.create({
  baseURL: API_URL,
});

// Crear instancia de axios para peticiones autenticadas
const apiClient = axios.create({
  baseURL: API_URL,
});

// Interceptor para agregar token de autenticación
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  async login(data: { email: string; password: string }) {
    const response = await authClient.post('/auth/login', data);
    return response.data.data;
  },

  async register(data: { email: string; password: string; nombre: string; apellido: string }) {
    const response = await authClient.post('/auth/register', data);
    return response.data.data;
  },

  async refreshToken(refreshToken?: string | null) {
    const response = await authClient.post('/auth/refresh', {
      refresh_token: refreshToken ?? localStorage.getItem('refresh_token')
    });
    return response.data.data;
  },

  async logout(refreshToken?: string | null) {
    const response = await apiClient.post('/auth/logout', {
      refresh_token: refreshToken ?? localStorage.getItem('refresh_token')
    });
    return response.data;
  },

  async getProfile() {
    const response = await apiClient.get('/auth/profile');
    return response.data.data;
  }
};