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
  Fab,
  InputAdornment
} from '@mui/material';
import {
  Route as RouteIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  LocationOn as LocationOnIcon,
  Speed as SpeedIcon,
  AttachMoney as AttachMoneyIcon
} from '@mui/icons-material';
import { rutasAPI } from '../services/apiService';

const Rutas = () => {
  const [rutas, setRutas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRuta, setSelectedRuta] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    origen: '',
    destino: '',
    distancia_km: '',
    tiempo_estimado_horas: '',
    costo_combustible: '',
    costo_peajes: '',
    estado: 'activa',
    descripcion: ''
  });

  useEffect(() => {
    loadRutas();
  }, []);

  const loadRutas = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await rutasAPI.getAll();
      console.log('Rutas cargadas:', response.data);
      setRutas(response.data || []);
    } catch (error) {
      console.error('Error cargando rutas:', error);
      setError('Error cargando rutas: ' + error.message);
      setRutas([]);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'activa': return 'success';
      case 'inactiva': return 'default';
      case 'mantenimiento': return 'warning';
      default: return 'default';
    }
  };

  const handleCreate = () => {
    setSelectedRuta(null);
    setIsEditing(false);
    setFormData({
      nombre: '',
      origen: '',
      destino: '',
      distancia_km: '',
      tiempo_estimado_horas: '',
      costo_combustible: '',
      costo_peajes: '',
      estado: 'activa',
      descripcion: ''
    });
    setOpenDialog(true);
  };

  const handleEdit = (ruta) => {
    setSelectedRuta(ruta);
    setIsEditing(true);
    setFormData({
      nombre: ruta.nombre,
      origen: ruta.origen,
      destino: ruta.destino,
      distancia_km: ruta.distancia_km,
      tiempo_estimado_horas: ruta.tiempo_estimado_horas,
      costo_combustible: ruta.costo_combustible,
      costo_peajes: ruta.costo_peajes,
      estado: ruta.estado,
      descripcion: ruta.descripcion || ''
    });
    setOpenDialog(true);
  };

  const handleSave = async () => {
    try {
      if (!isEditing) {
        await rutasAPI.create(formData);
      } else if (selectedRuta) {
        await rutasAPI.update(selectedRuta.id, formData);
      }
      setOpenDialog(false);
      await loadRutas();
    } catch (error) {
      console.error('Error guardando ruta:', error);
      setError('Error guardando la ruta');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Cargando rutas...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <RouteIcon sx={{ mr: 2, fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            Gestión de Rutas ({rutas.length})
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Nueva Ruta
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Tabla de rutas */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Nombre</strong></TableCell>
              <TableCell><strong>Origen - Destino</strong></TableCell>
              <TableCell><strong>Distancia</strong></TableCell>
              <TableCell><strong>Tiempo Est.</strong></TableCell>
              <TableCell><strong>Costo Total</strong></TableCell>
              <TableCell><strong>Estado</strong></TableCell>
              <TableCell><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rutas.map((ruta) => (
              <TableRow key={ruta.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    {ruta.nombre}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOnIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      {ruta.origen} → {ruta.destino}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <SpeedIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      {ruta.distancia_km} km
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {ruta.tiempo_estimado_horas} hrs
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AttachMoneyIcon fontSize="small" sx={{ mr: 0.5, color: 'success.main' }} />
                    <Typography variant="body2" fontWeight="bold" color="success.main">
                      {formatCurrency(ruta.costo_combustible + ruta.costo_peajes)}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={ruta.estado.toUpperCase()}
                    color={getEstadoColor(ruta.estado)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => handleEdit(ruta)}
                  >
                    Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {rutas.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <RouteIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No hay rutas registradas
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Crea tu primera ruta para comenzar
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
            Crear Primera Ruta
          </Button>
        </Box>
      )}

      {/* Dialog para crear/editar ruta */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {isEditing ? 'Editar Ruta' : 'Nueva Ruta'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre de la Ruta"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Origen</InputLabel>
                <Select
                  value={formData.origen}
                  label="Origen"
                  onChange={(e) => setFormData({ ...formData, origen: e.target.value })}
                >
                  <MenuItem value="Bogotá">Bogotá</MenuItem>
                  <MenuItem value="Soacha">Soacha</MenuItem>
                  <MenuItem value="Chía">Chía</MenuItem>
                  <MenuItem value="Zipaquirá">Zipaquirá</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Destino</InputLabel>
                <Select
                  value={formData.destino}
                  label="Destino"
                  onChange={(e) => setFormData({ ...formData, destino: e.target.value })}
                >
                  <MenuItem value="Bogotá">Bogotá</MenuItem>
                  <MenuItem value="Soacha">Soacha</MenuItem>
                  <MenuItem value="Chía">Chía</MenuItem>
                  <MenuItem value="Zipaquirá">Zipaquirá</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Distancia (km)"
                value={formData.distancia_km}
                onChange={(e) => setFormData({ ...formData, distancia_km: e.target.value })}
                InputProps={{
                  endAdornment: <InputAdornment position="end">km</InputAdornment>,
                }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Tiempo Estimado"
                value={formData.tiempo_estimado_horas}
                onChange={(e) => setFormData({ ...formData, tiempo_estimado_horas: e.target.value })}
                InputProps={{
                  endAdornment: <InputAdornment position="end">horas</InputAdornment>,
                }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Costo Combustible"
                value={formData.costo_combustible}
                onChange={(e) => setFormData({ ...formData, costo_combustible: e.target.value })}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Costo Peajes"
                value={formData.costo_peajes}
                onChange={(e) => setFormData({ ...formData, costo_peajes: e.target.value })}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={formData.estado}
                  label="Estado"
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                >
                  <MenuItem value="activa">Activa</MenuItem>
                  <MenuItem value="inactiva">Inactiva</MenuItem>
                  <MenuItem value="mantenimiento">Mantenimiento</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Descripción"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
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
    </Container>
  );
};

export default Rutas;
