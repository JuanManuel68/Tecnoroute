import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { pedidosAPI } from '../services/apiService';

const OrdersDebug = () => {
  const { user } = useAuth();
  const [debugInfo, setDebugInfo] = useState('');
  const [orders, setOrders] = useState([]);

  const testAPI = async () => {
    let info = `=== DEBUG INFO ===\n`;
    info += `Usuario: ${JSON.stringify(user, null, 2)}\n`;
    info += `Token: ${localStorage.getItem('authToken')}\n`;
    
    try {
      const response = await pedidosAPI.getAll();
      info += `Respuesta API:\n${JSON.stringify(response.data, null, 2)}\n`;
      setOrders(response.data || []);
    } catch (error) {
      info += `Error API: ${error.message}\n`;
      info += `Error Response: ${JSON.stringify(error.response?.data, null, 2)}\n`;
    }
    
    setDebugInfo(info);
  };

  useEffect(() => {
    if (user) {
      testAPI();
    }
  }, [user]);

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Debug Orders</h1>
      
      <button 
        onClick={testAPI}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Probar API de Pedidos
      </button>
      
      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="font-bold mb-2">Información de Debug:</h2>
        <pre className="whitespace-pre-wrap text-sm">
          {debugInfo}
        </pre>
      </div>
      
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-bold mb-2">Pedidos encontrados: {orders.length}</h2>
        {orders.map((order, index) => (
          <div key={index} className="border-b pb-2 mb-2">
            <p><strong>ID:</strong> {order.id}</p>
            <p><strong>Número:</strong> {order.numero_pedido}</p>
            <p><strong>Usuario ID:</strong> {order.usuario_id}</p>
            <p><strong>Total:</strong> ${order.total}</p>
            <p><strong>Items:</strong> {order.items?.length || 0}</p>
            <p><strong>JSON completo:</strong></p>
            <pre className="text-xs bg-gray-100 p-2 rounded">
              {JSON.stringify(order, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersDebug;