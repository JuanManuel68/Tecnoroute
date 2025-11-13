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

// ===============================
// COMPONENTE InputField
// ===============================

const InputField = ({
  name,
  label,
  type = 'text',
  textarea = false,
  formData,
  handleInputChange,
  handleBlur,
  fieldErrors,
  isSubmitting,
}) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
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
        placeholder={`Escribe aquí tu ${label.toLowerCase()}...`}
        className={`w-full rounded-lg border p-3 shadow-sm focus:ring-[#6a0dad] focus:border-[#6a0dad] transition duration-150 ${
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
        placeholder={`Escribe aquí tu ${label.toLowerCase()}...`}
        className={`w-full rounded-lg border p-3 shadow-sm focus:ring-[#6a0dad] focus:border-[#6a0dad] transition duration-150 ${
          fieldErrors[name] ? 'border-red-500' : 'border-gray-300'
        }`}
        disabled={isSubmitting}
      />
    )}

    {fieldErrors[name] && (
      <p className="mt-1 text-sm text-red-600">{fieldErrors[name]}</p>
    )}
  </div>
);

// ===============================
// COMPONENTE PRINCIPAL ModernContact
// ===============================

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
  const [bgPos, setBgPos] = useState(50);

  // Autocompletar datos si el usuario está logueado
  useEffect(() => {
    if (user && user.email) {
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

  // ===========================
  // Manejadores
  // ===========================

  const handleMouseMove = (e) => {
    const y = e.clientY / window.innerHeight;
    setBgPos(20 + y * 60);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (error) setError('');
    if (fieldErrors[name])
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const err = validateField(name, value);
    if (err)
      setFieldErrors((prev) => ({
        ...prev,
        [name]: err,
      }));
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
        const emailRegex =
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value))
          return 'Formato de correo inválido';
        break;

      case 'mensaje':
        if (value.length < 10)
          return 'El mensaje debe tener al menos 10 caracteres';
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

    ['nombres', 'apellidos', 'email', 'asunto', 'mensaje'].forEach(
      (f) => {
        const err = validateField(f, formData[f]);
        if (err) errors[f] = err;
      }
    );

    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      setError(
        'Por favor corrige los errores en el formulario'
      );
      setIsSubmitting(false);
      return;
    }

    try {
      await contactAPI.sendMessage({
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        email: formData.email,
        asunto: formData.asunto,
        mensaje: formData.mensaje,
        userId: user?.id || null,
      });

      setIsSubmitted(true);

      setTimeout(() => {
        setIsSubmitted(false);

        setFormData({
          nombres: user?.name?.split(' ')[0] || '',
          apellidos:
            user?.name?.split(' ').slice(1).join(' ') ||
            '',
          email: user?.email || '',
          asunto: '',
          mensaje: '',
        });
      }, 3000);
    } catch (err) {
      setError(
        'Error al enviar el mensaje. Por favor intenta nuevamente.'
      );
      console.error('Error enviando contacto:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputProps = {
    formData,
    handleInputChange,
    handleBlur,
    fieldErrors,
    isSubmitting,
  };

  // ===========================
  // RENDER
  // ===========================

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative min-h-screen overflow-hidden flex items-center justify-center px-4 md:px-6 py-12 md:py-16 font-sans"
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
      <div className="relative z-10 w-full max-w-5xl mx-auto">

        {/* TÍTULO */}
        <div className="text-center mb-8 md:mb-12">
          <div className="flex justify-center mb-4 md:mb-6">
            <div className="bg-[#1f2937] p-4 md:p-5 rounded-2xl shadow-lg">
              <EnvelopeIcon className="w-10 h-10 md:w-12 md:h-12 text-[#ffe066]" />
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 md:mb-3">
            Contáctanos 💬
          </h1>

          <p className="text-sm md:text-xl text-gray-200 max-w-2xl mx-auto">
            Estamos listos para impulsar tus ventas y ayudarte en tus
            necesidades de transporte.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">

          {/* PANEL DE INFORMACIÓN */}
          <div className="lg:col-span-1 space-y-4 md:space-y-6">
            <div className="bg-white/95 backdrop-blur-sm p-4 md:p-6 rounded-2xl shadow-xl">
              <h2 className="text-xl md:text-2xl font-bold text-[#1a1a1a] mb-3 md:mb-5">
                Nuestra Información
              </h2>

              <ul className="space-y-4 md:space-y-6">
                <li className="flex items-start space-x-3 md:space-x-4">
                  <div className="p-2 md:p-3 rounded-xl shadow-lg bg-gradient-to-br from-[#6a0dad] to-[#0057ff]">
                    <PhoneIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Teléfono</p>
                    <p className="text-xs md:text-sm text-gray-700">+1 (555) 123-4567</p>
                    <p className="text-xs text-gray-500">Lunes a Viernes, 8:00 - 18:00</p>
                  </div>
                </li>

                <li className="flex items-start space-x-3 md:space-x-4">
                  <div className="p-2 md:p-3 rounded-xl shadow-lg bg-gradient-to-br from-[#6a0dad] to-[#0057ff]">
                    <MapPinIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Dirección</p>
                    <p className="text-xs md:text-sm text-gray-700">123 Calle Principal</p>
                    <p className="text-xs text-gray-500">Ciudad, País - CP 12345</p>
                  </div>
                </li>

                <li className="flex items-start space-x-3 md:space-x-4">
                  <div className="p-2 md:p-3 rounded-xl shadow-lg bg-gradient-to-br from-[#6a0dad] to-[#ff7b00]">
                    <ClockIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Horarios</p>
                    <p className="text-xs md:text-sm text-gray-700">Lun - Vie: 8:00 - 18:00</p>
                    <p className="text-xs text-gray-500">Sáb: 9:00 - 14:00</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* BENEFICIOS */}
            <div className="bg-white/95 backdrop-blur-sm p-4 md:p-6 rounded-2xl shadow-xl">
              <h3 className="text-lg md:text-xl font-bold text-[#1a1a1a] mb-3 md:mb-4">
                Por qué Elegirnos
              </h3>

              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center space-x-2 md:space-x-3">
                  <TruckIcon className="w-5 h-5 md:w-6 md:h-6 text-[#6a0dad]" />
                  <div>
                    <p className="font-semibold text-gray-800 text-sm md:text-base">Entrega Rápida</p>
                    <p className="text-xs md:text-sm text-gray-500">Envíos en 24-48 horas</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 md:space-x-3">
                  <HeartIcon className="w-5 h-5 md:w-6 md:h-6 text-[#ff7b00]" />
                  <div>
                    <p className="font-semibold text-gray-800 text-sm md:text-base">Atención Personalizada</p>
                    <p className="text-xs md:text-sm text-gray-500">Soporte dedicado para cada cliente</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 md:space-x-3">
                  <CheckCircleIcon className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                  <div>
                    <p className="font-semibold text-gray-800 text-sm md:text-base">Garantía Total</p>
                    <p className="text-xs md:text-sm text-gray-500">Productos con garantía completa</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FORMULARIO */}
          <div className="lg:col-span-2">
            <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl p-6 md:p-8 border border-gray-200 max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] mb-4 md:mb-6 text-center md:text-left">
                Envíanos un mensaje
              </h2>

              {error && (
                <div className="mb-4 p-3 md:p-4 bg-red-50 border border-red-400 rounded-lg flex items-start space-x-2 md:space-x-3 shadow-md">
                  <ExclamationCircleIcon className="w-5 h-5 md:w-6 md:h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm md:text-base font-medium text-red-800">{error}</p>
                </div>
              )}

              {isSubmitted ? (
                <div className="text-center py-8 md:py-12 bg-green-50 rounded-xl border-2 border-green-300 shadow-inner">
                  <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-full mb-3 md:mb-4 animate-bounce">
                    <CheckCircleIcon className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
                  </div>

                  <h3 className="text-xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">
                    ¡Mensaje Enviado con Éxito!
                  </h3>

                  <p className="text-sm md:text-lg text-gray-600">
                    Gracias por contactarnos. Te responderemos pronto.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                  {/* Nombres + Apellidos */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-6">
                    <InputField name="nombres" label="Nombres" {...inputProps} />
                    <InputField name="apellidos" label="Apellidos" {...inputProps} />
                  </div>

                  {/* Correo */}
                  <InputField name="email" label="Correo electrónico" type="email" {...inputProps} />

                  {/* Asunto */}
                  <InputField name="asunto" label="Asunto" {...inputProps} />

                  {/* Mensaje */}
                  <InputField name="mensaje" label="Mensaje" textarea {...inputProps} />

                  {/* Botón Enviar */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 md:py-4 text-lg font-semibold text-white rounded-full shadow-lg transition-all flex items-center justify-center gap-2 ${
                      isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gray-800 hover:bg-gray-600 hover:scale-105'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="inline-block animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-white"></div>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <PaperAirplaneIcon className="w-4 h-4 md:w-5 md:h-5 -rotate-45" />
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
