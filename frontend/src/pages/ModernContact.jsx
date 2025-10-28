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
    
    // Simular envío
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Reset form después de 3 segundos
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
      icon: EnvelopeIcon,
      title: 'Email',
      content: 'contacto@tecnoroute.com',
      description: 'Te respondemos en 24 horas',
      color: 'bg-green-500'
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
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-4 rounded-2xl shadow-lg">
              <EnvelopeIcon className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Contáctanos
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Estamos aquí para ayudarte con cualquier consulta sobre nuestros productos y servicios
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Formulario de Contacto */}
          <div className="lg:col-span-2">
            <div className="card p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Envíanos un mensaje</h2>
                <p className="text-gray-600">Completa el formulario y nos pondremos en contacto contigo pronto</p>
              </div>

              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <CheckCircleIcon className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">¡Mensaje Enviado!</h3>
                  <p className="text-gray-600">Gracias por contactarnos. Te responderemos pronto.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre completo
                      </label>
                      <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        required
                        value={formData.nombre}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        placeholder="Tu nombre completo"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="asunto" className="block text-sm font-medium text-gray-700 mb-2">
                      Asunto
                    </label>
                    <input
                      type="text"
                      id="asunto"
                      name="asunto"
                      required
                      value={formData.asunto}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      placeholder="¿En qué te podemos ayudar?"
                    />
                  </div>

                  <div>
                    <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 mb-2">
                      Mensaje
                    </label>
                    <textarea
                      id="mensaje"
                      name="mensaje"
                      required
                      rows={5}
                      value={formData.mensaje}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                      placeholder="Cuéntanos más detalles sobre tu consulta..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                      isSubmitting 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-primary-600 hover:bg-primary-700 transform hover:scale-105 shadow-lg hover:shadow-xl'
                    } text-white`}
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
          </div>

          {/* Información de Contacto */}
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Información de Contacto</h3>
              <div className="space-y-4">
                {contactInfo.map((info, index) => {
                  const IconComponent = info.icon;
                  return (
                    <div key={index} className="flex items-start space-x-4">
                      <div className={`${info.color} p-3 rounded-lg flex-shrink-0`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{info.title}</h4>
                        <p className="text-gray-800 font-medium">{info.content}</p>
                        <p className="text-sm text-gray-600">{info.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Características */}
            <div className="card p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">¿Por qué elegirnos?</h3>
              <div className="space-y-4">
                {features.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="bg-primary-100 p-2 rounded-lg">
                        <IconComponent className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Mapa o Sección adicional */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="card p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Nuestra Ubicación</h3>
            <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
              <div className="text-center">
                <MapPinIcon className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Mapa interactivo</p>
                <p className="text-sm text-gray-500">123 Calle Principal, Ciudad</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Cómo llegar:</strong></p>
              <p>• Metro: Estación Central (Línea 1)</p>
              <p>• Autobús: Líneas 25, 67, 89</p>
              <p>• Estacionamiento disponible</p>
            </div>
          </div>

          <div className="card p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Preguntas Frecuentes</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">¿Cuál es el tiempo de respuesta?</h4>
                <p className="text-gray-600 text-sm">Normalmente respondemos en menos de 24 horas en días laborables.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">¿Hacen entregas a domicilio?</h4>
                <p className="text-gray-600 text-sm">Sí, realizamos entregas en toda la ciudad y zonas aledañas.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">¿Ofrecen garantía?</h4>
                <p className="text-gray-600 text-sm">Todos nuestros productos incluyen garantía del fabricante.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">¿Aceptan devoluciones?</h4>
                <p className="text-gray-600 text-sm">Sí, aceptamos devoluciones dentro de los primeros 30 días.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer del contacto */}
        <div className="text-center mt-12">
          <div className="card p-8 bg-gradient-to-r from-primary-50 to-primary-100">
            <TruckIcon className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">¿Necesitas ayuda inmediata?</h3>
            <p className="text-gray-600 mb-6">
              Nuestro equipo de soporte está disponible para ayudarte con cualquier consulta
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+15551234567"
                className="btn-primary text-center"
              >
                Llamar Ahora
              </a>
              <a
                href="mailto:contacto@tecnoroute.com"
                className="btn-secondary text-center"
              >
                Enviar Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernContact;