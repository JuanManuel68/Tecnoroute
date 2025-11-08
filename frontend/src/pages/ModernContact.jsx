import React, { useState, useEffect } from 'react';
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  PaperAirplaneIcon,
  TruckIcon,
  HeartIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { contactAPI } from '../services/apiService';
import { useAuth } from '../context/AuthContext';

// --- CONFIGURACIÓN DE COLORES VIBRANTES ---
const PRIMARY_COLOR = 'indigo'; // Color principal para acción (botones, íconos)
const BRAND_GRADIENT = `from-${PRIMARY_COLOR}-500 to-${PRIMARY_COLOR}-700`;

const ModernContact = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    asunto: '',
    mensaje: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // ... (useEffect, handleInputChange, handleBlur, validateField, handleSubmit functions remain the same)
  // Autocompletar datos si el usuario está autenticado
  useEffect(() => {
    if (user) {
      const nameParts = user.name ? user.name.split(' ') : [];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      setFormData((prev) => ({
        ...prev,
        nombres: firstName,
        apellidos: lastName,
        email: user.email || '',
      }));
    }
  }, [user]);

  // Manejo de cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Validación de cada campo al perder el foco
  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) setFieldErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Validación de campos
  const validateField = (name, value) => {
    if (!value || value.trim() === '') {
      const labels = {
        nombres: 'Nombres',
        apellidos: 'Apellidos',
        email: 'Correo electrónico',
        asunto: 'Asunto',
        mensaje: 'Mensaje',
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
        if (!value.includes('@')) return 'El correo debe contener el símbolo @';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Formato de correo inválido (ejemplo: usuario@dominio.com)';
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

  // Envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setFieldErrors({});

    // Validar todos los campos
    const errors = {};
    ['nombres', 'apellidos', 'email', 'asunto', 'mensaje'].forEach((field) => {
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
      // Simulación de la llamada API
      // const response = await contactAPI.sendMessage(formData);
      // if (response.data.success) {

      // Simulación de éxito
      await new Promise(resolve => setTimeout(resolve, 800)); // Simula la latencia
      const response = { data: { success: true } };

      if (response.data.success) {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            nombres: '',
            apellidos: '',
            email: '',
            asunto: '',
            mensaje: '',
          });
        }, 3000);
      } else {
        setError(response.data.error || 'Error al enviar el mensaje');
      }
    } catch (err) {
      console.error('Error al enviar mensaje:', err);
      setError(err.response?.data?.error || 'Error al enviar el mensaje. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };


  // Información de contacto - Colores vibrantes (gradient)
  const contactInfo = [
    {
      icon: PhoneIcon,
      title: 'Teléfono',
      content: '+1 (555) 123-4567',
      description: 'Lunes a Viernes, 8:00 - 18:00',
      color: 'bg-gradient-to-br from-cyan-500 to-blue-600',
    },
    {
      icon: MapPinIcon,
      title: 'Dirección',
      content: '123 Calle Principal',
      description: 'Ciudad, País - CP 12345',
      color: `bg-gradient-to-br from-${PRIMARY_COLOR}-500 to-${PRIMARY_COLOR}-600`, // Color principal
    },
    {
      icon: ClockIcon,
      title: 'Horarios',
      content: 'Lun - Vie: 8:00 - 18:00',
      description: 'Sáb: 9:00 - 14:00',
      color: 'bg-gradient-to-br from-orange-500 to-red-600',
    },
  ];

  // Características o beneficios - Enfoque en transporte/ventas
  const features = [
    { icon: TruckIcon, title: 'Entrega Rápida', description: 'Envíos en 24-48 horas', color: 'text-indigo-600' },
    { icon: HeartIcon, title: 'Atención Personalizada', description: 'Soporte dedicado para cada cliente', color: 'text-pink-600' },
    { icon: CheckCircleIcon, title: 'Garantía Total', description: 'Productos con garantía completa', color: 'text-green-600' },
  ];

  const InputField = ({ name, label, type = 'text', textarea = false }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {textarea ? (
        <textarea
          id={name}
          name={name}
          rows="4"
          value={formData[name]}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className={`mt-1 block w-full rounded-lg border p-3 shadow-sm focus:ring-${PRIMARY_COLOR}-500 focus:border-${PRIMARY_COLOR}-500 transition duration-150 ${
            fieldErrors[name] ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isSubmitting}
        ></textarea>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={formData[name]}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className={`mt-1 block w-full rounded-lg border p-3 shadow-sm focus:ring-${PRIMARY_COLOR}-500 focus:border-${PRIMARY_COLOR}-500 transition duration-150 ${
            fieldErrors[name] ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isSubmitting}
        />
      )}
      {fieldErrors[name] && <p className="mt-1 text-sm text-red-600">{fieldErrors[name]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className={`bg-gradient-to-br ${BRAND_GRADIENT} p-5 rounded-3xl shadow-xl transform rotate-3`}>
              <EnvelopeIcon className="w-12 h-12 text-white transform -rotate-3" />
            </div>
          </div>
          <h1 className="text-5xl font-extrabold text-gray-900 mb-3">Conéctate con Nosotros 💬</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Estamos listos para impulsar tus ventas y resolver tus necesidades de transporte.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Columna de Información de Contacto */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-5">Nuestra Información</h2>
              <ul className="space-y-6">
                {contactInfo.map((item, index) => (
                  <li key={index} className="flex items-start space-x-4">
                    <div
                      className={`p-3 rounded-xl shadow-lg ${item.color} flex-shrink-0 group-hover:scale-105 transition-transform`}
                    >
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{item.title}</p>
                      <p className="text-gray-700 text-sm">{item.content}</p>
                      <p className="text-gray-500 text-xs">{item.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {/* Características/Beneficios */}
            <div className="bg-white p-6 rounded-2xl shadow-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Por qué Elegirnos</h3>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <feature.icon className={`w-6 h-6 ${feature.color} flex-shrink-0`} />
                    <div>
                      <p className="font-semibold text-gray-800">{feature.title}</p>
                      <p className="text-sm text-gray-500">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Columna de Formulario */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-2xl rounded-2xl p-8 border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Envíanos un mensaje</h2>

              {/* Mensaje de error */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-400 rounded-lg flex items-start space-x-3 shadow-md">
                  <ExclamationCircleIcon className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-base font-medium text-red-800">{error}</p>
                </div>
              )}

              {/* Mensaje de éxito */}
              {isSubmitted ? (
                <div className="text-center py-12 bg-green-50 rounded-xl border-2 border-green-300 shadow-inner">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4 animate-bounce">
                    <CheckCircleIcon className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">¡Mensaje Enviado con Éxito!</h3>
                  <p className="text-lg text-gray-600">
                    Gracias por contactarnos. Te responderemos pronto.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField name="nombres" label="Nombres" />
                    <InputField name="apellidos" label="Apellidos" />
                  </div>
                  <InputField name="email" label="Correo electrónico" type="email" />
                  <InputField name="asunto" label="Asunto" />
                  <InputField name="mensaje" label="Mensaje" textarea />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 text-lg font-semibold text-white rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                      isSubmitting
                        ? `bg-gray-400 cursor-not-allowed`
                        : `bg-gradient-to-r from-${PRIMARY_COLOR}-600 to-${PRIMARY_COLOR}-800 hover:from-${PRIMARY_COLOR}-700 hover:to-${PRIMARY_COLOR}-900 hover:shadow-xl`
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <PaperAirplaneIcon className="w-5 h-5 -rotate-45" />
                        Enviar Mensaje
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernContact;