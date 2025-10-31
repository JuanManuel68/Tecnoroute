import React from 'react';
import {
  TruckIcon,
  BoltIcon,
  ShieldCheckIcon,
  PhoneIcon,
  CheckCircleIcon,
  BuildingStorefrontIcon,
  CubeIcon,
  ChartBarIcon,
  GlobeAmericasIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isUser } = useAuth();

  const servicios = [
    {
      titulo: 'Transporte Rápido',
      descripcion: 'Entrega en tiempo record con nuestro sistema de logística avanzado',
      icono: <BoltIcon className="w-12 h-12 text-primary-600" />,
      color: 'bg-gradient-to-br from-blue-50 to-blue-100',
      iconBg: 'bg-blue-500'
    },
    {
      titulo: 'Seguridad Garantizada',
      descripcion: 'Tus productos están protegidos durante todo el proceso de entrega',
      icono: <ShieldCheckIcon className="w-12 h-12 text-green-600" />,
      color: 'bg-gradient-to-br from-green-50 to-green-100',
      iconBg: 'bg-green-500'
    },
    {
      titulo: 'Soporte 24/7',
      descripcion: 'Atención al cliente disponible todos los días del año',
      icono: <PhoneIcon className="w-12 h-12 text-purple-600" />,
      color: 'bg-gradient-to-br from-purple-50 to-purple-100',
      iconBg: 'bg-purple-500'
    }
  ];

  const caracteristicas = [
    { texto: 'Seguimiento en tiempo real', icono: <ChartBarIcon className="w-5 h-5 text-primary-600" /> },
    { texto: 'Entrega programada', icono: <TruckIcon className="w-5 h-5 text-primary-600" /> },
    { texto: 'Múltiples formas de pago', icono: <CheckCircleIcon className="w-5 h-5 text-primary-600" /> },
    { texto: 'Garantía de satisfacción', icono: <ShieldCheckIcon className="w-5 h-5 text-primary-600" /> },
    { texto: 'Red de distribución nacional', icono: <GlobeAmericasIcon className="w-5 h-5 text-primary-600" /> },
    { texto: 'Tecnología de vanguardia', icono: <CubeIcon className="w-5 h-5 text-primary-600" /> }
  ];

  return (
    <div className="min-h-screen">

      {/* Hero Section */}
      <section className="gradient-bg text-white py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <div className="animate-bounce-in mb-8">
            <TruckIcon className="w-24 h-24 mx-auto mb-6 text-white/90" />
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
            Bienvenido a <span className="text-yellow-300">TecnoRoute</span>
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl mb-6 text-white/90 font-light animate-slide-up">
            La plataforma líder en logística y distribución de electrodomésticos
          </p>
          <p className="text-lg md:text-xl mb-10 text-white/80 max-w-3xl mx-auto leading-relaxed animate-slide-up">
            Conectamos fabricantes, distribuidores y consumidores a través de nuestra avanzada red de transporte y logística especializada en electrodomésticos.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
            <button
              onClick={() => navigate(isAuthenticated && isUser() ? '/productos' : '/login?type=user')}
              className="group bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-4 rounded-full min-w-[200px] transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg hover:shadow-2xl"
            >
              <BuildingStorefrontIcon className="w-5 h-5" />
              {isAuthenticated && isUser() ? 'Ver Productos' : 'Iniciar Sesión'}
            </button>

            {!isAuthenticated && (
              <button
                onClick={() => navigate('/register')}
                className="group border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold px-8 py-4 rounded-full min-w-[200px] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl"
              >
                Registrarse
              </button>
            )}

            {isAuthenticated && isUser() && (
              <button
                onClick={() => navigate('/contact')}
                className="group border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold px-8 py-4 rounded-full min-w-[200px] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl"
              >
                Contáctanos
              </button>
            )}
          </div>

          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl"></div>
        </div>
      </section>

      {/* Servicios Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Nuestros <span className="text-primary-600">Servicios</span>
            </h2>
            <div className="w-24 h-1 bg-primary-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {servicios.map((servicio, index) => (
              <div
                key={index}
                className={`group ${servicio.color} rounded-2xl p-8 text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer border border-white/50`}
              >
                <div className="mb-6">
                  <div className={`${servicio.iconBg} w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white">{servicio.icono}</div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-primary-700 transition-colors">
                  {servicio.titulo}
                </h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                  {servicio.descripcion}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sobre Nosotros Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">

            <div className="order-2 lg:order-1">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Sobre <span className="text-primary-600">TecnoRoute</span>
              </h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  Somos una empresa líder en logística especializada en la distribución de electrodomésticos...
                </p>
                <p>
                  Nuestro sistema integrado permite a los usuarios encontrar los mejores electrodomésticos...
                </p>
              </div>

              <div className="card p-8 mt-8 border-l-4 border-primary-500">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  ¿Por qué elegir TecnoRoute?
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {caracteristicas.map((caracteristica, index) => (
                    <div key={index} className="flex items-center space-x-3 py-2">
                      <div className="flex-shrink-0">{caracteristica.icono}</div>
                      <span className="text-gray-700 font-medium">{caracteristica.texto}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl transform rotate-6"></div>
                <img
                  src="https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=600&h=400&fit=crop&auto=format"
                  alt="Almacén de electrodomésticos"
                  className="relative rounded-2xl shadow-2xl w-full h-96 object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Estadísticas Section */}
      <section className="py-20 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-primary-800/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-yellow-400">Confían</span> en Nosotros
            </h2>
            <div className="w-24 h-1 bg-yellow-400 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { numero: '10K+', texto: 'Productos Entregados' },
              { numero: '500+', texto: 'Clientes Satisfechos' },
              { numero: '50+', texto: 'Ciudades Cubiertas' },
              { numero: '99%', texto: 'Entregas a Tiempo' }
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="text-5xl md:text-6xl font-bold text-yellow-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {item.numero}
                </div>
                <div className="text-lg md:text-xl font-semibold text-gray-300">
                  {item.texto}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-primary-500/20 rounded-full blur-2xl"></div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 gradient-bg text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              ¿Listo para <span className="text-yellow-300">empezar</span>?
            </h2>
            <p className="text-xl md:text-2xl mb-10 text-white/90 leading-relaxed">
              Únete a miles de usuarios que confían en TecnoRoute para sus necesidades de electrodomésticos
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button
                onClick={() => navigate('/login?type=user')}
                className="group bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-4 rounded-full min-w-[200px] transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 shadow-lg hover:shadow-2xl"
              >
                <CubeIcon className="w-5 h-5" />
                Explorar Productos
              </button>

              <button
                onClick={() => navigate('/contact')}
                className="group border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold px-8 py-4 rounded-full min-w-[200px] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl"
              >
                Contáctanos
              </button>
            </div>
          </div>
        </div>

        <div className="absolute top-20 left-20 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl animate-pulse"></div>
      </section>

      {/* Footer / Derechos de Autor */}
      <footer className="py-6 bg-gray-900 text-white text-center">
        &copy; {new Date().getFullYear()} TecnoRoute. Todos los derechos reservados.
      </footer>

    </div>
  );
};

export default Home;
