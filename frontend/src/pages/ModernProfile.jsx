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
  PhotoIcon,
  ExclamationTriangleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

const ModernProfile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  // Ciudades disponibles con sus códigos postales
  const cities = [
    { name: 'Bogotá', postalCode: '110111' },
    { name: 'Soacha', postalCode: '250052' },
    { name: 'Chía', postalCode: '250001' },
    { name: 'Zipaquirá', postalCode: '250252' }
  ];
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  });
  const [activeTab, setActiveTab] = useState('profile');
  const [errors, setErrors] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        postalCode: user.postalCode || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedData = { [name]: value };
    
    // Auto-populate postal code when city is selected
    if (name === 'city') {
      const selectedCity = cities.find(city => city.name === value);
      if (selectedCity) {
        updatedData.postalCode = selectedCity.postalCode;
      }
    }
    
    setFormData(prev => ({ ...prev, ...updatedData }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({ ...prev, image: 'La imagen no debe superar los 5MB' }));
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setProfileImage(file);
        setErrors(prev => ({ ...prev, image: '' }));
      };
      reader.readAsDataURL(file);
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

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }
    
    // Aquí actualizarías los datos del usuario en la API
    // await updateUserProfile(formData, profileImage);
    setIsEditing(false);
    // Simular actualización exitosa
  };

  const handleCancel = () => {
    // Restaurar datos originales
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      city: user?.city || '',
      postalCode: user?.postalCode || ''
    });
    setErrors({});
    setPreviewImage(null);
    setProfileImage(null);
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
  
  useEffect(() => {
    // Cargar pedidos del usuario desde la API
  const loadUserOrders = async () => {
    try {
      if (!user?.id) return;
      
      const response = await fetch(`http://localhost:8000/api/users/${user.id}/orders/`);
      
      if (response.ok) {
        const orders = await response.json();
        setRecentOrders(orders);
      } else {
        // Fallback: datos de ejemplo incluyendo pedidos entregados
        setRecentOrders([
          {
            id: 1,
            number: 'TR-2024-001',
            date: '2024-01-10',
            total: 2599.99,
            status: 'entregado',
            items: [
              {
                id: 1,
                nombre: 'Refrigerador Samsung 28 pies',
                precio: 2599.99,
                cantidad: 1,
                imagen_url: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=300&h=300&fit=crop'
              }
            ]
          },
          {
            id: 2,
            number: 'TR-2024-002',
            date: '2024-01-15',
            total: 1899.99,
            status: 'entregado',
            items: [
              {
                id: 2,
                nombre: 'Lavadora LG 15 kg',
                precio: 1899.99,
                cantidad: 1,
                imagen_url: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=300&h=300&fit=crop'
              }
            ]
          },
          {
            id: 3,
            number: 'TR-2024-003',
            date: '2024-01-20',
            total: 899.99,
            status: 'en_transito',
            items: [
              {
                id: 3,
                nombre: 'Microondas Panasonic 1.2 pies',
                precio: 899.99,
                cantidad: 1,
                imagen_url: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=300&h=300&fit=crop'
              }
            ]
          }
        ]);
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
      if (!user?.id) return;
      
      // En una implementación real, aquí cargarías los productos favoritos del usuario desde la API
      // const response = await fetch(`http://localhost:8000/api/users/${user.id}/favorites/`);
      
      // Por ahora, simulamos algunos productos favoritos de ejemplo
      const mockFavorites = [
        {
          id: 1,
          nombre: 'Refrigerador Samsung 28 pies',
          precio: 2599.99,
          imagen_url: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=300&h=300&fit=crop',
          categoria: 'Electrodomésticos',
          fecha_agregado: new Date().toISOString()
        },
        {
          id: 2,
          nombre: 'Lavadora LG 15 kg',
          precio: 1899.99,
          imagen_url: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=300&h=300&fit=crop',
          categoria: 'Electrodomésticos',
          fecha_agregado: new Date().toISOString()
        }
      ];
      
      setFavoriteProducts(mockFavorites);
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
      case 'delivered':
        return 'Entregado';
      case 'shipped':
        return 'Enviado';
      case 'processing':
        return 'Procesando';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center overflow-hidden">
                {previewImage || user?.profileImage ? (
                  <img 
                    src={previewImage || user?.profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-10 h-10 text-white" />
                )}
              </div>
              {isEditing && (
                <>
                  <label 
                    htmlFor="profile-image" 
                    className="absolute bottom-0 right-0 bg-primary-600 hover:bg-primary-700 rounded-full p-2 cursor-pointer shadow-lg transition-colors"
                  >
                    <PhotoIcon className="w-4 h-4 text-white" />
                  </label>
                  <input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Hola, {user?.name || 'Usuario'}
              </h1>
              <p className="text-gray-600">Gestiona tu perfil y pedidos</p>
              {errors.image && (
                <p className="text-red-600 text-sm mt-1 flex items-center">
                  <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                  {errors.image}
                </p>
              )}
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
                  <div className="grid md:grid-cols-2 gap-6">
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
                            <option key={city.name} value={city.name}>
                              {city.name}
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

                  <div className="w-full md:w-1/2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Código Postal *
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                      placeholder="Selecciona una ciudad"
                    />
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
                              <h3 className="font-semibold text-gray-900">{order.number}</h3>
                              <p className="text-sm text-gray-600">{order.date}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg text-primary-600">
                                ${order.total?.toFixed(2) || order.total}
                              </p>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                {getStatusText(order.status)}
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
                                        src={item.imagen_url || 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=100&h=100&fit=crop'}
                                        alt={item.nombre}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-900 truncate">{item.nombre}</p>
                                      <p className="text-xs text-gray-600">
                                        Cantidad: {item.cantidad} × ${item.precio?.toFixed(2) || item.precio}
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
                            <button className="text-red-500 hover:text-red-700 transition-colors">
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
                      <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                        Cambiar contraseña
                      </button>
                      <br />
                      <button className="text-red-600 hover:text-red-700 text-sm font-medium">
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
                  <span className="font-semibold">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total gastado:</span>
                  <span className="font-semibold text-primary-600">$2,399.97</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Productos favoritos:</span>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Miembro desde:</span>
                  <span className="font-semibold">Enero 2024</span>
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
                  <button className="w-full text-left text-sm text-primary-600 hover:text-primary-700">
                    Centro de ayuda
                  </button>
                  <button className="w-full text-left text-sm text-primary-600 hover:text-primary-700">
                    Contactar soporte
                  </button>
                  <button className="w-full text-left text-sm text-primary-600 hover:text-primary-700">
                    Preguntas frecuentes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernProfile;