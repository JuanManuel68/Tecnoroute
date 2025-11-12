import React, { useState } from 'react';
import {
  TruckIcon,
  UserIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

// MOCKS DE DEPENDENCIAS PARA DEMO
const useAuth = () => ({
  login: async (email, password) => {
    console.log(`[MOCK] Login: ${email}`);
    if (password === 'password123') return { success: true };
    return { success: false, error: 'Credenciales inválidas (usa "password123").' };
  },
  getDashboardRoute: () => '/dashboard'
});
const useNavigate = () => (path) => console.log(`[MOCK] Navegación a: ${path}`);
const useSearchParams = () => [{ get: (key) => (key === 'type' ? 'user' : null) }, () => {}];

const ModernLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [bgPos, setBgPos] = useState(50); // posición del fondo

  const [searchParams] = useSearchParams();
  const loginType = searchParams.get('type');

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
    if (result.success) navigate(getDashboardRoute());
    else setError(result.error);
    setLoading(false);
  };

  const handleMouseMove = (e) => {
    const y = e.clientY / window.innerHeight; // valor entre 0 y 1
    setBgPos(20 + y * 60); // mueve el fondo entre 20% y 80%
  };

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
      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-2xl border-t-8 border-[#6a0dad] relative z-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[#1f2937] shadow-lg">
            <TruckIcon className="h-10 w-10 text-[#ffe066]" />
          </div>
          <h1 className="mt-4 text-3xl font-extrabold text-[#1a1a1a]">
            {loginType === 'user' ? 'Tienda TecnoRoute' : 'Panel TecnoRoute'}
          </h1>
          <p className="mt-2 text-gray-600">
            {loginType === 'user'
              ? 'Accede para explorar nuestros productos'
              : 'Inicia sesión para continuar'}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-center text-red-700">
            {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Correo electrónico</label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="correo@ejemplo.com"
                className="w-full rounded-full border border-gray-300 py-3 pl-10 pr-4 text-gray-800 focus:border-[#6a0dad] focus:ring-2 focus:ring-[#6a0dad]"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full rounded-full border border-gray-300 py-3 pl-4 pr-10 text-gray-800 focus:border-[#0057ff] focus:ring-2 focus:ring-[#0057ff]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0057ff]"
              >
                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Botón login */}
          <button
            type="submit"
            disabled={loading}
            className={`flex w-full items-center justify-center gap-2 rounded-full py-3 text-lg font-semibold text-white shadow-lg transition-all ${
              loading
                ? 'cursor-not-allowed bg-gray-400'
                : 'bg-gray-800 hover:bg-gray-600 hover:scale-105'
            }`}
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
            ) : (
              <>
                Iniciar sesión <ArrowRightIcon className="h-5 w-5" />
              </>
            )}
          </button>
        </form>

        {/* Recuperar contraseña */}
        <div className="mt-4 text-right">
          <button className="text-sm text-[#0057ff] hover:underline">
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        {/* Registro */}
        <div className="mt-6 text-center text-gray-700">
          ¿No tienes cuenta?{' '}
          <button
            onClick={() => navigate('/register')}
            className="font-semibold text-[#6a0dad] hover:text-[#ff7b00]"
          >
            Regístrate aquí
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModernLogin;