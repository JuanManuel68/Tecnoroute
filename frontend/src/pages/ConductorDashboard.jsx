import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  TruckIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  HandRaisedIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import {
  CheckCircleIcon as CheckCircleIconSolid,
  TruckIcon as TruckIconSolid
} from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext';
import { pedidosAPI } from '../services/apiService';

const ConductorDashboard = () => {
  const { user } = useAuth();
  const [pendingOrders, setPendingOrders] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assigningOrder, setAssigningOrder] = useState(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [welcomeStep, setWelcomeStep] = useState(1);
  const [vehicleData, setVehicleData] = useState({
    placa: '',
    marca: '',
    modelo: '',
    año: new Date().getFullYear(),
    tipo: 'camion',
    capacidad_kg: '1000',
    capacidad_motor: '',
    color: 'Blanco',
    combustible: 'gasolina'
  });
  const [errorModal, setErrorModal] = useState({ open: false, title: '', message: '' });
  const [confirmCompleteModal, setConfirmCompleteModal] = useState(false);
  const [successTakeModal, setSuccessTakeModal] = useState({ open: false, order: null });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const hasCompletedWelcome = useRef(false); // Ref para controlar si ya completó el welcome

  // Cargar pedidos asignados al conductor
  const loadPendingOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Cargar mis pedidos (pedidos asignados a este conductor)
      // El backend ya filtra automáticamente los pedidos por conductor
      const myOrdersResponse = await pedidosAPI.getAll();
      const myOrders = myOrdersResponse.data || [];
      
      console.log('Mis pedidos:', myOrders);
      console.log('User conductor info:', user?.conductor_info);
      
      // Filtrar pedidos por estado (el backend ya filtró por conductor)
      // - Pendientes asignados = estado 'confirmado' (ya asignado pero no tomado aún)
      // - Activo = estado 'en_curso'
      const assignedPending = myOrders.filter(order => order.estado === 'confirmado');
      const activeOrder = myOrders.find(order => order.estado === 'en_curso');
      
      setPendingOrders(assignedPending);
      if (activeOrder) {
        setActiveOrder(activeOrder);
      } else {
        setActiveOrder(null);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      setError('Error al cargar los pedidos');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    console.log('Usuario conductor:', user);
    console.log('Conductor info:', user?.conductor_info);
    console.log('User role:', user?.role);
    loadPendingOrders();
    
    // Check if conductor needs to complete vehicle registration
    // Modal must show if conductor doesn't have placa_temporal (vehicle not registered)
    if (user?.role === 'conductor' && user?.conductor_info) {
      const hasVehicleData = user.conductor_info.placa_temporal;
      console.log('Has vehicle data (placa_temporal):', hasVehicleData);
      
      if (!hasVehicleData && !hasCompletedWelcome.current) {
        console.log('⚠️ Showing welcome modal - vehicle not registered');
        setShowWelcomeModal(true);
      }
    }
    
    // Recargar cada 30 segundos
    const interval = setInterval(loadPendingOrders, 30000);
    return () => clearInterval(interval);
  }, [loadPendingOrders, user]);

  // Tomar pedido asignado (cambiar de confirmado a en_curso)
  const handleTakeOrder = async (order) => {
    try {
      setAssigningOrder(order.id);
      
      // Cambiar estado de confirmado a en_curso
      await pedidosAPI.cambiarEstado(order.id, 'en_curso');
      
      // Actualizar estado local
      setActiveOrder({
        ...order,
        estado: 'en_curso'
      });
      
      // Remover de pedidos pendientes asignados
      setPendingOrders(prev => prev.filter(o => o.id !== order.id));
      
      // Mostrar modal de éxito
      setSuccessTakeModal({ open: true, order: order });
      
    } catch (error) {
      console.error('Error taking order:', error);
      const errorMsg = error.response?.data?.error || 'Error al tomar el pedido. Intente de nuevo.';
      setErrorModal({
        open: true,
        title: '❌ Error al Tomar Pedido',
        message: errorMsg
      });
    } finally {
      setAssigningOrder(null);
    }
  };

  // Completar pedido
  const handleCompleteOrder = () => {
    if (!activeOrder) return;
    setConfirmCompleteModal(true);
  };
  
  const confirmCompleteOrder = async () => {
    try {
      await pedidosAPI.cambiarEstado(activeOrder.id, 'entregado');
      setActiveOrder(null);
      setConfirmCompleteModal(false);
      loadPendingOrders(); // Recargar lista
      setErrorModal({
        open: true,
        title: '✅ ¡Pedido Entregado!',
        message: 'El pedido se ha marcado como entregado exitosamente'
      });
    } catch (error) {
      console.error('Error completing order:', error);
      const errorMsg = error.response?.data?.error || 'Error al completar el pedido. Intente de nuevo.';
      setConfirmCompleteModal(false);
      setErrorModal({
        open: true,
        title: '❌ Error al Completar',
        message: errorMsg
      });
    }
  };
  
  // Close welcome modal (only when vehicle registration is complete)
  const handleCloseWelcome = () => {
    hasCompletedWelcome.current = true;
    setShowWelcomeModal(false);
    setWelcomeStep(1);
  };
  
  // Handle vehicle data and password submission
  const handleVehicleSubmit = async () => {
    try {
      // Validar contraseña
      if (!newPassword || !confirmPassword) {
        setErrorModal({
          open: true,
          title: '⚠️ Campos Requeridos',
          message: 'Por favor ingresa tu nueva contraseña y confírmala'
        });
        return;
      }
      
      if (newPassword !== confirmPassword) {
        setErrorModal({
          open: true,
          title: '⚠️ Contraseñas no Coinciden',
          message: 'Las contraseñas ingresadas no coinciden. Por favor verifícalas.'
        });
        return;
      }
      
      // Validar requisitos de seguridad
      if (newPassword.length < 8) {
        setErrorModal({
          open: true,
          title: '⚠️ Contraseña Muy Corta',
          message: 'La contraseña debe tener al menos 8 caracteres'
        });
        return;
      }
      
      if (!/[a-z]/.test(newPassword)) {
        setErrorModal({
          open: true,
          title: '⚠️ Falta Minúscula',
          message: 'La contraseña debe contener al menos una letra minúscula'
        });
        return;
      }
      
      if (!/[A-Z]/.test(newPassword)) {
        setErrorModal({
          open: true,
          title: '⚠️ Falta Mayúscula',
          message: 'La contraseña debe contener al menos una letra mayúscula'
        });
        return;
      }
      
      if (!/[0-9]/.test(newPassword)) {
        setErrorModal({
          open: true,
          title: '⚠️ Falta Número',
          message: 'La contraseña debe contener al menos un número'
        });
        return;
      }
      
      if (!/[@$!%*?&]/.test(newPassword)) {
        setErrorModal({
          open: true,
          title: '⚠️ Falta Carácter Especial',
          message: 'La contraseña debe contener al menos un carácter especial (@$!%*?&)'
        });
        return;
      }
      
      // Guardar datos del vehículo
      let vehicleResponse;
      try {
        vehicleResponse = await fetch('http://localhost:8000/api/conductores/guardar_datos_vehiculo/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify(vehicleData)
        });
      } catch (fetchError) {
        throw new Error('Error de conexión. Verifica que el servidor esté corriendo.');
      }
      
      if (!vehicleResponse.ok) {
        let errorData;
        try {
          errorData = await vehicleResponse.json();
        } catch (e) {
          errorData = { error: 'Error desconocido del servidor' };
        }
        throw new Error(errorData.error || `Error ${vehicleResponse.status}: ${vehicleResponse.statusText}`);
      }
      
      await vehicleResponse.json();
      
      // Cambiar contraseña
      let passwordResponse;
      try {
        passwordResponse = await fetch('http://localhost:8000/api/auth/change-password/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify({
            new_password: newPassword
          })
        });
      } catch (fetchError) {
        throw new Error('Error de conexión al cambiar contraseña.');
      }
      
      if (!passwordResponse.ok) {
        let errorData;
        try {
          errorData = await passwordResponse.json();
        } catch (e) {
          errorData = { error: 'Error desconocido del servidor' };
        }
        throw new Error(errorData.error || `Error ${passwordResponse.status}: ${passwordResponse.statusText}`);
      }
      
      // Cerrar modal de bienvenida
      handleCloseWelcome();
      
      // Esperar un momento para asegurar que el modal se cierre antes de mostrar el de éxito
      setTimeout(() => {
        setErrorModal({
          open: true,
          title: '✅ ¡Registro Completado!',
          message: 'Tus datos se han guardado exitosamente y tu contraseña ha sido actualizada.'
        });
      }, 100);
    } catch (error) {
      console.error('Error completando registro:', error);
      setErrorModal({
        open: true,
        title: '❌ Error al Guardar',
        message: error.message
      });
    }
  };

  const formatPrice = (price) => `$${Number(price).toLocaleString('es-CO')}`;
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  // Función para abrir Google Maps con la dirección
  const openGoogleMaps = (address) => {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://www.google.com/maps/search/${encodedAddress}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 flex items-center">
                <TruckIconSolid className="w-10 h-10 text-primary-600 mr-3" />
                Dashboard del Conductor
              </h1>
              <p className="text-gray-600 mt-2">
                Bienvenido, {user?.name || 'Conductor'}. Gestiona tus entregas aquí.
              </p>
            </div>
            <button
              onClick={loadPendingOrders}
              className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <ArrowPathIcon className="w-5 h-5" />
              <span>Actualizar</span>
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
                <p>{error}</p>
              </div>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Pedido Activo */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <CheckCircleIconSolid className="w-6 h-6 text-green-600 mr-2" />
              Pedido Activo
            </h2>

            {activeOrder ? (
              <div className="bg-white rounded-2xl shadow-xl border-l-4 border-green-500 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Pedido #{activeOrder.numero_pedido}
                      </h3>
                      <p className="text-green-600 font-medium">En progreso</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        {formatPrice(activeOrder.total)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-start space-x-3">
                      <MapPinIcon className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Dirección de entrega:</p>
                        <p className="text-gray-600">{activeOrder.direccion_envio}</p>
                      </div>
                      <button
                        onClick={() => openGoogleMaps(activeOrder.direccion_envio)}
                        className="flex items-center space-x-1 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                        <span>Ruta</span>
                      </button>
                    </div>

                    <div className="flex items-center space-x-3">
                      <PhoneIcon className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900">Teléfono de contacto:</p>
                        <p className="text-gray-600">{activeOrder.telefono_contacto}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <ClockIcon className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900">Fecha del pedido:</p>
                        <p className="text-gray-600">{formatDate(activeOrder.fecha_creacion)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Productos del pedido */}
                  <div className="border-t pt-4 mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Productos a entregar:</h4>
                    <div className="space-y-2">
                      {(activeOrder.items || []).map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-900">{item.producto?.nombre || 'Producto'}</span>
                          <span className="text-gray-600">Cant: {item.cantidad}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleCompleteOrder}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    ✅ Marcar como Entregado
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border-2 border-dashed border-gray-300 p-8 text-center">
                <TruckIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No tienes pedidos activos
                </h3>
                <p className="text-gray-600">
                  Selecciona un pedido de tu lista de pedidos asignados para comenzar la entrega.
                </p>
              </div>
            )}
          </div>

          {/* Pedidos Asignados */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <ClockIcon className="w-6 h-6 text-yellow-600 mr-2" />
              Pedidos Asignados ({pendingOrders.length})
            </h2>

            {pendingOrders.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg border-2 border-dashed border-gray-300 p-8 text-center">
                <CheckCircleIconSolid className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  ¡Excelente trabajo!
                </h3>
                <p className="text-gray-600">
                  No tienes pedidos asignados en este momento. El administrador te asignará pedidos cuando estén disponibles.
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {pendingOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">
                          Pedido #{order.numero_pedido}
                        </h4>
                        <p className="text-yellow-600 font-medium flex items-center">
                          <ClockIcon className="w-4 h-4 mr-1" />
                          Pendiente
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">
                          {formatPrice(order.total)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(order.fecha_creacion)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-start space-x-2">
                        <MapPinIcon className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-600">{order.direccion_envio}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <PhoneIcon className="w-4 h-4 text-gray-500" />
                        <p className="text-sm text-gray-600">{order.telefono_contacto}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <span className="text-sm text-gray-600">
                        {(order.items || []).length} producto(s)
                      </span>
                      <button
                        onClick={() => handleTakeOrder(order)}
                        disabled={!!activeOrder || assigningOrder === order.id}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                          activeOrder
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : assigningOrder === order.id
                            ? 'bg-primary-400 text-white cursor-wait'
                            : 'bg-primary-600 hover:bg-primary-700 text-white hover:scale-105'
                        }`}
                      >
                        {assigningOrder === order.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Asignando...</span>
                          </>
                        ) : activeOrder ? (
                          <>
                            <ExclamationTriangleIcon className="w-4 h-4" />
                            <span>Completa pedido activo</span>
                          </>
                        ) : (
                          <>
                            <HandRaisedIcon className="w-4 h-4" />
                            <span>Tomar Pedido</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Success Take Order Modal */}
      {successTakeModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-fade-in">
            <div className="p-6 rounded-t-2xl bg-green-500">
              <h3 className="text-2xl font-bold text-white text-center">✅ ¡Pedido Asignado!</h3>
            </div>
            <div className="p-6">
              <div className="text-center mb-6">
                <p className="text-gray-700 text-lg mb-4">
                  Has tomado exitosamente el pedido:
                </p>
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <p className="text-2xl font-bold text-primary-600 mb-2">
                    #{successTakeModal.order?.numero_pedido}
                  </p>
                  <p className="text-gray-600">
                    {successTakeModal.order?.direccion_envio}
                  </p>
                </div>
                <p className="text-gray-600">
                  El pedido aparecerá ahora en tu panel de "Pedido Activo"
                </p>
              </div>
              <button
                onClick={() => setSuccessTakeModal({ open: false, order: null })}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Confirm Complete Order Modal */}
      {confirmCompleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-fade-in">
            <div className="p-6 rounded-t-2xl bg-yellow-500">
              <h3 className="text-xl font-bold text-white text-center">⚠️ Confirmar Entrega</h3>
            </div>
            <div className="p-6">
              <div className="text-center mb-6">
                <p className="text-gray-700 text-lg mb-4">
                  ¿Confirmas que has entregado este pedido?
                </p>
                <div className="bg-gray-100 p-4 rounded-lg mb-4">
                  <p className="text-xl font-bold text-gray-900 mb-2">
                    Pedido #{activeOrder?.numero_pedido}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {activeOrder?.direccion_envio}
                  </p>
                </div>
                <p className="text-sm text-gray-500">
                  Esta acción marcará el pedido como completado
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmCompleteModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmCompleteOrder}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Confirmar Entrega
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Error/Success Modal */}
      {errorModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-fade-in">
            <div className={`p-6 rounded-t-2xl ${
              errorModal.title.includes('✅') ? 'bg-green-500' :
              errorModal.title.includes('❌') ? 'bg-red-500' :
              'bg-yellow-500'
            }`}>
              <h3 className="text-xl font-bold text-white text-center">{errorModal.title}</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-700 text-center mb-6">{errorModal.message}</p>
              <button
                onClick={() => setErrorModal({ open: false, title: '', message: '' })}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Welcome Modal - Cannot be dismissed without completing registration */}
      {showWelcomeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8 overflow-hidden animate-fade-in">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white">
              <div className="flex items-center justify-center mb-4">
                <TruckIconSolid className="w-16 h-16" />
              </div>
              <h2 className="text-3xl font-bold text-center">¡Bienvenido a TecnoRoute!</h2>
              <p className="text-center text-primary-100 mt-2">Paso {welcomeStep} de 3</p>
            </div>
            
            <div className="p-6 max-h-[calc(100vh-250px)] overflow-y-auto">
              {welcomeStep === 1 ? (
                <>
                  <div className="mb-6">
                    <p className="text-gray-700 text-lg mb-4">
                      Hola <span className="font-bold text-primary-600">{user?.name || 'Conductor'}</span>,
                    </p>
                    <p className="text-gray-600 mb-4">
                      Estamos emocionados de tenerte como parte de nuestro equipo de conductores.
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                      <span className="mr-2">📋</span> Cómo funciona:
                    </h3>
                    <ul className="space-y-2 text-sm text-blue-800">
                      <li className="flex items-start">
                        <span className="mr-2 font-bold">1.</span>
                        <span>Cada día recibirás pedidos asignados específicamente para ti</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 font-bold">2.</span>
                        <span>Revisa los pedidos asignados en el panel "Pedidos Asignados Hoy"</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 font-bold">3.</span>
                        <span>Toma un pedido haciendo clic en "Tomar Pedido" para comenzar la entrega</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 font-bold">4.</span>
                        <span>Entrega el pedido en la dirección indicada</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 font-bold">5.</span>
                        <span>Marca como entregado cuando completes la entrega</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <p className="text-green-800 text-sm">
                      <span className="font-semibold">💡 Consejo:</span> Puedes usar el botón de mapa para abrir Google Maps y navegar fácilmente a la dirección de entrega.
                    </p>
                  </div>
                  
                  <button
                    onClick={() => setWelcomeStep(2)}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    Siguiente: Datos del Vehículo
                  </button>
                </>
              ) : welcomeStep === 2 ? (
                <>
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Datos de tu Vehículo</h3>
                    <p className="text-gray-600 mb-4">
                      Para completar tu registro, necesitamos los datos de tu vehículo de entrega.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Placa del Vehículo <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={vehicleData.placa}
                        onChange={(e) => setVehicleData({...vehicleData, placa: e.target.value.toUpperCase()})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Ej: ABC123"
                        maxLength="10"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Marca <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={vehicleData.marca}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]*$/.test(value)) {
                            setVehicleData({...vehicleData, marca: value});
                          }
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Ej: Toyota"
                      />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Modelo <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={vehicleData.modelo}
                          onChange={(e) => setVehicleData({...vehicleData, modelo: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Ej: Hilux"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Año <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          value={vehicleData.año}
                          onChange={(e) => setVehicleData({...vehicleData, año: parseInt(e.target.value)})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          min="1990"
                          max={new Date().getFullYear() + 1}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tipo de Vehículo <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={vehicleData.tipo}
                          onChange={(e) => setVehicleData({...vehicleData, tipo: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="camion">Camión</option>
                          <option value="furgon">Furgón</option>
                          <option value="camioneta">Camioneta</option>
                          <option value="motocicleta">Motocicleta</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Capacidad de Carga (kg) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          inputMode="numeric"
                          value={vehicleData.capacidad_kg}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            setVehicleData({...vehicleData, capacidad_kg: value});
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="1000"
                          min="0"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Capacidad Motor (CC) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          inputMode="numeric"
                          value={vehicleData.capacidad_motor}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            setVehicleData({...vehicleData, capacidad_motor: value});
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Ej: 2000"
                          min="0"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Color <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={vehicleData.color}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]*$/.test(value)) {
                            setVehicleData({...vehicleData, color: value});
                          }
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Ej: Blanco"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de Combustible <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={vehicleData.combustible}
                        onChange={(e) => setVehicleData({...vehicleData, combustible: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="gasolina">Gasolina</option>
                        <option value="diesel">Diesel</option>
                        <option value="electrico">Eléctrico</option>
                        <option value="hibrido">Híbrido</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6 mb-6">
                    <p className="text-yellow-800 text-sm">
                      <span className="font-semibold">⚠️ Importante:</span> Estos datos se usarán para identificar tu vehículo en las entregas. Asegúrate de que sean correctos.
                    </p>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => setWelcomeStep(1)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                      Atrás
                    </button>
                    <button
                      onClick={() => {
                        // Validar campos del vehículo antes de avanzar
                        if (!vehicleData.placa || !vehicleData.marca || !vehicleData.modelo || !vehicleData.color) {
                          setErrorModal({
                            open: true,
                            title: '⚠️ Campos Requeridos',
                            message: 'Por favor completa todos los campos obligatorios del vehículo antes de continuar'
                          });
                          return;
                        }
                        if (!vehicleData.capacidad_kg || vehicleData.capacidad_kg <= 0) {
                          setErrorModal({
                            open: true,
                            title: '⚠️ Capacidad de Carga Inválida',
                            message: 'La capacidad de carga debe ser mayor a 0 kg'
                          });
                          return;
                        }
                        if (!vehicleData.capacidad_motor || vehicleData.capacidad_motor <= 0) {
                          setErrorModal({
                            open: true,
                            title: '⚠️ Capacidad de Motor Inválida',
                            message: 'La capacidad del motor debe ser mayor a 0 CC'
                          });
                          return;
                        }
                        setWelcomeStep(3);
                      }}
                      className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                      Siguiente: Cambiar Contraseña
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Paso 3: Cambiar contraseña */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Establece tu Nueva Contraseña</h3>
                    <p className="text-gray-600 mb-4">
                      Por seguridad, te recomendamos cambiar la contraseña temporal que te fue asignada.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nueva Contraseña <span className="text-red-500">*</span>
                      </label>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Ingresa tu nueva contraseña"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirmar Contraseña <span className="text-red-500">*</span>
                      </label>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Confirma tu nueva contraseña"
                      />
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="showPassword"
                        checked={showPassword}
                        onChange={(e) => setShowPassword(e.target.checked)}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <label htmlFor="showPassword" className="ml-2 text-sm text-gray-700">
                        Mostrar contraseñas
                      </label>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6 mb-6">
                    <p className="text-blue-800 text-sm font-semibold mb-2">
                      🔒 Requisitos de seguridad:
                    </p>
                    <ul className="text-blue-800 text-sm ml-4 list-disc space-y-1">
                      <li>Mínimo 8 caracteres</li>
                      <li>Al menos una letra minúscula</li>
                      <li>Al menos una letra mayúscula</li>
                      <li>Al menos un número</li>
                      <li>Al menos un carácter especial (@$!%*?&)</li>
                    </ul>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => setWelcomeStep(2)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                      Atrás
                    </button>
                    <button
                      onClick={handleVehicleSubmit}
                      className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                      Completar Registro
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConductorDashboard;
