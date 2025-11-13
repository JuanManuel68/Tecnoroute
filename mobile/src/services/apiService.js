import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// URL base del backend - ajusta según tu configuración
const API_URL = 'http://localhost:8000';

// Crear instancia de axios
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a las peticiones
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Token ${token}`;
      }
    } catch (error) {
      console.error('Error al obtener token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

// Servicios de Autenticación
export const authService = {
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/api/auth/login/', {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  register: async (userData) => {
    try {
      const response = await apiClient.post('/api/auth/register/', {
        username: userData.email,
        email: userData.email,
        nombres: userData.nombres,
        apellidos: userData.apellidos,
        password: userData.password,
        password_confirm: userData.password_confirm || userData.password,
        telefono: userData.phone || '',
        direccion: userData.address || '',
        ciudad: userData.city || '',
        role: userData.role || 'customer',
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error de conexión' };
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  },
};

// Servicios de Productos
export const productService = {
  getAll: async () => {
    try {
      const response = await apiClient.get('/api/productos/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al obtener productos' };
    }
  },

  getById: async (id) => {
    try {
      const response = await apiClient.get(`/api/productos/${id}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al obtener producto' };
    }
  },
};

// Servicios de Carrito
export const cartService = {
  get: async () => {
    try {
      const response = await apiClient.get('/api/carrito/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al obtener carrito' };
    }
  },

  addItem: async (productId, quantity) => {
    try {
      const response = await apiClient.post('/api/carrito/', {
        producto_id: productId,
        cantidad: quantity,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al agregar al carrito' };
    }
  },

  updateItem: async (itemId, quantity) => {
    try {
      const response = await apiClient.patch('/api/carrito/', {
        item_id: itemId,
        cantidad: quantity,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al actualizar carrito' };
    }
  },

  removeItem: async (itemId) => {
    try {
      const response = await apiClient.delete('/api/carrito/', {
        data: { item_id: itemId },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al eliminar del carrito' };
    }
  },
};

// Servicios de Pedidos
export const orderService = {
  getMyOrders: async () => {
    try {
      const response = await apiClient.get('/api/pedidos/mis_pedidos/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al obtener pedidos' };
    }
  },

  create: async (orderData) => {
    try {
      const response = await apiClient.post('/api/pedidos/', orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al crear pedido' };
    }
  },
};

export default apiClient;
