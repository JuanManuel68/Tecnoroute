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
  FormControl,
  Pagination
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
  const [currentPage, setCurrentPage] = useState(1); // 🔹 Página actual
  const itemsPerPage = 6; // 🔹 6 pedidos por página

  useEffect(() => {
    loadPedidos();
    loadConductores();
  }, []);

  const loadPedidos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await pedidosAPI.getAll();
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
      await loadPedidos();
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
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
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

  // 🔹 Paginación
  const totalPages = Math.ceil(pedidos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPedidos = pedidos.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} color="primary" />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Cargando pedidos...
        </Typography>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 4,
        background: 'linear-gradient(to bottom right, #e3f2fd, #bbdefb)',
        borderRadius: 3,
        boxShadow: 3,
        minHeight: '100vh'
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 4,
          backgroundColor: 'primary.main',
          color: 'white',
          borderRadius: 2,
          p: 2,
          boxShadow: 2
        }}
      >
        <ReceiptIcon sx={{ mr: 2, fontSize: 40 }} />
        <Typography variant="h4" component="h1" fontWeight="bold">
          Gestión de Pedidos ({pedidos.length})
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Tabla de pedidos */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          boxShadow: 4,
          overflow: 'hidden',
          mb: 2
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#2196f3' }}>
              {['Número', 'Cliente', 'Conductor', 'Fecha', 'Total', 'Items', 'Estado', 'Acciones'].map((header) => (
                <TableCell key={header} sx={{ color: 'white', fontWeight: 'bold' }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {currentPedidos.map((pedido) => (
              <TableRow
                key={pedido.id}
                hover
                sx={{
                  '&:hover': { backgroundColor: '#e3f2fd' }
                }}
              >
                <TableCell><strong>{pedido.numero_pedido}</strong></TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PersonIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body2">
                        {pedido.usuario_nombre || pedido.usuario?.username || 'N/A'}
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
                      <Typography variant="body2">{pedido.conductor.nombre}</Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      Sin asignar
                    </Typography>
                  )}
                </TableCell>
                <TableCell>{formatDate(pedido.fecha_creacion)}</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  {formatCurrency(pedido.total)}
                </TableCell>
                <TableCell>{pedido.items?.length || 0} productos</TableCell>
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

      {/* 🔹 Paginación */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}

      {/* Footer */}
      <Box
        sx={{
          mt: 6,
          py: 3,
          backgroundColor: '#0d47a1',
          color: 'white',
          textAlign: 'center',
          borderRadius: 1,
          boxShadow: 2
        }}
      >
        <Typography variant="body2">
          © {new Date().getFullYear()}{' '}
          <Box component="span" sx={{ fontWeight: 'bold' }}>
            TecnoRoute
          </Box>
          . Todos los derechos reservados.
        </Typography>
      </Box>
    </Container>
  );
};

export default PedidosAdmin;
