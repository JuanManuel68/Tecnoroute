import React, { useEffect, useState } from 'react';
import {
  ShoppingCartIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
  ArrowLeftIcon,
  CreditCardIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const ModernCart = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal, 
    clearCart, 
    addToCart,
    loading, 
    error 
  } = useCart();

  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  // --- PRODUCTOS DESTACADOS ---
  const destacados = [
    {
      id: 1,
      nombre: 'Refrigerador LG 420L Frost Free',
      precio: 1299000,
      imagen: 'https://www.lg.com/content/dam/channel/wcms/co/images/neveras/gb41wpp_apzcclm_escb_co_c/gallery/GB41WPP-3.jpg'
    },
    {
      id: 2,
      nombre: 'Nevera Samsung 350L No Frost',
      precio: 1150000,
      imagen: 'https://images.samsung.com/is/image/samsung/co-rt5000k-top-freezer-con-twin-cooling-plus-350l-rt35k5930s8-cl-frontsilver-thumb-64167088'
    },
    {
      id: 3,
      nombre: 'Refrigerador Whirlpool 280L',
      precio: 899000,
      imagen: 'https://orvehogar.vtexassets.com/arquivos/ids/179288/WRW27CKTWW.jpg?v=638653813800530000'
    },
    {
      id: 4,
      nombre: 'Lavadora LG 18kg Carga Superior',
      precio: 1450000,
      imagen: 'https://media.falabella.com/falabellaCO/73133826_2/w=800,h=800,fit=pad'
    },
    {
      id: 5,
      nombre: 'Lavadora Samsung 16kg Digital Inverter',
      precio: 1350000,
      imagen: 'https://realplaza.vtexassets.com/arquivos/ids/35321310-800-auto?v=638476054935970000&width=800&height=auto&aspect=true'
    }
  ];

  // --- AUTOPLAY CARRUSEL ---
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % destacados.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [destacados.length]);

  const formatPrice = (price) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);

  const handleAddFromCarousel = async (producto) => {
    await addToCart(producto, 1);
  };

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % destacados.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + destacados.length) % destacados.length);

  // --- CARRITO VACÍO ---
  if (cartItems.length === 0) {
    return (
      <div
        className="min-h-screen flex flex-col pt-20 pb-12"
        style={{
          backgroundImage:
            'linear-gradient(to bottom right, rgba(106,13,173,0.7), rgba(0,87,255,0.7), rgba(255,123,0,0.6))',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="max-w-4xl mx-auto px-4 flex-grow">
          <div className="text-center py-16">
            <div className="w-32 h-32 mx-auto mb-8 bg-gray-100 rounded-full flex items-center justify-center shadow-md">
              <ShoppingCartIcon className="w-16 h-16 text-gray-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Tu carrito está vacío</h2>
            <p className="text-gray-700 mb-8 text-lg">
              ¡Explora nuestros productos y añade algunos artículos!
            </p>
            <button
              onClick={() => navigate('/productos')}
              className="bg-gray-700 text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition inline-flex items-center space-x-2"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span>Continuar Comprando</span>
            </button>
          </div>
        </div>

        {/* Carrusel debajo */}
        <div className="mt-20 py-12 shadow-inner bg-gray-100/60 backdrop-blur-sm rounded-t-3xl">
          <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-6">
            Productos Destacados
          </h2>
          <div className="relative max-w-5xl mx-auto px-4">
            <div className="overflow-hidden rounded-2xl">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {destacados.map((p) => (
                  <div key={p.id} className="min-w-full flex justify-center">
                    <div className="bg-white shadow-md rounded-2xl overflow-hidden max-w-sm hover:shadow-lg transition">
                      <img src={p.imagen} alt={p.nombre} className="w-full h-64 object-cover" />
                      <div className="p-5 text-center bg-gray-50">
                        <h3 className="text-lg font-semibold text-gray-900">{p.nombre}</h3>
                        <p className="text-gray-700 font-medium mt-2">{formatPrice(p.precio)}</p>
                        <button
                          onClick={() => handleAddFromCarousel(p)}
                          className="mt-3 w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-800 transition inline-flex items-center justify-center space-x-2"
                        >
                          <ShoppingCartIcon className="w-5 h-5" />
                          <span>Agregar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-900 transition"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-900 transition"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <footer className="bg-gray-900 text-gray-300 py-6 mt-8 text-center shadow-inner">
          <p className="text-sm">
            © {new Date().getFullYear()} <span className="font-semibold text-white">TecnoRoute</span>. Todos los derechos reservados.
          </p>
        </footer>
      </div>
    );
  }

  // --- CARRITO CON PRODUCTOS ---
  return (
    <div
      className="min-h-screen flex flex-col pt-20 pb-12"
      style={{
        backgroundImage:
          'linear-gradient(to bottom right, rgba(106,13,173,0.7), rgba(0,87,255,0.7), rgba(255,123,0,0.6))',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 flex-grow">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Mi Carrito</h1>
        <p className="text-gray-800 mb-6">Revisa y modifica tu selección de productos</p>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Productos */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.imagen_url}
                    alt={item.nombre}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.nombre}</h3>
                    <p className="text-sm text-gray-600 mb-2">{item.categoria_nombre || 'Producto'}</p>
                    <p className="text-lg font-bold text-gray-700">{formatPrice(item.precio)}</p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                      className="p-1 rounded-full hover:bg-gray-200 text-gray-600 disabled:opacity-50"
                    >
                      <MinusIcon className="w-5 h-5" />
                    </button>
                    <span className="w-12 text-center font-semibold text-gray-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 rounded-full hover:bg-gray-200 text-gray-600 disabled:opacity-50"
                    >
                      <PlusIcon className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900 mb-2">
                      {formatPrice(item.precio * item.quantity)}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Resumen de Compra</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">{formatPrice(getCartTotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Envío:</span>
                  <span className="font-semibold text-green-600">Gratis</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="text-lg font-bold text-gray-900">Total:</span>
                  <span className="text-xl font-bold text-gray-700">
                    {formatPrice(getCartTotal() * 1.1)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 flex items-center justify-center space-x-2 transition"
              >
                <CreditCardIcon className="w-5 h-5" />
                <span>Proceder al Pago</span>
              </button>
              <button
                onClick={() => navigate('/productos')}
                className="w-full bg-gray-300 text-gray-900 py-2 rounded-lg hover:bg-gray-400 flex items-center justify-center space-x-2 mt-3 transition"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                <span>Seguir Comprando</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Carrusel debajo */}
      <div className="mt-20 py-12 shadow-inner bg-gray-100/60 backdrop-blur-sm rounded-t-3xl">
        <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-6">
          Productos Destacados
        </h2>
        <div className="relative max-w-5xl mx-auto px-4">
          <div className="overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {destacados.map((p) => (
                <div key={p.id} className="min-w-full flex justify-center">
                  <div className="bg-white shadow-md rounded-2xl overflow-hidden max-w-sm hover:shadow-lg transition">
                    <img src={p.imagen} alt={p.nombre} className="w-full h-64 object-cover" />
                    <div className="p-5 text-center bg-gray-50">
                      <h3 className="text-lg font-semibold text-gray-900">{p.nombre}</h3>
                      <p className="text-gray-700 font-medium mt-2">{formatPrice(p.precio)}</p>
                      <button
                        onClick={() => handleAddFromCarousel(p)}
                        className="mt-3 w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-800 transition inline-flex items-center justify-center space-x-2"
                      >
                        <ShoppingCartIcon className="w-5 h-5" />
                        <span>Agregar</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-900 transition"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-900 transition"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <footer className="bg-gray-900 text-gray-300 py-6 mt-8 text-center shadow-inner">
        <p className="text-sm">
          © {new Date().getFullYear()} <span className="font-semibold text-white">TecnoRoute</span>. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
};

export default ModernCart;
