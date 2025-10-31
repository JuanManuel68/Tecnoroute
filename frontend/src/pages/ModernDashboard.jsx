import React, { useState, useEffect } from 'react';
import {
  TruckIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  MapPinIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  BanknotesIcon,
  CalendarDaysIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import {
  TruckIcon as TruckIconSolid,
  UsersIcon as UsersIconSolid,
  ClipboardDocumentListIcon as ClipboardIconSolid,
  ChartBarIcon as ChartBarIconSolid
} from '@heroicons/react/24/solid';
import apiService, { pedidosAPI } from '../services/apiService';
import { useAuth } from '../context/AuthContext';

const ModernDashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalClientes: 0,
    totalConductores: 0,
    totalVehiculos: 0,
    totalRutas: 0,
    totalEnvios: 0,
    enviosPendientes: 0,
    enviosEnTransito: 0,
    enviosEntregados: 0,
    // Stats para pedidos (admin)
    totalPedidos: 0,
    totalIngresos: 0,
    pedidosHoy: 0,
    pedidosSemana: 0,
    pedidosMes: 0,
    pedidosPendientes: 0,
    pedidosConfirmados: 0,
    pedidosEnviados: 0,
    pedidosEntregados: 0,
    pedidosCancelados: 0,
  });
  const [loading, setLoading] = useState(true);
  const [enviosRecientes, setEnviosRecientes] = useState([]);
  const [pedidosRecientes, setPedidosRecientes] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        if (isAdmin()) {
          // Si es admin, cargar datos de pedidos
          try {
            const [
              estadisticasPedidos,
              pedidosRecientesRes,
              clientesRes,
              conductoresRes,
              vehiculosRes,
              rutasRes,
            ] = await Promise.all([
              pedidosAPI.getEstadisticas(),
              pedidosAPI.getRecientes(10),
              apiService.get('/api/clientes/'),
              apiService.get('/api/conductores/'),
              apiService.get('/api/vehiculos/'),
              apiService.get('/api/rutas/'),
            ]);

            setStats({
              // Datos básicos de logística
              totalClientes: clientesRes.data.length,
              totalConductores: conductoresRes.data.length,
              totalVehiculos: vehiculosRes.data.length,
              totalRutas: rutasRes.data.length,
              // Datos de pedidos
              totalPedidos: estadisticasPedidos.data.total_pedidos || 0,
              totalIngresos: estadisticasPedidos.data.total_ingresos || 0,
              pedidosHoy: estadisticasPedidos.data.pedidos_hoy || 0,
              pedidosSemana: estadisticasPedidos.data.pedidos_semana || 0,
              pedidosMes: estadisticasPedidos.data.pedidos_mes || 0,
              pedidosPendientes: estadisticasPedidos.data.pedidos_pendientes || 0,
              pedidosConfirmados: estadisticasPedidos.data.pedidos_confirmados || 0,
              pedidosEnviados: estadisticasPedidos.data.pedidos_enviados || 0,
              pedidosEntregados: estadisticasPedidos.data.pedidos_entregados || 0,
              pedidosCancelados: estadisticasPedidos.data.pedidos_cancelados || 0,
              // Reset envios stats for admin
              totalEnvios: 0,
              enviosPendientes: 0,
              enviosEnTransito: 0,
              enviosEntregados: 0,
            });

            setPedidosRecientes(pedidosRecientesRes.data || []);
          } catch (adminError) {
            console.error('Error cargando datos de admin:', adminError);
            // Fallback básico
            setStats({
              totalClientes: 0,
              totalConductores: 0,
              totalVehiculos: 0,
              totalRutas: 0,
              totalPedidos: 0,
              totalIngresos: 0,
              pedidosHoy: 0,
              pedidosSemana: 0,
              pedidosMes: 0,
              pedidosPendientes: 0,
              pedidosConfirmados: 0,
              pedidosEnviados: 0,
              pedidosEntregados: 0,
              pedidosCancelados: 0,
              totalEnvios: 0,
              enviosPendientes: 0,
              enviosEnTransito: 0,
              enviosEntregados: 0,
            });
          }
        } else {
          // Si no es admin, cargar datos de envíos
          const [
            clientesRes,
            conductoresRes,
            vehiculosRes,
            rutasRes,
            enviosRes,
            enviosPendientesRes,
            enviosTransitoRes,
          ] = await Promise.all([
            apiService.get('/api/clientes/'),
            apiService.get('/api/conductores/'),
            apiService.get('/api/vehiculos/'),
            apiService.get('/api/rutas/'),
            apiService.get('/api/envios/'),
            apiService.get('/api/envios/pendientes/'),
            apiService.get('/api/envios/en_transito/'),
          ]);

          // Calculate delivered shipments
          const enviosEntregados = enviosRes.data.filter(envio => envio.estado === 'entregado').length;

          setStats(prevStats => ({
            ...prevStats,
            totalClientes: clientesRes.data.length,
            totalConductores: conductoresRes.data.length,
            totalVehiculos: vehiculosRes.data.length,
            totalRutas: rutasRes.data.length,
            totalEnvios: enviosRes.data.length,
            enviosPendientes: enviosPendientesRes.data.length,
            enviosEnTransito: enviosTransitoRes.data.length,
            enviosEntregados: enviosEntregados,
          }));

          // Get recent shipments (last 10)
          const enviosOrdenados = enviosRes.data
            .sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion))
            .slice(0, 10);
          setEnviosRecientes(enviosOrdenados);
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user, isAdmin]);

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'en_transito':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'entregado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelado':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'confirmado':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'enviado':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const statCards = isAdmin() ? [
    // Tarjetas para Admin (Pedidos)
    {
      title: 'Total de Pedidos',
      value: stats.totalPedidos,
      icon: ClipboardIconSolid,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      title: 'Ingresos Totales',
      value: formatCurrency(stats.totalIngresos),
      icon: BanknotesIcon,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
    {
      title: 'Pedidos Hoy',
      value: stats.pedidosHoy,
      icon: CalendarDaysIcon,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
    },
    {
      title: 'Pedidos Esta Semana',
      value: stats.pedidosSemana,
      icon: ArrowTrendingUpIcon,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
    },
  ] : [
    // Tarjetas para otros usuarios (Envíos)
    {
      title: 'Total de Clientes',
      value: stats.totalClientes,
      icon: UsersIconSolid,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      title: 'Conductores Activos',
      value: stats.totalConductores,
      icon: UsersIcon,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
    {
      title: 'Vehículos Disponibles',
      value: stats.totalVehiculos,
      icon: TruckIconSolid,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
    },
    {
      title: 'Total de Envíos',
      value: stats.totalEnvios,
      icon: ClipboardIconSolid,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-700',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Cargando panel de control...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Panel de Control</h1>
              <p className="text-gray-600 mt-1">Bienvenido de nuevo, {user?.name || 'Administrador'}</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="bg-white rounded-lg px-4 py-2 shadow-sm border">
                <p className="text-sm text-gray-500">Última actualización</p>
                <p className="font-semibold text-gray-900">
                  {new Date().toLocaleString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <div 
                key={index}
                className="card p-6 hover:shadow-xl transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {card.title}
                    </p>
                    <p className={`text-3xl font-bold ${card.textColor} group-hover:scale-105 transition-transform duration-200`}>
                      {card.value}
                    </p>
                  </div>
                  <div className={`${card.bgColor} p-4 rounded-xl group-hover:scale-110 transition-transform duration-200`}>
                    <IconComponent className={`w-8 h-8 ${card.textColor}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Items */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <ChartBarIconSolid className="w-6 h-6 text-primary-600" />
                  {isAdmin() ? 'Pedidos Recientes' : 'Envíos Recientes'}
                </h2>
                <button className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1">
                  <EyeIcon className="w-4 h-4" />
                  Ver todos
                </button>
              </div>
              
              <div className="space-y-4">
                {isAdmin() ? (
                  // Mostrar pedidos recientes para admin
                  pedidosRecientes.length > 0 ? (
                    pedidosRecientes.map((pedido) => (
                      <div key={pedido.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="bg-primary-100 p-3 rounded-lg">
                            <ClipboardDocumentListIcon className="w-5 h-5 text-primary-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {pedido.numero_pedido}
                            </p>
                            <p className="text-sm text-gray-600">
                              {pedido.usuario_email || pedido.usuario?.email || 'Sin email'}
                            </p>
                            <p className="text-sm text-gray-500">
                              Total: {formatCurrency(pedido.total)} • {pedido.items?.length || 0} productos
                            </p>
                            <p className="text-xs text-gray-400">
                              {new Date(pedido.fecha_creacion).toLocaleDateString('es-ES')}
                            </p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getEstadoColor(pedido.estado)}`}>
                          {pedido.estado.toUpperCase()}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <ClipboardDocumentListIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No hay pedidos recientes para mostrar.</p>
                    </div>
                  )
                ) : (
                  // Mostrar envíos recientes para otros usuarios
                  enviosRecientes.length > 0 ? (
                    enviosRecientes.map((envio) => (
                      <div key={envio.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="bg-blue-100 p-3 rounded-lg">
                            <TruckIcon className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {envio.numero_guia} - {envio.cliente_nombre}
                            </p>
                            <p className="text-sm text-gray-500">
                              {envio.ruta_info} • {envio.descripcion_carga}
                            </p>
                            <p className="text-xs text-gray-400">
                              {new Date(envio.fecha_creacion).toLocaleDateString('es-ES')}
                            </p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getEstadoColor(envio.estado)}`}>
                          {envio.estado.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <TruckIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No hay envíos recientes para mostrar.</p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Summary Panel */}
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Resumen de Operaciones</h3>
              
              {isAdmin() ? (
                // Resumen para admin (Pedidos)
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Estado del Sistema:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ingresos totales:</span>
                        <span className="font-semibold text-green-600">{formatCurrency(stats.totalIngresos)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pedidos registrados:</span>
                        <span className="font-semibold">{stats.totalPedidos}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pedidos hoy:</span>
                        <span className="font-semibold text-blue-600">{stats.pedidosHoy}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pedidos este mes:</span>
                        <span className="font-semibold">{stats.pedidosMes}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-800 mb-3">Estado de Pedidos:</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                          <span className="text-sm text-gray-600">Pendientes</span>
                        </div>
                        <span className="font-semibold text-yellow-600">{stats.pedidosPendientes}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                          <span className="text-sm text-gray-600">Confirmados</span>
                        </div>
                        <span className="font-semibold text-blue-600">{stats.pedidosConfirmados}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-indigo-400 rounded-full"></div>
                          <span className="text-sm text-gray-600">Enviados</span>
                        </div>
                        <span className="font-semibold text-indigo-600">{stats.pedidosEnviados}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                          <span className="text-sm text-gray-600">Entregados</span>
                        </div>
                        <span className="font-semibold text-green-600">{stats.pedidosEntregados}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Resumen para otros usuarios (Envíos)
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Estado del Sistema:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Clientes registrados:</span>
                        <span className="font-semibold">{stats.totalClientes}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Conductores disponibles:</span>
                        <span className="font-semibold text-green-600">{stats.totalConductores}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Vehículos en flota:</span>
                        <span className="font-semibold text-orange-600">{stats.totalVehiculos}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rutas configuradas:</span>
                        <span className="font-semibold">{stats.totalRutas}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-800 mb-3">Envíos del Día:</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                          <span className="text-sm text-gray-600">Pendientes</span>
                        </div>
                        <span className="font-semibold text-yellow-600">{stats.enviosPendientes}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                          <span className="text-sm text-gray-600">En tránsito</span>
                        </div>
                        <span className="font-semibold text-blue-600">{stats.enviosEnTransito}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                          <span className="text-sm text-gray-600">Entregados</span>
                        </div>
                        <span className="font-semibold text-green-600">{stats.enviosEntregados}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            
              </div>
            </div>
          </div>
        </div>

  );
};

export default ModernDashboard;