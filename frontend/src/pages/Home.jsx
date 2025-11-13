import React, { useState, useEffect } from 'react';
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

  // --- 🎯 Estado para el movimiento del fondo según el mouse ---
  const [bgPosition, setBgPosition] = useState('center');

  useEffect(() => {
    const handleMouseMove = (e) => {
      const y = e.clientY / window.innerHeight; // valor entre 0 y 1
      const offsetY = (y - 0.5) * 20; // movimiento máximo de ±10%
      setBgPosition(`center ${50 + offsetY}%`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const servicios = [
    {
      titulo: 'Transporte Exprés',
      descripcion: 'Envíos en tiempo récord con nuestra red logística avanzada.',
      icono: <BoltIcon className="w-12 h-12 text-[#ff7b00]" />,
      fondo: 'bg-gradient-to-br from-orange-50 to-purple-50'
    },
    {
      titulo: 'Seguridad Garantizada',
      descripcion: 'Tus productos viajan asegurados y protegidos.',
      icono: <ShieldCheckIcon className="w-12 h-12 text-[#6a0dad]" />,
      fondo: 'bg-gradient-to-br from-purple-50 to-blue-50'
    },
    {
      titulo: 'Soporte 24/7',
      descripcion: 'Atención personalizada disponible todos los días del año.',
      icono: <PhoneIcon className="w-12 h-12 text-[#0057ff]" />,
      fondo: 'bg-gradient-to-br from-blue-50 to-orange-50'
    }
  ];

  const caracteristicas = [
    { texto: 'Seguimiento en tiempo real', icono: <ChartBarIcon className="w-5 h-5 text-[#6a0dad]" /> },
    { texto: 'Entrega programada', icono: <TruckIcon className="w-5 h-5 text-[#ff7b00]" /> },
    { texto: 'Pagos flexibles', icono: <CheckCircleIcon className="w-5 h-5 text-[#0057ff]" /> },
    { texto: 'Garantía total', icono: <ShieldCheckIcon className="w-5 h-5 text-[#6a0dad]" /> },
    { texto: 'Cobertura nacional', icono: <GlobeAmericasIcon className="w-5 h-5 text-[#ff7b00]" /> },
    { texto: 'Tecnología avanzada', icono: <CubeIcon className="w-5 h-5 text-[#0057ff]" /> }
  ];

  return (
    <div className="font-sans bg-[#fdfdfd] text-gray-800">

      {/* 🎨 HERO animado */}
      <section
        className="relative bg-gradient-to-br from-[#6a0dad] via-[#0057ff] to-[#ff7b00] text-white py-24 overflow-hidden transition-all duration-200 ease-out"
        style={{
          backgroundImage:
            "linear-gradient(to bottom right, rgba(106,13,173,0.85), rgba(0,87,255,0.85), rgba(255,123,0,0.85)), url('https://eldiariony.com/wp-content/uploads/sites/2/2024/12/16-electrodomesticos-de-tu-hogar-que-hacen-que-tu-factura-de-electricidad-sea-cara-shutterstock_2473408983.jpg?fit=1316,740&crop=0px,0px,1316px,740px')",
          backgroundSize: 'cover',
          backgroundPosition: bgPosition,
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 container mx-auto px-6 text-center">
          <TruckIcon className="w-24 h-24 mx-auto mb-6 text-[#ffe066]" />
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight drop-shadow-lg">
            Envía y vende con <span className="text-[#ffe066]">TecnoRoute</span>
          </h1>
          <p className="text-lg md:text-2xl mb-10 text-white/90 max-w-3xl mx-auto drop-shadow-md">
            Soluciones de transporte, logística y ventas que impulsan tu negocio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(isAuthenticated && isUser() ? '/productos' : '/login?type=user')}
              className="bg-gray-800 text-white font-semibold px-8 py-4 rounded-full shadow-xl hover:bg-gray-600 hover:scale-105 transition-all"
            >
              <BuildingStorefrontIcon className="inline w-6 h-6 mr-2" />
              {isAuthenticated && isUser() ? 'Ver Productos' : 'Iniciar Sesión'}
            </button>
            {!isAuthenticated && (
              <button
                onClick={() => navigate('/register')}
                className="bg-gray-800 text-white font-semibold px-8 py-4 rounded-full shadow-xl hover:bg-gray-600 hover:scale-105 transition-all"
              >
                Registrarse
              </button>
            )}
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold mb-4 text-[#1a1a1a]">
            Nuestros <span className="text-[#6a0dad]">Servicios</span>
          </h2>
          <div className="w-24 h-1 bg-[#ff7b00] mx-auto mb-12 rounded-full"></div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {servicios.map((s, i) => (
              <div key={i} className={`${s.fondo} rounded-2xl p-8 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all`}>
                <div className="w-20 h-20 bg-white shadow-lg rounded-full flex items-center justify-center mx-auto mb-6">
                  {s.icono}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{s.titulo}</h3>
                <p className="text-gray-600">{s.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOBRE NOSOTROS */}
      <section className="py-20 bg-[#f4f2ff]">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-extrabold mb-6 text-[#1a1a1a]">
              Sobre <span className="text-[#6a0dad]">TecnoRoute</span>
            </h2>
            <p className="text-lg text-gray-700 mb-4">
              Somos líderes en transporte y logística, conectando fabricantes y clientes con tecnología inteligente.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              Brindamos soluciones seguras, rápidas y eficientes para envíos de electrodomésticos y productos.
            </p>

            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-[#6a0dad]">
              <h3 className="text-2xl font-bold mb-4 text-[#1a1a1a]">¿Por qué elegirnos?</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {caracteristicas.map((c, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {c.icono}
                    <span className="text-gray-800">{c.texto}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#6a0dad] to-[#0057ff] rounded-2xl transform rotate-6"></div>
            <img
              src="https://www.dispatchtrack.com/hs-fs/hubfs/logistics-technology-trends.webp?width=660&name=logistics-technology-trends.webp"
              alt="Logística moderna"
              className="relative rounded-2xl shadow-2xl w-full h-96 object-cover"
            />
          </div>
        </div>
      </section>

      {/* ESTADÍSTICAS */}
      <section className="py-20 bg-[#1a1a1a] text-white text-center">
        <h2 className="text-4xl font-extrabold mb-10 text-[#ff7b00]">Confían en Nosotros</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {[
            { numero: '10K+', texto: 'Envíos completados' },
            { numero: '500+', texto: 'Clientes satisfechos' },
            { numero: '80+', texto: 'Ciudades cubiertas' },
            { numero: '99%', texto: 'Entregas a tiempo' }
          ].map((item, index) => (
            <div key={index} className="group hover:scale-110 transition-transform">
              <div className="text-5xl font-extrabold text-[#6a0dad] mb-2">{item.numero}</div>
              <p className="text-white/90">{item.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-[#ff7b00] to-[#6a0dad] text-center text-white">
        <h2 className="text-4xl font-extrabold mb-4">¿Listo para comenzar?</h2>
        <p className="text-lg max-w-2xl mx-auto mb-10">
          Únete a miles de negocios que confían en <b>TecnoRoute</b> para sus envíos y ventas.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate('/login?type=user')}
            className="bg-gray-800 hover:bg-gray-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg transition-transform hover:scale-105"
          >
            Explorar Productos
          </button>
          <button
            onClick={() => navigate('/contact')}
            className="bg-gray-800 hover:bg-gray-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg transition-transform hover:scale-105"
          >
            Contáctanos
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-6 bg-[#1a1a1a] text-white text-center">
        &copy; {new Date().getFullYear()} TecnoRoute. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default Home;
