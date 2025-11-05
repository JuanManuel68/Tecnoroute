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
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Fab
} from '@mui/material';
import {
  LocalShipping as LocalShippingIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Person as PersonIcon,
  Engineering as EngineeringIcon,
  Speed as SpeedIcon,
  Build as BuildIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import { vehiculosAPI, conductoresAPI } from '../services/apiService';

const Vehiculos = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [conductores, setConductores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedVehiculo, setSelectedVehiculo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, vehiculo: null });
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('todos');
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    placa: '',
    marca: '',
    modelo: '',
    año: '',
    tipo: 'camion',
    capacidad_kg: '',
    color: '',
    combustible: 'gasolina',
    estado: 'disponible',
    conductor_asignado: '',
    numero_motor: '',
    numero_chasis: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load vehicles and conductors
      const [vehiculosResponse, conductoresResponse] = await Promise.all([
        vehiculosAPI.getAll(),
        conductoresAPI.getAll()
      ]);
      
      console.log('Vehículos cargados:', vehiculosResponse.data);
      console.log('Conductores cargados:', conductoresResponse.data);
      
      setVehiculos(vehiculosResponse.data || []);
      setConductores(conductoresResponse.data || []);
    } catch (error) {
      console.error('Error cargando datos:', error);
      setError('Error cargando datos: ' + error.message);
      // Demo data
      setVehiculos([
        {
          id: 1,
          placa: 'ABC-123',
          marca: 'Ford',
          modelo: 'Transit',
          año: 2022,
          tipo: 'furgon',
          capacidad_kg: 1500,
          color: 'Blanco',
          combustible: 'gasolina',
          estado: 'disponible',
          conductor_asignado: null,
          numero_motor: 'FM123456',
          numero_chasis: 'CH789012',
          fecha_registro: '2023-01-15'
        },
        {
          id: 2,
          placa: 'XYZ-789',
          marca: 'Chevrolet',
          modelo: 'NKR',
          año: 2021,
          tipo: 'camion',
          capacidad_kg: 3000,
          color: 'Azul',
          combustible: 'diesel',
          estado: 'en_uso',
          conductor_asignado: { id: 1, nombre: 'Carlos Rodríguez' },
          numero_motor: 'CH654321',
          numero_chasis: 'NK345678',
          fecha_registro: '2023-03-10'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'disponible': return 'success';
      case 'en_uso': return 'warning';
      case 'mantenimiento': return 'info';
      case 'inactivo': return 'error';
      default: return 'default';
    }
  };

  const getEstadoText = (estado) => {
    switch (estado) {
      case 'disponible': return 'Disponible';
      case 'en_uso': return 'En Uso';
      case 'mantenimiento': return 'Mantenimiento';
      case 'inactivo': return 'Inactivo';
      default: return estado;
    }
  };

  const getTipoText = (tipo) => {
    switch (tipo) {
      case 'furgon': return 'Furgón';
      case 'camion': return 'Camión';
      case 'camioneta': return 'Camioneta';
      case 'motocicleta': return 'Motocicleta';
      default: return tipo;
    }
  };

  const handleCreate = () => {
    setSelectedVehiculo(null);
    setIsEditing(false);
    setError(null);
    setFormErrors({});
    setFormData({
      placa: '',
      marca: '',
      modelo: '',
      año: '',
      tipo: 'camion',
      capacidad_kg: '',
      color: '',
      combustible: 'gasolina',
      estado: 'disponible',
      conductor_asignado: '',
      numero_motor: '',
      numero_chasis: ''
    });
    setOpenDialog(true);
  };

  const handleEdit = (vehiculo) => {
    setSelectedVehiculo(vehiculo);
    setIsEditing(true);
    setError(null);
    setFormErrors({});
    setFormData({
      placa: vehiculo.placa,
      marca: vehiculo.marca,
      modelo: vehiculo.modelo,
      año: vehiculo.año,
      tipo: vehiculo.tipo,
      capacidad_kg: vehiculo.capacidad_kg,
      color: vehiculo.color,
      combustible: vehiculo.combustible,
      estado: vehiculo.estado,
      conductor_asignado: vehiculo.conductor_asignado?.id || '',
      numero_motor: vehiculo.numero_motor,
      numero_chasis: vehiculo.numero_chasis
    });
    setOpenDialog(true);
  };

  const handleView = (vehiculo) => {
    setSelectedVehiculo(vehiculo);
    setIsEditing(false);
    setOpenDialog(true);
  };

  const handleBlur = (fieldName) => {
    const error = validateField(fieldName, formData[fieldName]);
    if (error) {
      setFormErrors(prev => ({ ...prev, [fieldName]: error }));
    }
  };

  const validateField = (name, value) => {
    if (!value || value === '') {
      const labels = {
        placa: 'Placa',
        marca: 'Marca',
        modelo: 'Modelo',
        año: 'Año',
        capacidad_kg: 'Capacidad de carga',
        color: 'Color',
        numero_motor: 'Número de motor',
        numero_chasis: 'Número de chasis'
      };
      return `${labels[name] || name} es requerido`;
    }

    switch (name) {
      case 'placa':
        if (value.length < 6) return 'La placa debe tener al menos 6 caracteres';
        break;
      case 'año':
        const year = parseInt(value);
        const currentYear = new Date().getFullYear();
        if (year < 1990 || year > currentYear + 1) {
          return `El año debe estar entre 1990 y ${currentYear + 1}`;
        }
        break;
      case 'capacidad_kg':
        if (parseFloat(value) <= 0) return 'La capacidad debe ser mayor a 0';
        break;
      default:
        break;
    }
    
    return '';
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.placa || formData.placa.trim() === '') {
      errors.placa = 'La placa es requerida';
    } else if (formData.placa.length < 6) {
      errors.placa = 'La placa debe tener al menos 6 caracteres';
    }
    
    if (!formData.marca || formData.marca.trim() === '') {
      errors.marca = 'La marca es requerida';
    }
    
    if (!formData.modelo || formData.modelo.trim() === '') {
      errors.modelo = 'El modelo es requerido';
    }
    
    if (!formData.año || formData.año === '') {
      errors.año = 'El año es requerido';
    } else {
      const year = parseInt(formData.año);
      const currentYear = new Date().getFullYear();
      if (year < 1990 || year > currentYear + 1) {
        errors.año = `El año debe estar entre 1990 y ${currentYear + 1}`;
      }
    }
    
    if (!formData.capacidad_kg || formData.capacidad_kg === '') {
      errors.capacidad_kg = 'La capacidad de carga es requerida';
    } else if (parseFloat(formData.capacidad_kg) <= 0) {
      errors.capacidad_kg = 'La capacidad debe ser mayor a 0';
    }
    
    if (!formData.color || formData.color.trim() === '') {
      errors.color = 'El color es requerido';
    }
    
    if (!formData.numero_motor || formData.numero_motor.trim() === '') {
      errors.numero_motor = 'El número de motor es requerido';
    }
    
    if (!formData.numero_chasis || formData.numero_chasis.trim() === '') {
      errors.numero_chasis = 'El número de chasis es requerido';
    }
    
    return errors;
  };

  const handleSave = async () => {
    try {
      setError(null);
      setFormErrors({});
      
      // Validar formulario
      const errors = validateForm();
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        setError('Por favor corrige los errores en el formulario');
        return;
      }
      
      if (isEditing && selectedVehiculo) {
        await vehiculosAPI.update(selectedVehiculo.id, formData);
      } else {
        await vehiculosAPI.create(formData);
      }
      setOpenDialog(false);
      loadData();
    } catch (error) {
      console.error('Error guardando vehículo:', error);
      setError('Error guardando vehículo: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = (vehiculo) => {
    setDeleteDialog({ open: true, vehiculo });
  };
  
  const confirmDelete = async () => {
    if (!deleteDialog.vehiculo) return;
    
    try {
      await vehiculosAPI.delete(deleteDialog.vehiculo.id);
      setDeleteDialog({ open: false, vehiculo: null });
      loadData();
    } catch (error) {
      console.error('Error eliminando vehículo:', error);
      setError('Error eliminando vehículo: ' + (error.response?.data?.error || error.message));
      setDeleteDialog({ open: false, vehiculo: null });
    }
  };

  const handleChangeEstado = async (id, nuevoEstado) => {
    try {
      await vehiculosAPI.cambiarEstado(id, nuevoEstado);
      loadData();
    } catch (error) {
      console.error('Error cambiando estado:', error);
      setError('Error cambiando estado del vehículo');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Filter available conductors (those without assigned vehicles)
  const getAvailableConductors = () => {
    const assignedConductorIds = vehiculos
      .filter(v => v.conductor_asignado && v.id !== selectedVehiculo?.id)
      .map(v => v.conductor_asignado.id);
    return conductores.filter(c => !assignedConductorIds.includes(c.id));
  };
  
  // Filter vehicles by search term and status
  const filteredVehiculos = vehiculos.filter(vehiculo => {
    const matchesSearch = searchTerm === '' || 
      vehiculo.placa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehiculo.marca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehiculo.modelo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehiculo.conductor_asignado?.nombre?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEstado = estadoFilter === 'todos' || vehiculo.estado === estadoFilter;
    
    return matchesSearch && matchesEstado;
  });

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Cargando vehículos...
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
            Gestión de Vehículos ({vehiculos.length})
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
          size="large"
        >
          Nuevo Vehículo
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Search and Filter Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Buscar por placa, marca, modelo o conductor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
              }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Filtrar por Estado</InputLabel>
              <Select
                value={estadoFilter}
                onChange={(e) => setEstadoFilter(e.target.value)}
                label="Filtrar por Estado"
                startAdornment={<FilterListIcon sx={{ color: 'text.secondary', mr: 1 }} />}
              >
                <MenuItem value="todos">Todos los Estados</MenuItem>
                <MenuItem value="disponible">Disponible</MenuItem>
                <MenuItem value="en_uso">En Uso</MenuItem>
                <MenuItem value="mantenimiento">Mantenimiento</MenuItem>
                <MenuItem value="inactivo">Inactivo</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <Typography variant="body2" color="text.secondary">
                {filteredVehiculos.length} de {vehiculos.length} vehículos
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Estadísticas rápidas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Total
                  </Typography>
                  <Typography variant="h4">
                    {vehiculos.length}
                  </Typography>
                </Box>
                <LocalShippingIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Disponibles
                  </Typography>
                  <Typography variant="h4" sx={{ color: 'success.main' }}>
                    {vehiculos.filter(v => v.estado === 'disponible').length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    En Uso
                  </Typography>
                  <Typography variant="h4" sx={{ color: 'warning.main' }}>
                    {vehiculos.filter(v => v.estado === 'en_uso').length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Mantenimiento
                  </Typography>
                  <Typography variant="h4" sx={{ color: 'info.main' }}>
                    {vehiculos.filter(v => v.estado === 'mantenimiento').length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabla de vehículos */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Vehículo</strong></TableCell>
              <TableCell><strong>Especificaciones</strong></TableCell>
              <TableCell><strong>Conductor Asignado</strong></TableCell>
              <TableCell><strong>Estado</strong></TableCell>
              <TableCell><strong>Fecha Registro</strong></TableCell>
              <TableCell><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredVehiculos.map((vehiculo) => (
              <TableRow key={vehiculo.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocalShippingIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {vehiculo.placa}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {vehiculo.marca} {vehiculo.modelo} ({vehiculo.año})
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="caption" display="block">
                      <strong>Tipo:</strong> {getTipoText(vehiculo.tipo)}
                    </Typography>
                    <Typography variant="caption" display="block">
                      <strong>Capacidad:</strong> {vehiculo.capacidad_kg} kg
                    </Typography>
                    <Typography variant="caption" display="block">
                      <strong>Combustible:</strong> {vehiculo.combustible}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  {vehiculo.conductor_asignado ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PersonIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">{vehiculo.conductor_asignado.nombre}</Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      Sin asignar
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select
                      value={vehiculo.estado}
                      onChange={(e) => handleChangeEstado(vehiculo.id, e.target.value)}
                      variant="outlined"
                      size="small"
                    >
                      <MenuItem value="disponible">Disponible</MenuItem>
                      <MenuItem value="en_uso">En Uso</MenuItem>
                      <MenuItem value="mantenimiento">Mantenimiento</MenuItem>
                      <MenuItem value="inactivo">Inactivo</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(vehiculo.fecha_registro)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleView(vehiculo)}
                    >
                      Ver
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() => handleEdit(vehiculo)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(vehiculo)}
                    >
                      Eliminar
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {vehiculos.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <LocalShippingIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No se encontraron vehículos
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Los vehículos registrados aparecerán aquí
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
            Registrar Primer Vehículo
          </Button>
        </Box>
      )}

      {/* Dialog para crear/editar vehículo */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocalShippingIcon sx={{ mr: 1 }} />
            {selectedVehiculo && !isEditing
              ? `Detalles del Vehículo: ${selectedVehiculo.placa}`
              : isEditing
              ? 'Editar Vehículo'
              : 'Nuevo Vehículo'
            }
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedVehiculo && !isEditing ? (
            // Vista de solo lectura
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2"><strong>Placa:</strong> {selectedVehiculo.placa}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2"><strong>Marca:</strong> {selectedVehiculo.marca}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2"><strong>Modelo:</strong> {selectedVehiculo.modelo}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2"><strong>Año:</strong> {selectedVehiculo.año}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2"><strong>Tipo:</strong> {getTipoText(selectedVehiculo.tipo)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2"><strong>Capacidad:</strong> {selectedVehiculo.capacidad_kg} kg</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2"><strong>Color:</strong> {selectedVehiculo.color}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2"><strong>Combustible:</strong> {selectedVehiculo.combustible}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2"><strong>Motor:</strong> {selectedVehiculo.numero_motor}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2"><strong>Chasis:</strong> {selectedVehiculo.numero_chasis}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                  <strong>Estado:</strong> 
                  <Chip 
                    label={getEstadoText(selectedVehiculo.estado)} 
                    color={getEstadoColor(selectedVehiculo.estado)} 
                    size="small" 
                    sx={{ ml: 1 }}
                  />
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                  <strong>Conductor Asignado:</strong> {selectedVehiculo.conductor_asignado?.nombre || 'Sin asignar'}
                </Typography>
              </Grid>
            </Grid>
          ) : (
            // Formulario de edición/creación
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Placa"
                  value={formData.placa}
                  onChange={(e) => {
                    setFormData({ ...formData, placa: e.target.value.toUpperCase() });
                    if (formErrors.placa) {
                      setFormErrors(prev => ({ ...prev, placa: '' }));
                    }
                  }}
                  onBlur={() => handleBlur('placa')}
                  required
                  placeholder="ABC-123"
                  error={!!formErrors.placa}
                  helperText={formErrors.placa}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Marca"
                  value={formData.marca}
                  onChange={(e) => {
                    setFormData({ ...formData, marca: e.target.value });
                    if (formErrors.marca) {
                      setFormErrors(prev => ({ ...prev, marca: '' }));
                    }
                  }}
                  onBlur={() => handleBlur('marca')}
                  required
                  error={!!formErrors.marca}
                  helperText={formErrors.marca}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Modelo"
                  value={formData.modelo}
                  onChange={(e) => {
                    setFormData({ ...formData, modelo: e.target.value });
                    if (formErrors.modelo) {
                      setFormErrors(prev => ({ ...prev, modelo: '' }));
                    }
                  }}
                  onBlur={() => handleBlur('modelo')}
                  required
                  error={!!formErrors.modelo}
                  helperText={formErrors.modelo}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Año"
                  type="number"
                  value={formData.año}
                  onChange={(e) => {
                    setFormData({ ...formData, año: e.target.value });
                    if (formErrors.año) {
                      setFormErrors(prev => ({ ...prev, año: '' }));
                    }
                  }}
                  onBlur={() => handleBlur('año')}
                  required
                  inputProps={{ min: 1990, max: new Date().getFullYear() + 1 }}
                  error={!!formErrors.año}
                  helperText={formErrors.año}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Tipo de Vehículo</InputLabel>
                  <Select
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    label="Tipo de Vehículo"
                  >
                    <MenuItem value="furgon">Furgón</MenuItem>
                    <MenuItem value="camion">Camión</MenuItem>
                    <MenuItem value="camioneta">Camioneta</MenuItem>
                    <MenuItem value="motocicleta">Motocicleta</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Capacidad de Carga (kg)"
                  type="number"
                  value={formData.capacidad_kg}
                  onChange={(e) => {
                    setFormData({ ...formData, capacidad_kg: e.target.value });
                    if (formErrors.capacidad_kg) {
                      setFormErrors(prev => ({ ...prev, capacidad_kg: '' }));
                    }
                  }}
                  onBlur={() => handleBlur('capacidad_kg')}
                  required
                  inputProps={{ min: 0 }}
                  error={!!formErrors.capacidad_kg}
                  helperText={formErrors.capacidad_kg}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Color"
                  value={formData.color}
                  onChange={(e) => {
                    setFormData({ ...formData, color: e.target.value });
                    if (formErrors.color) {
                      setFormErrors(prev => ({ ...prev, color: '' }));
                    }
                  }}
                  onBlur={() => handleBlur('color')}
                  required
                  error={!!formErrors.color}
                  helperText={formErrors.color}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Tipo de Combustible</InputLabel>
                  <Select
                    value={formData.combustible}
                    onChange={(e) => setFormData({ ...formData, combustible: e.target.value })}
                    label="Tipo de Combustible"
                  >
                    <MenuItem value="gasolina">Gasolina</MenuItem>
                    <MenuItem value="diesel">Diesel</MenuItem>
                    <MenuItem value="electrico">Eléctrico</MenuItem>
                    <MenuItem value="hibrido">Híbrido</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Número de Motor"
                  value={formData.numero_motor}
                  onChange={(e) => {
                    setFormData({ ...formData, numero_motor: e.target.value });
                    if (formErrors.numero_motor) {
                      setFormErrors(prev => ({ ...prev, numero_motor: '' }));
                    }
                  }}
                  onBlur={() => handleBlur('numero_motor')}
                  required
                  error={!!formErrors.numero_motor}
                  helperText={formErrors.numero_motor}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Número de Chasis"
                  value={formData.numero_chasis}
                  onChange={(e) => {
                    setFormData({ ...formData, numero_chasis: e.target.value });
                    if (formErrors.numero_chasis) {
                      setFormErrors(prev => ({ ...prev, numero_chasis: '' }));
                    }
                  }}
                  onBlur={() => handleBlur('numero_chasis')}
                  required
                  error={!!formErrors.numero_chasis}
                  helperText={formErrors.numero_chasis}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                    label="Estado"
                  >
                    <MenuItem value="disponible">Disponible</MenuItem>
                    <MenuItem value="en_uso">En Uso</MenuItem>
                    <MenuItem value="mantenimiento">Mantenimiento</MenuItem>
                    <MenuItem value="inactivo">Inactivo</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Conductor Asignado</InputLabel>
                  <Select
                    value={formData.conductor_asignado}
                    onChange={(e) => setFormData({ ...formData, conductor_asignado: e.target.value })}
                    label="Conductor Asignado"
                  >
                    <MenuItem value="">Sin asignar</MenuItem>
                    {getAvailableConductors().map((conductor) => (
                      <MenuItem key={conductor.id} value={conductor.id}>
                        {conductor.nombre} ({conductor.cedula})
                      </MenuItem>
                    ))}
                    {/* Include current conductor if editing */}
                    {isEditing && selectedVehiculo?.conductor_asignado && (
                      <MenuItem value={selectedVehiculo.conductor_asignado.id}>
                        {selectedVehiculo.conductor_asignado.nombre} (Actual)
                      </MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cerrar</Button>
          {(isEditing || !selectedVehiculo) && (
            <Button onClick={handleSave} variant="contained">
              {isEditing ? 'Actualizar' : 'Crear'}
            </Button>
          )}
          {selectedVehiculo && !isEditing && (
            <Button onClick={() => handleEdit(selectedVehiculo)} variant="contained">
              Editar
            </Button>
          )}
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteDialog.open} 
        onClose={() => setDeleteDialog({ open: false, vehiculo: null })} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: 'error.main', color: 'white', display: 'flex', alignItems: 'center' }}>
          <DeleteIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div">
            Confirmar Eliminación
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ mt: 3 }}>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Box sx={{ bgcolor: 'warning.light', p: 3, borderRadius: 2, mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'warning.dark' }}>
                ⚠️ ¿Estás seguro?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Vas a eliminar el vehículo:
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'error.dark', mb: 1 }}>
                {deleteDialog.vehiculo?.placa}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {deleteDialog.vehiculo?.marca} {deleteDialog.vehiculo?.modelo} ({deleteDialog.vehiculo?.año})
              </Typography>
            </Box>
            
            <Alert severity="warning" sx={{ textAlign: 'left', mb: 2 }}>
              <Typography variant="body2">
                <strong>Esta acción:</strong>
              </Typography>
              <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                <li>Eliminará permanentemente el vehículo del sistema</li>
                {deleteDialog.vehiculo?.conductor_asignado && (
                  <li>Desasignará el conductor: {deleteDialog.vehiculo.conductor_asignado.nombre}</li>
                )}
              </ul>
            </Alert>
            
            <Alert severity="error" sx={{ textAlign: 'left' }}>
              <Typography variant="body2">
                <strong>Advertencia:</strong> Esta acción no se puede deshacer.
              </Typography>
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
          <Button 
            onClick={() => setDeleteDialog({ open: false, vehiculo: null })} 
            variant="outlined"
            size="large"
          >
            Cancelar
          </Button>
          <Button 
            onClick={confirmDelete}
            variant="contained" 
            color="error"
            size="large"
            startIcon={<DeleteIcon />}
          >
            Sí, Eliminar
          </Button>
        </DialogActions>
      </Dialog>
          {/* Footer */}
    <footer className="py-6 bg-gray-900 text-white text-center mt-8">
      <Typography variant="body2">
        © {new Date().getFullYear()} <Box component="span" sx={{ fontWeight: 'bold' }}>TecnoRoute</Box>. Todos los derechos reservados.
      </Typography>
    </footer>
    
    </Container>
  );
};

export default Vehiculos;
