import React, { useState, useEffect, useCallback } from 'react';

const DriverOrders = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [takingOrder, setTakingOrder] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      
      // Obtener pedidos pendientes
      const pendingResponse = await fetch('http://localhost:8000/api/pedidos/pendientes/', {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (pendingResponse.ok) {
        const pendingData = await pendingResponse.json();
        setPendingOrders(pendingData);
      }

      // Obtener mis pedidos asignados
      const myOrdersResponse = await fetch('http://localhost:8000/api/pedidos/mis_pedidos/', {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (myOrdersResponse.ok) {
        const myOrdersData = await myOrdersResponse.json();
        setMyOrders(myOrdersData);
      }

    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      alert('Error al cargar los pedidos');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const handleTakeOrder = async () => {
    if (!selectedOrder) return;

    try {
      setTakingOrder(true);
      
      const response = await fetch(`http://localhost:8000/api/pedidos/${selectedOrder.id}/tomar_pedido/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || 'Pedido tomado exitosamente');
        setShowModal(false);
        setSelectedOrder(null);
        fetchOrders(); // Refresh the orders
      } else {
        alert(data.error || 'Error al tomar el pedido');
      }
    } catch (error) {
      console.error('Error al tomar pedido:', error);
      alert('Error al tomar el pedido');
    } finally {
      setTakingOrder(false);
    }
  };

  const openOrderModal = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeOrderModal = () => {
    setSelectedOrder(null);
    setShowModal(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'pendiente': 'bg-yellow-100 text-yellow-800',
      'confirmado': 'bg-blue-100 text-blue-800',
      'en_curso': 'bg-orange-100 text-orange-800',
      'enviado': 'bg-purple-100 text-purple-800',
      'entregado': 'bg-green-100 text-green-800',
      'cancelado': 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const statusTexts = {
      'pendiente': 'Pendiente',
      'confirmado': 'Confirmado',
      'en_curso': 'En Curso',
      'enviado': 'Enviado',
      'entregado': 'Entregado',
      'cancelado': 'Cancelado'
    };
    return statusTexts[status] || status;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Panel del Conductor - Pedidos</h1>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('pending')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pending'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Pedidos Disponibles ({pendingOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('assigned')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'assigned'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Mis Pedidos ({myOrders.length})
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          {activeTab === 'pending' && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Pedidos Pendientes</h2>
              {pendingOrders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No hay pedidos pendientes disponibles</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {pendingOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">Pedido #{order.numero_pedido}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.estado)}`}>
                              {getStatusText(order.estado)}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                              <p><strong>Cliente:</strong> {order.usuario_nombre || 'N/A'}</p>
                              <p><strong>Total:</strong> {formatCurrency(order.total)}</p>
                              <p><strong>Fecha:</strong> {formatDate(order.fecha_creacion)}</p>
                            </div>
                            <div>
                              <p><strong>Dirección:</strong> {order.direccion_envio}</p>
                              <p><strong>Teléfono:</strong> {order.telefono_contacto}</p>
                              <p><strong>Items:</strong> {order.items?.length || 0} productos</p>
                            </div>
                          </div>
                          {order.notas && (
                            <div className="mt-2">
                              <p className="text-sm text-gray-600"><strong>Notas:</strong> {order.notas}</p>
                            </div>
                          )}
                        </div>
                        <div className="ml-4 flex flex-col gap-2">
                          <button
                            onClick={() => openOrderModal(order)}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors text-sm"
                          >
                            Ver Detalles
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'assigned' && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Mis Pedidos Asignados</h2>
              {myOrders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No tienes pedidos asignados actualmente</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {myOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">Pedido #{order.numero_pedido}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.estado)}`}>
                              {getStatusText(order.estado)}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                              <p><strong>Cliente:</strong> {order.usuario_nombre || 'N/A'}</p>
                              <p><strong>Total:</strong> {formatCurrency(order.total)}</p>
                              <p><strong>Fecha Asignación:</strong> {order.fecha_asignacion ? formatDate(order.fecha_asignacion) : 'N/A'}</p>
                            </div>
                            <div>
                              <p><strong>Dirección:</strong> {order.direccion_envio}</p>
                              <p><strong>Teléfono:</strong> {order.telefono_contacto}</p>
                              <p><strong>Items:</strong> {order.items?.length || 0} productos</p>
                            </div>
                          </div>
                          {order.notas && (
                            <div className="mt-2">
                              <p className="text-sm text-gray-600"><strong>Notas:</strong> {order.notas}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal para detalles del pedido */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Detalles del Pedido #{selectedOrder.numero_pedido}</h2>
                <button
                  onClick={closeOrderModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Información del Cliente</h3>
                  <p><strong>Nombre:</strong> {selectedOrder.usuario_nombre || 'N/A'}</p>
                  <p><strong>Teléfono:</strong> {selectedOrder.telefono_contacto}</p>
                  <p><strong>Dirección:</strong> {selectedOrder.direccion_envio}</p>
                  <p><strong>Total:</strong> {formatCurrency(selectedOrder.total)}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Información del Pedido</h3>
                  <p><strong>Estado:</strong> 
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.estado)}`}>
                      {getStatusText(selectedOrder.estado)}
                    </span>
                  </p>
                  <p><strong>Fecha:</strong> {formatDate(selectedOrder.fecha_creacion)}</p>
                  <p><strong>Items:</strong> {selectedOrder.items?.length || 0} productos</p>
                  {selectedOrder.notas && <p><strong>Notas:</strong> {selectedOrder.notas}</p>}
                </div>
              </div>

              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Productos</h3>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 border rounded">
                        <span>{item.producto_nombre || `Producto ID: ${item.producto}`}</span>
                        <span>x{item.cantidad} - {formatCurrency(item.subtotal)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={closeOrderModal}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cerrar
              </button>
              {selectedOrder.estado === 'pendiente' && (
                <button
                  onClick={handleTakeOrder}
                  disabled={takingOrder}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {takingOrder ? 'Tomando...' : 'Tomar Pedido'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverOrders;