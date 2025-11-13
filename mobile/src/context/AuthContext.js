import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/apiService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar usuario del almacenamiento al iniciar
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error al cargar usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      if (!email || !password) {
        return {
          success: false,
          error: 'Email y contraseña son requeridos',
        };
      }

      const data = await authService.login(email, password);

      if (data.token && data.user) {
        const userData = {
          id: data.user.id,
          name: data.user.first_name
            ? `${data.user.first_name} ${data.user.last_name}`.trim()
            : data.user.username,
          email: data.user.email,
          username: data.user.username,
          role: data.user.role || 'customer',
          telefono: data.user.telefono || '',
          direccion: data.user.direccion || '',
          ciudad: data.user.ciudad || '',
        };

        // Guardar en AsyncStorage
        await AsyncStorage.setItem('authToken', data.token);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        
        setUser(userData);
        return { success: true };
      }

      return {
        success: false,
        error: 'Credenciales inválidas',
      };
    } catch (error) {
      console.error('Error en login:', error);
      return {
        success: false,
        error: error.error || 'Error de conexión con el servidor',
      };
    }
  };

  const register = async (formData) => {
    try {
      // Validación de campos requeridos
      if (!formData.nombres || !formData.apellidos || !formData.email || !formData.password) {
        return {
          success: false,
          error: 'Todos los campos son requeridos',
        };
      }

      // Validación de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        return {
          success: false,
          error: 'Email inválido',
        };
      }

      // Validación de contraseña
      if (formData.password.length < 8) {
        return {
          success: false,
          error: 'La contraseña debe tener al menos 8 caracteres',
        };
      }

      if (formData.password !== formData.confirmPassword) {
        return {
          success: false,
          error: 'Las contraseñas no coinciden',
        };
      }

      const data = await authService.register(formData);

      if (data.success && data.token && data.user) {
        const userData = {
          id: data.user.id,
          name: `${data.user.first_name} ${data.user.last_name}`.trim(),
          email: data.user.email,
          username: data.user.username,
          role: data.user.role || 'customer',
          telefono: data.user.telefono || '',
          direccion: data.user.direccion || '',
          ciudad: data.user.ciudad || '',
        };

        // Guardar en AsyncStorage
        await AsyncStorage.setItem('authToken', data.token);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        
        setUser(userData);
        return { success: true, message: data.message };
      }

      return {
        success: false,
        error: data.error || 'Error en el registro',
      };
    } catch (error) {
      console.error('Error en registro:', error);
      return {
        success: false,
        error: error.error || 'Error de conexión con el servidor',
      };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Error en logout:', error);
    }
  };

  const updateUser = async (userData) => {
    try {
      const updatedUser = { ...user, ...userData };
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
    }
  };

  // Helpers de roles
  const isAdmin = () => user?.role === 'admin';
  const isUser = () => user?.role === 'user' || user?.role === 'customer';
  const isConductor = () => user?.role === 'conductor';

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
    isAdmin,
    isUser,
    isConductor,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
