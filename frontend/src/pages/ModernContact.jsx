import React, { useState } from 'react';
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  PaperAirplaneIcon,
  TruckIcon,
  HeartIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { contactAPI } from '../services/apiService';

const ModernContact = () => {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    asunto: '',
    mensaje: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setFieldErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const validateField = (name, value) => {
    if (!value || value.trim() === '') {
      const labels = {
        nombres: 'Nombres',
        apellidos: 'Apellidos',
        email: 'Correo electrónico',
        asunto: 'Asunto',
        mensaje: 'Mensaje'
      };
      return `${labels[name] || name} es requerido`;
    }

    switch (name) {
      case 'nombres':
        if (value.length < 2) return 'Los nombres deben tener al menos 2 caracteres';
        break;
      case 'apellidos':
        if (value.length < 2) return 'Los apellidos deben tener al menos 2 caracteres';
        break;
      case 'email':
        // Validar que tenga @
        if (!value.includes('@')) {
          return 'El correo debe contener el símbolo @';
        } else {
          // Validar formato completo
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            return 'Formato de correo inválido (ejemplo: usuario@dominio.com)';
          }
        }
        break;
      case 'asunto':
        if (value.length < 3) return 'El asunto debe tener al menos 3 caracteres';
        break;
      case 'mensaje':
        if (value.length < 10) return 'El mensaje debe tener al menos 10 caracteres';
        break;
      default:
        break;
    }
    
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setFieldErrors({});

    // Validar todos los campos
    const errors = {};
    const fieldsToValidate = ['nombres', 'apellidos', 'email', 'asunto', 'mensaje'];
    
    fieldsToValidate.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) errors[field] = error;
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Por favor corrige los errores en el formulario');
      setIsSubmitting(false);
      return;
    }
    
    try {
      const response = await contactAPI.sendMessage(formData);
      
      if (response.data.success) {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            nombres: '',
            apellidos: '',
            email: '',
            asunto: '',
            mensaje: ''
          });
        }, 3000);
      } else {
        setError(response.data.error || 'Error al enviar el mensaje');
      }
    } catch (err) {
      console.error('Error al enviar mensaje:', err);
      setError(
        err.response?.data?.error || 
        'Error al enviar el mensaje. Por favor, inténtalo de nuevo.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: PhoneIcon,
      title: 'Teléfono',
      content: '+1 (555) 123-4567',
      description: 'Lunes a Viernes, 8:00 - 18:00',
      color: 'bg-blue-500'
    },
    {
      icon: MapPinIcon,
      title: 'Dirección',
      content: '123 Calle Principal',
      description: 'Ciudad, País - CP 12345',
      color: 'bg-purple-500'
    },
    {
      icon: ClockIcon,
      title: 'Horarios',
      content: 'Lun - Vie: 8:00 - 18:00',
      description: 'Sáb: 9:00 - 14:00',
      color: 'bg-orange-500'
    }
  ];

  const features = [
    {
      icon: TruckIcon,
      title: 'Entrega Rápida',
      description: 'Envíos en 24-48 horas'
    },
    {
      icon: HeartIcon,
      title: 'Atención Personalizada',
      description: 'Soporte dedicado para cada cliente'
    },
    {
      icon: CheckCircleIcon,
      title: 'Garantía Total',
      description: 'Productos con garantía completa'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 flex flex-col">
      <div className="max-w-4xl mx-auto px-4 flex-grow">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-4 rounded-2xl shadow-lg">
              <EnvelopeIcon className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Contáctanos</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Estamos aquí para ayudarte con cualquier consulta sobre nuestros productos y servicios.
          </p>
        </div>

        {/* Formulario en vertical */}
        <div className="bg-white shadow-lg rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Envíanos un mensaje</h2>

          {/* Mensaje de error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
              <ExclamationCircleIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircleIcon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">¡Mensaje Enviado!</h3>
              <p className="text-gray-600">Gracias por contactarnos. Te responderemos pronto.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="nombres" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombres <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="nombres"
                  name="nombres"
                  required
                  value={formData.nombres}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition ${
                    fieldErrors.nombres ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Juan Carlos"
                />
                {fieldErrors.nombres && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.nombres}</p>
                )}
              </div>

              <div>
                <label htmlFor="apellidos" className="block text-sm font-medium text-gray-700 mb-2">
                  Apellidos <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="apellidos"
                  name="apellidos"
                  required
                  value={formData.apellidos}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition ${
                    fieldErrors.apellidos ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Pérez González"
                />
                {fieldErrors.apellidos && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.apellidos}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Correo electrónico <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition ${
                    fieldErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="tu@email.com"
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="asunto" className="block text-sm font-medium text-gray-700 mb-2">
                  Asunto <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="asunto"
                  name="asunto"
                  required
                  value={formData.asunto}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition ${
                    fieldErrors.asunto ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="¿En qué te podemos ayudar?"
                />
                {fieldErrors.asunto && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.asunto}</p>
                )}
              </div>

              <div>
                <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  required
                  rows={5}
                  value={formData.mensaje}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition resize-none ${
                    fieldErrors.mensaje ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Cuéntanos más detalles sobre tu consulta..."
                ></textarea>
                {fieldErrors.mensaje && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.mensaje}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700 hover:scale-105 shadow-lg text-white'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <PaperAirplaneIcon className="w-5 h-5" />
                    <span>Enviar Mensaje</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Información de contacto */}
        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <div key={index} className="bg-white shadow-md rounded-xl p-6 text-center">
                <div className={`${info.color} inline-flex p-3 rounded-lg mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900">{info.title}</h4>
                <p className="text-gray-800 font-medium">{info.content}</p>
                <p className="text-sm text-gray-600">{info.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-6 mt-8 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} <span className="font-semibold text-white">TuEmpresa</span>. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
};

export default ModernContact;
