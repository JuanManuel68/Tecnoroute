import React, { useState } from 'react';
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  UserPlusIcon,
  PhoneIcon,
  MapPinIcon,
  ChevronDownIcon,
  TruckIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ModernRegister = () => {
  const { register, getDashboardRoute } = useAuth();

  const cities = [
    'Bogotá',
    'Soacha',
    'Chía',
    'Zipaquirá',
    'Cota',
    'Funza',
    'Mosquera',
    'Madrid',
    'Facatativá',
    'Cajicá'
  ];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    city: '',
    role: 'customer',
    acceptTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // validaciones (omitidas para brevedad, las mantienes igual)
  };

  const benefits = [
    { icon: TruckIcon, title: 'Envío Gratis', description: 'En pedidos superiores a $50' },
    { icon: UserIcon, title: 'Atención Personalizada', description: 'Soporte dedicado para ti' },
    { icon: EnvelopeIcon, title: 'Ofertas Exclusivas', description: 'Promociones solo para miembros' }
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10 px-4">
      <div className="max-w-5xl w-full bg-white rounded-xl shadow-lg p-8">
        {/* Encabezado */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-4 rounded-2xl shadow-md">
              <UserPlusIcon className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Únete a TecnoRoute</h1>
          <p className="text-gray-600">Crea tu cuenta y disfruta de todos los beneficios</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg shadow-inner space-y-5">
                <h2 className="text-xl font-semibold text-gray-800">Formulario de Registro</h2>

                {/* Campos en vertical */}
                {[
                  { id: 'name', label: 'Nombre completo', icon: UserIcon, type: 'text', placeholder: 'Tu nombre completo' },
                  { id: 'email', label: 'Correo electrónico', icon: EnvelopeIcon, type: 'email', placeholder: 'tu@email.com' },
                  { id: 'phone', label: 'Teléfono', icon: PhoneIcon, type: 'tel', placeholder: '+57 300 000 0000' },
                  { id: 'address', label: 'Dirección', icon: MapPinIcon, type: 'text', placeholder: 'Calle 123 #45-67' }
                ].map(({ id, label, icon: Icon, type, placeholder }) => (
                  <div key={id}>
                    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                      {label} *
                    </label>
                    <div className="relative">
                      <input
                        id={id}
                        name={id}
                        type={type}
                        required
                        value={formData[id]}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
                        placeholder={placeholder}
                      />
                      <Icon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                  </div>
                ))}

                {/* Ciudad */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ciudad *
                  </label>
                  <div className="relative">
                    <select
                      id="city"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none"
                    >
                      <option value="">Selecciona tu ciudad</option>
                      {cities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                    <ChevronDownIcon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>

                {/* Contraseñas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña *</label>
                  <div className="relative mb-4">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 pl-10 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="Mínimo 8 caracteres"
                    />
                    <LockClosedIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    </button>
                  </div>

                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Contraseña *</label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 pl-10 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="Repite tu contraseña"
                    />
                    <LockClosedIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Términos */}
                <div className="flex items-start">
                  <input
                    id="acceptTerms"
                    name="acceptTerms"
                    type="checkbox"
                    required
                    checked={formData.acceptTerms}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                  />
                  <label htmlFor="acceptTerms" className="ml-2 text-sm text-gray-800">
                    Acepto los <span className="text-primary-600 underline cursor-pointer">términos y condiciones</span> y la <span className="text-primary-600 underline cursor-pointer">política de privacidad</span> *
                  </label>
                </div>

                {/* Botón */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-lg text-white font-medium transition-all ${
                    loading ? 'bg-gray-400' : 'bg-primary-600 hover:bg-primary-700 hover:scale-105 shadow-md'
                  }`}
                >
                  {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                </button>
              </div>
            </form>

            {/* Derechos de autor */}
            <div className="text-center mt-8 text-sm text-gray-500 border-t border-gray-200 pt-4">
              © {new Date().getFullYear()} TecnoRoute. Todos los derechos reservados.
            </div>
          </div>

          {/* Beneficios */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">¿Por qué registrarte?</h3>
              {benefits.map((b, i) => {
                const Icon = b.icon;
                return (
                  <div key={i} className="flex items-start mb-3">
                    <div className="bg-primary-100 p-2 rounded-lg mr-3">
                      <Icon className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-800">{b.title}</h4>
                      <p className="text-gray-600 text-xs">{b.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernRegister;
