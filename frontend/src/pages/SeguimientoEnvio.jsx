import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Grid,
  Chip,
  Alert,
  CircularProgress,
  InputAdornment
} from '@mui/material';
import {
  Search as SearchIcon,
  LocalShipping as LocalShippingIcon,
  LocationOn as LocationOnIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { enviosAPI } from '../services/apiService';

const SeguimientoEnvio = () => {
  const [numeroGuia, setNumeroGuia] = useState('');
  const [envio, setEnvio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [seguimientos, setSeguimientos] = useState([]);

  const buscarEnvio = async () => {
    if (!numeroGuia.trim()) {
      setError('Por favor, ingresa un número de guía');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await enviosAPI.buscarPorGuia(numeroGuia);
      setEnvio(response.data);
      
      // Obtener seguimientos del envío
      const seguimientoResponse = await enviosAPI.getSeguimiento(response.data.id);
      setSeguimientos(seguimientoResponse.data || []);
    } catch (error) {
      console.error('Error buscando envío:', error);
      setError('No se encontró el envío con el número de guía proporcionado');
      
      // Datos de ejemplo para demostración
      if (numeroGuia === 'DEMO123') {
        setEnvio({
          id: 1,
          numero_guia: 'DEMO123',
          cliente: { nombre: 'Ana María López', telefono: '+57 300 123 4567' },
          estado: 'en_transito',
          direccion_recogida: 'Calle 123 #45-67, Bogotá',
          direccion_entrega: 'Carrera 78 #12-34, Soacha',
          fecha_recogida_programada: '2024-01-15T08:00:00',
          fecha_entrega_programada: '2024-01-15T16:00:00',
          peso_kg: 15.5,
          valor_declarado: 250000,
          conductor: { nombre: 'Carlos Rodríguez', telefono: '+57 301 555 7788' },
          vehiculo: { placa: 'ABC-123', marca: 'Chevrolet', modelo: 'NPR' }
        });
        
        setSeguimientos([
          {
            id: 1,
            estado: 'Envío creado',
            descripcion: 'El envío ha sido registrado en el sistema',
            ubicacion: 'Centro de distribución - Bogotá',
            fecha_hora: '2024-01-15T06:00:00',
            usuario: 'Sistema'
          },
          {
            id: 2,
            estado: 'En preparación',
            descripcion: 'El paquete está siendo preparado para el envío',
            ubicacion: 'Almacén principal',
            fecha_hora: '2024-01-15T07:30:00',
            usuario: 'María González'
          },
          {
            id: 3,
            estado: 'En tránsito',
            descripcion: 'El paquete ha sido recogido y está en camino',
            ubicacion: 'Autopista sur - Km 15',
            fecha_hora: '2024-01-15T10:15:00',
            usuario: 'Carlos Rodríguez'
          }
        ]);
        setError(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'pendiente': return 'warning';
      case 'en_transito': return 'info';
      case 'entregado': return 'success';
      case 'cancelado': return 'error';
      default: return 'default';
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'entregado': return <CheckCircleIcon />;
      case 'en_transito': return <LocalShippingIcon />;
      case 'cancelado': return <WarningIcon />;
      default: return <ScheduleIcon />;
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <LocalShippingIcon sx={{ mr: 2, fontSize: 40, color: 'primary.main' }} />
        <Typography variant="h4" component="h1">
          Seguimiento de Envíos
        </Typography>
      </Box>

      {/* Buscador */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Buscar Envío
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          <TextField
            fullWidth
            label="Número de Guía"
            value={numeroGuia}
            onChange={(e) => setNumeroGuia(e.target.value)}
            placeholder="Ej: DEMO123"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                buscarEnvio();
              }
            }}
          />
          <Button
            variant="contained"
            onClick={buscarEnvio}
            disabled={loading}
            sx={{ minWidth: 120, height: 56 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Buscar'}
          </Button>
        </Box>
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Prueba con el número de guía: <strong>DEMO123</strong> para ver un ejemplo
          </Typography>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Información del Envío */}
      {envio && (
        <>
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <LocationOnIcon sx={{ mr: 1 }} />
              Información del Envío
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      DATOS DEL ENVÍO
                    </Typography>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2">
                        <strong>Número de Guía:</strong> {envio.numero_guia}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2">
                        <strong>Estado:</strong>
                        <Chip
                          label={envio.estado.toUpperCase()}
                          color={getEstadoColor(envio.estado)}
                          size="small"
                          icon={getEstadoIcon(envio.estado)}
                          sx={{ ml: 1 }}
                        />
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2">
                        <strong>Peso:</strong> {envio.peso_kg} kg
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2">
                        <strong>Valor Declarado:</strong> ${envio.valor_declarado?.toLocaleString('es-CO')}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      DESTINATARIO
                    </Typography>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2">
                        <strong>Nombre:</strong> {envio.cliente?.nombre}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2">
                        <strong>Teléfono:</strong> {envio.cliente?.telefono}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2">
                        <strong>Dirección de Entrega:</strong>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {envio.direccion_entrega}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              {envio.conductor && (
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        CONDUCTOR ASIGNADO
                      </Typography>
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="body2">
                          <strong>Nombre:</strong> {envio.conductor.nombre}
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="body2">
                          <strong>Teléfono:</strong> {envio.conductor.telefono}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              )}
              
              {envio.vehiculo && (
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        VEHÍCULO
                      </Typography>
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="body2">
                          <strong>Placa:</strong> {envio.vehiculo.placa}
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="body2">
                          <strong>Vehículo:</strong> {envio.vehiculo.marca} {envio.vehiculo.modelo}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          </Paper>

          {/* Historial de Seguimiento */}
          <Paper sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Historial de Seguimiento
            </Typography>
            
            {seguimientos.length > 0 ? (
              <Stepper orientation="vertical">
                {seguimientos.map((seguimiento, index) => (
                  <Step key={seguimiento.id} active={true} completed={index < seguimientos.length - 1}>
                    <StepLabel>
                      <Box>
                        <Typography variant="subtitle2">
                          {seguimiento.estado}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDateTime(seguimiento.fecha_hora)} - {seguimiento.usuario}
                        </Typography>
                      </Box>
                    </StepLabel>
                    <StepContent>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {seguimiento.descripcion}
                      </Typography>
                      {seguimiento.ubicacion && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
                          {seguimiento.ubicacion}
                        </Typography>
                      )}
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            ) : (
              <Typography color="text.secondary">
                No hay información de seguimiento disponible
              </Typography>
            )}
          </Paper>
        </>
      )}
          {/* Footer */}
    <footer className="py-6 bg-gray-900 text-white text-center mt-8">
      <Typography variant="body2">
        © {new Date().getFullYear()} <Box component="span" sx={{ fontWeight: 'bold' }}>TecnoRoute</Box>. Todos los derechos reservados.
      </Typography>
    </footer>
    
    </Container>
  );
};

export default SeguimientoEnvio;
