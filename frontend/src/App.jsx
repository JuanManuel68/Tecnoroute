import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/scrollbar.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ModernPublicNavbar from './components/ModernPublicNavbar';
import ModernNavbar from './components/ModernNavbar';
import Home from './pages/Home';
import ModernLogin from './pages/ModernLogin';
import ModernRegister from './pages/ModernRegister';
import ModernContact from './pages/ModernContact';
import ModernProducts from './pages/ModernProducts';
import ModernCart from './pages/ModernCart';
import ModernProfile from './pages/ModernProfile';
import ModernCheckout from './pages/ModernCheckout';
import ModernOrders from './pages/ModernOrders';
import OrdersDebug from './components/OrdersDebug';
import PedidosAdmin from './pages/PedidosAdmin';
import ModernDashboard from './pages/ModernDashboard';
import Clientes from './pages/Clientes';
import Conductores from './pages/Conductores';
import Vehiculos from './pages/Vehiculos';
import Envios from './pages/Envios';
import SeguimientoEnvio from './pages/SeguimientoEnvio';
import ConductorDashboard from './pages/ConductorDashboard';
import DriverOrders from './components/DriverOrders';
import ProductDetail from './pages/ProductDetail';
import ManualUsuario from './pages/ManualUsuario'; // ✅ Importación añadida
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const theme = createTheme({
  palette: {
    primary: {
      main: '#616161',
      dark: '#424242',
      light: '#9e9e9e',
    },
    secondary: {
      main: '#757575',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    h4: { fontWeight: 600 },
    h6: { fontWeight: 500 },
  },
});

const UserRoute = ({ children }) => {
  const { isAuthenticated, isUser, loading } = useAuth();
  if (loading) return <div>Cargando...</div>;
  if (!isAuthenticated) return <Navigate to="/login?type=user" replace />;
  return isUser() ? children : <Navigate to="/admin" replace />;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return <div>Cargando...</div>;
  if (!isAuthenticated) return <Navigate to="/login?type=admin" replace />;
  return isAdmin() ? children : <Navigate to="/productos" replace />;
};

const ConductorRoute = ({ children }) => {
  const { isAuthenticated, isConductor, loading } = useAuth();
  if (loading) return <div>Cargando...</div>;
  if (!isAuthenticated) return <Navigate to="/login?type=conductor" replace />;
  return isConductor() ? children : <Navigate to="/productos" replace />;
};

const AppContent = () => {
  const { isAuthenticated, isAdmin, isConductor, loading } = useAuth();
  if (loading) return <div>Cargando aplicación...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && (isAdmin() || isConductor()) ? (
        <ModernNavbar />
      ) : (
        <ModernPublicNavbar />
      )}

      <main className={`${isAuthenticated && (isAdmin() || isConductor()) ? 'pt-0' : 'pt-16'} min-h-screen`}>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<ModernContact />} />
          <Route path="/manual" element={<ManualUsuario />} /> {/* ✅ Ruta añadida */}
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate
                  to={
                    isAdmin()
                      ? '/admin/dashboard'
                      : isConductor()
                      ? '/conductor/dashboard'
                      : '/productos'
                  }
                  replace
                />
              ) : (
                <ModernLogin />
              )
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? (
                <Navigate
                  to={
                    isAdmin()
                      ? '/admin/dashboard'
                      : isConductor()
                      ? '/conductor/dashboard'
                      : '/productos'
                  }
                  replace
                />
              ) : (
                <ModernRegister />
              )
            }
          />

          {/* Usuario */}
          <Route path="/productos" element={<UserRoute><ModernProducts /></UserRoute>} />
          <Route path="/producto/:id" element={<UserRoute><ProductDetail /></UserRoute>} />
          <Route path="/cart" element={<UserRoute><ModernCart /></UserRoute>} />
          <Route path="/profile" element={<UserRoute><ModernProfile /></UserRoute>} />
          <Route path="/checkout" element={<UserRoute><ModernCheckout /></UserRoute>} />
          <Route path="/orders" element={<UserRoute><ModernOrders /></UserRoute>} />
          <Route path="/seguimiento" element={<UserRoute><SeguimientoEnvio /></UserRoute>} />
          <Route path="/debug-orders" element={<UserRoute><OrdersDebug /></UserRoute>} />

          {/* Conductor */}
          <Route path="/conductor/dashboard" element={<ConductorRoute><ConductorDashboard /></ConductorRoute>} />
          <Route path="/conductor/pedidos" element={<ConductorRoute><DriverOrders /></ConductorRoute>} />

          {/* Admin */}
          <Route path="/admin" element={<AdminRoute><Navigate to="/admin/dashboard" replace /></AdminRoute>} />
          <Route path="/admin/dashboard" element={<AdminRoute><ModernDashboard /></AdminRoute>} />
          <Route path="/admin/clientes" element={<AdminRoute><Clientes /></AdminRoute>} />
          <Route path="/admin/conductores" element={<AdminRoute><Conductores /></AdminRoute>} />
          <Route path="/admin/vehiculos" element={<AdminRoute><Vehiculos /></AdminRoute>} />
          <Route path="/admin/envios" element={<AdminRoute><Envios /></AdminRoute>} />
          <Route path="/admin/pedidos" element={<AdminRoute><PedidosAdmin /></AdminRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CartProvider>
          <Router>
            <AppContent />
            <ToastContainer position="top-right" autoClose={3000} />
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
