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
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

const COLOMBIAN_CITIES = [
  'Bogotá',
  'Medellín',
  'Cali',
  'Barranquilla',
  'Cartagena',
  'Cúcuta',
  'Bucaramanga',
  'Pereira',
  'Santa Marta',
  'Ibagué',
  'Pasto',
  'Manizales',
  'Neiva',
  'Villavicencio',
  'Armenia',
  'Valledupar',
  'Montería',
  'Sincelejo',
  'Popayán',
  'Tunja',
].sort();

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
    setValidationErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const errors = {};

    // Validar campos requeridos
    if (!formData.nombres.trim()) {
      errors.nombres = 'El nombre es requerido';
    }

    if (!formData.apellidos.trim()) {
      errors.apellidos = 'Los apellidos son requeridos';
    }

    if (!formData.email.trim()) {
      errors.email = 'El email es requerido';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = 'Email inválido';
      }
    }

    if (!formData.password) {
      errors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      errors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      setError('Por favor corrige los errores del formulario');
      return;
    }

    setLoading(true);
    setError('');

    const result = await register(formData);

    if (result.success) {
      // La navegación se maneja automáticamente por el AuthContext
    } else {
      setError(result.error || 'Error al registrarse');
    }

    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
      style={{ backgroundColor: '#3B82F6' }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        className="flex-1"
      >
        <View className="flex-1 px-8 py-12">
          {/* Header */}
          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-white rounded-full items-center justify-center mb-4 shadow-lg">
              <Ionicons name="person-add" size={40} color="#3B82F6" />
            </View>
            <Text className="text-3xl font-bold text-white mb-2">Crear Cuenta</Text>
            <Text className="text-base text-white/80">Únete a TecnoRoute</Text>
          </View>

          {/* Formulario */}
          <View className="bg-white rounded-3xl p-6 shadow-2xl">
            {/* Error general */}
            {error ? (
              <View className="bg-red-100 border border-red-400 rounded-lg p-3 mb-4">
                <Text className="text-red-700 text-sm">{error}</Text>
              </View>
            ) : null}

            {/* Nombres */}
            <View className="mb-4">
              <Text className="text-gray-700 font-semibold mb-2">Nombres *</Text>
              <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3">
                <Ionicons name="person-outline" size={20} color="#6B7280" />
                <TextInput
                  className="flex-1 ml-3 text-base"
                  placeholder="Juan"
                  value={formData.nombres}
                  onChangeText={(value) => handleInputChange('nombres', value)}
                  editable={!loading}
                />
              </View>
              {validationErrors.nombres ? (
                <Text className="text-red-600 text-sm mt-1">{validationErrors.nombres}</Text>
              ) : null}
            </View>

            {/* Apellidos */}
            <View className="mb-4">
              <Text className="text-gray-700 font-semibold mb-2">Apellidos *</Text>
              <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3">
                <Ionicons name="person-outline" size={20} color="#6B7280" />
                <TextInput
                  className="flex-1 ml-3 text-base"
                  placeholder="Pérez"
                  value={formData.apellidos}
                  onChangeText={(value) => handleInputChange('apellidos', value)}
                  editable={!loading}
                />
              </View>
              {validationErrors.apellidos ? (
                <Text className="text-red-600 text-sm mt-1">{validationErrors.apellidos}</Text>
              ) : null}
            </View>

            {/* Email */}
            <View className="mb-4">
              <Text className="text-gray-700 font-semibold mb-2">Email *</Text>
              <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3">
                <Ionicons name="mail-outline" size={20} color="#6B7280" />
                <TextInput
                  className="flex-1 ml-3 text-base"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value.toLowerCase())}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  editable={!loading}
                />
              </View>
              {validationErrors.email ? (
                <Text className="text-red-600 text-sm mt-1">{validationErrors.email}</Text>
              ) : null}
            </View>

            {/* Teléfono */}
            <View className="mb-4">
              <Text className="text-gray-700 font-semibold mb-2">Teléfono</Text>
              <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3">
                <Ionicons name="call-outline" size={20} color="#6B7280" />
                <TextInput
                  className="flex-1 ml-3 text-base"
                  placeholder="3001234567"
                  value={formData.phone}
                  onChangeText={(value) => handleInputChange('phone', value)}
                  keyboardType="phone-pad"
                  editable={!loading}
                />
              </View>
            </View>

            {/* Dirección */}
            <View className="mb-4">
              <Text className="text-gray-700 font-semibold mb-2">Dirección</Text>
              <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3">
                <Ionicons name="location-outline" size={20} color="#6B7280" />
                <TextInput
                  className="flex-1 ml-3 text-base"
                  placeholder="Calle 123 #45-67"
                  value={formData.address}
                  onChangeText={(value) => handleInputChange('address', value)}
                  editable={!loading}
                />
              </View>
            </View>

            {/* Ciudad */}
            <View className="mb-4">
              <Text className="text-gray-700 font-semibold mb-2">Ciudad</Text>
              <View className="bg-gray-100 rounded-xl overflow-hidden">
                <Picker
                  selectedValue={formData.city}
                  onValueChange={(value) => handleInputChange('city', value)}
                  enabled={!loading}
                  style={{ height: 50 }}
                >
                  <Picker.Item label="Selecciona una ciudad" value="" />
                  {COLOMBIAN_CITIES.map((city) => (
                    <Picker.Item key={city} label={city} value={city} />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Password */}
            <View className="mb-4">
              <Text className="text-gray-700 font-semibold mb-2">Contraseña *</Text>
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
              {validationErrors.password ? (
                <Text className="text-red-600 text-sm mt-1">{validationErrors.password}</Text>
              ) : null}
            </View>

            {/* Confirm Password */}
            <View className="mb-6">
              <Text className="text-gray-700 font-semibold mb-2">Confirmar Contraseña *</Text>
              <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3">
                <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />
                <TextInput
                  className="flex-1 ml-3 text-base"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChangeText={(value) => handleInputChange('confirmPassword', value)}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  editable={!loading}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                >
                  <Ionicons
                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>
              {validationErrors.confirmPassword ? (
                <Text className="text-red-600 text-sm mt-1">
                  {validationErrors.confirmPassword}
                </Text>
              ) : null}
            </View>

            {/* Register Button */}
            <TouchableOpacity
              className={`rounded-xl py-4 items-center mb-4 ${
                loading ? 'bg-blue-400' : 'bg-blue-600'
              }`}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-lg">Registrarse</Text>
              )}
            </TouchableOpacity>

            {/* Login Link */}
            <View className="flex-row justify-center">
              <Text className="text-gray-600">¿Ya tienes cuenta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')} disabled={loading}>
                <Text className="text-blue-600 font-bold">Inicia sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
