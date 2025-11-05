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
    'Medellín',
    'Cali',
    'Barranquilla',
    'Cartagena',
    'Bucaramanga',
    'Pereira',
    'Manizales',
    'Armenia',
    'Cúcuta',
    'Ibagué',
    'Neiva',
    'Villavicencio',
    'Tunja',
    'Santa Marta',
    'Montería',
    'Sincelejo',
    'Popayán',
    'Pasto',
    'Valledupar',
    'Floridablanca',
    'Palmira',
    'Yopal',
    'Riohacha',
    'Quibdó',
    'Arauca',
    'Leticia'
  ];

  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
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
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) setError('');
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setFieldErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const validateField = (name, value) => {
    let error = '';
    
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      const labels = {
        nombres: 'Nombres',
        apellidos: 'Apellidos',
        email: 'Correo electrónico',
        phone: 'Teléfono',
        address: 'Dirección',
        city: 'Ciudad',
        password: 'Contraseña',
        confirmPassword: 'Confirmación de contraseña'
      };
      return `${labels[name] || name} es requerido`;
    }

    switch (name) {
      case 'nombres':
        if (value.length < 2) error = 'Los nombres deben tener al menos 2 caracteres';
        break;
      case 'apellidos':
        if (value.length < 2) error = 'Los apellidos deben tener al menos 2 caracteres';
        break;
      case 'email':
        // Validar que tenga @
        if (!value.includes('@')) {
          error = 'El correo debe contener el símbolo @';
        } else {
          // Validar formato completo
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            error = 'Formato de correo inválido (ejemplo: usuario@dominio.com)';
          }
        }
        break;
      case 'phone':
        const phoneDigits = value.replace(/\D/g, '');
        if (phoneDigits.length < 7) error = 'El teléfono debe tener al menos 7 dígitos';
        break;
      case 'address':
        if (value.length < 5) error = 'La dirección debe tener al menos 5 caracteres';
        break;
      case 'password':
        if (value.length < 6) error = 'La contraseña debe tener al menos 6 caracteres';
        break;
      case 'confirmPassword':
        if (value !== formData.password) error = 'Las contraseñas no coinciden';
        break;
      default:
        break;
    }
    
    return error;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFieldErrors({});

    // Validar todos los campos
    const errors = {};
    const fieldsToValidate = ['nombres', 'apellidos', 'email', 'phone', 'address', 'city', 'password', 'confirmPassword'];
    
    fieldsToValidate.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) errors[field] = error;
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Por favor corrige los errores en el formulario');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFieldErrors({ confirmPassword: 'Las contraseñas no coinciden' });
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (!formData.acceptTerms) {
      setError('Debes aceptar los términos y condiciones');
      setLoading(false);
      return;
    }

    try {
      console.log('Enviando datos de registro:', {
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city
      });
      
      const result = await register({
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
        city: formData.city
      });

      console.log('Resultado del registro:', result);

      if (result.success) {
        // Dar tiempo para que el estado se actualice
        setTimeout(() => {
          const dashboardRoute = getDashboardRoute();
          console.log('Navegando a:', dashboardRoute);
          navigate(dashboardRoute);
        }, 100);
      } else {
        // Manejar errores específicos del backend
        const errorMessage = result.error || 'Error al crear la cuenta';
        
        // Si el error es de email duplicado
        if (errorMessage.toLowerCase().includes('correo') && errorMessage.toLowerCase().includes('registrado')) {
          setFieldErrors({ email: errorMessage });
        }
        
        setError(errorMessage);
      }
    } catch (err) {
      console.error('Error en registro:', err);
      setError('Error al conectar con el servidor');
    }

    setLoading(false);
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

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                )}

                {/* Campos en vertical */}
                {[
                  { id: 'nombres', label: 'Nombres', icon: UserIcon, type: 'text', placeholder: 'Juan Carlos' },
                  { id: 'apellidos', label: 'Apellidos', icon: UserIcon, type: 'text', placeholder: 'Pérez González' },
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
                        onBlur={handleBlur}
                        className={`w-full px-4 py-3 pl-10 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition ${
                          fieldErrors[id] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder={placeholder}
                      />
                      <Icon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                    {fieldErrors[id] && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors[id]}</p>
                    )}
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
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none ${
                        fieldErrors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Selecciona tu ciudad</option>
                      {cities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                    <ChevronDownIcon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                  {fieldErrors.city && (
                    <p className="mt-1 text-sm text-red-600">{fieldErrors.city}</p>
                  )}
                </div>

                {/* Contraseñas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña *</label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 pl-10 pr-10 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                        fieldErrors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Mínimo 6 caracteres"
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
                  {fieldErrors.password && (
                    <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
                  )}

                  <label className="block text-sm font-medium text-gray-700 mb-1 mt-4">Confirmar Contraseña *</label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 pl-10 pr-10 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                        fieldErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
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
                  {fieldErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{fieldErrors.confirmPassword}</p>
                  )}
                </div>

                {/* Términos */}
                <div>
                  <div className="flex items-start">
                    <input
                      id="acceptTerms"
                      name="acceptTerms"
                      type="checkbox"
                      required
                      checked={formData.acceptTerms}
                      onChange={handleInputChange}
                      className={`h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1 ${
                        !formData.acceptTerms && error.includes('términos') ? 'border-red-500' : ''
                      }`}
                    />
                    <label htmlFor="acceptTerms" className="ml-2 text-sm text-gray-800">
                      Acepto los <span className="text-primary-600 underline cursor-pointer">términos y condiciones</span> y la <span className="text-primary-600 underline cursor-pointer">política de privacidad</span> *
                    </label>
                  </div>
                  {!formData.acceptTerms && error.includes('términos') && (
                    <p className="mt-1 text-sm text-red-600">Debes aceptar los términos y condiciones</p>
                  )}
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
