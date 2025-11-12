import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  TruckIcon,
  UserIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowRightIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';


// Definición de colores principales
// Morado Principal (Purple) = #7c3aed (indigo-600)
// Acento Suave (Lavender) = #ede9fe (indigo-100)
// Morado Oscuro para fondo = #4c1d95 (violeta oscuro, para contraste)

const ModernLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [searchParams] = useSearchParams();
  // Usamos 'admin' como default para simular el tipo si no se encuentra en URL
  const loginType = searchParams.get('type') || 'admin';

  // Estados para recuperación de contraseña
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryStep, setRecoveryStep] = useState(1);
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
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate(getDashboardRoute());
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  // Funciones recuperación - Usando mocks para las APIs
  const handleRequestReset = async () => {
    setRecoveryLoading(true);
    setRecoveryError('');
    setRecoverySuccess('');

    try {
      // Simulamos el envío de código
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (!recoveryEmail.includes('@')) {
        setRecoveryError('Correo inválido');
        return;
      }

      setRecoverySuccess(`Código enviado a ${recoveryEmail}. Código de prueba: 123456`);
      setRecoveryStep(2);
    } catch {
      setRecoveryError('Error de conexión simulado. Intenta de nuevo.');
    } finally {
      setRecoveryLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setRecoveryLoading(true);
    setRecoveryError('');
    setRecoverySuccess('');

    try {
      // Simulamos la verificación
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (recoveryCode === '123456') {
        setRecoverySuccess('Código verificado correctamente. Procede a cambiar tu contraseña.');
        setRecoveryStep(3);
      } else {
        setRecoveryError('Código inválido. Intenta de nuevo.');
      }
    } catch {
      setRecoveryError('Error de conexión simulado. Intenta de nuevo.');
    } finally {
      setRecoveryLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmNewPassword) {
      setRecoveryError('Las contraseñas no coinciden');
      return;
    }
    if (newPassword.length < 6) {
      setRecoveryError('La contraseña debe tener al menos 6 caracteres (mínimo de prueba)');
      return;
    }

    setRecoveryLoading(true);
    setRecoveryError('');
    setRecoverySuccess('');

    try {
      // Simulamos el restablecimiento
      await new Promise(resolve => setTimeout(resolve, 1500));
      setRecoverySuccess('¡Contraseña restablecida con éxito! Serás redirigido.');
      setTimeout(() => {
        closeRecoveryModal();
      }, 2000);
    } catch {
      setRecoveryError('Error de conexión simulado. Intenta de nuevo.');
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
    setShowNewPassword(false);
  };

  return (
    // CAMBIO 1: Fondo más claro, degradado de blanco a morado muy suave (#ede9fe)
    <div className="min-h-screen bg-gradient-to-br from-white to-[#ede9fe] flex items-center justify-center px-4 py-12 font-inter">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 sm:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          {/* CAMBIO 2: Ícono con color sólido (#a78bfa) sin degradado */}
          <div className="bg-[#a78bfa] w-20 h-20 rounded-2xl flex items-center justify-center mx-auto shadow-xl transform hover:scale-105 transition-transform duration-300">
            <TruckIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mt-4">
            {loginType === 'user' ? 'Tienda TecnoRoute' : 'Panel TecnoRoute'}
          </h1>
          <p className="text-gray-600 mt-2">
            {loginType === 'user'
              ? 'Accede para explorar nuestros productos'
              : 'Inicia sesión para continuar con tu gestión'}
          </p>
        </div>

        {/* Login form */}
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Correo electrónico</label>
            <div className="relative">
              {/* Ícono en Morado Suave */}
              <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#c4b5fd] w-5 h-5" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="correo@ejemplo.com"
                // Foco en Morado Principal
                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 transition-all focus:ring-2 focus:ring-[#7c3aed] focus:border-[#7c3aed] text-gray-800"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
            <div className="relative">
               {/* Ícono en Morado Suave */}
              <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#c4b5fd] w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                // Foco en Morado Principal
                className="w-full border border-gray-300 rounded-lg pr-10 pl-10 py-3 transition-all focus:ring-2 focus:ring-[#7c3aed] focus:border-[#7c3aed] text-gray-800"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                // Hover en Morado Principal
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#7c3aed] transition-colors"
              >
                {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>
          {/* Forgot password section to allow spacing */}
          <div className="text-right pt-1">
            <button
              type="button"
              onClick={() => setShowRecoveryModal(true)}
              // Link en Morado Principal
              className="text-sm text-[#7c3aed] hover:text-[#5b21b6] hover:underline transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>


          {/* Submit button - Morado principal con degradado a un tono más oscuro */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg text-lg font-semibold text-white transition-all duration-300 shadow-lg ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                // Degradado del Morado Principal
                : 'bg-gradient-to-r from-[#7c3aed] to-[#5b21b6] hover:scale-[1.02] hover:shadow-xl'
            }`}
          >
            {loading ? (
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
            ) : (
              <>
                Iniciar sesión <ArrowRightIcon className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Register */}
        <div className="mt-8 text-center text-gray-700">
          ¿No tienes cuenta?{' '}
          <button
            onClick={() => navigate('/register')}
            // Link en Morado Principal
            className="text-[#7c3aed] hover:text-[#5b21b6] font-semibold transition-colors"
          >
            Regístrate aquí
          </button>
        </div>
      </div>

      {/* Password Recovery Modal */}
      {showRecoveryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative transform scale-100 transition-transform duration-300">
            <button
              onClick={closeRecoveryModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 transition-colors p-2 rounded-full hover:bg-gray-100"
            >
              ✕
            </button>

            <h3 className="text-2xl font-bold text-gray-900 mb-2">Recuperar contraseña</h3>
            <p className="text-gray-600 mb-6 text-sm">
              {recoveryStep === 1
                ? 'Ingresa tu correo para recibir un código de verificación.'
                : recoveryStep === 2
                ? `Ingresa el código enviado a ${recoveryEmail}`
                : 'Establece tu nueva contraseña segura.'}
            </p>

            {recoveryError && (
              <div className="bg-red-50 text-red-700 border border-red-300 rounded-lg px-4 py-2 mb-3 text-sm">
                {recoveryError}
              </div>
            )}
            {recoverySuccess && (
              <div className="bg-green-50 text-green-700 border border-green-300 rounded-lg px-4 py-2 mb-3 text-sm">
                {recoverySuccess}
              </div>
            )}

            {/* Paso 1: Enviar correo */}
            {recoveryStep === 1 && (
              <>
                <input
                  type="email"
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  placeholder="Correo electrónico registrado"
                  // Foco en Morado Principal
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-6 transition-all focus:ring-2 focus:ring-[#7c3aed] focus:border-[#7c3aed]"
                />
                <button
                  onClick={handleRequestReset}
                  disabled={!recoveryEmail || recoveryLoading}
                  className={`w-full py-3 rounded-lg text-white font-semibold transition-all duration-300 shadow-md ${
                    !recoveryEmail || recoveryLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      // Acento Morado Principal para acciones modales
                      : 'bg-gradient-to-r from-[#7c3aed] to-[#5b21b6] hover:scale-[1.02]'
                  }`}
                >
                  {recoveryLoading ? 'Enviando...' : 'Enviar código'}
                </button>
              </>
            )}

            {/* Paso 2: Verificar código */}
            {recoveryStep === 2 && (
              <>
                <input
                  type="text"
                  maxLength={6}
                  value={recoveryCode}
                  onChange={(e) => setRecoveryCode(e.target.value)}
                  placeholder="Código de 6 dígitos"
                  // Foco en Morado Principal
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-6 text-center tracking-widest transition-all focus:ring-2 focus:ring-[#7c3aed] focus:border-[#7c3aed]"
                />
                <button
                  onClick={handleVerifyCode}
                  disabled={recoveryLoading || recoveryCode.length !== 6}
                  className={`w-full py-3 rounded-lg text-white font-semibold transition-all duration-300 shadow-md ${
                    recoveryLoading || recoveryCode.length !== 6
                      ? 'bg-gray-400 cursor-not-allowed'
                      // Acento Morado Principal
                      : 'bg-gradient-to-r from-[#7c3aed] to-[#5b21b6] hover:scale-[1.02]'
                  }`}
                >
                  {recoveryLoading ? 'Verificando...' : 'Verificar código'}
                </button>
              </>
            )}

            {/* Paso 3: Nueva contraseña */}
            {recoveryStep === 3 && (
              <>
                <div className="relative mb-3">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nueva contraseña (min. 6 caracteres)"
                    // Foco en Morado Principal
                    className="w-full border border-gray-300 rounded-lg pr-10 pl-4 py-3 transition-all focus:ring-2 focus:ring-[#7c3aed] focus:border-[#7c3aed]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    // Hover en Morado Principal
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#7c3aed] transition-colors"
                  >
                    {showNewPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Confirmar nueva contraseña"
                  // Foco en Morado Principal
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-6 transition-all focus:ring-2 focus:ring-[#7c3aed] focus:border-[#7c3aed]"
                />
                <button
                  onClick={handleResetPassword}
                  disabled={recoveryLoading || !newPassword || !confirmNewPassword}
                  className={`w-full py-3 rounded-lg text-white font-semibold transition-all duration-300 shadow-md ${
                    recoveryLoading || !newPassword || !confirmNewPassword
                      ? 'bg-gray-400 cursor-not-allowed'
                      // Degradado del Morado Principal para la acción final
                      : 'bg-gradient-to-r from-[#7c3aed] to-[#5b21b6] hover:scale-[1.02]'
                  }`}
                >
                  {recoveryLoading ? 'Restableciendo...' : 'Restablecer contraseña'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernLogin;