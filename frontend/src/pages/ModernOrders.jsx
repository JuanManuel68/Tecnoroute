import React, { useState, useEffect } from 'react';
import {
  ClockIcon,
  TruckIcon,
  XCircleIcon,
  EyeIcon,
  ShoppingBagIcon,
  CalendarIcon,
  MapPinIcon,
  PhoneIcon,
  CreditCardIcon,
  DocumentTextIcon,
  PencilIcon,
  TrashIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import {
  CheckCircleIcon as CheckCircleIconSolid,
  StarIcon as StarIconSolid
} from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { pedidosAPI } from '../services/apiService';
import { useToast } from '../components/Toast';
import EditOrderModal from '../components/EditOrderModal';

const ModernOrders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast, ToastContainer } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [orderToEdit, setOrderToEdit] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Obtener pedidos del usuario desde la API
        const response = await pedidosAPI.getAll();
        
        // El backend ya filtra automáticamente por usuario autenticado
        // pero por seguridad también validamos en el frontend
        let userOrders = response.data || [];
        
        // Si el usuario tiene ID, filtrar por ID, sino por email
        if (user?.id) {
          userOrders = userOrders.filter(order => {
            return order.usuario === user.id || order.usuario_id === user.id;
          });
        } else if (user?.email) {
          userOrders = userOrders.filter(order => {
            return order.usuario?.email === user.email;
          });
        }
        
        setOrders(userOrders);
      } catch (error) {
        console.error('Error cargando pedidos:', error);
        setError(`Error al cargar los pedidos: ${error.message}`);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case 'pendiente':
        return {
          label: 'Pendiente',
          color: 'bg-gradient-to-r from-yellow-400 to-orange-500',
          textColor: 'text-white',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          icon: <ClockIcon className="w-4 h-4" />,
          description: 'Esperando confirmación'
        };
      case 'confirmado':
        return {
          label: 'Confirmado',
          color: 'bg-gradient-to-r from-blue-500 to-blue-600',
          textColor: 'text-white',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          icon: <CheckCircleIconSolid className="w-4 h-4" />,
          description: 'Pedido confirmado'
        };
      case 'enviado':
        return {
          label: 'Enviado',
          color: 'bg-gradient-to-r from-purple-500 to-indigo-600',
          textColor: 'text-white',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          icon: <TruckIcon className="w-4 h-4" />,
          description: 'En camino'
        };
      case 'entregado':
        return {
          label: 'Entregado',
          color: 'bg-gradient-to-r from-green-500 to-emerald-600',
          textColor: 'text-white',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          icon: <CheckCircleIconSolid className="w-4 h-4" />,
          description: 'Entregado exitosamente'
        };
      case 'cancelado':
        return {
          label: 'Cancelado',
          color: 'bg-gradient-to-r from-red-500 to-red-600',
          textColor: 'text-white',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          icon: <XCircleIcon className="w-4 h-4" />,
          description: 'Pedido cancelado'
        };
      default:
        return {
          label: 'Confirmado',
          color: 'bg-gradient-to-r from-blue-500 to-blue-600',
          textColor: 'text-white',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          icon: <CheckCircleIconSolid className="w-4 h-4" />,
          description: 'Pedido confirmado'
        };
    }
  };

  const formatPrice = (price) => `$${Number(price).toLocaleString('es-CO')}`;
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  // Función para eliminar pedido
  const handleDeleteOrder = async (orderId) => {
    try {
      setIsDeleting(true);
      await pedidosAPI.delete(orderId);
      
      // Actualizar la lista de pedidos
      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
      setShowDeleteModal(false);
      setOrderToDelete(null);
      
      // Mostrar mensaje de éxito
      showToast('Pedido eliminado exitosamente', 'success');
    } catch (error) {
      console.error('Error eliminando pedido:', error);
      const errorMessage = error.response?.data?.error || 'Error al eliminar el pedido. Intenta de nuevo.';
      showToast(errorMessage, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Función para abrir modal de confirmación de eliminación
  const confirmDeleteOrder = (order) => {
    setOrderToDelete(order);
    setShowDeleteModal(true);
  };

  // Función para abrir modal de edición
  const handleEditOrder = (order) => {
    setOrderToEdit(order);
    setShowEditModal(true);
  };

  // Función para guardar cambios del pedido
  const handleSaveOrderChanges = async (formData) => {
    if (!orderToEdit) return;
    
    try {
      setIsUpdating(true);
      
      const response = await pedidosAPI.update(orderToEdit.id, formData);
      
      // Actualizar el pedido en la lista local
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderToEdit.id 
            ? { ...order, ...formData }
            : order
        )
      );
      
      // Cerrar modal y mostrar mensaje de éxito
      setShowEditModal(false);
      setOrderToEdit(null);
      showToast('Pedido actualizado exitosamente', 'success');
      
    } catch (error) {
      console.error('Error actualizando pedido:', error);
      const errorMessage = error.response?.data?.error || 'Error al actualizar el pedido. Intenta de nuevo.';
      showToast(errorMessage, 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  // Función para verificar si un pedido se puede editar/eliminar
  const canEditOrDelete = (order) => {
    return order.estado?.toLowerCase() === 'pendiente';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando tus pedidos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-12">
            <XCircleIcon className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Error al cargar pedidos</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-20">
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full"></div>
              </div>
              <ShoppingBagIcon className="relative w-24 h-24 text-blue-400 mx-auto" />
            </div>
            
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent mb-6">
              Aún no has realizado pedidos
            </h2>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Descubre nuestra increíble selección de productos y realiza tu primera compra. ¡Te esperan ofertas fantásticas!
            </p>
            
            <div className="space-y-4">
              <button
                onClick={() => navigate('/productos')}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg"
              >
                🛍️ Explorar Productos
              </button>
              <p className="text-sm text-gray-500">
                ¿Necesitas ayuda? <span className="text-blue-600 font-medium cursor-pointer hover:underline">Contacta nuestro soporte</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header con estadísticas */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent mb-4">
              Mis Pedidos
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Historial completo de tus compras y seguimiento en tiempo real
            </p>
          </div>
          
          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                  <ShoppingBagIcon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Pedidos</p>
                  <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
                  <CheckCircleIconSolid className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Entregados</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {orders.filter(order => order.estado === 'entregado').length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl">
                  <ClockIcon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pendientes</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {orders.filter(order => order.estado === 'pendiente').length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl">
                  <CreditCardIcon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Gastado</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatPrice(orders.reduce((sum, order) => sum + Number(order.total), 0))}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de pedidos */}
        <div className="space-y-8">
          {orders.map((order) => {
            const statusInfo = getStatusInfo(order.estado);
            
            return (
              <div key={order.id} className={`bg-white rounded-2xl shadow-xl border-l-4 ${statusInfo.borderColor} overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1`}>
                <div className="p-8">
                  {/* Header del pedido */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl ${statusInfo.color}`}>
                        {statusInfo.icon}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                          Pedido #{order.numero_pedido}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {statusInfo.description}
                        </p>
                      </div>
                    </div>
                    <div className={`px-6 py-3 rounded-full ${statusInfo.color} ${statusInfo.textColor} font-semibold text-sm flex items-center space-x-2 shadow-lg`}>
                      {statusInfo.icon}
                      <span>{statusInfo.label}</span>
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-8">
                    {/* Información básica */}
                    <div className={`${statusInfo.bgColor} rounded-xl p-6 border ${statusInfo.borderColor}`}>
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <DocumentTextIcon className="w-5 h-5 mr-2" />
                        Información del Pedido
                      </h4>
                    
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-700">
                          <CalendarIcon className="w-4 h-4 mr-3 text-gray-500" />
                          <span className="font-medium">Fecha:</span>
                          <span className="ml-2">{formatDate(order.fecha_creacion || order.created_at)}</span>
                        </div>
                        <div className="flex items-start text-sm text-gray-700">
                          <MapPinIcon className="w-4 h-4 mr-3 mt-0.5 text-gray-500 flex-shrink-0" />
                          <div>
                            <span className="font-medium block">Dirección:</span>
                            <span className="text-gray-600">{order.direccion_envio || order.direccion || 'Dirección no especificada'}</span>
                          </div>
                        </div>
                        {(order.telefono_contacto || order.telefono) && (
                          <div className="flex items-center text-sm text-gray-700">
                            <PhoneIcon className="w-4 h-4 mr-3 text-gray-500" />
                            <span className="font-medium">Teléfono:</span>
                            <span className="ml-2">{order.telefono_contacto || order.telefono}</span>
                          </div>
                        )}
                        <div className="pt-2 border-t border-gray-200">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Total del pedido:</span>
                            <span className="text-xl font-bold text-gray-900">{formatPrice(order.total)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Productos */}
                    <div className="lg:col-span-2">
                      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                          <h4 className="font-semibold text-gray-900 flex items-center">
                            <ShoppingBagIcon className="w-5 h-5 mr-2" />
                            Productos ({(order.items || order.productos || []).length})
                          </h4>
                        </div>
                        <div className="p-6">
                          {(order.items || order.productos || []).length === 0 ? (
                            <p className="text-center text-gray-500 py-8">No hay productos en este pedido</p>
                          ) : (
                            <div className="space-y-4">
                              {(order.items || order.productos || []).slice(0, 3).map((item, index) => {
                                // Manejar diferentes estructuras de datos
                                const producto = item.producto || item;
                                const cantidad = item.cantidad || item.quantity || 1;
                                const precio = item.precio_unitario || item.precio || producto.precio || 0;
                                const subtotal = item.subtotal || (precio * cantidad);
                              
                              return (
                                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                  <div className="relative">
                                    <img
                                      src={producto?.imagen_url || 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500&h=400&fit=crop'}
                                      alt={producto?.nombre || 'Producto'}
                                      className="w-16 h-16 object-cover rounded-xl shadow-md"
                                      onError={(e) => {
                                        e.target.src = 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500&h=400&fit=crop';
                                      }}
                                    />
                                    <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                      {cantidad}
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-900 truncate mb-1">
                                      {producto?.nombre || item.producto_nombre || 'Producto sin nombre'}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {cantidad} unidades × {formatPrice(precio)}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-bold text-lg text-gray-900">
                                      {formatPrice(subtotal)}
                                    </p>
                                  </div>
                                </div>
                              );
                              })}
                              {(order.items || order.productos || []).length > 3 && (
                                <div className="text-center py-3 border-t border-gray-200">
                                  <p className="text-sm text-gray-600 font-medium">
                                    +{(order.items || order.productos || []).length - 3} productos más
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div>
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                        <div className="text-center mb-6">
                          <p className="text-sm font-medium text-gray-600 mb-2">Total del Pedido</p>
                          <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            {formatPrice(order.total)}
                          </p>
                        </div>
                        
                        <div className="space-y-3">
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowModal(true);
                            }}
                            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
                          >
                            <EyeIcon className="w-5 h-5" />
                            <span>Ver Detalles Completos</span>
                          </button>
                          
                          {/* Botones de editar y eliminar solo para pedidos pendientes */}
                          {canEditOrDelete(order) && (
                            <>
                              <button
                                onClick={() => handleEditOrder(order)}
                                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2 px-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
                              >
                                <PencilIcon className="w-4 h-4" />
                                <span>Editar Pedido</span>
                              </button>
                              <button
                                onClick={() => confirmDeleteOrder(order)}
                                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-2 px-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
                              >
                                <TrashIcon className="w-4 h-4" />
                                <span>Eliminar Pedido</span>
                              </button>
                            </>
                          )}
                          
                          {/* Mensaje informativo para pedidos que no se pueden editar */}
                          {!canEditOrDelete(order) && (
                            <div className="bg-gray-100 rounded-xl p-3 text-center">
                              <p className="text-sm text-gray-600">
                                <ExclamationTriangleIcon className="w-4 h-4 inline mr-1" />
                                Este pedido no se puede editar
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Solo los pedidos pendientes pueden ser modificados
                              </p>
                            </div>
                          )}
                          
                          {order.estado === 'entregado' && (
                            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <StarIconSolid key={star} className="w-4 h-4 text-yellow-400" />
                                ))}
                              </div>
                              <span className="text-xs">¡Califica tu experiencia!</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de detalles del pedido */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-white bg-opacity-20 rounded-xl">
                    <DocumentTextIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      Pedido #{selectedOrder.numero_pedido}
                    </h2>
                    <p className="text-blue-100 text-sm">
                      {getStatusInfo(selectedOrder.estado).description}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-xl transition-colors"
                >
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="max-h-[calc(90vh-120px)] overflow-y-auto modal-scrollbar smooth-scroll">
            
            <div className="p-6 space-y-6">
              {/* Información del pedido */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Información del Pedido</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Número:</strong> #{selectedOrder.numero_pedido || selectedOrder.id}</p>
                    <p><strong>Fecha:</strong> {formatDate(selectedOrder.fecha_creacion || selectedOrder.created_at)}</p>
                    <p><strong>Estado:</strong> 
                      <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusInfo(selectedOrder.estado).color}`}>
                        {getStatusInfo(selectedOrder.estado).label}
                      </span>
                    </p>
                    <p><strong>Total:</strong> {formatPrice(selectedOrder.total)}</p>
                    {selectedOrder.metodo_pago && (
                      <p><strong>Método de pago:</strong> {selectedOrder.metodo_pago}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Información de Envío</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Dirección:</strong> {selectedOrder.direccion_envio || selectedOrder.direccion || 'No especificada'}</p>
                    <p><strong>Teléfono:</strong> {selectedOrder.telefono_contacto || selectedOrder.telefono || 'No especificado'}</p>
                    {(selectedOrder.notas || selectedOrder.observaciones) && (
                      <p><strong>Notas:</strong> {selectedOrder.notas || selectedOrder.observaciones}</p>
                    )}
                    {selectedOrder.fecha_entrega_estimada && (
                      <p><strong>Fecha estimada de entrega:</strong> {formatDate(selectedOrder.fecha_entrega_estimada)}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Productos detallados */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Productos</h3>
                <div className="space-y-3">
                  {(selectedOrder.items || selectedOrder.productos || []).map((item, index) => {
                    // Manejar diferentes estructuras de datos
                    const producto = item.producto || item;
                    const cantidad = item.cantidad || item.quantity || 1;
                    const precio = item.precio_unitario || item.precio || producto.precio || 0;
                    const subtotal = item.subtotal || (precio * cantidad);
                    
                    return (
                      <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                        <img
                          src={producto?.imagen_url || 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500&h=400&fit=crop'}
                          alt={producto?.nombre || 'Producto'}
                          className="w-16 h-16 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500&h=400&fit=crop';
                          }}
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">
                            {producto?.nombre || 'Producto sin nombre'}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Cantidad: {cantidad} | Precio unitario: {formatPrice(precio)}
                          </p>
                          {producto?.categoria_nombre && (
                            <p className="text-xs text-gray-500 mt-1">
                              Categoría: {producto.categoria_nombre}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatPrice(subtotal)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total del Pedido:</span>
                    <span className="text-primary-600">{formatPrice(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            </div>
            
            <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Última actualización: {formatDate(selectedOrder.fecha_actualizacion || selectedOrder.updated_at || selectedOrder.fecha_creacion)}
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && orderToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full mb-4">
                <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                ¿Eliminar pedido?
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Esta acción no se puede deshacer. Se eliminará permanentemente el pedido 
                <strong>#{orderToDelete.numero_pedido}</strong>
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setOrderToDelete(null);
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-xl transition-colors"
                  disabled={isDeleting}
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDeleteOrder(orderToDelete.id)}
                  disabled={isDeleting}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Eliminando...</span>
                    </>
                  ) : (
                    <>
                      <TrashIcon className="w-4 h-4" />
                      <span>Sí, eliminar</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de edición */}
      <EditOrderModal
        order={orderToEdit}
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setOrderToEdit(null);
        }}
        onSave={handleSaveOrderChanges}
        isLoading={isUpdating}
      />
      
      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default ModernOrders;
