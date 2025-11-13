import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-600 pt-12 pb-6 px-6 rounded-b-3xl shadow-lg">
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="text-white text-2xl font-bold">Hola, {user?.name}</Text>
            <Text className="text-white/80 text-sm">{user?.email}</Text>
          </View>
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-white/20 p-3 rounded-full"
          >
            <Ionicons name="log-out-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 py-6">
        {/* Welcome Card */}
        <View className="bg-white rounded-2xl p-6 mb-6 shadow-md">
          <View className="flex-row items-center mb-4">
            <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-4">
              <Ionicons name="checkmark-circle" size={24} color="#3B82F6" />
            </View>
            <View className="flex-1">
              <Text className="text-xl font-bold text-gray-800">¡Bienvenido!</Text>
              <Text className="text-gray-600">Has iniciado sesión correctamente</Text>
            </View>
          </View>
          <Text className="text-gray-700">
            Esta es la aplicación móvil de TecnoRoute. Explora nuestras funcionalidades.
          </Text>
        </View>

        {/* Quick Actions */}
        <Text className="text-lg font-bold text-gray-800 mb-4">Acciones Rápidas</Text>

        <View className="flex-row flex-wrap justify-between">
          <TouchableOpacity className="bg-white rounded-2xl p-6 mb-4 shadow-md" style={{ width: '48%' }}>
            <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mb-3">
              <Ionicons name="cart" size={24} color="#10B981" />
            </View>
            <Text className="text-gray-800 font-bold mb-1">Productos</Text>
            <Text className="text-gray-600 text-xs">Ver catálogo</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-white rounded-2xl p-6 mb-4 shadow-md" style={{ width: '48%' }}>
            <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center mb-3">
              <Ionicons name="list" size={24} color="#8B5CF6" />
            </View>
            <Text className="text-gray-800 font-bold mb-1">Pedidos</Text>
            <Text className="text-gray-600 text-xs">Ver historial</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-white rounded-2xl p-6 mb-4 shadow-md" style={{ width: '48%' }}>
            <View className="w-12 h-12 bg-yellow-100 rounded-full items-center justify-center mb-3">
              <Ionicons name="person" size={24} color="#F59E0B" />
            </View>
            <Text className="text-gray-800 font-bold mb-1">Perfil</Text>
            <Text className="text-gray-600 text-xs">Editar datos</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-white rounded-2xl p-6 mb-4 shadow-md" style={{ width: '48%' }}>
            <View className="w-12 h-12 bg-red-100 rounded-full items-center justify-center mb-3">
              <Ionicons name="help-circle" size={24} color="#EF4444" />
            </View>
            <Text className="text-gray-800 font-bold mb-1">Ayuda</Text>
            <Text className="text-gray-600 text-xs">Soporte</Text>
          </TouchableOpacity>
        </View>

        {/* User Info Card */}
        <View className="bg-white rounded-2xl p-6 mt-4 mb-6 shadow-md">
          <Text className="text-lg font-bold text-gray-800 mb-4">Información de Usuario</Text>
          
          <View className="flex-row items-center mb-3">
            <Ionicons name="person-outline" size={20} color="#6B7280" />
            <Text className="ml-3 text-gray-700">Rol: <Text className="font-semibold">{user?.role}</Text></Text>
          </View>

          {user?.telefono && (
            <View className="flex-row items-center mb-3">
              <Ionicons name="call-outline" size={20} color="#6B7280" />
              <Text className="ml-3 text-gray-700">{user.telefono}</Text>
            </View>
          )}

          {user?.ciudad && (
            <View className="flex-row items-center mb-3">
              <Ionicons name="location-outline" size={20} color="#6B7280" />
              <Text className="ml-3 text-gray-700">{user.ciudad}</Text>
            </View>
          )}

          {user?.direccion && (
            <View className="flex-row items-center">
              <Ionicons name="home-outline" size={20} color="#6B7280" />
              <Text className="ml-3 text-gray-700 flex-1">{user.direccion}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
