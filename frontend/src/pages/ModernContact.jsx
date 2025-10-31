import React, { useState } from 'react';
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  PaperAirplaneIcon,
  TruckIcon,
  HeartIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const ModernContact = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          nombre: '',
          email: '',
          asunto: '',
          mensaje: ''
        });
      }, 3000);
    }, 1500);
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
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  required
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
                  placeholder="Tu nombre completo"
                />
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
                  placeholder="tu@email.com"
                />
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
                  placeholder="¿En qué te podemos ayudar?"
                />
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition resize-none"
                  placeholder="Cuéntanos más detalles sobre tu consulta..."
                ></textarea>
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
