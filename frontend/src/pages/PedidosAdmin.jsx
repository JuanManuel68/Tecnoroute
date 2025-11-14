import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
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
  CircularProgress,
  Alert,
  MenuItem,
  Select,
  FormControl,
  Chip,
  Pagination,
  InputLabel
} from '@mui/material';

import {
  Receipt as ReceiptIcon,
  Person as PersonIcon,
  Visibility as VisibilityIcon,
  AssignmentInd as AssignmentIndIcon,
  LocalShipping as LocalShippingIcon
} from '@mui/icons-material';

import { pedidosAPI, conductoresAPI } from '../services/apiService';

// Estilo para botones grises
const buttonGrayStyles = {
  backgroundColor: '#bdbdbd !important',
  color: '#212121 !important',
  borderColor: '#9e9e9e !important',
  fontWeight: 'bold'
};

const PedidosAdmin = () => {
  const [pedidos, setPedidos] = useState([]);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dialog asignar conductor
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [pedidoToAssign, setPedidoToAssign] = useState(null);
  const [conductores, setConductores] = useState([]);
  const [selectedConductor, setSelectedConductor] = useState('');

  // paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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
    } catch (err) {
      setError('Error cargando pedidos: ' + (err.message || ''));
    } finally {
      setLoading(false);
    }
  };

  const loadConductores = async () => {
    try {
      const response = await conductoresAPI.getAll();
      const disponibles = (response.data || []).filter(
        c => c.activo && c.estado === 'disponible'
      );
      setConductores(disponibles);
    } catch (err) {
      console.error('Error cargando conductores:', err);
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
      setError('Por favor selecciona un conductor.');
      return;
    }

    try {
      await pedidosAPI.asignarConductor(pedidoToAssign.id, selectedConductor);
      setOpenAssignDialog(false);
      setPedidoToAssign(null);
      setSelectedConductor('');

      await loadPedidos();
      await loadConductores();
    } catch (err) {
      setError('Error asignando conductor: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleChangeEstado = async (pedido, nuevoEstado) => {
    try {
      if (nuevoEstado === 'enviado' && !pedido.conductor) {
        handleOpenAssignDialog(pedido);
        return;
      }

      await pedidosAPI.cambiarEstado(pedido.id, nuevoEstado);
      await loadPedidos();
    } catch (err) {
      setError('Error cambiando estado: ' + (err.message || ''));
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'pendiente': return 'warning';
      case 'confirmado': return 'info';
      case 'enviado': return 'primary';
      case 'entregado': return 'success';
      case 'cancelado': return 'error';
      default: return 'default';
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

  const totalPages = Math.ceil(pedidos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPedidos = pedidos.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (e, v) => setCurrentPage(v);

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <CircularProgress size={60} />
        <Typography mt={2}>Cargando pedidos...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        p: 3,
        background: 'linear-gradient(135deg, #1e3a8a, #6b21a8, #fb923c)',
        backgroundSize: 'cover'
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 4,
          backgroundColor: 'rgba(0,0,0,0.3)',
          p: 2,
          borderRadius: 2,
          color: 'white',
          backdropFilter: 'blur(4px)'
        }}>
          <ReceiptIcon sx={{ mr: 2, fontSize: 40 }} />
          <Typography variant="h4" fontWeight="bold">
            Gestión de Pedidos ({pedidos.length})
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {/* TABLA DE PEDIDOS */}
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 4 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#0d47a1' }}>
                {['Número', 'Cliente', 'Conductor', 'Fecha', 'Total', 'Items', 'Estado', 'Acciones']
                  .map(h => (
                    <TableCell key={h} sx={{ color: 'white', fontWeight: 'bold' }}>{h}</TableCell>
                  ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {currentPedidos.map(pedido => (
                <TableRow key={pedido.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                  <TableCell><strong>{pedido.numero_pedido}</strong></TableCell>

                  {/* Cliente */}
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PersonIcon fontSize="small" sx={{ mr: 1 }} />
                      <Box>
                        <Typography variant="body2">{pedido.usuario_nombre || pedido.usuario?.username}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {pedido.usuario?.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Conductor */}
                  <TableCell>
                    {pedido.conductor ? (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocalShippingIcon fontSize="small" sx={{ mr: 1, color: 'success.main' }} />
                        <Typography>{pedido.conductor.nombre}</Typography>
                      </Box>
                    ) : (
                      <Typography sx={{ fontStyle: 'italic' }} color="text.secondary">
                        Sin asignar
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell>{formatDate(pedido.fecha_creacion)}</TableCell>

                  <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    {formatCurrency(pedido.total)}
                  </TableCell>

                  <TableCell>{pedido.items?.length || 0} productos</TableCell>

                  {/* Estado */}
                  <TableCell>
                    <Chip
                      label={pedido.estado?.toUpperCase()}
                      color={getEstadoColor(pedido.estado)}
                      size="small"
                    />
                  </TableCell>

                  {/* Acciones */}
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {/* VER */}
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<VisibilityIcon />}
                        sx={buttonGrayStyles}
                        onClick={() => handleViewPedido(pedido)}
                      >
                        Ver
                      </Button>

                      {/* ASIGNAR */}
                      {!pedido.conductor && pedido.estado !== 'cancelado' && pedido.estado !== 'entregado' && (
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<AssignmentIndIcon />}
                          sx={buttonGrayStyles}
                          onClick={() => handleOpenAssignDialog(pedido)}
                        >
                          Asignar
                        </Button>
                      )}

                      {/* CAMBIAR ESTADO */}
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel id={`estado-${pedido.id}`}>Estado</InputLabel>
                        <Select
                          labelId={`estado-${pedido.id}`}
                          value={pedido.estado}
                          label="Estado"
                          onChange={(e) => handleChangeEstado(pedido, e.target.value)}
                          sx={{ ...buttonGrayStyles, backgroundColor: '#e0e0e0 !important' }}
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

        {/* Paginación */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
            />
          </Box>
        )}

        {/* DIALOG DETALLE / VER */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="md">
          <DialogTitle>Detalle del Pedido</DialogTitle>
          <DialogContent dividers>
            {selectedPedido ? (
              <Box>
                <Typography><strong>Número:</strong> {selectedPedido.numero_pedido}</Typography>
                <Typography><strong>Cliente:</strong> {selectedPedido.usuario_nombre}</Typography>
                <Typography><strong>Email:</strong> {selectedPedido.usuario?.email}</Typography>
                <Typography><strong>Fecha:</strong> {formatDate(selectedPedido.fecha_creacion)}</Typography>
                <Typography><strong>Estado:</strong> {selectedPedido.estado}</Typography>
                <Typography><strong>Total:</strong> {formatCurrency(selectedPedido.total)}</Typography>

                <Box mt={2}>
                  <Typography variant="h6">Productos:</Typography>
                  {selectedPedido.items?.map((item, i) => (
                    <Box key={i} sx={{ border: '1px solid #ccc', p: 1, my: 1, borderRadius: 1 }}>
                      <Typography><strong>{item.nombre}</strong></Typography>
                      <Typography>Cantidad: {item.cantidad}</Typography>
                      <Typography>Precio: {formatCurrency(item.precio)}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            ) : (
              <Typography>No hay datos</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cerrar</Button>
          </DialogActions>
        </Dialog>

        {/* DIALOG ASIGNAR CONDUCTOR */}
        <Dialog open={openAssignDialog} onClose={() => setOpenAssignDialog(false)} fullWidth maxWidth="sm">
          <DialogTitle>Asignar conductor</DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 2 }}>
              Pedido: <strong>{pedidoToAssign?.numero_pedido}</strong>
            </Typography>

            <FormControl fullWidth>
              <InputLabel>Conductor disponible</InputLabel>
              <Select
                value={selectedConductor}
                label="Conductor disponible"
                onChange={(e) => setSelectedConductor(e.target.value)}
              >
                {conductores.length === 0 && (
                  <MenuItem disabled>No hay conductores disponibles</MenuItem>
                )}

                {conductores.map(c => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.nombre} {c.placa ? ` - ${c.placa}` : ''}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setOpenAssignDialog(false)}>Cancelar</Button>
            <Button
              onClick={handleAssignConductor}
              disabled={!selectedConductor}
              sx={buttonGrayStyles}
            >
              Asignar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Footer */}
        <Box sx={{
          mt: 6, py: 3, backgroundColor: '#0d47a1',
          color: 'white', textAlign: 'center',
          borderRadius: 1, boxShadow: 2
        }}>
          <Typography variant="body2">
            © {new Date().getFullYear()} <strong>TecnoRoute</strong>. Todos los derechos reservados.
          </Typography>
        </Box>

      </Container>
    </Box>
  );
};

export default PedidosAdmin;
