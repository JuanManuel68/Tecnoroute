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
  const [bgPos, setBgPos] = useState(50); // efecto fondo dinámico

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

  // Handlers
  const handleMouseMove = (e) => {
    const y = e.clientY / window.innerHeight;
    setBgPos(20 + y * 60);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };
  const handleBlur = (e) => {
    const { name, value } = e.target;
    const err = validateField(name, value);
    if (err) setFieldErrors((prev) => ({ ...prev, [name]: err }));
  };

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
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Formato de correo inválido';
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
    const errors = {};
    ['nombres', 'apellidos', 'email', 'asunto', 'mensaje'].forEach((f) => {
      const err = validateField(f, formData[f]);
      if (err) errors[f] = err;
    });
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      setError('Por favor corrige los errores en el formulario');
      setIsSubmitting(false);
      return;
    }
    try {
      await new Promise((r) => setTimeout(r, 800));
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ nombres: '', apellidos: '', email: '', asunto: '', mensaje: '' });
      }, 3000);
    } catch {
      setError('Error al enviar el mensaje.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const InputField = ({ name, label, type = 'text', textarea = false }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {textarea ? (
        <textarea
          id={name}
          name={name}
          rows="4"
          value={formData[name]}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className={`w-full rounded-full border p-3 shadow-sm focus:ring-[#6a0dad] focus:border-[#6a0dad] transition duration-150 ${
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
          className={`w-full rounded-full border p-3 shadow-sm focus:ring-[#6a0dad] focus:border-[#6a0dad] transition duration-150 ${
            fieldErrors[name] ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isSubmitting}
        />
      )}
      {fieldErrors[name] && <p className="mt-1 text-sm text-red-600">{fieldErrors[name]}</p>}
    </div>
  );

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative min-h-screen overflow-hidden flex items-center justify-center px-6 py-16"
      style={{
        backgroundImage: `
          linear-gradient(to bottom right, rgba(106,13,173,0.7), rgba(0,87,255,0.6), rgba(255,123,0,0.6)),
          url('https://eldiariony.com/wp-content/uploads/sites/2/2024/12/16-electrodomesticos-de-tu-hogar-que-hacen-que-tu-factura-de-electricidad-sea-cara-shutterstock_2473408983.jpg?fit=1316,740&crop=0px,0px,1316px,740px')
        `,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: `center ${bgPos}%`,
        transition: 'background-position 0.3s ease-out',
      }}
    >
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Encabezado */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-[#1f2937] p-5 rounded-2xl shadow-lg">
              <EnvelopeIcon className="w-12 h-12 text-[#ffe066]" />
            </div>
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-3">Contáctanos 💬</h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Estamos listos para impulsar tus ventas y ayudarte en tus necesidades de transporte.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Información de contacto */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-xl">
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-5">Nuestra Información</h2>
              <ul className="space-y-6">
                <li className="flex items-start space-x-4">
                  <div className="p-3 rounded-xl shadow-lg bg-gradient-to-br from-[#6a0dad] to-[#0057ff]">
                    <PhoneIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Teléfono</p>
                    <p className="text-gray-700 text-sm">+1 (555) 123-4567</p>
                    <p className="text-gray-500 text-xs">Lunes a Viernes, 8:00 - 18:00</p>
                  </div>
                </li>
                <li className="flex items-start space-x-4">
                  <div className="p-3 rounded-xl shadow-lg bg-gradient-to-br from-[#6a0dad] to-[#0057ff]">
                    <MapPinIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Dirección</p>
                    <p className="text-gray-700 text-sm">123 Calle Principal</p>
                    <p className="text-gray-500 text-xs">Ciudad, País - CP 12345</p>
                  </div>
                </li>
                <li className="flex items-start space-x-4">
                  <div className="p-3 rounded-xl shadow-lg bg-gradient-to-br from-[#6a0dad] to-[#ff7b00]">
                    <ClockIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Horarios</p>
                    <p className="text-gray-700 text-sm">Lun - Vie: 8:00 - 18:00</p>
                    <p className="text-gray-500 text-xs">Sáb: 9:00 - 14:00</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Beneficios */}
            <div className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-xl">
              <h3 className="text-xl font-bold text-[#1a1a1a] mb-4">Por qué Elegirnos</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <TruckIcon className="w-6 h-6 text-[#6a0dad]" />
                  <div>
                    <p className="font-semibold text-gray-800">Entrega Rápida</p>
                    <p className="text-sm text-gray-500">Envíos en 24-48 horas</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <HeartIcon className="w-6 h-6 text-[#ff7b00]" />
                  <div>
                    <p className="font-semibold text-gray-800">Atención Personalizada</p>
                    <p className="text-sm text-gray-500">Soporte dedicado para cada cliente</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-semibold text-gray-800">Garantía Total</p>
                    <p className="text-sm text-gray-500">Productos con garantía completa</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <div className="lg:col-span-2">
            <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl p-8 border border-gray-200">
              <h2 className="text-3xl font-bold text-[#1a1a1a] mb-6">Envíanos un mensaje</h2>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-400 rounded-lg flex items-start space-x-3 shadow-md">
                  <ExclamationCircleIcon className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-base font-medium text-red-800">{error}</p>
                </div>
              )}

              {isSubmitted ? (
                <div className="text-center py-12 bg-green-50 rounded-xl border-2 border-green-300 shadow-inner">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4 animate-bounce">
                    <CheckCircleIcon className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">¡Mensaje Enviado con Éxito!</h3>
                  <p className="text-lg text-gray-600">Gracias por contactarnos. Te responderemos pronto.</p>
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
                    className={`w-full py-4 text-lg font-semibold text-white rounded-full shadow-lg transition-all flex items-center justify-center gap-2 ${
                      isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gray-800 hover:bg-gray-600 hover:scale-105'
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
