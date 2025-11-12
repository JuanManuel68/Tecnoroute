import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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


const ModernRegister = () => {
  const { register, getDashboardRoute } = useAuth();
  const navigate = useNavigate();

  // 🏙️ Ciudades ordenadas alfabéticamente
  const cities = [
    'Arauca','Armenia','Barranquilla','Bucaramanga','Cali','Cartagena','Cúcuta',
    'Floridablanca','Ibagué','Leticia','Manizales','Medellín','Montería','Neiva',
    'Palmira','Pasto','Popayán','Quibdó','Riohacha','Santa Marta','Sincelejo',
    'Tunja','Valledupar','Villavicencio','Yopal'
  ].sort();

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

  // 🔠 Transformar a mayúsculas y validar caracteres en nombres/apellidos
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;

    if (name === 'nombres' || name === 'apellidos') {
      // Solo letras y espacios
      newValue = newValue.replace(/[^a-zA-ZÁÉÍÓÚáéíóúñÑ\s]/g, '');
      // Mayúsculas automáticas
      newValue = newValue.toUpperCase();
    }

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    if (error) setError('');
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: '' }));
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
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          error = 'Formato de correo inválido (ejemplo: usuario@dominio.com)';
        break;
      case 'phone':
        // Only check length of digits
        if (value.replace(/\D/g, '').length < 7)
          error = 'El teléfono debe tener al menos 7 dígitos';
        break;
      case 'address':
        if (value.length < 5)
          error = 'La dirección debe tener al menos 5 caracteres';
        break;
      case 'password':
        if (value.length < 8)
          error = 'La contraseña debe tener al menos 8 caracteres';
        else if (!/(?=.*[a-z])/.test(value))
          error = 'Debe contener al menos una letra minúscula';
        else if (!/(?=.*[A-Z])/.test(value))
          error = 'Debe contener al menos una letra mayúscula';
        else if (!/(?=.*\d)/.test(value))
          error = 'Debe contener al menos un número';
        else if (!/(?=.*[@$!%*?&])/.test(value))
          error = 'Debe contener al menos un carácter especial (@$!%*?&)';
        break;
      case 'confirmPassword':
        if (value !== formData.password)
          error = 'Las contraseñas no coinciden';
        break;
      default:
        break;
    }
    return error;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) setFieldErrors(prev => ({ ...prev, [name]: error }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFieldErrors({});

    const errors = {};
    ['nombres','apellidos','email','phone','address','city','password','confirmPassword'].forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) errors[field] = error;
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Por favor corrige los errores en el formulario');
      setLoading(false);
      return;
    }

    if (!formData.acceptTerms) {
      setError('Debes aceptar los términos y condiciones');
      setLoading(false);
      return;
    }

    // Registrar directamente sin verificación de código
    const result = await register({
      nombres: formData.nombres,
      apellidos: formData.apellidos,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      role: formData.role
    });

    if (result.success) {
      // Navegar al dashboard después del registro exitoso
      navigate(getDashboardRoute());
    } else {
      setError(result.error || 'Error al crear la cuenta');
    }
    
    setLoading(false);
  };

  const benefits = [
    { icon: TruckIcon, title: 'Envío Gratis', description: 'En pedidos superiores a $50' },
    { icon: UserIcon, title: 'Atención Personalizada', description: 'Soporte dedicado para ti' },
    { icon: EnvelopeIcon, title: 'Ofertas Exclusivas', description: 'Promociones solo para miembros' }
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10 px-4 font-sans">
      <div className="max-w-5xl w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-violet-500 to-violet-700 p-4 rounded-2xl shadow-md">
              <UserPlusIcon className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Únete a TecnoRoute</h1>
          <p className="text-gray-600">Crea tu cuenta y disfruta de todos los beneficios</p>
        </div>

        {/* CONTENEDOR PRINCIPAL: Ahora será siempre una columna */}
        <div className="flex flex-col gap-8">
          
          {/* 1. SECCIÓN DE FORMULARIO */}
          <div className="w-full">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg shadow-inner space-y-5">

                {/* Todos los campos de formulario serán una columna en todas las pantallas */}
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { id: 'nombres', label: 'Nombres', icon: UserIcon, type: 'text', placeholder: 'JUAN CARLOS' },
                    { id: 'apellidos', label: 'Apellidos', icon: UserIcon, type: 'text', placeholder: 'PÉREZ GONZÁLEZ' },
                    { id: 'email', label: 'Correo electrónico', icon: EnvelopeIcon, type: 'email', placeholder: 'tu@email.com' },
                    { id: 'phone', label: 'Teléfono', icon: PhoneIcon, type: 'tel', placeholder: '+57 300 000 0000' },
                    { id: 'address', label: 'Dirección', icon: MapPinIcon, type: 'text', placeholder: 'Calle 123 #45-67' },
                  ].map(({ id, label, icon: Icon, type, placeholder }) => (
                    <div key={id}>
                      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label} *</label>
                      <div className="relative">
                        <input
                          id={id}
                          name={id}
                          type={type}
                          required
                          value={formData[id]}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          className={`w-full px-4 py-3 pl-10 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition ${fieldErrors[id] ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder={placeholder}
                        />
                        <Icon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      </div>
                      {fieldErrors[id] && <p className="mt-1 text-sm text-red-600">{fieldErrors[id]}</p>}
                    </div>
                  ))}
                </div>

                {/* Ciudad (Campo único) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad *</label>
                  <div className="relative">
                    <select
                      id="city"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 appearance-none ${fieldErrors.city ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">Selecciona tu ciudad</option>
                      {cities.map(city => <option key={city} value={city}>{city}</option>)}
                    </select>
                    <ChevronDownIcon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                  </div>
                  {fieldErrors.city && <p className="mt-1 text-sm text-red-600">{fieldErrors.city}</p>}
                </div>

                {/* Contraseñas (Dos columnas en escritorio, una en móvil) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                        onCopy={(e) => e.preventDefault()}
                        onPaste={(e) => e.preventDefault()}
                        className={`w-full px-4 py-3 pl-10 pr-10 border rounded-lg focus:ring-2 focus:ring-violet-500 ${fieldErrors.password ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Mínimo 8 caracteres, mayúscula, minúscula, número y símbolo"
                      />
                      <LockClosedIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 p-1"
                      >
                        {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                      </button>
                    </div>
                    {fieldErrors.password && <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Contraseña *</label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        onCopy={(e) => e.preventDefault()}
                        onPaste={(e) => e.preventDefault()}
                        className={`w-full px-4 py-3 pl-10 pr-10 border rounded-lg focus:ring-2 focus:ring-violet-500 ${fieldErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Repite tu contraseña"
                      />
                      <LockClosedIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 p-1"
                      >
                        {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                      </button>
                    </div>
                    {fieldErrors.confirmPassword && <p className="mt-1 text-sm text-red-600">{fieldErrors.confirmPassword}</p>}
                  </div>
                </div>

                {/* Global Error */}
                {error && <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">{error}</div>}

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
                      className={`h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded mt-1`}
                    />
                    <label htmlFor="acceptTerms" className="ml-2 text-sm text-gray-800 cursor-pointer">
                      Acepto los <span className="text-violet-600 underline hover:text-violet-800 transition">términos y condiciones</span> y la <span className="text-violet-600 underline hover:text-violet-800 transition">política de privacidad</span> *
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-lg text-white font-medium transition-all duration-300 flex items-center justify-center ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-violet-600 hover:bg-violet-700 hover:scale-[1.01] shadow-md hover:shadow-lg'}`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Registrando...
                    </>
                  ) : 'Registrarse'}
                </button>
              </div>
            </form>
          </div>

          {/* 2. SECCIÓN DE BENEFICIOS (Ahora debajo del formulario y centrado si el espacio es pequeño) */}
          <div className="w-full space-y-4 pt-4 border-t border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">Beneficios al registrarte</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {benefits.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex flex-col items-center text-center bg-violet-50 p-6 rounded-xl shadow-sm border border-violet-100 transition duration-300 hover:shadow-md hover:scale-[1.02]">
                  <div className="bg-violet-200 p-3 rounded-full mb-3 flex-shrink-0">
                      <Icon className="w-7 h-7 text-violet-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{title}</h3>
                    <p className="text-gray-600 text-base">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ModernRegister;