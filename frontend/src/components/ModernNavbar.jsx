import React, { useState, useEffect, useRef } from 'react';
import {
  TruckIcon,
  ChartBarIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  MapPinIcon,
  CursorArrowRaysIcon,
  ShoppingBagIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ModernNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);
  const navigate = useNavigate();
  const { user, logout, isAdmin, isConductor } = useAuth();
  const navRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenCategory(null);
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
    setOpenCategory(null);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
    setOpenCategory(null);
    navigate('/');
  };

  const toggleCategory = (categoryId) => {
    setOpenCategory(openCategory === categoryId ? null : categoryId);
  };

  // Menús diferentes según el rol
  const adminMenuItems = [
    { label: 'Dashboard', path: '/admin', icon: ChartBarIcon, category: 'main' },
    { label: 'Pedidos', path: '/admin/pedidos', icon: ShoppingBagIcon, category: 'orders' },
    { label: 'Clientes', path: '/admin/clientes', icon: UsersIcon, category: 'users' },
    { label: 'Conductores', path: '/admin/conductores', icon: UsersIcon, category: 'users' },
    { label: 'Vehículos', path: '/admin/vehiculos', icon: TruckIcon, category: 'logistics' },
    { label: 'Envíos', path: '/admin/envios', icon: ClipboardDocumentListIcon, category: 'logistics' },
    { label: 'Seguimiento', path: '/admin/seguimiento', icon: CursorArrowRaysIcon, category: 'logistics' },
  ];

  const conductorMenuItems = [
    { label: 'Dashboard', path: '/conductor/dashboard', icon: ChartBarIcon, category: 'main' },
  ];


  const adminMenuCategories = {
    main: { label: 'Principal', items: adminMenuItems.filter(item => item.category === 'main') },
    orders: { label: 'Pedidos', items: adminMenuItems.filter(item => item.category === 'orders') },
    users: { label: 'Usuarios', items: adminMenuItems.filter(item => item.category === 'users') },
    logistics: { label: 'Logística', items: adminMenuItems.filter(item => item.category === 'logistics') }
  };

  const conductorMenuCategories = {
    main: { label: 'Principal', items: conductorMenuItems.filter(item => item.category === 'main') },
  };
  
  const menuCategories = isAdmin() ? adminMenuCategories : conductorMenuCategories;

  return (
    <nav ref={navRef} className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => handleNavigation(isAdmin() ? '/admin' : '/conductor/dashboard')}
          >
            <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-2 rounded-lg group-hover:shadow-lg transition-all duration-300">
              <TruckIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 group-hover:text-primary-600 transition-colors">
                TecnoRoute
              </h1>
              <p className="text-xs text-gray-500">
                {isAdmin() ? 'Panel Administrativo' : 
                 isConductor() ? 'Panel del Conductor' : 
                 'Sistema de Logística'}
              </p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-2">
            {/* Dashboard - Always visible */}
            <button
              onClick={() => handleNavigation(isAdmin() ? '/admin' : '/conductor/dashboard')}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 group"
            >
              <ChartBarIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Dashboard</span>
            </button>

            {/* Pedidos - Solo para admin */}
            {isAdmin() && (
              <button
                onClick={() => handleNavigation('/admin/pedidos')}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 group"
              >
                <ShoppingBagIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Pedidos</span>
              </button>
            )}

            {/* Usuarios Dropdown - Solo para admin */}
            {isAdmin() && menuCategories.users && (
              <div className="relative">
                <button
                  onClick={() => toggleCategory('users')}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 group"
                >
                  <UsersIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Usuarios</span>
                  <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${openCategory === 'users' ? 'rotate-180' : ''}`} />
                </button>
                {openCategory === 'users' && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {menuCategories.users.items.map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <button
                          key={item.path}
                          onClick={() => handleNavigation(item.path)}
                          className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-colors duration-200"
                        >
                          <IconComponent className="w-4 h-4" />
                          <span className="text-sm">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Logística Dropdown - Solo para admin */}
            {isAdmin() && menuCategories.logistics && (
              <div className="relative">
                <button
                  onClick={() => toggleCategory('logistics')}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 group"
                >
                  <TruckIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Logística</span>
                  <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${openCategory === 'logistics' ? 'rotate-180' : ''}`} />
                </button>
                {openCategory === 'logistics' && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {menuCategories.logistics.items.map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <button
                          key={item.path}
                          onClick={() => handleNavigation(item.path)}
                          className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-colors duration-200"
                        >
                          <IconComponent className="w-4 h-4" />
                          <span className="text-sm">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Menu & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
              >
                <div className="bg-gradient-to-br from-primary-500 to-primary-700 w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {user?.name?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-gray-800">
                    {user?.name || 'Administrador'}
                  </p>
                  <p className="text-xs text-gray-500">{isAdmin() ? 'Administrador' : isConductor() ? 'Conductor' : 'Usuario'}</p>
                </div>
                <ChevronDownIcon className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-semibold text-gray-800">{user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                    <span className="inline-block mt-1 px-2 py-1 text-xs bg-primary-100 text-primary-700 rounded-full">
                      {isAdmin() ? 'Administrador' : isConductor() ? 'Conductor' : 'Usuario'}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    <span className="font-medium">Cerrar Sesión</span>
                  </button>
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
          <div className="lg:hidden border-t border-gray-200 py-4 space-y-2">
            {/* Dashboard */}
            <button
              onClick={() => handleNavigation(isAdmin() ? '/admin' : '/conductor/dashboard')}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 group"
            >
              <ChartBarIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Dashboard</span>
            </button>

            {/* Pedidos - Solo admin */}
            {isAdmin() && (
            <button
              onClick={() => handleNavigation('/admin/pedidos')}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 group"
            >
              <ShoppingBagIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Pedidos</span>
            </button>
            )}

            {/* Usuarios Category - Solo admin */}
            {isAdmin() && menuCategories.users && (
            <div className="border-t border-gray-100 pt-2 mt-2">
              <div className="px-4 py-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Usuarios</span>
              </div>
              {menuCategories.users.items.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className="w-full flex items-center space-x-3 px-8 py-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 group"
                  >
                    <IconComponent className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="text-sm">{item.label}</span>
                  </button>
                );
              })}
            </div>
            )}

            {/* Logística Category - Solo admin */}
            {isAdmin() && menuCategories.logistics && (
            <div className="border-t border-gray-100 pt-2 mt-2">
              <div className="px-4 py-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Logística</span>
              </div>
              {menuCategories.logistics.items.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className="w-full flex items-center space-x-3 px-8 py-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 group"
                  >
                    <IconComponent className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="text-sm">{item.label}</span>
                  </button>
                );
              })}
            </div>
            )}

            <div className="border-t border-gray-200 pt-4 mt-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                <span className="font-medium">Cerrar Sesión</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default ModernNavbar;