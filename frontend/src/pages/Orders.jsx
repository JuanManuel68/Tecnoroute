import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button,
  Paper,
  Avatar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  LocalShipping as LocalShippingIcon,
  Person as PersonIcon,
  DirectionsCar as DirectionsCarIcon,
  Route as RouteIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { pedidosAPI } from '../services/apiService';

const Orders = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        
        if (isAdmin()) {
          // Si es admin, cargar todos los pedidos desde la API
          const response = await pedidosAPI.getAll();
          setOrders(response.data);
        } else {
          // Si es usuario normal, cargar desde localStorage
          const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
          const userOrders = allOrders.filter(order => 
            order.usuario && order.usuario.id === user?.id
          );
          setOrders(userOrders);
        }
      } catch (error) {
        console.error('Error loading orders:', error);
        // Fallback a localStorage si la API falla
        if (!isAdmin()) {
          const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
          const userOrders = allOrders.filter(order => 
            order.usuario && order.usuario.id === user?.id
          );
          setOrders(userOrders);
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadOrders();
    }
  }, [user, isAdmin]);

  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return { 
          label: 'Pendiente', 
          color: 'warning', 
          icon: <PendingIcon fontSize="small" /> 
        };
      case 'confirmed':
        return { 
          label: 'Confirmado', 
          color: 'info', 
          icon: <ScheduleIcon fontSize="small" /> 
        };
      case 'in_transit':
        return { 
          label: 'En Tránsito', 
          color: 'primary', 
          icon: <LocalShippingIcon fontSize="small" /> 
        };
      case 'delivered':
        return { 
          label: 'Entregado', 
          color: 'success', 
          icon: <CheckCircleIcon fontSize="small" /> 
        };
      case 'cancelled':
        return { 
          label: 'Cancelado', 
          color: 'error', 
          icon: <CancelIcon fontSize="small" /> 
        };
      default:
        return { 
          label: 'Confirmado', 
          color: 'info', 
          icon: <ScheduleIcon fontSize="small" /> 
        };
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const handleChangeOrderStatus = async (orderId, newStatus) => {
    try {
      await pedidosAPI.cambiarEstado(orderId, newStatus);
      // Recargar la lista de pedidos
      const response = await pedidosAPI.getAll();
      setOrders(response.data);
    } catch (error) {
      console.error('Error changing order status:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Cargando pedidos...
        </Typography>
      </Container>
    );
  }

  if (orders.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Box sx={{ py: 8 }}>
          <ReceiptIcon sx={{ fontSize: 100, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            No tienes pedidos aún
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            ¡Explora nuestra tienda y realiza tu primera compra!
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/productos')}
            sx={{ mt: 2 }}
          >
            Ir a Comprar
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <ReceiptIcon sx={{ mr: 2, fontSize: 40, color: 'primary.main' }} />
        <Typography variant="h4" component="h1">
          {isAdmin() ? `Gestión de Pedidos (${orders.length})` : `Mis Pedidos (${orders.length})`}
        </Typography>
      </Box>

      {/* Lista de pedidos */}
      <Grid container spacing={3}>
        {orders.map((order) => {
          const statusInfo = getStatusInfo(order.status || 'confirmed');
          
          return (
            <Grid item xs={12} key={order.numeroOrden}>
              <Card>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    {/* Información básica del pedido */}
                    <Grid item xs={12} sm={3}>
                      <Typography variant="h6" gutterBottom>
                        #{order.numero_pedido || order.numeroOrden}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(order.fecha_creacion || order.timestamp)}
                      </Typography>
                      {isAdmin() && (
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Cliente: {order.usuario?.username || order.usuario?.email || 'N/A'}
                        </Typography>
                      )}
                      <Chip
                        icon={statusInfo.icon}
                        label={statusInfo.label}
                        color={statusInfo.color}
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    </Grid>

                    {/* Productos */}
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2" gutterBottom>
                        Productos ({(order.productos || order.items || []).length})
                      </Typography>
                      <List dense>
                        {(order.productos || order.items || []).slice(0, 2).map((item, index) => (
                          <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                            <ListItemText
                              primary={
                                <Typography variant="body2">
                                  {item.nombre || item.producto?.nombre} x{item.quantity || item.cantidad}
                                </Typography>
                              }
                              secondary={formatCurrency((item.precio || item.precio_unitario || 0) * (item.quantity || item.cantidad || 1))}
                            />
                          </ListItem>
                        ))}
                        {(order.productos || order.items || []).length > 2 && (
                          <Typography variant="body2" color="text.secondary">
                            +{(order.productos || order.items || []).length - 2} productos más
                          </Typography>
                        )}
                      </List>
                    </Grid>

                    {/* Detalles del envío */}
                    <Grid item xs={12} sm={3}>
                      <Typography variant="subtitle2" gutterBottom>
                        Detalles del Envío
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <PersonIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {order.conductor?.nombre}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <DirectionsCarIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {order.vehiculo?.tipo}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <RouteIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {order.ruta?.nombre}
                        </Typography>
                      </Box>
                    </Grid>

                    {/* Total y acciones */}
                    <Grid item xs={12} sm={2}>
                      <Typography variant="h6" color="primary" gutterBottom>
                        {formatCurrency(order.total)}
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        fullWidth
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleViewOrder(order)}
                        sx={{ mb: 1 }}
                      >
                        Ver Detalles
                      </Button>
                      {isAdmin() && order.id && (
                        <Button
                          variant="contained"
                          size="small"
                          fullWidth
                          color="secondary"
                          onClick={() => {
                            const newStatus = order.estado === 'pendiente' ? 'confirmado' : 
                                            order.estado === 'confirmado' ? 'enviado' :
                                            order.estado === 'enviado' ? 'entregado' : 'pendiente';
                            handleChangeOrderStatus(order.id, newStatus);
                          }}
                        >
                          Cambiar Estado
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Dialog de detalles del pedido */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedOrder && (
          <>
            <DialogTitle>
              Detalles del Pedido #{selectedOrder.numeroOrden}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                {/* Información del pedido */}
                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Información del Pedido
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Fecha:</strong> {formatDate(selectedOrder.timestamp)}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Tipo de Servicio:</strong> {selectedOrder.tipoServicio}
                    </Typography>
                    {selectedOrder.fechaEntrega && (
                      <Typography variant="body2" gutterBottom>
                        <strong>Fecha de Entrega:</strong> {selectedOrder.fechaEntrega} {selectedOrder.horaEntrega}
                      </Typography>
                    )}
                    <Chip
                      icon={getStatusInfo(selectedOrder.status || 'confirmed').icon}
                      label={getStatusInfo(selectedOrder.status || 'confirmed').label}
                      color={getStatusInfo(selectedOrder.status || 'confirmed').color}
                      sx={{ mt: 1 }}
                    />
                  </Paper>
                </Grid>

                {/* Detalles del envío */}
                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Detalles del Envío
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>Conductor:</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 1, width: 32, height: 32 }}>
                          {selectedOrder.conductor?.nombre.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2">{selectedOrder.conductor?.nombre}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {selectedOrder.conductor?.telefono}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Typography variant="subtitle2" gutterBottom>Vehículo:</Typography>
                    <Typography variant="body2" gutterBottom>
                      {selectedOrder.vehiculo?.tipo} - {selectedOrder.vehiculo?.marca}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Placa: {selectedOrder.vehiculo?.placa}
                    </Typography>

                    <Typography variant="subtitle2" gutterBottom>Ruta:</Typography>
                    <Typography variant="body2">
                      {selectedOrder.ruta?.nombre}
                    </Typography>
                  </Paper>
                </Grid>

                {/* Productos */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Productos
                    </Typography>
                    <List>
                      {selectedOrder.productos.map((item, index) => (
                        <ListItem key={index} sx={{ px: 0 }}>
                          <ListItemText
                            primary={`${item.nombre} x${item.quantity}`}
                            secondary={`${item.marca} - ${item.categoria}`}
                          />
                          <Typography variant="body2">
                            {formatCurrency(item.precio * item.quantity)}
                          </Typography>
                        </ListItem>
                      ))}
                    </List>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="h6">Total:</Typography>
                      <Typography variant="h6" color="primary">
                        {formatCurrency(selectedOrder.total)}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>

                {/* Instrucciones especiales */}
                {selectedOrder.instruccionesEspeciales && (
                  <Grid item xs={12}>
                    <Alert severity="info">
                      <Typography variant="subtitle2" gutterBottom>
                        Instrucciones Especiales:
                      </Typography>
                      <Typography variant="body2">
                        {selectedOrder.instruccionesEspeciales}
                      </Typography>
                    </Alert>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>
                Cerrar
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default Orders;
