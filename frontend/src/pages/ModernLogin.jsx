import React, { useState } from 'react';
import {
  TruckIcon,
  UserIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import {
  UserIcon as UserSolid,
  CogIcon as CogSolid
} from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ModernLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const loginType = searchParams.get('type'); // 'admin' o 'user'
  
  // Password recovery states
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryStep, setRecoveryStep] = useState(1); // 1: email, 2: code, 3: new password
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [recoveryError, setRecoveryError] = useState('');
  const [recoverySuccess, setRecoverySuccess] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  const { login, getDashboardRoute } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      // Redirigir según el rol del usuario
      navigate(getDashboardRoute());
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  // Password recovery functions
  const handleRequestReset = async () => {
    setRecoveryLoading(true);
    setRecoveryError('');
    setRecoverySuccess('');
    
    try {
      const response = await fetch('http://localhost:8000/api/auth/request-password-reset/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: recoveryEmail })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setRecoverySuccess(data.message);
        setRecoveryStep(2);
        console.log('Debug code:', data.debug_code); // Solo para desarrollo
      } else {
        setRecoveryError(data.error || 'Error al enviar el código');
      }
    } catch (error) {
      setRecoveryError('Error de conexión. Intenta de nuevo.');
    } finally {
      setRecoveryLoading(false);
    }
  };
  
  const handleVerifyCode = async () => {
    setRecoveryLoading(true);
    setRecoveryError('');
    setRecoverySuccess('');
    
    try {
      const response = await fetch('http://localhost:8000/api/auth/verify-reset-code/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: recoveryEmail, code: recoveryCode })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setRecoverySuccess(data.message);
        setRecoveryStep(3);
      } else {
        setRecoveryError(data.error || 'Código inválido');
      }
    } catch (error) {
      setRecoveryError('Error de conexión. Intenta de nuevo.');
    } finally {
      setRecoveryLoading(false);
    }
  };
  
  const handleResetPassword = async () => {
    if (newPassword !== confirmNewPassword) {
      setRecoveryError('Las contraseñas no coinciden');
      return;
    }
    
    if (newPassword.length < 8) {
      setRecoveryError('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    
    setRecoveryLoading(true);
    setRecoveryError('');
    setRecoverySuccess('');
    
    try {
      const response = await fetch('http://localhost:8000/api/auth/reset-password/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: recoveryEmail, 
          code: recoveryCode, 
          new_password: newPassword 
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setRecoverySuccess(data.message);
        setTimeout(() => {
          setShowRecoveryModal(false);
          setRecoveryStep(1);
          setRecoveryEmail('');
          setRecoveryCode('');
          setNewPassword('');
          setConfirmNewPassword('');
          setRecoveryError('');
          setRecoverySuccess('');
        }, 2000);
      } else {
        setRecoveryError(data.error || 'Error al restablecer la contraseña');
      }
    } catch (error) {
      setRecoveryError('Error de conexión. Intenta de nuevo.');
    } finally {
      setRecoveryLoading(false);
    }
  };
  
  const closeRecoveryModal = () => {
    setShowRecoveryModal(false);
    setRecoveryStep(1);
    setRecoveryEmail('');
    setRecoveryCode('');
    setNewPassword('');
    setConfirmNewPassword('');
    setRecoveryError('');
    setRecoverySuccess('');
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-4 rounded-2xl shadow-lg">
              <TruckIcon className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {loginType === 'user' ? '🛒 Tienda TecnoRoute' : 'Bienvenido a TecnoRoute'}
          </h1>
          <p className="text-xl text-gray-600">
            {loginType === 'user' 
              ? 'Accede para ver nuestros electrodomésticos'
              : 'Accede a tu cuenta para continuar'
            }
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          {/* Formulario de Login */}
          <div className="card p-10">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Iniciar Sesión</h2>
              <p className="text-gray-600">Ingresa tus credenciales para acceder</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Correo electrónico *
                    </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors pl-12 text-lg"
                    placeholder="correo@ejemplo.com"
                  />
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Contraseña *
                    </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors pr-12 text-lg"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Botón de recuperar contraseña */}
              <div className="text-right -mt-2">
                <button
                  type="button"
                  onClick={() => setShowRecoveryModal(true)}
                  className="text-sm text-primary-600 hover:text-primary-700 hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 text-lg ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-primary-600 hover:bg-primary-700 transform hover:scale-105 shadow-lg hover:shadow-xl'
                } text-white`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Iniciando sesión...</span>
                  </>
                ) : (
                  <>
                    <span>Iniciar Sesión</span>
                    <ArrowRightIcon className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-gray-600 mb-2">¿No tienes cuenta?</p>
                <button
                  onClick={() => navigate('/register')}
                  className="text-primary-600 hover:text-primary-700 font-medium hover:underline transition-colors"
                >
                  Regístrate aquí
                </button>
            </div>
          </div>
        </div>
        </div>
                  {/* Footer */}
          <footer className="bg-gray-900 text-gray-300 py-6 mt-8 text-center">
            <p className="text-sm">
              © {new Date().getFullYear()} <span className="font-semibold text-white">TecnoRoute</span>. Todos los derechos reservados.
            </p>
          </footer>
      </div>
      
      {/* Password Recovery Modal */}
      {showRecoveryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            {/* Close button */}
            <button
              onClick={closeRecoveryModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Recuperar Contraseña
              </h3>
              <p className="text-gray-600">
                {recoveryStep === 1 && 'Ingresa tu correo para recibir un código de verificación'}
                {recoveryStep === 2 && 'Ingresa el código que enviamos a tu correo'}
                {recoveryStep === 3 && 'Ingresa tu nueva contraseña'}
              </p>
            </div>
            
            {recoveryError && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
                {recoveryError}
              </div>
            )}
            
            {recoverySuccess && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-4">
                {recoverySuccess}
              </div>
            )}
            
            {/* Step 1: Enter Email */}
            {recoveryStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="correo@ejemplo.com"
                  />
                </div>
                <button
                  onClick={handleRequestReset}
                  disabled={recoveryLoading || !recoveryEmail}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                    recoveryLoading || !recoveryEmail
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-primary-600 hover:bg-primary-700'
                  } text-white`}
                >
                  {recoveryLoading ? 'Enviando...' : 'Enviar Código'}
                </button>
              </div>
            )}
            
            {/* Step 2: Enter Code */}
            {recoveryStep === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Código de Verificación
                  </label>
                  <input
                    type="text"
                    value={recoveryCode}
                    onChange={(e) => setRecoveryCode(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center text-2xl tracking-widest"
                    placeholder="000000"
                    maxLength={6}
                  />
                </div>
                <button
                  onClick={handleVerifyCode}
                  disabled={recoveryLoading || recoveryCode.length !== 6}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                    recoveryLoading || recoveryCode.length !== 6
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-primary-600 hover:bg-primary-700'
                  } text-white`}
                >
                  {recoveryLoading ? 'Verificando...' : 'Verificar Código'}
                </button>
                <button
                  onClick={() => setRecoveryStep(1)}
                  className="w-full text-sm text-gray-600 hover:text-gray-900"
                >
                  Volver a enviar código
                </button>
              </div>
            )}
            
            {/* Step 3: New Password */}
            {recoveryStep === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nueva Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-12"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar Contraseña
                  </label>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>
                <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium mb-1">⚠️ La contraseña debe tener:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Mínimo 8 caracteres</li>
                    <li>Al menos una letra mayúscula</li>
                    <li>Al menos una letra minúscula</li>
                    <li>Al menos un número</li>
                  </ul>
                </div>
                <button
                  onClick={handleResetPassword}
                  disabled={recoveryLoading || !newPassword || !confirmNewPassword}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                    recoveryLoading || !newPassword || !confirmNewPassword
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-primary-600 hover:bg-primary-700'
                  } text-white`}
                >
                  {recoveryLoading ? 'Restableciendo...' : 'Restablecer Contraseña'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernLogin;