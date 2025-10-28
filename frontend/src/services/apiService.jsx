import axios from 'axios';

// Create axios instance with default config
const apiService = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
apiService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiService.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, remove from storage
      localStorage.removeItem('authToken');
      // Redirect to login page if needed
      // window.location.href = '/login';
    }
    
    // Log error for debugging
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: error.config,
    });
    
    return Promise.reject(error);
  }
);

// API endpoints
const API_ENDPOINTS = {
  // Clientes
  clientes: '/api/clientes/',
  clientesActivos: '/api/clientes/activos/',
  
  // Conductores
  conductores: '/api/conductores/',
  conductoresDisponibles: '/api/conductores/disponibles/',
  
  // Vehículos
  vehiculos: '/api/vehiculos/',
  vehiculosDisponibles: '/api/vehiculos/disponibles/',
  
  // Rutas
  rutas: '/api/rutas/',
  rutasActivas: '/api/rutas/activas/',
  
  // Envíos
  envios: '/api/envios/',
  enviosPendientes: '/api/envios/pendientes/',
  enviosEnTransito: '/api/envios/en_transito/',
  buscarPorGuia: '/api/envios/buscar_por_guia/',
  
  // Seguimientos
  seguimientos: '/api/seguimientos/',
  
  // Pedidos
  pedidos: '/api/pedidos/',
  pedidosEstadisticas: '/api/pedidos/estadisticas/',
  pedidosRecientes: '/api/pedidos/recientes/',
  
  // Productos y categorías
  productos: '/api/productos/',
  categorias: '/api/categorias/',
  carrito: '/api/carrito/',
  
  // Autenticación
  login: '/api/auth/login/',
  register: '/api/auth/register/',
  
  // Dashboard
  dashboardStats: '/api/dashboard/stats/',
};

// Helper functions for common API operations
export const clientesAPI = {
  getAll: () => apiService.get(API_ENDPOINTS.clientes),
  getById: (id) => apiService.get(`${API_ENDPOINTS.clientes}${id}/`),
  create: (data) => apiService.post(API_ENDPOINTS.clientes, data),
  update: (id, data) => apiService.put(`${API_ENDPOINTS.clientes}${id}/`, data),
  delete: (id) => apiService.delete(`${API_ENDPOINTS.clientes}${id}/`),
  getActivos: () => apiService.get(API_ENDPOINTS.clientesActivos),
};

export const conductoresAPI = {
  getAll: () => apiService.get(API_ENDPOINTS.conductores),
  getById: (id) => apiService.get(`${API_ENDPOINTS.conductores}${id}/`),
  create: (data) => apiService.post(API_ENDPOINTS.conductores, data),
  update: (id, data) => apiService.put(`${API_ENDPOINTS.conductores}${id}/`, data),
  delete: (id) => apiService.delete(`${API_ENDPOINTS.conductores}${id}/`),
  getDisponibles: () => apiService.get(API_ENDPOINTS.conductoresDisponibles),
  cambiarEstado: (id, estado) => apiService.post(`${API_ENDPOINTS.conductores}${id}/cambiar_estado/`, { estado }),
};

export const vehiculosAPI = {
  getAll: () => apiService.get(API_ENDPOINTS.vehiculos),
  getById: (id) => apiService.get(`${API_ENDPOINTS.vehiculos}${id}/`),
  create: (data) => apiService.post(API_ENDPOINTS.vehiculos, data),
  update: (id, data) => apiService.put(`${API_ENDPOINTS.vehiculos}${id}/`, data),
  delete: (id) => apiService.delete(`${API_ENDPOINTS.vehiculos}${id}/`),
  getDisponibles: () => apiService.get(API_ENDPOINTS.vehiculosDisponibles),
  cambiarEstado: (id, estado) => apiService.post(`${API_ENDPOINTS.vehiculos}${id}/cambiar_estado/`, { estado }),
};

export const rutasAPI = {
  getAll: () => apiService.get(API_ENDPOINTS.rutas),
  getById: (id) => apiService.get(`${API_ENDPOINTS.rutas}${id}/`),
  create: (data) => apiService.post(API_ENDPOINTS.rutas, data),
  update: (id, data) => apiService.put(`${API_ENDPOINTS.rutas}${id}/`, data),
  delete: (id) => apiService.delete(`${API_ENDPOINTS.rutas}${id}/`),
  getActivas: () => apiService.get(API_ENDPOINTS.rutasActivas),
};

export const enviosAPI = {
  getAll: () => apiService.get(API_ENDPOINTS.envios),
  getById: (id) => apiService.get(`${API_ENDPOINTS.envios}${id}/`),
  create: (data) => apiService.post(API_ENDPOINTS.envios, data),
  update: (id, data) => apiService.put(`${API_ENDPOINTS.envios}${id}/`, data),
  delete: (id) => apiService.delete(`${API_ENDPOINTS.envios}${id}/`),
  getPendientes: () => apiService.get(API_ENDPOINTS.enviosPendientes),
  getEnTransito: () => apiService.get(API_ENDPOINTS.enviosEnTransito),
  buscarPorGuia: (numeroGuia) => apiService.get(`${API_ENDPOINTS.buscarPorGuia}?numero_guia=${numeroGuia}`),
  cambiarEstado: (id, data) => apiService.post(`${API_ENDPOINTS.envios}${id}/cambiar_estado/`, data),
  asignarVehiculoConductor: (id, data) => apiService.post(`${API_ENDPOINTS.envios}${id}/asignar_vehiculo_conductor/`, data),
  getSeguimiento: (id) => apiService.get(`${API_ENDPOINTS.envios}${id}/seguimiento/`),
};

