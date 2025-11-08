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
  const navigate = useNavigate();

  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [debugCode, setDebugCode] = useState('');

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

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) setFieldErrors(prev => ({ ...prev, [name]: error }));
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

  const sendVerificationCode = async (email) => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/send-verification-code/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (response.ok) {
        if (data.debug_code) {
          setDebugCode(data.debug_code);
          console.log('CÓDIGO DE VERIFICACIÓN:', data.debug_code);
        }
        return true;
      } else {
        setError(data.error || 'Error al enviar código de verificación');
        return false;
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error de conexión al enviar código');
      return false;
    }
  };

  const handleVerifyAndRegister = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setVerificationError('El código debe tener 6 dígitos');
      return;
    }
    setIsVerifying(true);
    setVerificationError('');
    try {
      const verifyResponse = await fetch('http://localhost:8000/api/auth/verify-code/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, code: verificationCode })
      });
      const verifyData = await verifyResponse.json();
      if (!verifyResponse.ok) {
        setVerificationError(verifyData.error || 'Código inválido');
        setIsVerifying(false);
        return;
      }
      const result = await register({
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
        city: formData.city
      });
      if (result.success) {
        setShowVerificationModal(false);
        setTimeout(() => navigate(getDashboardRoute()), 100);
      } else setVerificationError(result.error || 'Error al crear la cuenta');
    } catch (error) {
      console.error('Error:', error);
      setVerificationError('Error de conexión');
    } finally {
      setIsVerifying(false);
    }
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

    const codeSent = await sendVerificationCode(formData.email);
    if (codeSent) setShowVerificationModal(true);
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
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-4 rounded-2xl shadow-md">
              <UserPlusIcon className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Únete a TecnoRoute</h1>
          <p className="text-gray-600">Crea tu cuenta y disfruta de todos los beneficios</p>
        </div>

        <div className="md:grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg shadow-inner space-y-5">

                {/* Campos en vertical */}
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { id: 'nombres', label: 'Nombres', icon: UserIcon, type: 'text', placeholder: 'JUAN CARLOS' },
                    { id: 'apellidos', label: 'Apellidos', icon: UserIcon, type: 'text', placeholder: 'PÉREZ GONZÁLEZ' },
                    { id: 'email', label: 'Correo electrónico', icon: EnvelopeIcon, type: 'email', placeholder: 'tu@email.com' },
                    { id: 'phone', label: 'Teléfono', icon: PhoneIcon, type: 'tel', placeholder: '+57 300 000 0000' },
                    { id: 'address', label: 'Dirección', icon: MapPinIcon, type: 'text', placeholder: 'Calle 123 #45-67' }
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
                          className={`w-full px-4 py-3 pl-10 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition ${fieldErrors[id] ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder={placeholder}
                        />
                        <Icon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      </div>
                      {fieldErrors[id] && <p className="mt-1 text-sm text-red-600">{fieldErrors[id]}</p>}
                    </div>
                  ))}
                </div>

                {/* Ciudad */}
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
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none ${fieldErrors.city ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">Selecciona tu ciudad</option>
                      {cities.map(city => <option key={city} value={city}>{city}</option>)}
                    </select>
                    <ChevronDownIcon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                  {fieldErrors.city && <p className="mt-1 text-sm text-red-600">{fieldErrors.city}</p>}
                </div>

                {/* Contraseñas sin copiar/pegar */}
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
                      className={`w-full px-4 py-3 pl-10 pr-10 border rounded-lg focus:ring-2 focus:ring-primary-500 ${fieldErrors.password ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Mínimo 8 caracteres, mayúscula, minúscula, número y símbolo"
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
                  {fieldErrors.password && <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>}

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
                      onCopy={(e) => e.preventDefault()}
                      onPaste={(e) => e.preventDefault()}
                      className={`w-full px-4 py-3 pl-10 pr-10 border rounded-lg focus:ring-2 focus:ring-primary-500 ${fieldErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
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
                  {fieldErrors.confirmPassword && <p className="mt-1 text-sm text-red-600">{fieldErrors.confirmPassword}</p>}
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
                      className={`h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1`}
                    />
                    <label htmlFor="acceptTerms" className="ml-2 text-sm text-gray-800">
                      Acepto los <span className="text-primary-600 underline cursor-pointer">términos y condiciones</span> y la <span className="text-primary-600 underline cursor-pointer">política de privacidad</span> *
                    </label>
                  </div>
                  {!formData.acceptTerms && error.includes('términos') && <p className="mt-1 text-sm text-red-600">Debes aceptar los términos y condiciones</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-lg text-white font-medium transition-all ${loading ? 'bg-gray-400' : 'bg-primary-600 hover:bg-primary-700 hover:scale-105 shadow-md'}`}
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
                <Icon className="w-8 h-8 text-primary-600 mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">{title}</h3>
                  <p className="text-gray-600 text-sm">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal de verificación */}
        {showVerificationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Verificación de correo</h2>
              <p className="mb-4">Ingresa el código de 6 dígitos que enviamos a {formData.email}</p>
              <input
                type="text"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg mb-2"
                placeholder="Código"
              />
              {verificationError && <p className="text-red-600 text-sm mb-2">{verificationError}</p>}
              {debugCode && <p className="text-gray-500 text-xs mb-2">Código de prueba (desarrollo): {debugCode}</p>}
              <div className="flex justify-end mt-4 space-x-2">
                <button
                  onClick={() => setShowVerificationModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleVerifyAndRegister}
                  disabled={isVerifying}
                  className={`px-4 py-2 rounded-lg text-white ${isVerifying ? 'bg-gray-400' : 'bg-primary-600 hover:bg-primary-700'}`}
                >
                  {isVerifying ? 'Verificando...' : 'Verificar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernRegister;
