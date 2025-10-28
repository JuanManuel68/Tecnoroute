import React, { useState } from 'react';
import {
  TruckIcon,
  HomeIcon,
  PhoneIcon,
  BuildingStorefrontIcon,
  UserPlusIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  ShoppingCartIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useEffect, useRef } from 'react';

const ModernPublicNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, isUser, user, logout } = useAuth();
  const { getCartItemsCount } = useCart();
  const dropdownRef = useRef(null);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const menuItems = [
    { label: 'Inicio', path: '/', icon: HomeIcon },
    { label: 'Contacto', path: '/contact', icon: PhoneIcon },
  ];

  // Si está autenticado como usuario, añadir items de usuario (pero no Mi Perfil)
  if (isAuthenticated && isUser()) {
    menuItems.push(
      { label: 'Productos', path: '/productos', icon: BuildingStorefrontIcon },
      { label: 'Mi Carrito', path: '/cart', icon: BuildingStorefrontIcon },
      { label: 'Mis Pedidos', path: '/orders', icon: BuildingStorefrontIcon }
    );
  }

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 fixed top-0 w-full z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => handleNavigation('/')}
          >
            <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-2 rounded-lg group-hover:shadow-lg transition-all duration-300">
              <TruckIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 group-hover:text-primary-600 transition-colors">
                TecnoRoute
              </h1>
              <p className="text-xs text-gray-500">Logística & Electrodomésticos</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 group"
                >
                  <IconComponent className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Auth Buttons & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Auth Buttons - Desktop */}
            <div className="hidden lg:flex items-center space-x-3">
              {!isAuthenticated ? (
                <>
                  <button
                    onClick={() => handleNavigation('/login?type=user')}
                    className="flex items-center space-x-2 px-4 py-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-all duration-200 font-medium"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    <span>Iniciar Sesión</span>
                  </button>
                  <button
                    onClick={() => handleNavigation('/register')}
                    className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                  >
                    <UserPlusIcon className="w-5 h-5" />
                    <span>Registrarse</span>
                  </button>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  {/* Botón Contáctanos cuando está autenticado */}
                  <button
                    onClick={() => handleNavigation('/contact')}
                    className="flex items-center space-x-2 px-4 py-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-all duration-200 font-medium"
                  >
                    <PhoneIcon className="w-5 h-5" />
                    <span>Contáctanos</span>
                  </button>
                  
                  {/* Cart Icon - solo mostrar si es usuario */}
                  {isUser() && (
                    <button
                      onClick={() => handleNavigation('/cart')}
                      className="relative p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
                    >
                      <ShoppingCartIcon className="w-6 h-6" />
                      {getCartItemsCount() > 0 && (
                        <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                          {getCartItemsCount()}
                        </span>
                      )}
                    </button>
                  )}
                  
                  {/* User Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                      className="flex items-center space-x-2 bg-primary-100 text-primary-700 px-3 py-2 rounded-lg font-medium hover:bg-primary-200 transition-colors"
                    >
                      <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-white" />
                      </div>
                      <span>{user?.name?.split(' ')[0] || 'Usuario'}</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* Dropdown Menu */}
                    {isUserDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                        <button
                          onClick={() => {
                            handleNavigation('/profile');
                            setIsUserDropdownOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                        >
                          <UserIcon className="w-4 h-4" />
                          <span>Mi Perfil</span>
                        </button>
                        <hr className="my-1" />
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsUserDropdownOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                        >
                          <ArrowRightOnRectangleIcon className="w-4 h-4" />
                          <span>Cerrar Sesión</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
            >
              {isMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4 space-y-2 animate-slide-up">
            {/* Navigation Items */}
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 group"
                >
                  <IconComponent className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
            
            {/* Mobile Auth Buttons */}
            <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
              {!isAuthenticated ? (
                <>
                  <button
                    onClick={() => handleNavigation('/login?type=user')}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 font-medium"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    <span>Iniciar Sesión</span>
                  </button>
                  <button
                    onClick={() => handleNavigation('/register')}
                    className="w-full flex items-center space-x-3 bg-primary-600 hover:bg-primary-700 text-white px-4 py-3 rounded-lg transition-all duration-200 font-medium"
                  >
                    <UserPlusIcon className="w-5 h-5" />
                    <span>Registrarse</span>
                  </button>
                </>
              ) : (
                <div className="space-y-2">
                  <div className="bg-primary-100 text-primary-700 px-4 py-3 rounded-lg font-medium text-center">
                    Hola, {user?.name || 'Usuario'}
                  </div>
                  <button
                    onClick={() => handleNavigation('/contact')}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
                  >
                    <PhoneIcon className="w-5 h-5" />
                    <span>Contáctanos</span>
                  </button>
                  <button
                    onClick={() => handleNavigation('/profile')}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
                  >
                    <UserIcon className="w-5 h-5" />
                    <span>Mi Perfil</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default ModernPublicNavbar;