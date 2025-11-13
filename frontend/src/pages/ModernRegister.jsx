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

const ModernRegister = () => {
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
      if (['nombres','apellidos','email','password','confirmPassword'].includes(k)) {
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
    { icon: TruckIcon, title: 'Envío Gratis', description: 'En pedidos superiores a $50' },
    { icon: UserIcon, title: 'Atención Personalizada', description: 'Soporte dedicado para ti' },
    { icon: EnvelopeIcon, title: 'Ofertas Exclusivas', description: 'Promociones solo para miembros' },
  ];

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative flex min-h-screen items-center justify-center px-6 py-12 overflow-hidden"
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
        backgroundPosition: `center ${bgPos}%`,
        transition: 'background-position 0.3s ease-out',
      }}
    >
      <div className="w-full max-w-5xl bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border-t-8 border-[#6a0dad] relative z-10 p-10">
        <div className="text-center mb-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[#1f2937] shadow-lg">
            <UserPlusIcon className="h-10 w-10 text-[#ffe066]" />
          </div>
          <h1 className="mt-4 text-3xl font-extrabold text-[#1a1a1a]">Crea tu cuenta TecnoRoute</h1>
          <p className="mt-2 text-gray-600">Regístrate y accede a todos los beneficios</p>
        </div>

        <div className="md:grid md:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="md:col-span-2">
            {error && (
              <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-center text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-xl shadow-inner space-y-5">
                {/* Campos principales */}
                {[
                  { id: 'nombres', label: 'Nombres', icon: UserIcon, type: 'text', placeholder: 'JUAN CARLOS' },
                  { id: 'apellidos', label: 'Apellidos', icon: UserIcon, type: 'text', placeholder: 'PÉREZ GONZÁLEZ' },
                  { id: 'email', label: 'Correo electrónico', icon: EnvelopeIcon, type: 'email', placeholder: 'tu@email.com' },
                  { id: 'phone', label: 'Teléfono', icon: PhoneIcon, type: 'tel', placeholder: '+57 300 000 0000' },
                  { id: 'address', label: 'Dirección', icon: MapPinIcon, type: 'text', placeholder: 'Calle 123 #45-67' },
                ].map(({ id, label, icon: Icon, type, placeholder }) => (
                  <div key={id}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{label} *</label>
                    <div className="relative">
                      <input
                        id={id}
                        name={id}
                        type={type}
                        value={formData[id]}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder={placeholder}
                        className={`w-full px-4 py-3 pl-10 border rounded-lg focus:ring-2 focus:ring-[#6a0dad] focus:border-[#6a0dad] ${
                          fieldErrors[id] ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      <Icon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                    {fieldErrors[id] && <p className="mt-1 text-sm text-red-600">{fieldErrors[id]}</p>}
                  </div>
                ))}

                {/* Ciudad */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad *</label>
                  <div className="relative">
                    <select
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#6a0dad] focus:border-[#6a0dad] ${
                        fieldErrors.city ? 'border-red-500' : 'border-gray-300'
                      } appearance-none`}
                    >
                      <option value="">Selecciona tu ciudad</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                    <ChevronDownIcon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>

                {/* Contraseñas */}
                <div>
                  {[
                    { id: 'password', label: 'Contraseña', show: showPassword, setShow: setShowPassword },
                    { id: 'confirmPassword', label: 'Confirmar Contraseña', show: showConfirmPassword, setShow: setShowConfirmPassword },
                  ].map(({ id, label, show, setShow }) => (
                    <div key={id} className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">{label} *</label>
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
                          className={`w-full px-4 py-3 pl-10 pr-10 border rounded-lg focus:ring-2 focus:ring-[#6a0dad] ${
                            fieldErrors[id] ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder={id === 'password' ? 'Crea tu contraseña' : 'Repite tu contraseña'}
                        />

                        <LockClosedIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <button
                          type="button"
                          onClick={() => setShow(!show)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#6a0dad]"
                        >
                          {show ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                        </button>
                      </div>
                      {fieldErrors[id] && <p className="mt-1 text-sm text-red-600">{fieldErrors[id]}</p>}
                    </div>
                  ))}
                </div>

                {/* Términos */}
                <div className="flex items-start">
                  <input
                    id="acceptTerms"
                    name="acceptTerms"
                    type="checkbox"
                    checked={formData.acceptTerms}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-[#6a0dad] border-gray-300 rounded mt-1"
                  />
                  <label htmlFor="acceptTerms" className="ml-2 text-sm text-gray-800">
                    Acepto los <span className="text-[#6a0dad] underline cursor-pointer">términos y condiciones</span> y la{' '}
                    <span className="text-[#6a0dad] underline cursor-pointer">política de privacidad</span> *
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-full text-white font-semibold text-lg shadow-lg transition-all ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gray-800 hover:bg-gray-600 hover:scale-105'
                  }`}
                >
                  {loading ? 'Creando cuenta...' : 'Registrarse'}
                </button>
              </div>
            </form>
          </div>

          {/* Beneficios */}
          <div className="md:col-span-1 space-y-4 mt-8 md:mt-0">
            {benefits.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex items-start bg-gray-50 p-4 rounded-lg shadow-inner">
                <Icon className="w-8 h-8 text-[#6a0dad] mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">{title}</h3>
                  <p className="text-gray-600 text-sm">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernRegister;
