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
  Chip,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  People as PeopleIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationOnIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import { clientesAPI } from '../services/apiService';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('todos');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: ''
  });

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    try {
      setLoading(true);
      setError(null);
      // Llamar al endpoint que devuelve solo customers (usuarios con role=customer)
      const response = await clientesAPI.getAll();
      console.log('Customers cargados:', response.data);
      setClientes(response.data || []);
    } catch (error) {
      console.error('Error cargando customers:', error);
      setError('Error cargando clientes: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cliente) => {
    setSelectedCliente(cliente);
    setFormData({
      first_name: cliente.nombre?.split(' ')[0] || '',
      last_name: cliente.nombre?.split(' ').slice(1).join(' ') || '',
      email: cliente.email || '',
      telefono: cliente.telefono || '',
      direccion: cliente.direccion || '',
      ciudad: cliente.ciudad || ''
    });
    setOpenEditDialog(true);
  };

  const handleSaveEdit = async () => {
    try {
      setError(null);
      // Actualizar usuario usando el endpoint correcto
      await clientesAPI.update(selectedCliente.id, {
        first_name: formData.first_name,
        last_name: formData.last_name,
        telefono: formData.telefono,
        direccion: formData.direccion,
        ciudad: formData.ciudad
      });
      
      setSuccess('Cliente actualizado exitosamente');
      setOpenEditDialog(false);
      await loadClientes();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error actualizando cliente:', error);
      setError('Error actualizando cliente: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleDelete = async (cliente) => {
    if (!window.confirm(`¿Estás seguro de desactivar al cliente ${cliente.nombre}?`)) {
      return;
    }
    
    try {
      setError(null);
      // Desactivar usuario usando el endpoint correcto
      await clientesAPI.delete(cliente.id);
      
      setSuccess('Cliente desactivado exitosamente');
      await loadClientes();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error desactivando cliente:', error);
      setError('Error desactivando cliente: ' + (error.response?.data?.error || error.message));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Filter clientes by search term and active status
  const filteredClientes = clientes.filter(cliente => {
    const matchesSearch = searchTerm === '' || 
      cliente.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.telefono?.includes(searchTerm) ||
      cliente.ciudad?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEstado = estadoFilter === 'todos' || 
      (estadoFilter === 'activo' && cliente.activo) ||
      (estadoFilter === 'inactivo' && !cliente.activo);
    
    return matchesSearch && matchesEstado;
  });

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Cargando clientes...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <PeopleIcon sx={{ mr: 2, fontSize: 40, color: 'primary.main' }} />
        <Typography variant="h4" component="h1">
          Gestión de Clientes ({clientes.length})
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}
      
      {/* Search and Filter Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Buscar por nombre, email, teléfono o ciudad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
              }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              select
              fullWidth
              label="Filtrar por Estado"
              value={estadoFilter}
              onChange={(e) => setEstadoFilter(e.target.value)}
              size="small"
              SelectProps={{
                startAdornment: <FilterListIcon sx={{ color: 'text.secondary', mr: 1 }} />
              }}
            >
              <option value="todos">Todos los Estados</option>
              <option value="activo">Activos</option>
              <option value="inactivo">Inactivos</option>
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <Typography variant="body2" color="text.secondary">
                {filteredClientes.length} de {clientes.length} clientes
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabla de clientes */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Nombre</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Teléfono</strong></TableCell>
              <TableCell><strong>Ciudad</strong></TableCell>
              <TableCell><strong>Estado</strong></TableCell>
              <TableCell><strong>Fecha Registro</strong></TableCell>
              <TableCell><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredClientes.map((cliente) => (
              <TableRow key={cliente.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PeopleIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" fontWeight="bold">
                      {cliente.nombre}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <EmailIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      {cliente.email}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      {cliente.telefono}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOnIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      {cliente.ciudad}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={cliente.activo ? 'ACTIVO' : 'INACTIVO'}
                    color={cliente.activo ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(cliente.fecha_registro)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Editar">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEdit(cliente)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(cliente)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog de edición */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Cliente</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Apellido"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                disabled
                helperText="El email no se puede cambiar"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Teléfono"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Ciudad"
                value={formData.ciudad}
                onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Dirección"
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancelar</Button>
          <Button onClick={handleSaveEdit} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>

      {clientes.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <PeopleIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No se encontraron clientes
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Los clientes registrados aparecerán aquí
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Clientes;
