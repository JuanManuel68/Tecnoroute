import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  MenuItem,
  Select,
  FormControl
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  Person as PersonIcon,
  Visibility as VisibilityIcon,
  AssignmentInd as AssignmentIndIcon,
  LocalShipping as LocalShippingIcon
} from '@mui/icons-material';
import { pedidosAPI, conductoresAPI } from '../services/apiService';

const PedidosAdmin = () => {
  const [pedidos, setPedidos] = useState([]);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [pedidoToAssign, setPedidoToAssign] = useState(null);
  const [conductores, setConductores] = useState([]);
  const [selectedConductor, setSelectedConductor] = useState('');

  useEffect(() => {
    loadPedidos();
    loadConductores();
  }, []);

  const loadPedidos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await pedidosAPI.getAll();
      console.log('Pedidos cargados:', response.data);
      setPedidos(response.data || []);
    } catch (error) {
      console.error('Error cargando pedidos:', error);
      setError('Error cargando pedidos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const loadConductores = async () => {
    try {
      const response = await conductoresAPI.getAll();
      // Filtrar solo conductores disponibles y activos
      const conductoresDisponibles = response.data.filter(c => c.activo && c.estado === 'disponible');
      setConductores(conductoresDisponibles);
    } catch (error) {
      console.error('Error cargando conductores:', error);
    }
  };

  const handleViewPedido = (pedido) => {
    setSelectedPedido(pedido);
    setOpenDialog(true);
  };
  
  const handleOpenAssignDialog = (pedido) => {
    setPedidoToAssign(pedido);
    setSelectedConductor('');
    setOpenAssignDialog(true);
  };
  
  const handleAssignConductor = async () => {
    if (!selectedConductor) {
      setError('Por favor selecciona un conductor');
      return;
    }
    
    try {
      const response = await pedidosAPI.asignarConductor(pedidoToAssign.id, selectedConductor);
      setOpenAssignDialog(false);
      await loadPedidos();
      alert(response.data.message || 'Conductor asignado exitosamente');
    } catch (error) {
      console.error('Error asignando conductor:', error);
      setError('Error asignando conductor: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleChangeEstado = async (pedidoId, nuevoEstado) => {
    try {
      await pedidosAPI.cambiarEstado(pedidoId, nuevoEstado);
      await loadPedidos(); // Recargar la lista
    } catch (error) {
      console.error('Error cambiando estado:', error);
      setError('Error cambiando estado del pedido');
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'pendiente':
        return 'warning';
      case 'confirmado':
        return 'info';
      case 'enviado':
        return 'primary';
      case 'entregado':
        return 'success';
      case 'cancelado':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Cargando pedidos...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <ReceiptIcon sx={{ mr: 2, fontSize: 40, color: 'primary.main' }} />
        <Typography variant="h4" component="h1">
          Gestión de Pedidos ({pedidos.length})
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Tabla de pedidos */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Número</strong></TableCell>
              <TableCell><strong>Cliente</strong></TableCell>
              <TableCell><strong>Conductor</strong></TableCell>
              <TableCell><strong>Fecha</strong></TableCell>
              <TableCell><strong>Total</strong></TableCell>
              <TableCell><strong>Items</strong></TableCell>
              <TableCell><strong>Estado</strong></TableCell>
              <TableCell><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pedidos.map((pedido) => (
              <TableRow key={pedido.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    {pedido.numero_pedido}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PersonIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body2">
                        {pedido.usuario_nombre || pedido.usuario?.get_full_name || `${pedido.usuario?.first_name || ''} ${pedido.usuario?.last_name || ''}`.trim() || pedido.usuario?.username || 'N/A'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {pedido.usuario?.email || 'Sin email'}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  {pedido.conductor ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocalShippingIcon fontSize="small" sx={{ mr: 1, color: 'success.main' }} />
                      <Typography variant="body2">
                        {pedido.conductor.nombre}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      Sin asignar
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(pedido.fecha_creacion)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold" color="primary">
                    {formatCurrency(pedido.total)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {pedido.items?.length || 0} productos
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={pedido.estado.toUpperCase()}
                    color={getEstadoColor(pedido.estado)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleViewPedido(pedido)}
                    >
                      Ver
                    </Button>
                    {!pedido.conductor && pedido.estado !== 'cancelado' && pedido.estado !== 'entregado' && (
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        startIcon={<AssignmentIndIcon />}
                        onClick={() => handleOpenAssignDialog(pedido)}
                      >
                        Asignar
                      </Button>
                    )}
                    <FormControl size="small" sx={{ minWidth: 100 }}>
                      <Select
                        value={pedido.estado}
                        onChange={(e) => handleChangeEstado(pedido.id, e.target.value)}
                        variant="outlined"
                        size="small"
                      >
                        <MenuItem value="pendiente">Pendiente</MenuItem>
                        <MenuItem value="confirmado">Confirmado</MenuItem>
                        <MenuItem value="enviado">Enviado</MenuItem>
                        <MenuItem value="entregado">Entregado</MenuItem>
                        <MenuItem value="cancelado">Cancelado</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {pedidos.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <ReceiptIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No se encontraron pedidos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Los pedidos realizados aparecerán aquí
          </Typography>
        </Box>
      )}

      {/* Dialog de detalles del pedido */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedPedido && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ReceiptIcon sx={{ mr: 1 }} />
                Detalles del Pedido {selectedPedido.numero_pedido}
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                {/* Información del pedido */}
                <Grid item xs={12} sm={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Información del Pedido
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>Número:</strong> {selectedPedido.numero_pedido}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>Fecha:</strong> {formatDate(selectedPedido.fecha_creacion)}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>Total:</strong> {formatCurrency(selectedPedido.total)}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>Estado:</strong> 
                        <Chip
                          label={selectedPedido.estado.toUpperCase()}
                          color={getEstadoColor(selectedPedido.estado)}
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Información del cliente */}
                <Grid item xs={12} sm={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Información del Cliente
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>Cliente:</strong> {selectedPedido.usuario_nombre || selectedPedido.usuario?.get_full_name || `${selectedPedido.usuario?.first_name || ''} ${selectedPedido.usuario?.last_name || ''}`.trim() || selectedPedido.usuario?.username || 'N/A'}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>Email:</strong> {selectedPedido.usuario?.email || 'Sin email'}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>Teléfono:</strong> {selectedPedido.telefono_contacto}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>Dirección:</strong> {selectedPedido.direccion_envio}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Items del pedido */}
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Productos Pedidos
                      </Typography>
                      <List>
                        {selectedPedido.items?.map((item, index) => (
                          <ListItem key={index} divider>
                            <ListItemText
                              primary={item.producto_nombre || `Producto ID: ${item.producto}`}
                              secondary={`Cantidad: ${item.cantidad} × ${formatCurrency(item.precio_unitario)}`}
                            />
                            <Typography variant="body2" fontWeight="bold">
                              {formatCurrency(item.subtotal)}
                            </Typography>
                          </ListItem>
                        ))}
                      </List>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                        <Typography variant="h6">Total:</Typography>
                        <Typography variant="h6" color="primary">
                          {formatCurrency(selectedPedido.total)}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Notas */}
                {selectedPedido.notas && (
                  <Grid item xs={12}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Notas Especiales
                        </Typography>
                        <Typography variant="body2">
                          {selectedPedido.notas}
                        </Typography>
                      </CardContent>
                    </Card>
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
      
      {/* Dialog para asignar conductor */}
      <Dialog
        open={openAssignDialog}
        onClose={() => setOpenAssignDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AssignmentIndIcon sx={{ mr: 1 }} />
            Asignar Conductor al Pedido
          </Box>
        </DialogTitle>
        <DialogContent>
          {pedidoToAssign && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" gutterBottom>
                <strong>Pedido:</strong> {pedidoToAssign.numero_pedido}
              </Typography>
              <Typography variant="body2" gutterBottom sx={{ mb: 3 }}>
                <strong>Dirección:</strong> {pedidoToAssign.direccion_envio}
              </Typography>
              
              {conductores.length === 0 ? (
                <Alert severity="warning">
                  No hay conductores disponibles en este momento
                </Alert>
              ) : (
                <FormControl fullWidth>
                  <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Selecciona un conductor:
                  </Typography>
                  <Select
                    value={selectedConductor}
                    onChange={(e) => setSelectedConductor(e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      Selecciona un conductor...
                    </MenuItem>
                    {conductores.map((conductor) => (
                      <MenuItem key={conductor.id} value={conductor.id}>
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          <PersonIcon fontSize="small" sx={{ mr: 1 }} />
                          <Box>
                            <Typography variant="body2">{conductor.nombre}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              Licencia: {conductor.licencia} | Tel: {conductor.telefono}
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAssignDialog(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleAssignConductor} 
            variant="contained"
            disabled={!selectedConductor || conductores.length === 0}
            startIcon={<AssignmentIndIcon />}
          >
            Asignar Conductor
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Footer */}
      <footer className="py-6 bg-gray-900 text-white text-center mt-8">
        <Typography variant="body2">
          © {new Date().getFullYear()}{' '}
          <Box component="span" sx={{ fontWeight: 'bold' }}>
            TecnoRoute
          </Box>
          . Todos los derechos reservados.
        </Typography>
      </footer>
    </Container>
  );
};

export default PedidosAdmin;
