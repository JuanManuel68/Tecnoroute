import React, { useState } from 'react';
import {
  TruckIcon,
  UserIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ModernLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [searchParams] = useSearchParams();
  const loginType = searchParams.get('type');

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

  // Funciones recuperación
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
      } else {
        setRecoveryError(data.error || 'Error al enviar el código');
      }
    } catch {
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
    } catch {
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
        body: JSON.stringify({ email: recoveryEmail, code: recoveryCode, new_password: newPassword })
      });
      const data = await response.json();
      if (response.ok) {
        setRecoverySuccess(data.message);
        setTimeout(() => {
          setShowRecoveryModal(false);
          setRecoveryStep(1);
        }, 2000);
      } else {
        setRecoveryError(data.error || 'Error al restablecer la contraseña');
      }
    } catch {
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
    <div className="min-h-screen bg-gradient-to-br from-[#0066ff] via-[#0044cc] to-[#002b80] flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-br from-[#ff6b00] to-[#ffd60a] w-20 h-20 rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <TruckIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mt-4">
            {loginType === 'user' ? 'Tienda TecnoRoute' : 'Panel TecnoRoute'}
          </h1>
          <p className="text-gray-600 mt-2">
            {loginType === 'user'
              ? 'Accede para explorar nuestros productos'
              : 'Inicia sesión para continuar'}
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
              <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="correo@ejemplo.com"
                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-[#0066ff] focus:border-transparent text-gray-800"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg pr-10 pl-4 py-3 focus:ring-2 focus:ring-[#0066ff] focus:border-transparent text-gray-800"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#0066ff]"
              >
                {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>


          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg text-lg font-semibold text-white transition-all shadow-lg ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#ff6b00] to-[#ff9100] hover:scale-105 hover:shadow-xl'
            }`}
          >
            {loading ? (
              <div className="animate-spin h-5 w-5 border-b-2 border-white rounded-full"></div>
            ) : (
              <>
                Iniciar sesión <ArrowRightIcon className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
        
          {/* Forgot password */}
          <div className="text-right">
            <button
              type="button"
              onClick={() => setShowRecoveryModal(true)}
              className="text-sm text-[#0066ff] hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

        {/* Register */}
        <div className="mt-6 text-center text-gray-700">
          ¿No tienes cuenta?{' '}
          <button
            onClick={() => navigate('/register')}
            className="text-[#0066ff] hover:text-[#0044cc] font-semibold"
          >
            Regístrate aquí
          </button>
        </div>
      </div>

      {/* Password Recovery Modal */}
      {showRecoveryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              onClick={closeRecoveryModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>

            <h3 className="text-2xl font-bold text-gray-900 mb-2">Recuperar contraseña</h3>
            <p className="text-gray-600 mb-6">
              {recoveryStep === 1
                ? 'Ingresa tu correo para recibir un código'
                : recoveryStep === 2
                ? 'Ingresa el código recibido'
                : 'Crea tu nueva contraseña'}
            </p>

            {recoveryError && (
              <div className="bg-red-50 text-red-700 border border-red-300 rounded-lg px-4 py-2 mb-3">
                {recoveryError}
              </div>
            )}
            {recoverySuccess && (
              <div className="bg-green-50 text-green-700 border border-green-300 rounded-lg px-4 py-2 mb-3">
                {recoverySuccess}
              </div>
            )}

            {/* Paso 1 */}
            {recoveryStep === 1 && (
              <>
                <input
                  type="email"
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:ring-2 focus:ring-[#0066ff]"
                />
                <button
                  onClick={handleRequestReset}
                  disabled={!recoveryEmail || recoveryLoading}
                  className={`w-full py-3 rounded-lg text-white font-semibold ${
                    !recoveryEmail || recoveryLoading
                      ? 'bg-gray-400'
                      : 'bg-gradient-to-r from-[#0066ff] to-[#0044cc] hover:scale-105'
                  }`}
                >
                  {recoveryLoading ? 'Enviando...' : 'Enviar código'}
                </button>
              </>
            )}

            {/* Paso 2 */}
            {recoveryStep === 2 && (
              <>
                <input
                  type="text"
                  maxLength={6}
                  value={recoveryCode}
                  onChange={(e) => setRecoveryCode(e.target.value)}
                  placeholder="Código de 6 dígitos"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 text-center tracking-widest focus:ring-2 focus:ring-[#0066ff]"
                />
                <button
                  onClick={handleVerifyCode}
                  disabled={recoveryCode.length !== 6}
                  className="w-full py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-[#0066ff] to-[#0044cc] hover:scale-105"
                >
                  Verificar código
                </button>
              </>
            )}

            {/* Paso 3 */}
            {recoveryStep === 3 && (
              <>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nueva contraseña"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-3 focus:ring-2 focus:ring-[#0066ff]"
                />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Confirmar contraseña"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:ring-2 focus:ring-[#0066ff]"
                />
                <button
                  onClick={handleResetPassword}
                  disabled={!newPassword || !confirmNewPassword}
                  className="w-full py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-[#ff6b00] to-[#ff9100] hover:scale-105"
                >
                  Restablecer contraseña
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
