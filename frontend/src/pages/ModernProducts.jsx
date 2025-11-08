import React, { useState, useEffect } from 'react';
import {
  ShoppingCartIcon,
  MagnifyingGlassIcon,
  StarIcon,
  HeartIcon,
  EyeIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { productosAPI, categoriasAPI } from '../services/apiService';

const ModernProducts = () => {
  const { addToCart, getCartItemsCount } = useCart();
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [productosResponse, categoriasResponse] = await Promise.all([
          productosAPI.getAll(),
          categoriasAPI.getAll()
        ]);

        setProductos(productosResponse.data);
        setCategorias(categoriasResponse.data);
        setFilteredProducts(productosResponse.data);
      } catch (error) {
        setError('Error al cargar los productos. Verifica tu conexión.');
        setProductos([]);
        setFilteredProducts([]);
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
        (producto) =>
          producto.categoria_nombre?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (producto) =>
          producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (producto.marca && producto.marca.toLowerCase().includes(searchTerm.toLowerCase()))
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
    } catch (error) {
      alert('Error al agregar el producto al carrito.');
    }
  };

  const toggleFavorite = (productId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(Array.from(newFavorites)));
  };

  const formatPrice = (precio) => `$${Number(precio).toLocaleString('es-CO')}`;

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <StarIcon
          key={i}
          className={`w-4 h-4 ${i < fullStars ? 'text-blue-400' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Nuestros Productos</h1>
            <p className="text-gray-600 mt-2">
              Descubre la mejor selección de ropa femenina de calidad
            </p>
          </div>
          <div className="flex items-center mt-4 md:mt-0 space-x-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las categorías</option>
              {categorias.map((cat) => (
                <option key={cat.nombre} value={cat.nombre}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Productos */}
        {loading ? (
          <p className="text-center text-gray-500 py-10">Cargando productos...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((producto) => (
              <div
                key={producto.id}
                className="flex flex-col bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
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
                    className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                  >
                    {favorites.has(producto.id) ? (
                      <HeartSolid className="w-5 h-5 text-blue-500" />
                    ) : (
                      <HeartIcon className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                </div>

                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-1 truncate">
                      {producto.nombre}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                      {producto.descripcion || 'Sin descripción'}
                    </p>
                    <div className="flex items-center mb-2">{renderStars(4.5)}</div>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatPrice(producto.precio)}
                    </p>
                  </div>

                  <div className="mt-4 space-y-2">
                    <button
                      onClick={() => navigate(`/producto/${producto.id}`)}
                      className="w-full py-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium flex justify-center items-center space-x-2"
                    >
                      <EyeIcon className="w-5 h-5" />
                      <span>Ver Producto</span>
                    </button>
                    <button
                      onClick={() => handleAddToCart(producto)}
                      className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium flex justify-center items-center space-x-2"
                    >
                      <ShoppingCartIcon className="w-5 h-5" />
                      <span>Agregar al Carrito</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notificación */}
      {showNotification && (
        <div className="fixed top-20 right-4 z-50 animate-slide-up">
          <div className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3">
            <ShoppingCartIcon className="w-6 h-6" />
            <span className="font-medium">¡Producto añadido al carrito!</span>
          </div>
        </div>
      )}

 {/* Footer */}
                <footer className="mt-8 py-6 bg-gray-900 text-white text-center">
                  <p className="text-sm">
                    © {new Date().getFullYear()} <span className="font-semibold">TecnoRoute</span>. Todos los derechos reservados.
                  </p>
                </footer>
    </div>
  );
};

export default ModernProducts;
