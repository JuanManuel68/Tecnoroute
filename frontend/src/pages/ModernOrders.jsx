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
  ExclamationTriangleIcon,
  MapIcon
} from '@heroicons/react/24/outline';
import {
  CheckCircleIcon as CheckCircleIconSolid,
  StarIcon as StarIconSolid
} from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { pedidosAPI, carritoAPI } from '../services/apiService';
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
        const response = await pedidosAPI.getAll();
        let userOrders = response.data || [];
        if (user?.id) {
          userOrders = userOrders.filter(order => order.usuario === user.id || order.usuario_id === user.id);
        } else if (user?.email) {
          userOrders = userOrders.filter(order => order.usuario?.email === user.email);
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
    if (user) loadOrders();
    else setLoading(false);
  }, [user]);

  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case 'pendiente':
        return { label: 'Pendiente', color: 'bg-yellow-500', icon: <ClockIcon className="w-4 h-4" /> };
      case 'confirmado':
        return { label: 'Confirmado', color: 'bg-blue-600', icon: <CheckCircleIconSolid className="w-4 h-4" /> };
      case 'enviado':
        return { label: 'Enviado', color: 'bg-purple-600', icon: <TruckIcon className="w-4 h-4" /> };
      case 'entregado':
        return { label: 'Entregado', color: 'bg-green-600', icon: <CheckCircleIconSolid className="w-4 h-4" /> };
      case 'cancelado':
        return { label: 'Cancelado', color: 'bg-red-600', icon: <XCircleIcon className="w-4 h-4" /> };
      default:
        return { label: 'Confirmado', color: 'bg-blue-600', icon: <CheckCircleIconSolid className="w-4 h-4" /> };
    }
  };

  const formatPrice = (price) => `$${Number(price).toLocaleString('es-CO')}`;
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  const handleDeleteOrder = async (orderId) => {
    try {
      setIsDeleting(true);
      await pedidosAPI.delete(orderId);
      setOrders(prev => prev.filter(order => order.id !== orderId));
      setShowDeleteModal(false);
      showToast('Pedido eliminado exitosamente', 'success');
    } catch {
      showToast('Error al eliminar el pedido.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const canEditOrDelete = (order) => order.estado?.toLowerCase() === 'pendiente';

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-300 via-blue-300 to-orange-200 flex items-center justify-center">
        <p className="text-white text-xl animate-pulse">Cargando tus pedidos...</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-300 via-blue-300 to-orange-200 flex items-center justify-center text-white text-center px-6">
        <div>
          <XCircleIcon className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">Error al cargar pedidos</h2>
          <p className="mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black py-3 px-6 rounded-xl text-white font-semibold shadow-lg"
          >
            Reintentar
          </button>
        </div>
      </div>
    );

  if (orders.length === 0)
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-300 via-blue-300 to-orange-200 flex flex-col items-center justify-center text-white px-6 text-center">
        <ShoppingBagIcon className="w-24 h-24 text-white mb-4" />
        <h2 className="text-4xl font-bold mb-4">Aún no has realizado pedidos</h2>
        <p className="max-w-lg text-white/90 mb-6">
          Descubre nuestra increíble selección de productos y realiza tu primera compra.
        </p>
        <button
          onClick={() => navigate('/productos')}
          className="bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
        >
          🛍️ Explorar Productos
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-300 via-blue-300 to-orange-200 py-8">
      <div className="max-w-7xl mx-auto px-4 text-white">
        <h1 className="text-5xl font-bold text-center mb-10">Mis Pedidos</h1>

        {orders.map((order) => {
          const status = getStatusInfo(order.estado);
          return (
            <div key={order.id} className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl mb-8 p-6 text-gray-900">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold">Pedido #{order.numero_pedido}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${status.color}`}>
                  {status.label}
                </span>
              </div>

              <p className="text-gray-700 mb-4">
                <CalendarIcon className="inline w-5 h-5 mr-2 text-gray-500" />
                {formatDate(order.fecha_creacion || order.created_at)}
              </p>

              <p className="text-lg font-semibold mb-6">Total: {formatPrice(order.total)}</p>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowModal(true);
                  }}
                  className="bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white font-semibold py-2 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
                >
                  <EyeIcon className="w-5 h-5" />
                  <span>Ver Detalles</span>
                </button>

                {(order.estado === 'confirmado' || order.estado === 'enviado' || order.estado === 'entregado') && (
                  <button
                    onClick={() => navigate(`/seguimiento?codigo=${order.numero_pedido}`)}
                    className="bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white font-semibold py-2 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
                  >
                    <MapIcon className="w-5 h-5" />
                    <span>Rastrear Pedido</span>
                  </button>
                )}

                {canEditOrDelete(order) && (
                  <>
                    <button
                      onClick={() => {
                        setOrderToDelete(order);
                        setShowDeleteModal(true);
                      }}
                      className="bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white font-semibold py-2 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
                    >
                      <TrashIcon className="w-5 h-5" />
                      <span>Eliminar</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modales */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-300 via-blue-300 to-orange-200 text-white p-6 flex justify-between items-center">
              <h2 className="text-xl font-bold">Pedido #{selectedOrder.numero_pedido}</h2>
              <button onClick={() => setShowModal(false)}>
                <XCircleIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">Total: {formatPrice(selectedOrder.total)}</p>
              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white py-3 rounded-xl mt-4"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && orderToDelete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">¿Eliminar Pedido?</h3>
            <p className="text-gray-600 mb-6 text-center">
              Esta acción no se puede deshacer. Se eliminará el pedido #{orderToDelete.numero_pedido}.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-xl"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDeleteOrder(orderToDelete.id)}
                className="flex-1 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white py-3 rounded-xl"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <EditOrderModal
        order={orderToEdit}
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setOrderToEdit(null);
        }}
        onSave={() => {}}
        isLoading={isUpdating}
      />

      <ToastContainer />

      <footer className="bg-gray-900 text-gray-300 py-6 mt-8 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} <span className="font-semibold text-white">TuEmpresa</span>. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
};

export default ModernOrders;