export const seguimientosAPI = {
  getAll: () => apiService.get(API_ENDPOINTS.seguimientos),
  getByEnvio: (envioId) => apiService.get(`${API_ENDPOINTS.seguimientos}?envio=${envioId}`),
  create: (data) => apiService.post(API_ENDPOINTS.seguimientos, data),
};

export const pedidosAPI = {
  getAll: () => apiService.get(API_ENDPOINTS.pedidos),
  getById: (id) => apiService.get(`${API_ENDPOINTS.pedidos}${id}/`),
  create: (data) => apiService.post(API_ENDPOINTS.pedidos, data),
  update: (id, data) => apiService.patch(`${API_ENDPOINTS.pedidos}${id}/`, data),
  delete: (id) => apiService.delete(`${API_ENDPOINTS.pedidos}${id}/`),
  cambiarEstado: (id, estado) => apiService.patch(`${API_ENDPOINTS.pedidos}${id}/cambiar_estado/`, { estado }),
  tomarPedido: (id) => apiService.post(`${API_ENDPOINTS.pedidos}${id}/tomar_pedido/`),
  asignarConductor: (pedidoId, conductorId) => apiService.post(`${API_ENDPOINTS.pedidos}${pedidoId}/asignar_conductor/`, { conductor_id: conductorId }),
  getPendientes: () => apiService.get(`${API_ENDPOINTS.pedidos}pendientes/`),
  getMisPedidos: () => apiService.get(`${API_ENDPOINTS.pedidos}mis_pedidos/`),
  getEstadisticas: () => apiService.get(API_ENDPOINTS.pedidosEstadisticas),
  getRecientes: (limit = 10) => apiService.get(`${API_ENDPOINTS.pedidosRecientes}?limit=${limit}`),
};

// API de productos
export const productosAPI = {
  getAll: () => apiService.get(API_ENDPOINTS.productos),
  getById: (id) => apiService.get(`${API_ENDPOINTS.productos}${id}/`),
  create: (data) => apiService.post(API_ENDPOINTS.productos, data),
  update: (id, data) => apiService.put(`${API_ENDPOINTS.productos}${id}/`, data),
  delete: (id) => apiService.delete(`${API_ENDPOINTS.productos}${id}/`),
  search: (params) => apiService.get(API_ENDPOINTS.productos, { params }),
};

// API de categorías
export const categoriasAPI = {
  getAll: () => apiService.get(API_ENDPOINTS.categorias),
  getById: (id) => apiService.get(`${API_ENDPOINTS.categorias}${id}/`),
  create: (data) => apiService.post(API_ENDPOINTS.categorias, data),
  update: (id, data) => apiService.put(`${API_ENDPOINTS.categorias}${id}/`, data),
  delete: (id) => apiService.delete(`${API_ENDPOINTS.categorias}${id}/`),
};

// API del carrito
export const carritoAPI = {
  get: () => apiService.get(API_ENDPOINTS.carrito),
  addItem: (productoId, cantidad = 1) => apiService.post(API_ENDPOINTS.carrito, {
    producto_id: productoId,
    cantidad: cantidad
  }),
  updateItem: (itemId, cantidad) => apiService.patch(API_ENDPOINTS.carrito, {
    item_id: itemId,
    cantidad: cantidad
  }),
  removeItem: (itemId) => apiService.delete(API_ENDPOINTS.carrito, {
    data: { item_id: itemId }
  }),
  clear: () => {
    // Clear cart by removing all items - will be handled by getting cart and removing each item
    return apiService.get(API_ENDPOINTS.carrito).then(response => {
      const promises = response.data.items?.map(item => 
        apiService.delete(API_ENDPOINTS.carrito, {
          data: { item_id: item.id }
        })
      ) || [];
      return Promise.all(promises);
    });
  }
};

// API de autenticación
export const authAPI = {
  login: (email, password) => apiService.post(API_ENDPOINTS.login, { email, password }),
  register: (userData) => apiService.post(API_ENDPOINTS.register, userData),
};

// API del dashboard
export const dashboardAPI = {
  getStats: () => apiService.get(API_ENDPOINTS.dashboardStats),
};

// Utility functions
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.message || 
                   error.response.data?.detail || 
                   `Error ${error.response.status}: ${error.response.statusText}`;
    return message;
  } else if (error.request) {
    // Request was made but no response received
    return 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
  } else {
    // Something else happened
    return error.message || 'Ha ocurrido un error inesperado.';
  }
};

// Export default axios instance for direct use if needed
export default apiService;
