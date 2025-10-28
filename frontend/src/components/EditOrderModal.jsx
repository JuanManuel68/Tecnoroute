import React, { useState, useEffect } from 'react';
import {
  PencilIcon,
  XCircleIcon,
  MapPinIcon,
  PhoneIcon,
  DocumentTextIcon,
  UserIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import '../styles/scrollbar.css';

const EditOrderModal = ({ order, isOpen, onClose, onSave, isLoading }) => {
  const [formData, setFormData] = useState({
    direccion_envio: '',
    telefono_contacto: '',
    notas: ''
  });
  
  const [errors, setErrors] = useState({});

  // Cargar datos del pedido cuando se abre el modal
  useEffect(() => {
    if (order) {
      setFormData({
        direccion_envio: order.direccion_envio || '',
        telefono_contacto: order.telefono_contacto || '',
        notas: order.notas || ''
      });
      setErrors({});
    }
  }, [order]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.direccion_envio.trim()) {
      newErrors.direccion_envio = 'La dirección de envío es obligatoria';
    } else if (formData.direccion_envio.trim().length < 10) {
      newErrors.direccion_envio = 'La dirección debe tener al menos 10 caracteres';
    }

    if (!formData.telefono_contacto.trim()) {
      newErrors.telefono_contacto = 'El teléfono de contacto es obligatorio';
    } else if (!/^[\d\s\-\+\(\)]{7,15}$/.test(formData.telefono_contacto.trim())) {
      newErrors.telefono_contacto = 'El teléfono debe tener un formato válido (7-15 dígitos)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSave(formData);
  };

  const handleClose = () => {
    setFormData({
      direccion_envio: '',
      telefono_contacto: '',
      notas: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-white bg-opacity-20 rounded-xl">
                <PencilIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  Editar Pedido #{order.numero_pedido}
                </h2>
                <p className="text-green-100 text-sm">
                  Modifica la información de entrega de tu pedido
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-xl transition-colors disabled:opacity-50"
            >
              <XCircleIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form with scrollable content */}
        <div className="max-h-[calc(90vh-200px)] overflow-y-auto modal-scrollbar smooth-scroll">
          <form id="edit-order-form" onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
            {/* Información del pedido (solo lectura) */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <DocumentTextIcon className="w-5 h-5 mr-2" />
                Información del Pedido (No editable)
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Total:</span>
                  <span className="ml-2 text-gray-600">
                    ${Number(order.total).toLocaleString('es-CO')}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Estado:</span>
                  <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    {order.estado}
                  </span>
                </div>
              </div>
              <div className="mt-2">
                <span className="font-medium text-gray-700">Productos:</span>
                <span className="ml-2 text-gray-600">
                  {(order.items || []).length} artículo(s)
                </span>
              </div>
            </div>

            {/* Dirección de envío */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <MapPinIcon className="w-4 h-4 mr-2" />
                Dirección de Envío *
              </label>
              <textarea
                value={formData.direccion_envio}
                onChange={(e) => handleInputChange('direccion_envio', e.target.value)}
                rows={3}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none ${
                  errors.direccion_envio ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Escribe la dirección completa de entrega..."
                disabled={isLoading}
              />
              {errors.direccion_envio && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                  {errors.direccion_envio}
                </p>
              )}
            </div>

            {/* Teléfono de contacto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <PhoneIcon className="w-4 h-4 mr-2" />
                Teléfono de Contacto *
              </label>
              <input
                type="tel"
                value={formData.telefono_contacto}
                onChange={(e) => handleInputChange('telefono_contacto', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                  errors.telefono_contacto ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Ej: +57 300 123 4567"
                disabled={isLoading}
              />
              {errors.telefono_contacto && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                  {errors.telefono_contacto}
                </p>
              )}
            </div>

            {/* Notas adicionales */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <DocumentTextIcon className="w-4 h-4 mr-2" />
                Notas Adicionales (Opcional)
              </label>
              <textarea
                value={formData.notas}
                onChange={(e) => handleInputChange('notas', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none"
                placeholder="Instrucciones especiales para la entrega, referencias del lugar, etc..."
                disabled={isLoading}
              />
            </div>

            {/* Información importante */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start">
                <ExclamationTriangleIcon className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                <div>
                  <p className="text-blue-800 font-medium text-sm">Información importante</p>
                  <p className="text-blue-700 text-sm mt-1">
                    • Solo puedes editar pedidos en estado "pendiente"<br />
                    • Los productos del pedido no se pueden modificar<br />
                    • Una vez confirmado el pedido, no podrás editarlo
                  </p>
                </div>
              </div>
            </div>
            </div>
          </form>
        </div>
        
        {/* Botones fijos en la parte inferior */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-xl transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="edit-order-form"
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <PencilIcon className="w-4 h-4" />
                  <span>Guardar Cambios</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditOrderModal;