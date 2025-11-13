import React, { useState, useEffect } from 'react';
import {
  ShoppingCartIcon,
  MagnifyingGlassIcon,
  StarIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { productosAPI, categoriasAPI } from '../services/apiService';

const ModernProducts = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productosResponse, categoriasResponse] = await Promise.all([
          productosAPI.getAll(),
          categoriasAPI.getAll(),
        ]);
        setProductos(productosResponse.data);
        setCategorias(categoriasResponse.data);
        setFilteredProducts(productosResponse.data);
      } catch (err) {
        setError('Error al cargar productos.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = productos;
    if (selectedCategory) {
      filtered = filtered.filter(
        (p) => p.categoria_nombre?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.marca && p.marca.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    setFilteredProducts(filtered);
  }, [selectedCategory, searchTerm, productos]);

  const handleAddToCart = async (producto) => {
    try {
      const success = await addToCart(producto, 1);
      if (success) {
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      }
    } catch {
      alert('Error al agregar producto.');
    }
  };

  const toggleFavorite = (id) => {
    const newFavs = new Set(favorites);
    newFavs.has(id) ? newFavs.delete(id) : newFavs.add(id);
    setFavorites(newFavs);
    localStorage.setItem('favorites', JSON.stringify([...newFavs]));
  };

  const formatPrice = (precio) => `$${Number(precio).toLocaleString('es-CO')}`;

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <StarIcon
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-[#FF7B00]' : 'text-gray-300'}`}
      />
    ));
  };

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIdx = (currentPage - 1) * productsPerPage;
  const currentGridProducts = filteredProducts.slice(startIdx, startIdx + productsPerPage);

  return (
    <div
      className="min-h-screen py-12 px-4"
      style={{
        backgroundImage: `
          linear-gradient(to bottom right,
            rgba(106,13,173,0.7),
            rgba(0,87,255,0.6),
            rgba(255,123,0,0.6)
          ),
          url('https://eldiariony.com/wp-content/uploads/sites/2/2024/12/16-electrodomesticos-de-tu-hogar-que-hacen-que-tu-factura-de-electricidad-sea-cara-shutterstock_2473408983.jpg?fit=1316,740&crop=0px,0px,1316px,740px')
        `,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="max-w-7xl mx-auto bg-white/95 backdrop-blur-md p-10 rounded-3xl shadow-2xl border-t-8 border-gray-700">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-[#1a1a1a]">Catálogo TecnoRoute</h1>
          <p className="text-gray-600 mt-2">
            Explora nuestros productos de tecnología y electrodomésticos
          </p>
        </div>

        {/* Filtros */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
          <div className="relative w-full md:w-1/3">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-gray-600"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="py-3 px-4 border border-gray-300 rounded-full focus:ring-2 focus:ring-gray-600"
          >
            <option value="">Todas las categorías</option>
            {categorias.map((cat) => (
              <option key={cat.nombre} value={cat.nombre}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Productos */}
        {loading ? (
          <div className="text-center text-gray-700 font-semibold py-10">Cargando productos...</div>
        ) : error ? (
          <div className="text-center text-red-600 font-semibold py-10">{error}</div>
        ) : (
          <>
            {/* Cambié aquí para mostrar 5 productos por fila */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
              {currentGridProducts.map((producto) => (
                <div
                  key={producto.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden"
                >
                  <div className="relative h-56">
                    <img
                      src={
                        producto.imagen_url ||
                        'https://via.placeholder.com/300x300?text=Sin+imagen'
                      }
                      alt={producto.nombre}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(producto.id);
                      }}
                      className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md hover:scale-110 transition"
                    >
                      {favorites.has(producto.id) ? (
                        <HeartSolid className="w-5 h-5 text-[#FF7B00]" />
                      ) : (
                        <HeartIcon className="w-5 h-5 text-gray-600" />
                      )}
                    </button>
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-semibold text-gray-900 truncate text-lg">
                      {producto.nombre}
                    </h3>
                    <div className="flex justify-center mb-2">{renderStars(4.5)}</div>
                    <p className="text-2xl font-bold text-gray-800 mb-4">
                      {formatPrice(producto.precio)}
                    </p>
                    <button
                      onClick={() => handleAddToCart(producto)}
                      className="w-full py-3 rounded-full font-semibold text-white shadow-lg transition-all bg-gray-700 hover:bg-gray-800"
                    >
                      <div className="flex justify-center items-center space-x-2">
                        <ShoppingCartIcon className="w-5 h-5" />
                        <span>Agregar al carrito</span>
                      </div>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Paginación */}
            <div className="flex justify-center mt-10 space-x-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    currentPage === index + 1
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Notificación */}
      {showNotification && (
        <div className="fixed top-20 right-4 z-50 animate-slide-up">
          <div className="bg-gray-700 text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-3">
            <ShoppingCartIcon className="w-6 h-6" />
            <span className="font-medium">¡Producto añadido al carrito!</span>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-10 py-6 bg-[#1f2937] text-white text-center rounded-t-2xl shadow-inner">
        <p className="text-sm">
          © {new Date().getFullYear()} <span className="font-semibold">TecnoRoute</span>. Todos los
          derechos reservados.
        </p>
      </footer>
    </div>
  );
};

export default ModernProducts;
