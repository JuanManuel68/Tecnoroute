import React, { useState, useEffect } from 'react';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ShoppingBagIcon,
  HeartIcon,
  CogIcon,
  ExclamationTriangleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

const ModernProfile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  // Ciudades disponibles
  const cities = [
  'Bogotá',
    'Soacha',
    'Chía',
    'Zipaquirá',
    'Cota',
    'Funza',
    'Mosquera',
    'Madrid',
    'Facatativá',
    'Cajicá',
    
    // Principales ciudades
    'Medellín',
    'Cali',
    'Barranquilla',
    'Cartagena',
    'Bucaramanga',
    'Pereira',
    'Manizales',
    'Armenia',
    'Cúcuta',
    'Ibagué',
    'Neiva',
    'Villavicencio',
    'Tunja',
    'Santa Marta',
    'Montería',
    'Sincelejo',
    'Popayán',
    'Pasto',
    'Valledupar',
    'Floridablanca',
    'Palmira',
    'Yopal',
    'Riohacha',
    'Quibdó',
    'Arauca',
    'Leticia'
  ];
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: ''
  });
  const [activeTab, setActiveTab] = useState('profile');
  const [errors, setErrors] = useState({});
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };


  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es obligatorio';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'La dirección es obligatoria';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'La ciudad es obligatoria';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      const token = localStorage.getItem('authToken');
      
      // Separar nombre completo en first_name y last_name
      const nameParts = formData.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      const response = await fetch('http://localhost:8000/api/auth/profile/', {
        method: 'PUT',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: formData.email,
          telefono: formData.phone,
          direccion: formData.address,
          ciudad: formData.city
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Actualizar el contexto de usuario
        updateUser({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city
        });
        
        setSuccessMessage('Perfil actualizado exitosamente');
        setIsEditing(false);
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrors({ general: data.error || 'Error al actualizar el perfil' });
      }
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      setErrors({ general: 'Error de conexión' });
    }
  };

  const handleCancel = () => {
    // Restaurar datos originales
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      city: user?.city || ''
    });
    setErrors({});
    setIsEditing(false);
  };

  const tabs = [
    { id: 'profile', label: 'Mi Perfil', icon: UserIcon },
    { id: 'orders', label: 'Mis Pedidos', icon: ShoppingBagIcon },
    { id: 'favorites', label: 'Favoritos', icon: HeartIcon },
    { id: 'settings', label: 'Configuración', icon: CogIcon }
  ];

  // Los pedidos se cargarían desde la API del usuario
  const [recentOrders, setRecentOrders] = useState([]);
  
  // Favoritos del usuario
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  
  // Estadísticas del usuario
  const [userStats, setUserStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    memberSince: null
  });
  
  useEffect(() => {
    // Cargar pedidos del usuario desde la API
  const loadUserOrders = async () => {
    try {
      if (!user?.id) return;
      
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:8000/api/pedidos/`, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const orders = await response.json();
        setRecentOrders(orders);
        
        // Calcular estadísticas desde los pedidos
        const totalOrders = orders.length;
        const totalSpent = orders.reduce((sum, order) => {
          const orderTotal = typeof order.total === 'number' ? order.total : parseFloat(order.total || 0);
          return sum + orderTotal;
        }, 0);
        
        setUserStats({
          totalOrders,
          totalSpent,
          memberSince: user?.date_joined || null
        });
      } else {
        setRecentOrders([]);
        setUserStats({
          totalOrders: 0,
          totalSpent: 0,
          memberSince: user?.date_joined || null
        });
      }
    } catch (error) {
      console.warn('No se pudieron cargar los pedidos:', error);
      setRecentOrders([]);
    }
  };
    
    loadUserOrders();
    loadFavoriteProducts();
  }, [user]);
  
  const loadFavoriteProducts = async () => {
    try {
      // Cargar IDs de favoritos desde localStorage
      const favoritesJSON = localStorage.getItem('favorites');
      if (!favoritesJSON) {
        setFavoriteProducts([]);
        return;
      }
      
      const favoriteIds = JSON.parse(favoritesJSON);
      if (!Array.isArray(favoriteIds) || favoriteIds.length === 0) {
        setFavoriteProducts([]);
        return;
      }
      
      // Cargar detalles de productos favoritos desde la API
      const response = await fetch('http://localhost:8000/api/productos/');
      if (response.ok) {
        const allProducts = await response.json();
        const favorites = allProducts.filter(p => favoriteIds.includes(p.id));
        setFavoriteProducts(favorites);
      } else {
        setFavoriteProducts([]);
      }
    } catch (error) {
      console.warn('No se pudieron cargar los productos favoritos:', error);
      setFavoriteProducts([]);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'entregado':
      case 'delivered':
        return 'Entregado';
      case 'en_curso':
      case 'shipped':
        return 'En Curso';
      case 'pendiente':
      case 'processing':
        return 'Pendiente';
      case 'confirmado':
        return 'Confirmado';
      case 'cancelado':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const handleChangePassword = async () => {
    try {
      setErrors({});
      
      // Validaciones
      if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        setErrors({ password: 'Todos los campos son obligatorios' });
        return;
      }
      
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setErrors({ password: 'Las contraseñas no coinciden' });
        return;
      }
      
      if (passwordData.newPassword.length < 8) {
        setErrors({ password: 'La contraseña debe tener al menos 8 caracteres' });
        return;
      }
      
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:8000/api/auth/change-password/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          current_password: passwordData.currentPassword,
          new_password: passwordData.newPassword
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccessMessage('Contraseña cambiada exitosamente');
        setShowChangePasswordModal(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrors({ password: data.error || 'Error al cambiar la contraseña' });
      }
    } catch (error) {
      setErrors({ password: 'Error de conexión' });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:8000/api/auth/delete-account/', {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        // Limpiar sesión y redirigir
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        window.location.href = '/';
      } else {
        setErrors({ delete: 'Error al eliminar la cuenta' });
      }
    } catch (error) {
      setErrors({ delete: 'Error de conexión' });
    }
  };
  
  const removeFavorite = (productId) => {
    const favoritesJSON = localStorage.getItem('favorites');
    if (!favoritesJSON) return;
    
    const favoriteIds = JSON.parse(favoritesJSON);
    const newFavorites = favoriteIds.filter(id => id !== productId);
    
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    
    // Actualizar el estado local
    setFavoriteProducts(prev => prev.filter(p => p.id !== productId));
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
              <UserIcon className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Hola, {user?.name || 'Usuario'}
              </h1>
              <p className="text-gray-600">Gestiona tu perfil y pedidos</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="card p-8">
                {successMessage && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                    {successMessage}
                  </div>
                )}
                {errors.general && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    {errors.general}
                  </div>
                )}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Información Personal</h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
                    >
                      <PencilIcon className="w-5 h-5" />
                      <span>Editar</span>
                    </button>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleSave}
                        className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
                      >
                        <CheckIcon className="w-4 h-4" />
                        <span>Guardar</span>
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center space-x-1 bg-gray-600 text-white px-3 py-1 rounded-lg hover:bg-gray-700"
                      >
                        <XMarkIcon className="w-4 h-4" />
                        <span>Cancelar</span>
                      </button>
                    </div>
                  )}
                </div>

                <form className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre completo <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 pl-11 ${
                            !isEditing 
                              ? 'bg-gray-50 text-gray-500 border-gray-300' 
                              : errors.name 
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                                : 'border-gray-300'
                          }`}
                          placeholder="Tu nombre completo"
                        />
                        <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      </div>
                      {errors.name && (
                        <p className="text-red-600 text-sm mt-1 flex items-center">
                          <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 pl-11 ${
                            !isEditing 
                              ? 'bg-gray-50 text-gray-500 border-gray-300' 
                              : errors.email 
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                                : 'border-gray-300'
                          }`}
                          placeholder="tu@email.com"
                        />
                        <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      </div>
                      {errors.email && (
                        <p className="text-red-600 text-sm mt-1 flex items-center">
                          <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 pl-11 ${
                            !isEditing 
                              ? 'bg-gray-50 text-gray-500 border-gray-300' 
                              : errors.phone 
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                                : 'border-gray-300'
                          }`}
                          placeholder="+1 (555) 000-0000"
                        />
                        <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      </div>
                      {errors.phone && (
                        <p className="text-red-600 text-sm mt-1 flex items-center">
                          <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ciudad <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none ${
                            !isEditing 
                              ? 'bg-gray-50 text-gray-500 border-gray-300' 
                              : errors.city 
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                                : 'border-gray-300'
                          }`}
                        >
                          <option value="">Selecciona tu ciudad</option>
                          {cities.map((city) => (
                            <option key={city} value={city}>
                              {city}
                            </option>
                          ))}
                        </select>
                        {isEditing && (
                          <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        )}
                      </div>
                      {errors.city && (
                        <p className="text-red-600 text-sm mt-1 flex items-center">
                          <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                          {errors.city}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 pl-11 ${
                          !isEditing 
                            ? 'bg-gray-50 text-gray-500 border-gray-300' 
                            : errors.address 
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                              : 'border-gray-300'
                        }`}
                        placeholder="Calle Principal 123"
                      />
                      <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    {errors.address && (
                      <p className="text-red-600 text-sm mt-1 flex items-center">
                        <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                        {errors.address}
                      </p>
                    )}
                  </div>
                </form>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="card p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Mis Pedidos</h2>
                  
                  {recentOrders.length > 0 ? (
                    <div className="space-y-4">
                      {recentOrders.map((order) => (
                        <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-gray-900">{order.numero_pedido || order.number}</h3>
                              <p className="text-sm text-gray-600">{new Date(order.fecha_creacion || order.date).toLocaleDateString('es-ES')}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg text-primary-600">
                                ${typeof order.total === 'number' ? order.total.toFixed(2) : parseFloat(order.total || 0).toFixed(2)}
                              </p>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.estado || order.status)}`}>
                                {getStatusText(order.estado || order.status)}
                              </span>
                            </div>
                          </div>
                          
                          {/* Productos del pedido */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Productos:</h4>
                            <div className="space-y-2">
                              {order.items && Array.isArray(order.items) ? (
                                order.items.map((item) => (
                                  <div key={item.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                                    <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                      <img
                                        src={item.producto?.imagen_url || item.imagen_url || 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=100&h=100&fit=crop'}
                                        alt={item.producto_nombre || item.nombre}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-900 truncate">{item.producto_nombre || item.nombre}</p>
                                      <p className="text-xs text-gray-600">
                                        Cantidad: {item.cantidad} × ${typeof item.precio_unitario === 'number' ? item.precio_unitario.toFixed(2) : parseFloat(item.precio_unitario || item.precio || 0).toFixed(2)}
                                      </p>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm text-gray-600">
                                  <strong>Productos:</strong> {Array.isArray(order.items) ? order.items.join(', ') : 'N/A'}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <ShoppingBagIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay pedidos aún</h3>
                      <p className="text-gray-600">Cuando hagas tu primer pedido, aparecerá aquí</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Favorites Tab */}
            {activeTab === 'favorites' && (
              <div className="card p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Productos Favoritos</h2>
                
                {favoriteProducts.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteProducts.map((product) => (
                      <div key={product.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                          <img
                            src={product.imagen_url}
                            alt={product.nombre}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-semibold text-gray-900 line-clamp-2">
                            {product.nombre}
                          </h3>
                          <p className="text-sm text-gray-600">{product.categoria}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-primary-600">
                              ${product.precio.toLocaleString('es-CO')}
                            </span>
                            <button 
                              onClick={() => removeFavorite(product.id)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                              title="Quitar de favoritos"
                            >
                              <HeartIcon className="w-5 h-5 fill-current" />
                            </button>
                          </div>
                          <button 
                            onClick={() => window.location.href = `/producto/${product.id}`}
                            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg transition-colors text-sm"
                          >
                            Ver Producto
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <HeartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No tienes favoritos aún</h3>
                    <p className="text-gray-600 mb-4">Marca productos como favoritos para verlos aquí</p>
                    <button
                      onClick={() => window.location.href = '/productos'}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Explorar Productos
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="card p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Configuración</h2>
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Notificaciones</h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" defaultChecked />
                        <span className="ml-2 text-sm text-gray-700">Recibir emails sobre nuevos productos</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" defaultChecked />
                        <span className="ml-2 text-sm text-gray-700">Notificaciones de estado de pedidos</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                        <span className="ml-2 text-sm text-gray-700">Ofertas especiales y promociones</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Privacidad</h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" defaultChecked />
                        <span className="ml-2 text-sm text-gray-700">Hacer público mi perfil</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                        <span className="ml-2 text-sm text-gray-700">Permitir que otros vean mis reseñas</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Cuenta</h3>
                    <div className="space-y-3">
                      {successMessage && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                          {successMessage}
                        </div>
                      )}
                      <button 
                        onClick={() => setShowChangePasswordModal(true)}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        Cambiar contraseña
                      </button>
                      <br />
                      <button 
                        onClick={() => setShowDeleteAccountModal(true)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Eliminar cuenta
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Estadísticas</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Pedidos totales:</span>
                  <span className="font-semibold">{userStats.totalOrders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total gastado:</span>
                  <span className="font-semibold text-primary-600">
                    ${userStats.totalSpent.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Productos favoritos:</span>
                  <span className="font-semibold">{favoriteProducts.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Miembro desde:</span>
                  <span className="font-semibold">
                    {userStats.memberSince ? new Date(userStats.memberSince).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }) : 'Reciente'}
                  </span>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Soporte</h3>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  ¿Necesitas ayuda con tu cuenta o pedidos?
                </p>
                <div className="space-y-2">
                  <button 
                    onClick={() => window.location.href = '/contact'}
                    className="w-full text-left text-sm text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    Centro de ayuda
                  </button>
                  <button 
                    onClick={() => window.location.href = '/contact'}
                    className="w-full text-left text-sm text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    Contactar soporte
                  </button>
                  <button 
                    onClick={() => window.open('mailto:soporte@tecnoroute.com?subject=Consulta desde perfil', '_blank')}
                    className="w-full text-left text-sm text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    Enviar email
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Cambiar Contraseña */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Cambiar Contraseña</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña Actual
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Ingresa tu contraseña actual"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Mínimo 8 caracteres"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Repite la nueva contraseña"
                />
              </div>
              {errors.password && (
                <p className="text-red-600 text-sm">{errors.password}</p>
              )}
              <div className="flex space-x-3">
                <button
                  onClick={handleChangePassword}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Cambiar Contraseña
                </button>
                <button
                  onClick={() => {
                    setShowChangePasswordModal(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    setErrors({});
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Eliminar Cuenta */}
      {showDeleteAccountModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Eliminar Cuenta</h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer y perderás todos tus datos, pedidos e historial.
            </p>
            {errors.delete && (
              <p className="text-red-600 text-sm mb-4">{errors.delete}</p>
            )}
            <div className="flex space-x-3">
              <button
                onClick={handleDeleteAccount}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Sí, Eliminar Mi Cuenta
              </button>
              <button
                onClick={() => {
                  setShowDeleteAccountModal(false);
                  setErrors({});
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
            {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-6 mt-8 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} <span className="font-semibold text-white">TuEmpresa</span>. Todos los derechos reservados.
        </p>
      </footer>
    </div>
    
  );
};

export default ModernProfile;
