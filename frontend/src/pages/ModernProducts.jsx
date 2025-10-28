import React, { useState, useEffect } from 'react';
import {
  ShoppingCartIcon,
  MagnifyingGlassIcon,
  StarIcon,
  HeartIcon,
  EyeIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartSolid
} from '@heroicons/react/24/solid';
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
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar productos y categorías desde la API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Obtener productos y categorías en paralelo
        const [productosResponse, categoriasResponse] = await Promise.all([
          productosAPI.getAll(),
          categoriasAPI.getAll()
        ]);
        
        console.log('Productos obtenidos:', productosResponse.data);
        console.log('Categorías obtenidas:', categoriasResponse.data);
        
        setProductos(productosResponse.data);
        setCategorias(categoriasResponse.data);
        setFilteredProducts(productosResponse.data);
      } catch (error) {
        console.error('Error cargando productos:', error);
        setError('Error al cargar los productos. Verifica tu conexión.');
        // Fallback: usar algunos productos de ejemplo si falla la API
        const fallbackProducts = [];
        setProductos(fallbackProducts);
        setFilteredProducts(fallbackProducts);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filtros
  useEffect(() => {
    let filtered = productos;

    if (selectedCategory) {
      filtered = filtered.filter(producto => 
        producto.categoria_nombre?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(producto =>
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (producto.marca && producto.marca.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, searchTerm, productos]);

  const categories = categorias.map(cat => cat.nombre);

  const handleAddToCart = async (producto) => {
    try {
      const success = await addToCart(producto, 1);
      
      if (success) {
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      } else {
        alert('No se pudo agregar el producto al carrito. Intente de nuevo.');
      }
      
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      alert('No se pudo agregar el producto al carrito. Intente de nuevo.');
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
  };

  const formatPrice = (precio, descuento = 0) => {
    const precioNum = Number(precio);
    if (descuento > 0) {
      const precioFinal = precioNum * (1 - descuento / 100);
      return {
        original: `$${precioNum.toLocaleString('es-CO')}`,
        final: `$${precioFinal.toLocaleString('es-CO')}`,
        hasDiscount: true
      };
    }
    return {
      final: `$${precioNum.toLocaleString('es-CO')}`,
      hasDiscount: false
    };
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <StarIcon key={i} className="w-4 h-4 text-yellow-400 fill-current" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarIcon key="half" className="w-4 h-4 text-yellow-400 fill-current opacity-50" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <StarIcon key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Nuestros Productos</h1>
              <p className="text-gray-600 mt-2">Descubre la mejor selección de electrodomésticos y electrónicos</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/cart')}
                className="relative bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <ShoppingCartIcon className="w-6 h-6" />
                {getCartItemsCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                    {getCartItemsCount()}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar productos, marcas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                />
              </div>
            </div>
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              >
                <option value="">Todas las categorías</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando productos...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600 mr-3" />
              <div>
                <h3 className="text-red-800 font-semibold">Error al cargar productos</h3>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(producto => {
            return (
              <div key={producto.id} className="card group cursor-pointer overflow-hidden">
                <div className="relative">
                  <img
                    src={producto.imagen_url || 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500&h=400&fit=crop'}
                    alt={producto.nombre}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500&h=400&fit=crop';
                    }}
                  />
                  
                  {/* Discount Badge */}
                  {(producto.descuento && producto.descuento > 0) && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-semibold">
                      -{producto.descuento}%
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="absolute top-3 right-3 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => toggleFavorite(producto.id)}
                      className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                    >
                      {favorites.has(producto.id) ? (
                        <HeartSolid className="w-5 h-5 text-red-500" />
                      ) : (
                        <HeartIcon className="w-5 h-5 text-gray-600" />
                      )}
                    </button>
                    <button className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors">
                      <EyeIcon className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>

                  {/* Stock indicator */}
                  <div className="absolute bottom-3 left-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      producto.stock > 10 ? 'bg-green-100 text-green-800' :
                      producto.stock > 5 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {producto.stock} disponibles
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-2">
                    <span className="text-xs font-medium text-primary-600 bg-primary-100 px-2 py-1 rounded-full">
                      {producto.categoria_nombre || 'Sin categoría'}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                    {producto.nombre}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {producto.descripcion}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {renderStars(4.5)}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      (4.5)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-primary-600">
                      {formatPrice(producto.precio).final}
                    </span>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(producto)}
                    disabled={producto.stock === 0}
                    className={`w-full flex items-center justify-center space-x-2 ${
                      producto.stock === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed py-3 px-4 rounded-lg font-medium transition-all duration-200'
                        : 'btn-primary'
                    }`}
                  >
                    <ShoppingCartIcon className="w-5 h-5" />
                    <span>
                      {producto.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        )}

        {/* No products found */}
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-64 mx-auto mb-6 opacity-50">
              <img src="https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300" alt="No products" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">No se encontraron productos</h3>
            <p className="text-gray-600 mb-6">
              Intenta cambiar los filtros o términos de búsqueda
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
              }}
              className="btn-primary"
            >
              Ver todos los productos
            </button>
          </div>
        )}
      </div>

      {/* Notification */}
      {showNotification && (
        <div className="fixed top-20 right-4 z-50 animate-slide-up">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3">
            <ShoppingCartIcon className="w-6 h-6" />
            <span className="font-medium">¡Producto añadido al carrito!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernProducts;