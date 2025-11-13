import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      setError('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);

    if (result.success) {
      // La navegación se maneja automáticamente por el AuthContext
    } else {
      setError(result.error || 'Error al iniciar sesión');
    }

    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gradient-to-br from-blue-500 to-purple-600"
      style={{ backgroundColor: '#3B82F6' }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        className="flex-1"
      >
        <View className="flex-1 justify-center px-8 py-12">
          {/* Logo y título */}
          <View className="items-center mb-12">
            <View className="w-20 h-20 bg-white rounded-full items-center justify-center mb-4 shadow-lg">
              <Ionicons name="logo-react" size={48} color="#3B82F6" />
            </View>
            <Text className="text-4xl font-bold text-white mb-2">TecnoRoute</Text>
            <Text className="text-lg text-white/80">Bienvenido de vuelta</Text>
          </View>

          {/* Formulario */}
          <View className="bg-white rounded-3xl p-8 shadow-2xl">
            {/* Error message */}
            {error ? (
              <View className="bg-red-100 border border-red-400 rounded-lg p-3 mb-4">
                <Text className="text-red-700 text-sm">{error}</Text>
              </View>
            ) : null}

            {/* Email */}
            <View className="mb-6">
              <Text className="text-gray-700 font-semibold mb-2">Email</Text>
              <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3">
                <Ionicons name="mail-outline" size={20} color="#6B7280" />
                <TextInput
                  className="flex-1 ml-3 text-base"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  editable={!loading}
                />
              </View>
            </View>

            {/* Password */}
            <View className="mb-6">
              <Text className="text-gray-700 font-semibold mb-2">Contraseña</Text>
              <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3">
                <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />
                <TextInput
                  className="flex-1 ml-3 text-base"
                  placeholder="••••••••"
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  editable={!loading}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity className="mb-6">
              <Text className="text-blue-600 text-right font-semibold">
                ¿Olvidaste tu contraseña?
              </Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              className={`rounded-xl py-4 items-center ${
                loading ? 'bg-blue-400' : 'bg-blue-600'
              }`}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-lg">Iniciar Sesión</Text>
              )}
            </TouchableOpacity>

            {/* Register Link */}
            <View className="flex-row justify-center mt-6">
              <Text className="text-gray-600">¿No tienes cuenta? </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Register')}
                disabled={loading}
              >
                <Text className="text-blue-600 font-bold">Regístrate aquí</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View className="items-center mt-8">
            <Text className="text-white/60 text-sm">
              © 2024 TecnoRoute. Todos los derechos reservados.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
