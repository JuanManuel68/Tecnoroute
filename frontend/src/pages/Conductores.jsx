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
  DriveEta as DriveEtaIcon,
  Person as PersonIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Badge as BadgeIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import { conductoresAPI } from '../services/apiService';

const Conductores = () => {
  const [conductores, setConductores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedConductor, setSelectedConductor] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [successDialog, setSuccessDialog] = useState({ open: false, password: '' });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, conductor: null });
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('todos');
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    cedula: '',
    licencia: '',
    telefono: '',
    email: '',
    direccion: '',
    estado: 'disponible'
  });

  useEffect(() => {
    loadConductores();
  }, []);

  const loadConductores = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await conductoresAPI.getAll();
      console.log('Conductores cargados:', response.data);
      setConductores(response.data || []);
    } catch (error) {
      console.error('Error cargando conductores:', error);
      setError('Error cargando conductores: ' + error.message);
      setConductores([]);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'disponible': return 'success';
      case 'en_ruta': return 'warning';
      case 'descanso': return 'info';
      case 'inactivo': return 'error';
      default: return 'default';
    }
  };

  const getEstadoText = (estado) => {
    switch (estado) {
      case 'disponible': return 'Disponible';
      case 'en_ruta': return 'En Ruta';
      case 'descanso': return 'En Descanso';
      case 'inactivo': return 'Inactivo';
      default: return estado;
    }
  };

  const handleCreate = () => {
    setSelectedConductor(null);
    setIsEditing(false);
    setError(null);
    setFormErrors({});
    setFormData({
      nombres: '',
      apellidos: '',
      cedula: '',
      licencia: '',
      telefono: '',
      email: '',
      direccion: '',
      estado: 'disponible'
    });
    setOpenDialog(true);
  };

  const handleEdit = (conductor) => {
    setSelectedConductor(conductor);
    setIsEditing(true);
    setError(null);
    setFormErrors({});
    setFormData({
      nombres: conductor.nombres || '',
      apellidos: conductor.apellidos || '',
      cedula: conductor.cedula,
      licencia: conductor.licencia,
      telefono: conductor.telefono,
      email: conductor.email,
      direccion: conductor.direccion,
      estado: conductor.estado
    });
    setOpenDialog(true);
  };

  const handleView = (conductor) => {
    setSelectedConductor(conductor);
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
    if (!value || value.trim() === '') {
      const labels = {
        nombres: 'Nombres',
        apellidos: 'Apellidos',
        cedula: 'Cédula',
        licencia: 'Licencia',
        telefono: 'Teléfono',
        email: 'Email',
        direccion: 'Dirección'
      };
      return `${labels[name] || name} es requerido`;
    }

    switch (name) {
      case 'nombres':
        if (value.length < 2) return 'Los nombres deben tener al menos 2 caracteres';
        break;
      case 'apellidos':
        if (value.length < 2) return 'Los apellidos deben tener al menos 2 caracteres';
        break;
      case 'cedula':
        if (value.length < 6) return 'La cédula debe tener al menos 6 caracteres';
        break;
      case 'telefono':
        const phoneDigits = value.replace(/\D/g, '');
        if (phoneDigits.length < 7) return 'El teléfono debe tener al menos 7 dígitos';
        break;
      case 'email':
        // Validar que tenga @
        if (!value.includes('@')) {
          return 'El correo debe contener el símbolo @';
        } else {
          // Validar formato completo
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            return 'Formato de correo inválido (ejemplo: usuario@dominio.com)';
          }
        }
        break;
      case 'direccion':
        if (value.length < 5) return 'La dirección debe tener al menos 5 caracteres';
        break;
      default:
        break;
    }
    
    return '';
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.nombres || formData.nombres.trim() === '') {
      errors.nombres = 'Los nombres son requeridos';
    } else if (formData.nombres.length < 2) {
      errors.nombres = 'Los nombres deben tener al menos 2 caracteres';
    }
    
    if (!formData.apellidos || formData.apellidos.trim() === '') {
      errors.apellidos = 'Los apellidos son requeridos';
    } else if (formData.apellidos.length < 2) {
      errors.apellidos = 'Los apellidos deben tener al menos 2 caracteres';
    }
    
    if (!formData.cedula || formData.cedula.trim() === '') {
      errors.cedula = 'La cédula es requerida';
    } else if (formData.cedula.length < 6) {
      errors.cedula = 'La cédula debe tener al menos 6 caracteres';
    }
    
    if (!formData.licencia || formData.licencia.trim() === '') {
      errors.licencia = 'La licencia es requerida';
    }
    
    if (!formData.telefono || formData.telefono.trim() === '') {
      errors.telefono = 'El teléfono es requerido';
    } else {
      const phoneDigits = formData.telefono.replace(/\D/g, '');
      if (phoneDigits.length < 7) {
        errors.telefono = 'El teléfono debe tener al menos 7 dígitos';
      }
    }
    
    if (!formData.email || formData.email.trim() === '') {
      errors.email = 'El email es requerido';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = 'Formato de correo inválido';
      }
    }
    
    if (!formData.direccion || formData.direccion.trim() === '') {
      errors.direccion = 'La dirección es requerida';
    } else if (formData.direccion.length < 5) {
      errors.direccion = 'La dirección debe tener al menos 5 caracteres';
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
      
      // For new conductors
      if (!isEditing) {
        // Create conductor - backend will generate password automatically
        const conductorData = {
          ...formData,
          role: 'conductor'
        };
        
        const response = await conductoresAPI.create(conductorData);
        
        // Show modal with temporary password
        if (response.data.password_temporal) {
          setSuccessDialog({
            open: true,
            password: response.data.password_temporal
          });
        }
        
        setOpenDialog(false);
        loadConductores();
      } else if (selectedConductor) {
        // For editing
        await conductoresAPI.update(selectedConductor.id, formData);
        setOpenDialog(false);
        loadConductores();
      }
    } catch (error) {
      console.error('Error guardando conductor:', error);
      
      // Procesar errores de validación del backend
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // Si hay errores de campo específicos
        if (typeof errorData === 'object' && !errorData.error && !errorData.message) {
          const newErrors = {};
          let errorMessage = 'Por favor corrige los siguientes errores:\n\n';
          
          Object.keys(errorData).forEach(field => {
            const fieldErrors = errorData[field];
            if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
              // Extraer el mensaje de error
              const errorMsg = fieldErrors[0].string || fieldErrors[0];
              newErrors[field] = errorMsg;
              
              // Traducir nombre de campo
              const fieldNames = {
                'cedula': 'Cédula',
                'email': 'Email',
                'nombres': 'Nombres',
                'apellidos': 'Apellidos',
                'telefono': 'Teléfono',
                'licencia': 'Licencia',
                'direccion': 'Dirección'
              };
              
              errorMessage += `• ${fieldNames[field] || field}: ${errorMsg}\n`;
            }
          });
          
          setFormErrors(newErrors);
          setError(errorMessage.trim());
        } else {
          // Error genérico - manejar email duplicado
          const errorMsg = errorData.error || errorData.message || 'Error al guardar el conductor';
          
          // Si el error es de email duplicado
          if (errorMsg.toLowerCase().includes('email') || errorMsg.toLowerCase().includes('correo')) {
            setFormErrors({ email: errorMsg });
          }
          
          setError(errorMsg);
        }
      } else {
        setError('Error de conexión. Por favor verifica tu conexión a internet.');
      }
    }
  };

  const handleDelete = (conductor) => {
    setDeleteDialog({ open: true, conductor });
  };
  
  const confirmDelete = async () => {
    if (!deleteDialog.conductor) return;
    
    try {
      const response = await conductoresAPI.delete(deleteDialog.conductor.id);
      
      // Close dialog
      setDeleteDialog({ open: false, conductor: null });
      
      // Show success message
      setSuccessDialog({
        open: true,
        password: '',
        successMessage: 'Conductor y vehículo asociado desactivados exitosamente'
      });
      
      // Reload list
      loadConductores();
    } catch (error) {
      console.error('Error desactivando conductor:', error);
      setError('Error desactivando conductor: ' + (error.response?.data?.error || error.message));
      setDeleteDialog({ open: false, conductor: null });
    }
  };

  const handleChangeEstado = async (id, nuevoEstado) => {
    try {
      await conductoresAPI.cambiarEstado(id, nuevoEstado);
      loadConductores();
    } catch (error) {
      console.error('Error cambiando estado:', error);
      setError('Error cambiando estado del conductor');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Filter conductors by search term and status
  const filteredConductores = conductores.filter(conductor => {
    const matchesSearch = searchTerm === '' || 
      conductor.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conductor.cedula?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conductor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conductor.telefono?.includes(searchTerm);
    
    const matchesEstado = estadoFilter === 'todos' || conductor.estado === estadoFilter;
    
    return matchesSearch && matchesEstado;
  });

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Cargando conductores...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <DriveEtaIcon sx={{ mr: 2, fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            Gestión de Conductores ({conductores.length})
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
          size="large"
        >
          Nuevo Conductor
        </Button>
      </Box>

      {error && !openDialog && (
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
              placeholder="Buscar por nombre, cédula, email o teléfono..."
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
                <MenuItem value="en_ruta">En Ruta</MenuItem>
                <MenuItem value="descanso">En Descanso</MenuItem>
                <MenuItem value="inactivo">Inactivo</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <Typography variant="body2" color="text.secondary">
                {filteredConductores.length} de {conductores.length} conductores
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
                    {conductores.length}
                  </Typography>
                </Box>
                <PersonIcon sx={{ fontSize: 40, color: 'primary.main' }} />
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
                    {conductores.filter(c => c.estado === 'disponible').length}
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
                    En Ruta
                  </Typography>
                  <Typography variant="h4" sx={{ color: 'warning.main' }}>
                    {conductores.filter(c => c.estado === 'en_ruta').length}
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
                    En Descanso
                  </Typography>
                  <Typography variant="h4" sx={{ color: 'info.main' }}>
                    {conductores.filter(c => c.estado === 'descanso').length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabla de conductores */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Conductor</strong></TableCell>
              <TableCell><strong>Identificación</strong></TableCell>
              <TableCell><strong>Licencia</strong></TableCell>
              <TableCell><strong>Contacto</strong></TableCell>
              <TableCell><strong>Estado</strong></TableCell>
              <TableCell><strong>Fecha Contratación</strong></TableCell>
              <TableCell><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredConductores.map((conductor) => (
              <TableRow key={conductor.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PersonIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {conductor.nombre}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {conductor.email}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <BadgeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">{conductor.cedula}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip label={conductor.licencia} size="small" color="primary" variant="outlined" />
                </TableCell>
                <TableCell>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="caption">{conductor.telefono}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <EmailIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="caption">{conductor.email}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select
                      value={conductor.estado}
                      onChange={(e) => handleChangeEstado(conductor.id, e.target.value)}
                      variant="outlined"
                      size="small"
                    >
                      <MenuItem value="disponible">Disponible</MenuItem>
                      <MenuItem value="en_ruta">En Ruta</MenuItem>
                      <MenuItem value="descanso">En Descanso</MenuItem>
                      <MenuItem value="inactivo">Inactivo</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(conductor.fecha_contratacion)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleView(conductor)}
                    >
                      Ver
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() => handleEdit(conductor)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(conductor)}
                      disabled={!conductor.activo}
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

      {conductores.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <DriveEtaIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No se encontraron conductores
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Los conductores registrados aparecerán aquí
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
            Registrar Primer Conductor
          </Button>
        </Box>
      )}

      {/* Dialog para crear/editar conductor */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <DriveEtaIcon sx={{ mr: 1 }} />
            {selectedConductor && !isEditing
              ? `Detalles del Conductor: ${selectedConductor.nombre}`
              : isEditing
              ? 'Editar Conductor'
              : 'Nuevo Conductor'
            }
          </Box>
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2, mt: 2, whiteSpace: 'pre-line' }}>
              {error}
            </Alert>
          )}
          {selectedConductor && !isEditing ? (
            // Vista de solo lectura
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2"><strong>Nombre:</strong> {selectedConductor.nombre}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2"><strong>Cédula:</strong> {selectedConductor.cedula}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2"><strong>Licencia:</strong> {selectedConductor.licencia}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2"><strong>Teléfono:</strong> {selectedConductor.telefono}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2"><strong>Email:</strong> {selectedConductor.email}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2"><strong>Dirección:</strong> {selectedConductor.direccion}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                  <strong>Estado:</strong> 
                  <Chip 
                    label={getEstadoText(selectedConductor.estado)} 
                    color={getEstadoColor(selectedConductor.estado)} 
                    size="small" 
                    sx={{ ml: 1 }}
                  />
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2"><strong>Fecha Contratación:</strong> {formatDate(selectedConductor.fecha_contratacion)}</Typography>
              </Grid>
            </Grid>
          ) : (
            // Formulario de edición/creación
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nombres"
                  value={formData.nombres}
                  onChange={(e) => {
                    setFormData({ ...formData, nombres: e.target.value });
                    if (formErrors.nombres) {
                      setFormErrors(prev => ({ ...prev, nombres: '' }));
                    }
                  }}
                  onBlur={() => handleBlur('nombres')}
                  required
                  error={!!formErrors.nombres}
                  helperText={formErrors.nombres}
                  placeholder="Juan Carlos"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Apellidos"
                  value={formData.apellidos}
                  onChange={(e) => {
                    setFormData({ ...formData, apellidos: e.target.value });
                    if (formErrors.apellidos) {
                      setFormErrors(prev => ({ ...prev, apellidos: '' }));
                    }
                  }}
                  onBlur={() => handleBlur('apellidos')}
                  required
                  error={!!formErrors.apellidos}
                  helperText={formErrors.apellidos}
                  placeholder="Pérez González"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Cédula"
                  value={formData.cedula}
                  onChange={(e) => {
                    setFormData({ ...formData, cedula: e.target.value });
                    if (formErrors.cedula) {
                      setFormErrors(prev => ({ ...prev, cedula: '' }));
                    }
                  }}
                  onBlur={() => handleBlur('cedula')}
                  required
                  error={!!formErrors.cedula}
                  helperText={formErrors.cedula}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Licencia de conducir"
                  value={formData.licencia}
                  onChange={(e) => {
                    setFormData({ ...formData, licencia: e.target.value });
                    if (formErrors.licencia) {
                      setFormErrors(prev => ({ ...prev, licencia: '' }));
                    }
                  }}
                  onBlur={() => handleBlur('licencia')}
                  placeholder="Ej: B1, C1, A2"
                  required
                  error={!!formErrors.licencia}
                  helperText={formErrors.licencia}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  value={formData.telefono}
                  onChange={(e) => {
                    setFormData({ ...formData, telefono: e.target.value });
                    if (formErrors.telefono) {
                      setFormErrors(prev => ({ ...prev, telefono: '' }));
                    }
                  }}
                  onBlur={() => handleBlur('telefono')}
                  required
                  error={!!formErrors.telefono}
                  helperText={formErrors.telefono}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (formErrors.email) {
                      setFormErrors(prev => ({ ...prev, email: '' }));
                    }
                  }}
                  onBlur={() => handleBlur('email')}
                  required
                  error={!!formErrors.email}
                  helperText={formErrors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Dirección"
                  multiline
                  rows={2}
                  value={formData.direccion}
                  onChange={(e) => {
                    setFormData({ ...formData, direccion: e.target.value });
                    if (formErrors.direccion) {
                      setFormErrors(prev => ({ ...prev, direccion: '' }));
                    }
                  }}
                  onBlur={() => handleBlur('direccion')}
                  required
                  error={!!formErrors.direccion}
                  helperText={formErrors.direccion}
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
                    <MenuItem value="en_ruta">En Ruta</MenuItem>
                    <MenuItem value="descanso">En Descanso</MenuItem>
                    <MenuItem value="inactivo">Inactivo</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cerrar</Button>
          {(isEditing || !selectedConductor) && (
            <Button onClick={handleSave} variant="contained">
              {isEditing ? 'Actualizar' : 'Crear'}
            </Button>
          )}
          {selectedConductor && !isEditing && (
            <Button onClick={() => handleEdit(selectedConductor)} variant="contained">
              Editar
            </Button>
          )}
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteDialog.open} 
        onClose={() => setDeleteDialog({ open: false, conductor: null })} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: 'error.main', color: 'white', display: 'flex', alignItems: 'center' }}>
          <DeleteIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div">
            Confirmar Desactivación
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ mt: 3 }}>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Box sx={{ bgcolor: 'warning.light', p: 3, borderRadius: 2, mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'warning.dark' }}>
                ⚠️ ¿Estás seguro?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Vas a desactivar al conductor:
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'error.dark', mb: 2 }}>
                {deleteDialog.conductor?.nombre}
              </Typography>
            </Box>
            
            <Alert severity="warning" sx={{ textAlign: 'left', mb: 2 }}>
              <Typography variant="body2">
                <strong>Esta acción desactivará:</strong>
              </Typography>
              <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                <li>El perfil del conductor</li>
                <li>El vehículo asociado (si existe)</li>
                <li>El acceso del conductor al sistema</li>
              </ul>
            </Alert>
            
            <Alert severity="info" sx={{ textAlign: 'left' }}>
              <Typography variant="body2">
                <strong>Nota:</strong> Los registros históricos se mantendrán intactos para mantener la integridad de los datos.
              </Typography>
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
          <Button 
            onClick={() => setDeleteDialog({ open: false, conductor: null })} 
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
            Sí, Desactivar
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Success Dialog with Password */}
      <Dialog open={successDialog.open} onClose={() => setSuccessDialog({ open: false, password: '' })} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: 'success.main', color: 'white', textAlign: 'center' }}>
          <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
            {successDialog.password ? '✅ ¡Conductor Creado Exitosamente!' : '✅ ¡Operación Exitosa!'}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ mt: 3 }}>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            {successDialog.successMessage ? (
              <Typography variant="h6" sx={{ mb: 3, color: 'success.dark' }}>
                {successDialog.successMessage}
              </Typography>
            ) : (
              <>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  El conductor ha sido registrado correctamente en el sistema.
                </Typography>
                
                <Box sx={{ bgcolor: 'warning.light', p: 3, borderRadius: 2, mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'warning.dark' }}>
                    🔑 CONTRASEÑA TEMPORAL
                  </Typography>
                  <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 1, mb: 2 }}>
                    <Typography variant="h4" sx={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'error.main', letterSpacing: 2 }}>
                      {successDialog.password}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    ⚠️ Por favor, comuníquela al conductor de forma segura
                  </Typography>
                </Box>
                
                <Alert severity="info" sx={{ textAlign: 'left' }}>
                  <Typography variant="body2">
                    <strong>Importante:</strong> El conductor debe usar esta contraseña en su primer inicio de sesión y completar el registro de su vehículo.
                  </Typography>
                </Alert>
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
          <Button 
            onClick={() => setSuccessDialog({ open: false, password: '' })} 
            variant="contained" 
            size="large"
            sx={{ px: 4 }}
          >
            Entendido
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

export default Conductores;
