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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Grid,
  CircularProgress,
  Alert,
  InputAdornment,
  Card,
  CardContent
} from '@mui/material';
import {
  LocalShipping as LocalShippingIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  LocationOn as LocationOnIcon,
  AttachMoney as AttachMoneyIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { enviosAPI, clientesAPI, vehiculosAPI, conductoresAPI, pedidosAPI } from '../services/apiService';

const Envios = () => {
  const [envios, setEnvios] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [conductores, setConductores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedEnvio, setSelectedEnvio] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    numero_guia: '',
    cliente: '',
    ruta: '',
    vehiculo: '',
    conductor: '',
    descripcion_carga: '',
    peso_kg: '',
    volumen_m3: '',
    direccion_recogida: '',
    direccion_entrega: '',
    contacto_recogida: '',
    contacto_entrega: '',
    telefono_recogida: '',
    telefono_entrega: '',
    fecha_recogida_programada: '',
    fecha_entrega_programada: '',
    costo_envio: '',
    valor_declarado: '',
    estado: 'pendiente',
    prioridad: 'media',
    observaciones: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [enviosRes, pedidosRes, clientesRes, vehiculosRes, conductoresRes] = await Promise.all([
        enviosAPI.getAll().catch(() => ({ data: [] })),
        pedidosAPI.getAll().catch(() => ({ data: [] })),
        clientesAPI.getAll().catch(() => ({ data: [] })),
        vehiculosAPI.getAll().catch(() => ({ data: [] })),
        conductoresAPI.getAll().catch(() => ({ data: [] }))
      ]);
      
      // Convertir pedidos a formato de envío para mostrar seguimiento
      const pedidosConSeguimiento = (pedidosRes.data || [])
        .filter(pedido => pedido.estado === 'confirmado' || pedido.estado === 'en_curso' || pedido.estado === 'enviado')
        .map(pedido => ({
          id: pedido.id,
          numero_guia: pedido.numero_pedido,
          cliente: pedido.usuario_nombre ? { nombre: pedido.usuario_nombre } : null,
          conductor: pedido.conductor_data || pedido.conductor,
          peso_kg: pedido.items?.reduce((sum, item) => sum + (item.cantidad * 5), 0) || 0,
          costo_envio: pedido.total,
          estado: pedido.estado === 'en_curso' ? 'en_transito' : pedido.estado,
          prioridad: 'media',
          direccion_entrega: pedido.direccion_envio,
          telefono_entrega: pedido.telefono_contacto,
          fecha_creacion: pedido.fecha_creacion,
          tipo: 'pedido'
        }));
      
      // Combinar envíos reales con pedidos convertidos
      const todosLosEnvios = [
        ...(enviosRes.data || []).filter(envio => 
          envio.estado === 'enviado' || envio.estado === 'en_transito'
        ),
        ...pedidosConSeguimiento
      ];
      
      setEnvios(todosLosEnvios);
      setClientes(clientesRes.data || []);
      setVehiculos(vehiculosRes.data || []);
      setConductores(conductoresRes.data || []);
    } catch (error) {
      console.error('Error cargando datos:', error);
      setError('Error cargando datos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'pendiente': return 'warning';
      case 'confirmado': return 'info';
      case 'en_transito': return 'primary';
      case 'en_curso': return 'primary';
      case 'entregado': return 'success';
      case 'cancelado': return 'error';
      case 'devuelto': return 'default';
      default: return 'default';
    }
  };

  const getPrioridadColor = (prioridad) => {
    switch (prioridad) {
      case 'urgente': return 'error';
      case 'alta': return 'warning';
      case 'media': return 'info';
      case 'baja': return 'default';
      default: return 'default';
    }
  };

  const handleCreate = () => {
    setSelectedEnvio(null);
    setIsEditing(false);
    setFormData({
      numero_guia: `ENV-${Date.now()}`,
      cliente: '',
      vehiculo: '',
      conductor: '',
      descripcion_carga: '',
      peso_kg: '',
      volumen_m3: '',
      direccion_recogida: '',
      direccion_entrega: '',
      contacto_recogida: '',
      contacto_entrega: '',
      telefono_recogida: '',
      telefono_entrega: '',
      fecha_recogida_programada: '',
      fecha_entrega_programada: '',
      costo_envio: '',
      valor_declarado: '',
      estado: 'pendiente',
      prioridad: 'media',
      observaciones: ''
    });
    setOpenDialog(true);
  };

  const handleEdit = (envio) => {
    setSelectedEnvio(envio);
    setIsEditing(true);
    setFormData({
      numero_guia: envio.numero_guia,
      cliente: envio.cliente?.id || '',
      vehiculo: envio.vehiculo?.id || '',
      conductor: envio.conductor?.id || '',
      descripcion_carga: envio.descripcion_carga,
      peso_kg: envio.peso_kg,
      volumen_m3: envio.volumen_m3,
      direccion_recogida: envio.direccion_recogida,
      direccion_entrega: envio.direccion_entrega,
      contacto_recogida: envio.contacto_recogida,
      contacto_entrega: envio.contacto_entrega,
      telefono_recogida: envio.telefono_recogida,
      telefono_entrega: envio.telefono_entrega,
      fecha_recogida_programada: envio.fecha_recogida_programada,
      fecha_entrega_programada: envio.fecha_entrega_programada,
      costo_envio: envio.costo_envio,
      valor_declarado: envio.valor_declarado,
      estado: envio.estado,
      prioridad: envio.prioridad,
      observaciones: envio.observaciones || ''
    });
    setOpenDialog(true);
  };

  const handleView = (envio) => {
    setSelectedEnvio(envio);
    setOpenDetailDialog(true);
  };

  const handleSave = async () => {
    try {
      if (!isEditing) {
        await enviosAPI.create(formData);
      } else if (selectedEnvio) {
        await enviosAPI.update(selectedEnvio.id, formData);
      }
      setOpenDialog(false);
      await loadData();
    } catch (error) {
      console.error('Error guardando envío:', error);
      setError('Error guardando el envío');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('es-ES', {
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
          Cargando envíos...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LocalShippingIcon sx={{ mr: 2, fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            Gestión de Envíos ({envios.length})
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Nuevo Envío
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Tabla de envíos */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Número Guía</strong></TableCell>
              <TableCell><strong>Cliente</strong></TableCell>
              <TableCell><strong>Peso</strong></TableCell>
              <TableCell><strong>Costo</strong></TableCell>
              <TableCell><strong>Estado</strong></TableCell>
              <TableCell><strong>Prioridad</strong></TableCell>
              <TableCell><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {envios.map((envio) => (
              <TableRow key={envio.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AssignmentIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" fontWeight="bold">
                      {envio.numero_guia}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {envio.cliente?.nombre || 'N/A'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {envio.peso_kg} kg
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AttachMoneyIcon fontSize="small" sx={{ mr: 0.5, color: 'success.main' }} />
                    <Typography variant="body2" fontWeight="bold" color="success.main">
                      {formatCurrency(envio.costo_envio)}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={envio.estado.toUpperCase()}
                    color={getEstadoColor(envio.estado)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={envio.prioridad.toUpperCase()}
                    color={getPrioridadColor(envio.prioridad)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleView(envio)}
                    >
                      Ver
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() => handleEdit(envio)}
                    >
                      Editar
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {envios.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <LocalShippingIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No hay envíos registrados
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Crea tu primer envío para comenzar
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
            Crear Primer Envío
          </Button>
        </Box>
      )}

      {/* Dialog para crear/editar envío */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {isEditing ? 'Editar Envío' : 'Nuevo Envío'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Número de Guía"
                value={formData.numero_guia}
                onChange={(e) => setFormData({ ...formData, numero_guia: e.target.value })}
                required
                InputProps={{ readOnly: isEditing }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Cliente *</InputLabel>
                <Select
                  value={formData.cliente}
                  label="Cliente *"
                  onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                >
                  {clientes.map((cliente) => (
                    <MenuItem key={cliente.id} value={cliente.id}>
                      {cliente.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Descripción de la Carga"
                value={formData.descripcion_carga}
                onChange={(e) => setFormData({ ...formData, descripcion_carga: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Peso (kg)"
                value={formData.peso_kg}
                onChange={(e) => setFormData({ ...formData, peso_kg: e.target.value })}
                InputProps={{
                  endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Costo del Envío"
                value={formData.costo_envio}
                onChange={(e) => setFormData({ ...formData, costo_envio: e.target.value })}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={formData.estado}
                  label="Estado"
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                >
                  <MenuItem value="pendiente">Pendiente</MenuItem>
                  <MenuItem value="en_transito">En Tránsito</MenuItem>
                  <MenuItem value="entregado">Entregado</MenuItem>
                  <MenuItem value="cancelado">Cancelado</MenuItem>
                  <MenuItem value="devuelto">Devuelto</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Prioridad</InputLabel>
                <Select
                  value={formData.prioridad}
                  label="Prioridad"
                  onChange={(e) => setFormData({ ...formData, prioridad: e.target.value })}
                >
                  <MenuItem value="baja">Baja</MenuItem>
                  <MenuItem value="media">Media</MenuItem>
                  <MenuItem value="alta">Alta</MenuItem>
                  <MenuItem value="urgente">Urgente</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Observaciones"
                value={formData.observaciones}
                onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained">
            {isEditing ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de detalles */}
      <Dialog open={openDetailDialog} onClose={() => setOpenDetailDialog(false)} maxWidth="md" fullWidth>
        {selectedEnvio && (
          <>
            <DialogTitle>
              Detalles del Envío {selectedEnvio.numero_guia}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Cliente</Typography>
                      <Typography variant="body2"><strong>Nombre:</strong> {selectedEnvio.cliente?.nombre}</Typography>
                      <Typography variant="body2"><strong>Email:</strong> {selectedEnvio.cliente?.email}</Typography>
                      <Typography variant="body2"><strong>Teléfono:</strong> {selectedEnvio.cliente?.telefono}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Envío</Typography>
                      <Typography variant="body2"><strong>Número Guía:</strong> {selectedEnvio.numero_guia}</Typography>
                      <Typography variant="body2"><strong>Estado:</strong> <Chip label={selectedEnvio.estado} color={getEstadoColor(selectedEnvio.estado)} size="small" /></Typography>
                      <Typography variant="body2"><strong>Prioridad:</strong> <Chip label={selectedEnvio.prioridad} color={getPrioridadColor(selectedEnvio.prioridad)} size="small" /></Typography>
                      <Typography variant="body2"><strong>Costo:</strong> {formatCurrency(selectedEnvio.costo_envio)}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Información de la Carga</Typography>
                      <Typography variant="body2"><strong>Descripción:</strong> {selectedEnvio.descripcion_carga}</Typography>
                      <Typography variant="body2"><strong>Peso:</strong> {selectedEnvio.peso_kg} kg</Typography>
                      {selectedEnvio.observaciones && (
                        <Typography variant="body2"><strong>Observaciones:</strong> {selectedEnvio.observaciones}</Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDetailDialog(false)}>Cerrar</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default Envios;
