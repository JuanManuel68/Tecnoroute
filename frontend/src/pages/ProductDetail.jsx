import React, { useState, useEffect } from 'react';
import {
  StarIcon,
  HeartIcon,
  ShoppingCartIcon,
  TruckIcon,
  ShieldCheckIcon,
  InformationCircleIcon,
  ChevronLeftIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { productosAPI } from '../services/apiService';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await productosAPI.getById(id);
      setProduct(response.data);
    } catch (error) {
      console.error('Error loading product:', error);
      // Datos de ejemplo para demostración
      setProduct({
        id: parseInt(id),
        nombre: 'Refrigerador Samsung 28 pies',
        precio: 2599.99,
        descripcion: 'Refrigerador Samsung de 28 pies cúbicos con tecnología Twin Cooling Plus, dispensador de agua y hielo, y eficiencia energética A+++. Perfecto para familias grandes con su amplio espacio de almacenamiento y características avanzadas.',
        categoria: { nombre: 'Electrodomésticos' },
        marca: 'Samsung',
        modelo: 'RT28K3000S8',
        especificaciones: {
          'Capacidad': '28 pies cúbicos',
          'Eficiencia Energética': 'A+++',
          'Tipo': 'No Frost',
          'Dispensador': 'Agua y hielo',
          'Color': 'Acero inoxidable',
          'Dimensiones': '175 x 70 x 75 cm',
          'Peso': '85 kg',
          'Garantía': '2 años'
        },
        caracteristicas: [
          'Tecnología Twin Cooling Plus para mantener frescura',
          'Dispensador externo de agua y hielo',
          'Iluminación LED interior',
          'Cajones con cierre suave',
          'Control digital de temperatura',
          'Filtro de agua reemplazable',
          'Alarma de puerta abierta',
          'Estantes ajustables de vidrio templado'
        ],
        imagenes: [
          'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&h=800&fit=crop',
          'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=800&fit=crop',
          'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=800&fit=crop'
        ],
        stock: 15,
        rating: 4.5,
        reviews_count: 127,
        disponible: true,
        envio_gratis: true
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      await addToCart(product.id, quantity);
      // Show success message or notification here
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Here you would typically make an API call to update favorites
  };

  const formatPrice = (price) => `$${Number(price).toLocaleString('es-CO')}`;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="aspect-square bg-gray-300 rounded-lg"></div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="aspect-square bg-gray-300 rounded"></div>
                  <div className="aspect-square bg-gray-300 rounded"></div>
                  <div className="aspect-square bg-gray-300 rounded"></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                <div className="h-12 bg-gray-300 rounded w-1/3"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-300 rounded w-4/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 text-center py-16">
          <InformationCircleIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Producto no encontrado</h2>
          <p className="text-gray-600 mb-6">El producto que buscas no existe o ha sido eliminado.</p>
          <button
            onClick={() => navigate('/productos')}
            className="btn-primary"
          >
            Ver Productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            <ChevronLeftIcon className="w-5 h-5 mr-1" />
            Volver
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-md">
              <img
                src={product.imagenes?.[selectedImage] || product.imagen_url}
                alt={product.nombre}
                className="w-full h-full object-cover"
              />
            </div>
            {product.imagenes && product.imagenes.length > 1 && (
              <div className="grid grid-cols-3 gap-2">
                {product.imagenes.map((imagen, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-white rounded-lg overflow-hidden shadow-sm border-2 transition-colors ${
                      selectedImage === index ? 'border-primary-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={imagen}
                      alt={`${product.nombre} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.nombre}</h1>
                  <p className="text-lg text-gray-600">{product.categoria?.nombre} • {product.marca}</p>
                </div>
                <button
                  onClick={toggleFavorite}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  {isFavorite ? (
                    <HeartSolid className="w-6 h-6 text-red-500" />
                  ) : (
                    <HeartIcon className="w-6 h-6 text-gray-400" />
                  )}
                </button>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviews_count} reseñas)
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  {formatPrice(product.precio)}
                </div>
                {product.envio_gratis && (
                  <div className="flex items-center text-green-600">
                    <TruckIcon className="w-5 h-5 mr-1" />
                    <span className="text-sm font-medium">Envío gratis</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Descripción</h3>
              <p className="text-gray-600 leading-relaxed">{product.descripcion}</p>
            </div>

            {/* Stock and Add to Cart */}
            <div className="border-t pt-6">
              <div className="flex items-center space-x-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cantidad
                  </label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {[...Array(Math.min(product.stock, 10))].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="text-sm text-gray-600">
                  {product.stock > 0 ? (
                    <span className="text-green-600">✓ {product.stock} disponibles</span>
                  ) : (
                    <span className="text-red-600">Sin stock</span>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.disponible || product.stock === 0 || addingToCart}
                  className={`w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                    product.disponible && product.stock > 0
                      ? 'bg-primary-600 hover:bg-primary-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {addingToCart ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Agregando...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCartIcon className="w-5 h-5" />
                      <span>Agregar al carrito</span>
                    </>
                  )}
                </button>

                {/* Guarantees */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <ShieldCheckIcon className="w-4 h-4 mr-1" />
                    <span>Garantía del fabricante</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <TruckIcon className="w-4 h-4 mr-1" />
                    <span>Entrega segura</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Tabs */}
        <div className="card p-0 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button className="border-b-2 border-primary-500 py-4 px-1 text-sm font-medium text-primary-600">
                Especificaciones
              </button>
            </nav>
          </div>

          {/* Specifications */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Especificaciones Técnicas</h3>
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-3">
              {product.especificaciones && Object.entries(product.especificaciones).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                  <dt className="font-medium text-gray-900">{key}:</dt>
                  <dd className="text-gray-600">{value}</dd>
                </div>
              ))}
            </div>

            {product.caracteristicas && (
              <div className="mt-6">
                <h4 className="text-md font-semibold text-gray-900 mb-3">Características Principales</h4>
                <ul className="space-y-2">
                  {product.caracteristicas.map((caracteristica, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-600">{caracteristica}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
            {/* Footer / Derechos de Autor */}
            <footer className="py-6 bg-gray-900 text-white text-center">
              &copy; {new Date().getFullYear()} TecnoRoute. Todos los derechos reservados.
            </footer>
    </div>
  );
};

export default ProductDetail;