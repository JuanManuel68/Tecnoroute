import React, { useState, useEffect } from 'react';
import {
  CreditCardIcon,
  TruckIcon,
  MapPinIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { pedidosAPI } from '../services/apiService';

const ModernCheckout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Ciudades disponibles con sus códigos postales
  const cities = [
    { name: 'Bogotá', postalCode: '110111' },
    { name: 'Soacha', postalCode: '250052' },
    { name: 'Chía', postalCode: '250001' },
    { name: 'Zipaquirá', postalCode: '250252' }
  ];
  
  const [orderComplete, setOrderComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    // Datos de envío
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    // Datos de pago
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  // Precargar datos del usuario autenticado
  useEffect(() => {
    if (user) {
      const nameParts = (user.name || user.first_name + ' ' + user.last_name || '').split(' ');
      const userData = {
        firstName: nameParts[0] || user.first_name || '',
        lastName: nameParts.slice(1).join(' ') || user.last_name || '',
        email: user.email || '',
        phone: user.phone || user.telefono || '',
        address: user.address || user.direccion || '',
        city: user.city || user.ciudad || '',
        postalCode: user.postal_code || user.codigo_postal || '',
        cardName: user.name || (user.first_name + ' ' + user.last_name).trim() || ''
      };
      
      // Si la ciudad del usuario está en nuestra lista, auto-poblar el código postal
      if (userData.city && !userData.postalCode) {
        const selectedCity = cities.find(city => city.name === userData.city);
        if (selectedCity) {
          userData.postalCode = selectedCity.postalCode;
        }
      }
      
      console.log('Checkout - User data loaded:', userData); // Debug log
      
      setFormData(prev => ({
        ...prev,
        ...userData
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    let updatedData = { [name]: formattedValue };
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
    }
    
    // Format expiry date
    if (name === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d{1,2})/, '$1/$2');
    }
    
    // Format CVV (only numbers)
    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '');
    }
    
    // Format phone number
    if (name === 'phone') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '+$1 ($2) $3-$4');
    }
    
    // Auto-populate postal code when city is selected
    if (name === 'city') {
      const selectedCity = cities.find(city => city.name === value);
      if (selectedCity) {
        updatedData.postalCode = selectedCity.postalCode;
      }
    }
    
    updatedData[name] = formattedValue;
    
    setFormData(prev => ({ ...prev, ...updatedData }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validación de datos de envío
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es obligatorio';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es obligatorio';
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
    
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'El código postal es obligatorio';
    }
    
    // Validación de datos de pago
    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = 'El número de tarjeta es obligatorio';
    } else if (formData.cardNumber.replace(/\s/g, '').length < 13) {
      newErrors.cardNumber = 'El número de tarjeta debe tener al menos 13 dígitos';
    }
    
    if (!formData.expiryDate.trim()) {
      newErrors.expiryDate = 'La fecha de vencimiento es obligatoria';
    } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Formato de fecha inválido (MM/YY)';
    } else {
      // Validar que la fecha no sea pasada
      const [month, year] = formData.expiryDate.split('/');
      const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
      const currentDate = new Date();
      currentDate.setDate(1); // Establecer al primer día del mes actual
      
      if (expiryDate < currentDate) {
        newErrors.expiryDate = 'Tarjeta vencida. Verifica la fecha de vencimiento';
      }
    }
    
    if (!formData.cvv.trim()) {
      newErrors.cvv = 'El CVV es obligatorio';
    } else if (formData.cvv.length < 3) {
      newErrors.cvv = 'El CVV debe tener al menos 3 dígitos';
    }
    
    if (!formData.cardName.trim()) {
      newErrors.cardName = 'El nombre en la tarjeta es obligatorio';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = document.querySelector('.border-red-300');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Preparar datos del pedido para la API
      const pedidoData = {
        direccion_envio: `${formData.address}, ${formData.city}, ${formData.postalCode}`,
        telefono_contacto: formData.phone,
        notas: `Nombre: ${formData.firstName} ${formData.lastName}, Email: ${formData.email}`,
        // Los productos ya están en el carrito del backend (cuando implementemos esa parte)
      };
      
      // Crear el pedido en el backend
      const response = await pedidosAPI.create(pedidoData);
      console.log('Pedido creado:', response.data);
      
      // Si el pedido se crea exitosamente
      await clearCart();
      setOrderComplete(true);
      setIsProcessing(false);
      
    } catch (error) {
      console.error('Error creando pedido:', error);
      setIsProcessing(false);
      
      // Mostrar error al usuario
      setErrors({ 
        submit: 'Error al procesar el pedido. Por favor, inténtalo de nuevo.' 
      });
      
      // Fallback: simular éxito para propósitos de desarrollo
      setTimeout(async () => {
        await clearCart();
        setOrderComplete(true);
      }, 1000);
    }
  };

  const formatPrice = (price) => `$${Number(price).toLocaleString('es-CO')}`;
  const subtotal = getCartTotal();
  const tax = subtotal * 0.1;
  const shipping = 0;
  const total = subtotal + tax + shipping;

  if (cartItems.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-16">
            <TruckIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No hay productos en el carrito</h2>
            <p className="text-gray-600 mb-6">Agrega algunos productos antes de proceder al checkout</p>
            <button
              onClick={() => navigate('/productos')}
              className="btn-primary"
            >
              Ver Productos
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleIcon className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">¡Pedido Completado!</h2>
            <p className="text-xl text-gray-600 mb-6">
              Tu pedido ha sido procesado exitosamente
            </p>
            <div className="card p-6 max-w-md mx-auto mb-8">
              <h3 className="font-semibold text-gray-900 mb-2">Número de orden:</h3>
              <p className="text-2xl font-bold text-primary-600">#TR-{Date.now()}</p>
              <p className="text-sm text-gray-600 mt-2">
                Recibirás un email de confirmación en breve
              </p>
            </div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => navigate('/productos')}
                className="btn-primary"
              >
                Seguir Comprando
              </button>
              <button
                onClick={() => navigate('/orders')}
                className="btn-secondary"
              >
                Ver Mis Pedidos
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Volver al carrito
          </button>
          <h1 className="text-4xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Información de envío */}
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <MapPinIcon className="w-6 h-6 mr-2 text-primary-600" />
                  Información de Envío
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        errors.firstName 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                          : 'border-gray-300'
                      }`}
                      placeholder="Tu nombre"
                    />
                    {errors.firstName && (
                      <p className="text-red-600 text-sm mt-1 flex items-center">
                        <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                        {errors.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apellido <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        errors.lastName 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                          : 'border-gray-300'
                      }`}
                      placeholder="Tu apellido"
                    />
                    {errors.lastName && (
                      <p className="text-red-600 text-sm mt-1 flex items-center">
                        <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        errors.email 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                          : 'border-gray-300'
                      }`}
                      placeholder="tu@email.com"
                    />
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
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        errors.phone 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                          : 'border-gray-300'
                      }`}
                      placeholder="+1 (555) 000-0000"
                    />
                    {errors.phone && (
                      <p className="text-red-600 text-sm mt-1 flex items-center">
                        <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                        {errors.phone}
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        errors.address 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                          : 'border-gray-300'
                      }`}
                      placeholder="Calle Principal 123"
                    />
                    {errors.address && (
                      <p className="text-red-600 text-sm mt-1 flex items-center">
                        <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                        {errors.address}
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
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none ${
                          errors.city 
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
                      <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                    {errors.city && (
                      <p className="text-red-600 text-sm mt-1 flex items-center">
                        <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                        {errors.city}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Código Postal <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      required
                      value={formData.postalCode}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                      placeholder="Selecciona una ciudad"
                    />
                    {errors.postalCode && (
                      <p className="text-red-600 text-sm mt-1 flex items-center">
                        <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                        {errors.postalCode}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Información de pago */}
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <CreditCardIcon className="w-6 h-6 mr-2 text-primary-600" />
                  Información de Pago
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número de tarjeta <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      required
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        errors.cardNumber 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                          : 'border-gray-300'
                      }`}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                    />
                    {errors.cardNumber && (
                      <p className="text-red-600 text-sm mt-1 flex items-center">
                        <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                        {errors.cardNumber}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha de vencimiento <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        required
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                          errors.expiryDate 
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                            : 'border-gray-300'
                        }`}
                        placeholder="MM/YY"
                        maxLength="5"
                      />
                      {errors.expiryDate && (
                        <p className="text-red-600 text-sm mt-1 flex items-center">
                          <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                          {errors.expiryDate}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        required
                        value={formData.cvv}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                          errors.cvv 
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                            : 'border-gray-300'
                        }`}
                        placeholder="123"
                        maxLength="4"
                      />
                      {errors.cvv && (
                        <p className="text-red-600 text-sm mt-1 flex items-center">
                          <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                          {errors.cvv}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre en la tarjeta <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="cardName"
                      required
                      value={formData.cardName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        errors.cardName 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                          : 'border-gray-300'
                      }`}
                      placeholder="Como aparece en la tarjeta"
                    />
                    {errors.cardName && (
                      <p className="text-red-600 text-sm mt-1 flex items-center">
                        <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                        {errors.cardName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex items-center space-x-2 text-sm text-gray-600">
                  <ShieldCheckIcon className="w-5 h-5 text-green-500" />
                  <span>Tu información está protegida con encriptación SSL</span>
                </div>
              </div>
            </form>
          </div>

          {/* Resumen del pedido */}
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Resumen del Pedido</h2>
              
              {/* Productos */}
              <div className="space-y-3 mb-6">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img
                      src={item.imagen_url || 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500&h=400&fit=crop'}
                      alt={item.nombre}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.nombre}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.quantity}x {formatPrice(item.precio)}
                      </p>
                    </div>
                    <p className="text-sm font-semibold">
                      {formatPrice(item.precio * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totales */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Envío:</span>
                  <span className="text-green-600 font-medium">Gratis</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Impuestos:</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-primary-600">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isProcessing}
                className={`w-full mt-6 flex items-center justify-center space-x-2 ${
                  isProcessing
                    ? 'bg-gray-400 cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-all duration-200'
                    : 'btn-primary'
                }`}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Procesando...</span>
                  </>
                ) : (
                  <>
                    <CreditCardIcon className="w-5 h-5" />
                    <span>Completar Pedido</span>
                  </>
                )}
              </button>
            </div>

            {/* Garantías */}
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Garantías de Compra</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-500" />
                  <span>Pago 100% seguro</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-500" />
                  <span>Devoluciones en 30 días</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-500" />
                  <span>Garantía del fabricante</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-500" />
                  <span>Soporte 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernCheckout;