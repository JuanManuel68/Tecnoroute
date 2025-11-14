import React, { useState, useEffect } from 'react';
import {
  TruckIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  BanknotesIcon,
  CalendarDaysIcon,
  ArrowTrendingUpIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import {
  TruckIcon as TruckIconSolid,
  UsersIcon as UsersIconSolid,
  ClipboardDocumentListIcon as ClipboardIconSolid,
  BanknotesIcon as BanknotesIconSolid,
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
  const [bgPos, setBgPos] = useState(50);

  const handleMouseMove = (e) => {
    const y = e.clientY;
    const height = window.innerHeight;
    const pos = (y / height) * 100;
    setBgPos(pos);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        if (isAdmin()) {
          const [estadisticasPedidos, pedidosRecientesRes] = await Promise.all([
            pedidosAPI.getEstadisticas().catch(() => ({ data: {} })),
            pedidosAPI.getRecientes(10).catch(() => ({ data: [] })),
          ]);

          let totalClientes = 0, totalConductores = 0, totalVehiculos = 0;

          try { const clientesRes = await apiService.get('/api/clientes/'); totalClientes = Array.isArray(clientesRes.data) ? clientesRes.data.length : 0; } catch {}
          try { const conductoresRes = await apiService.get('/api/conductores/'); totalConductores = Array.isArray(conductoresRes.data) ? conductoresRes.data.length : 0; } catch {}
          try { const vehiculosRes = await apiService.get('/api/vehiculos/'); totalVehiculos = Array.isArray(vehiculosRes.data) ? vehiculosRes.data.length : 0; } catch {}

          setStats({
            totalClientes,
            totalConductores,
            totalVehiculos,
            totalRutas: 0,
            totalPedidos: estadisticasPedidos.data?.total_pedidos || 0,
            totalIngresos: estadisticasPedidos.data?.total_ingresos || 0,
            pedidosHoy: estadisticasPedidos.data?.pedidos_hoy || 0,
            pedidosSemana: estadisticasPedidos.data?.pedidos_semana || 0,
            pedidosMes: estadisticasPedidos.data?.pedidos_mes || 0,
            pedidosPendientes: estadisticasPedidos.data?.pedidos_pendientes || 0,
            pedidosConfirmados: estadisticasPedidos.data?.pedidos_confirmados || 0,
            pedidosEnviados: estadisticasPedidos.data?.pedidos_enviados || 0,
            pedidosEntregados: estadisticasPedidos.data?.pedidos_entregados || 0,
            pedidosCancelados: estadisticasPedidos.data?.pedidos_cancelados || 0,
            totalEnvios: 0,
            enviosPendientes: 0,
            enviosEnTransito: 0,
            enviosEntregados: 0,
          });

          setPedidosRecientes(Array.isArray(pedidosRecientesRes.data) ? pedidosRecientesRes.data : []);
        } else {
          const [clientesRes, conductoresRes, vehiculosRes, enviosRes, enviosPendientesRes, enviosTransitoRes] = await Promise.all([
            apiService.get('/api/clientes/'),
            apiService.get('/api/conductores/'),
            apiService.get('/api/vehiculos/'),
            apiService.get('/api/envios/'),
            apiService.get('/api/envios/pendientes/'),
            apiService.get('/api/envios/en_transito/'),
          ]);

          const enviosEntregados = enviosRes.data.filter(envio => envio.estado === 'entregado').length;

          setStats(prevStats => ({
            ...prevStats,
            totalClientes: clientesRes.data.length,
            totalConductores: conductoresRes.data.length,
            totalVehiculos: vehiculosRes.data.length,
            totalRutas: 0,
            totalEnvios: enviosRes.data.length,
            enviosPendientes: enviosPendientesRes.data.length,
            enviosEnTransito: enviosTransitoRes.data.length,
            enviosEntregados,
          }));

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

    if (user) fetchDashboardData();
  }, [user, isAdmin]);

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'pendiente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'en_transito': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'entregado': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelado': return 'bg-red-100 text-red-800 border-red-200';
      case 'confirmado': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'enviado': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(amount);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      <p className="mt-4">Cargando panel de control...</p>
    </div>
  );

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative flex min-h-screen items-start justify-center px-6 py-12 overflow-hidden"
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
      <div className="max-w-7xl w-full flex flex-col lg:flex-row gap-8">
        {/* Left Column: Stats */}
        <div className="flex flex-col space-y-6 lg:w-1/4">
          <div className="bg-white bg-opacity-80 p-6 rounded-xl shadow">
            <p className="text-gray-600 font-medium">Total de Pedidos</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalPedidos}</p>
          </div>
          <div className="bg-white bg-opacity-80 p-6 rounded-xl shadow">
            <p className="text-gray-600 font-medium">Ingresos Totales</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{formatCurrency(stats.totalIngresos)}</p>
          </div>
          <div className="bg-white bg-opacity-80 p-6 rounded-xl shadow">
            <p className="text-gray-600 font-medium">Pedidos Hoy</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pedidosHoy}</p>
          </div>
          <div className="bg-white bg-opacity-80 p-6 rounded-xl shadow">
            <p className="text-gray-600 font-medium">Pedidos Esta Semana</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pedidosSemana}</p>
          </div>
        </div>

        {/* Right Column: Pedidos Recientes + Resumen en tarjetas */}
        <div className="flex-1 flex gap-8">
          {/* Pedidos Recientes */}
          <div className="bg-white bg-opacity-80 p-6 rounded-xl shadow flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{isAdmin() ? 'Pedidos Recientes' : 'Envíos Recientes'}</h2>
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {isAdmin() ? (
                pedidosRecientes.length > 0 ? pedidosRecientes.map(p => (
                  <div key={p.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-semibold">{p.numero_pedido}</p>
                      <p className="text-sm text-gray-600">{p.usuario_email || 'Sin email'}</p>
                      <p className="text-xs text-gray-400">{new Date(p.fecha_creacion).toLocaleDateString('es-ES')}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getEstadoColor(p.estado)}`}>
                      {p.estado.toUpperCase()}
                    </span>
                  </div>
                )) : <p>No hay pedidos recientes</p>
              ) : (
                enviosRecientes.length > 0 ? enviosRecientes.map(e => (
                  <div key={e.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-semibold">{e.numero_guia} - {e.cliente_nombre}</p>
                      <p className="text-sm text-gray-600">{e.ruta_info}</p>
                      <p className="text-xs text-gray-400">{new Date(e.fecha_creacion).toLocaleDateString('es-ES')}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getEstadoColor(e.estado)}`}>
                      {e.estado.replace('_',' ').toUpperCase()}
                    </span>
                  </div>
                )) : <p>No hay envíos recientes</p>
              )}
            </div>
          </div>

          {/* Resumen de Pedidos */}
          <div className="flex flex-col space-y-4 w-72">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Resumen de Pedidos</h3>
            <div className="bg-white bg-opacity-80 p-4 rounded-xl shadow flex items-center gap-3">
              <ClipboardIconSolid className="w-6 h-6 text-blue-600" />
              <p className="font-semibold">Total Pedidos: {stats.totalPedidos}</p>
            </div>
            <div className="bg-white bg-opacity-80 p-4 rounded-xl shadow flex items-center gap-3">
              <BanknotesIconSolid className="w-6 h-6 text-green-600" />
              <p className="font-semibold">Ingresos Totales: {formatCurrency(stats.totalIngresos)}</p>
            </div>
            <div className="bg-white bg-opacity-80 p-4 rounded-xl shadow flex items-center gap-3">
              <CalendarDaysIcon className="w-6 h-6 text-orange-600" />
              <p className="font-semibold">Pedidos Hoy: {stats.pedidosHoy}</p>
            </div>
            <div className="bg-white bg-opacity-80 p-4 rounded-xl shadow flex items-center gap-3">
              <ArrowTrendingUpIcon className="w-6 h-6 text-purple-600" />
              <p className="font-semibold">Pedidos Esta Semana: {stats.pedidosSemana}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernDashboard;
