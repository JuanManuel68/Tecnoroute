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
  TruckIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ModernRegisterCitySide = () => {
  const { register, getDashboardRoute } = useAuth();
  const navigate = useNavigate();

  const cities = [
    'Arauca','Armenia','Barranquilla','Bucaramanga','Cali','Cartagena','Cúcuta',
    'Floridablanca','Ibagué','Leticia','Manizales','Medellín','Montería','Neiva',
    'Palmira','Pasto','Popayán','Quibdó','Riohacha','Santa Marta','Sincelejo',
    'Tunja','Valledupar','Villavicencio','Yopal'
  ].sort();

  const [formData, setFormData] = useState({
    nombres: '', apellidos: '', email: '', password: '',
    confirmPassword: '', phone: '', address: '', city: '',
    role: 'customer', acceptTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [bgPos, setBgPos] = useState(50);

  const handleMouseMove = (e) => {
    const y = e.clientY / window.innerHeight;
    setBgPos(20 + y * 60);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;
    if (['nombres','apellidos'].includes(name)) {
      newValue = newValue.replace(/[^a-zA-ZÁÉÍÓÚáéíóúñÑ\s]/g, '').toUpperCase();
    }
    setFormData((prev) => ({ ...prev, [name]: newValue }));
    if (error) setError('');
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateField = (name, value) => {
    if (!value || value.trim() === '') return `${name} es requerido`;
    if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Correo inválido';
    if (name === 'password' && value.length < 8) return 'Mínimo 8 caracteres';
    if (name === 'confirmPassword' && value !== formData.password) return 'No coincide con la contraseña';
    return '';
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const err = validateField(name, value);
    if (err) setFieldErrors((prev) => ({ ...prev, [name]: err }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const errors = {};
    Object.keys(formData).forEach((k) => {
      if (['nombres','apellidos','email','password','confirmPassword','phone','address','city'].includes(k)) {
        const err = validateField(k, formData[k]);
        if (err) errors[k] = err;
      }
    });
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Por favor corrige los errores');
      setLoading(false);
      return;
    }
    if (!formData.acceptTerms) {
      setError('Debes aceptar los términos');
      setLoading(false);
      return;
    }
    const result = await register(formData);
    if (result.success) navigate(getDashboardRoute());
    else setError(result.error || 'Error al registrar');
    setLoading(false);
  };

  const benefits = [
    { icon: TruckIcon, title: 'Envío Gratis', description: 'Pedidos superiores a $50' },
    { icon: UserIcon, title: 'Atención Personalizada', description: 'Soporte dedicado' },
    { icon: EnvelopeIcon, title: 'Ofertas Exclusivas', description: 'Promociones solo para miembros' },
  ];

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative flex min-h-screen items-center justify-center px-6 py-12 overflow-hidden"
      style={{
        backgroundImage: `
          linear-gradient(to bottom right, rgba(106,13,173,0.7), rgba(0,87,255,0.6), rgba(255,123,0,0.6)),
          url('https://eldiariony.com/wp-content/uploads/sites/2/2024/12/16-electrodomesticos-de-tu-hogar-que-hacen-que-tu-factura-de-electricidad-sea-cara-shutterstock_2473408983.jpg?fit=1316,740&crop=0px,0px,1316px,740px')
        `,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: `center ${bgPos}%`,
        transition: 'background-position 0.3s ease-out'
      }}
    >
      <div className="w-full max-w-3xl sm:max-w-4xl bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border-t-4 border-[#6a0dad] p-6 sm:p-8">
        <div className="text-center mb-4">
          <div className="mx-auto flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-xl bg-[#1f2937] shadow-md">
            <UserPlusIcon className="h-8 w-8 sm:h-10 sm:w-10 text-[#ffe066]" />
          </div>
          <h1 className="mt-2 text-xl sm:text-2xl font-bold text-[#1a1a1a]">Crea tu cuenta TecnoRoute</h1>
          <p className="text-gray-600 text-xs sm:text-sm">Regístrate y accede a todos los beneficios</p>
        </div>

        {error && (
          <div className="mb-3 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-center text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Grid uniforme */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {['nombres','apellidos','email','phone'].map((id) => {
              const labels = {
                nombres: 'Nombres',
                apellidos: 'Apellidos',
                email: 'Correo electrónico',
                phone: 'Teléfono',
              };
              const placeholders = {
                nombres: 'JUAN CARLOS',
                apellidos: 'PÉREZ GONZÁLEZ',
                email: 'tu@email.com',
                phone: '+57 300 000 0000',
              };
              const icons = {
                nombres: UserIcon,
                apellidos: UserIcon,
                email: EnvelopeIcon,
                phone: PhoneIcon,
              };
              const Icon = icons[id];
              return (
                <div key={id}>
                  <label className="block text-xs font-medium text-gray-700 mb-1">{labels[id]} *</label>
                  <div className="relative">
                    <input
                      id={id}
                      name={id}
                      type={id === 'email' ? 'email' : 'text'}
                      value={formData[id]}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder={placeholders[id]}
                      className={`w-full h-10 px-3 pl-8 border rounded-lg focus:ring-1 focus:ring-[#6a0dad] focus:border-[#6a0dad] ${
                        fieldErrors[id] ? 'border-red-500' : 'border-gray-300'
                      } text-sm`}
                    />
                    <Icon className="w-4 h-4 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
                  </div>
                  {fieldErrors[id] && <p className="mt-1 text-xs text-red-600">{fieldErrors[id]}</p>}
                </div>
              );
            })}

            {/* Dirección y Ciudad en la misma fila */}
            <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Dirección */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Dirección *</label>
                <div className="relative">
                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Calle 123 #45-67"
                    className={`w-full h-10 px-3 pl-8 border rounded-lg focus:ring-1 focus:ring-[#6a0dad] focus:border-[#6a0dad] ${
                      fieldErrors.address ? 'border-red-500' : 'border-gray-300'
                    } text-sm`}
                  />
                  <MapPinIcon className="w-4 h-4 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
                </div>
                {fieldErrors.address && <p className="mt-1 text-xs text-red-600">{fieldErrors.address}</p>}
              </div>

              {/* Ciudad */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Ciudad *</label>
                <div className="relative">
                  <select
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full h-10 px-3 border rounded-lg focus:ring-1 focus:ring-[#6a0dad] focus:border-[#6a0dad] ${
                      fieldErrors.city ? 'border-red-500' : 'border-gray-300'
                    } text-sm appearance-none`}
                  >
                    <option value="">Selecciona tu ciudad</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  <ChevronDownIcon className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2" />
                </div>
                {fieldErrors.city && <p className="mt-1 text-xs text-red-600">{fieldErrors.city}</p>}
              </div>
            </div>

            {/* Contraseñas */}
            {['password','confirmPassword'].map((id) => {
              const show = id === 'password' ? showPassword : showConfirmPassword;
              const setShow = id === 'password' ? setShowPassword : setShowConfirmPassword;
              const label = id === 'password' ? 'Contraseña' : 'Confirmar Contraseña';
              const placeholder = id === 'password' ? 'Crea tu contraseña' : 'Repite tu contraseña';
              return (
                <div key={id} className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">{label} *</label>
                  <div className="relative">
                    <input
                      id={id}
                      name={id}
                      type={show ? 'text' : 'password'}
                      value={formData[id]}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      onCopy={(e) => e.preventDefault()}
                      onPaste={(e) => e.preventDefault()}
                      onCut={(e) => e.preventDefault()}
                      placeholder={placeholder}
                      className={`w-full h-10 px-3 pl-8 pr-8 border rounded-lg focus:ring-1 focus:ring-[#6a0dad] focus:border-[#6a0dad] ${
                        fieldErrors[id] ? 'border-red-500' : 'border-gray-300'
                      } text-sm`}
                    />
                    <LockClosedIcon className="w-4 h-4 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShow(!show)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#6a0dad]"
                    >
                      {show ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                    </button>
                  </div>
                  {fieldErrors[id] && <p className="mt-1 text-xs text-red-600">{fieldErrors[id]}</p>}
                </div>
              );
            })}
          </div>

          {/* Términos */}
          <div className="flex items-start">
            <input
              id="acceptTerms"
              name="acceptTerms"
              type="checkbox"
              checked={formData.acceptTerms}
              onChange={handleInputChange}
              className="h-3 w-3 sm:h-4 sm:w-4 text-[#6a0dad] border-gray-300 rounded mt-1"
            />
            <label htmlFor="acceptTerms" className="ml-2 text-xs sm:text-sm text-gray-800">
              Acepto los <span className="text-[#6a0dad] underline cursor-pointer">términos y condiciones</span> y la{' '}
              <span className="text-[#6a0dad] underline cursor-pointer">política de privacidad</span> *
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full h-10 rounded-full text-white font-semibold text-sm shadow transition-all ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-600 hover:scale-105'
            }`}
          >
            {loading ? 'Creando cuenta...' : 'Registrarse'}
          </button>
        </form>

        {/* Beneficios fila horizontal */}
        <div className="mt-4 flex flex-col sm:flex-row justify-between gap-2">
          {benefits.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex items-center bg-gray-50 p-2 rounded-lg shadow-inner flex-1">
              <Icon className="w-4 h-4 text-[#6a0dad] mr-2" />
              <div>
                <h3 className="text-xs font-semibold text-gray-800">{title}</h3>
                <p className="text-[10px] text-gray-600">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModernRegisterCitySide;
