from django.shortcuts import render
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from datetime import datetime, timedelta
from django.contrib.auth.models import User

from .models import Cliente, Conductor, Vehiculo, Ruta, Envio, SeguimientoEnvio
from .serializers import (
    ClienteSerializer, ConductorSerializer, VehiculoSerializer, 
    RutaSerializer, EnvioSerializer, EnvioCreateSerializer, 
    EnvioListSerializer, SeguimientoEnvioSerializer
)


class ClienteViewSet(viewsets.ModelViewSet):
    """API endpoint para gestionar clientes usando auth_user y UserProfile"""
    
    def get_queryset(self):
        from django.contrib.auth.models import User
        from user_management.models import UserProfile
        # Filter users with customer role and include UserProfile
        return User.objects.select_related('userprofile').filter(
            userprofile__role='customer'
        ).order_by('-date_joined')
    
    serializer_class = ClienteSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active', 'userprofile__ciudad']
    search_fields = ['first_name', 'last_name', 'email', 'userprofile__telefono']
    ordering_fields = ['first_name', 'last_name', 'date_joined']
    ordering = ['-date_joined']

    def update(self, request, *args, **kwargs):
        """Update customer user and profile"""
        from user_management.models import UserProfile
        
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        data = request.data
        
        # Update User fields
        if 'first_name' in data:
            instance.first_name = data['first_name']
        if 'last_name' in data:
            instance.last_name = data['last_name']
        instance.save()
        
        # Update UserProfile fields
        try:
            profile = instance.userprofile
            if 'telefono' in data:
                profile.telefono = data['telefono']
            if 'direccion' in data:
                profile.direccion = data['direccion']
            if 'ciudad' in data:
                profile.ciudad = data['ciudad']
            if 'codigo_postal' in data:
                profile.codigo_postal = data['codigo_postal']
            profile.save()
        except UserProfile.DoesNotExist:
            return Response({'error': 'Perfil de usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    def destroy(self, request, *args, **kwargs):
        """Deactivate customer instead of deleting"""
        instance = self.get_object()
        instance.is_active = False
        instance.save()
        return Response({'message': 'Cliente desactivado exitosamente'}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def activos(self, request):
        """Obtener solo clientes activos"""
        clientes_activos = self.get_queryset().filter(is_active=True)
        serializer = self.get_serializer(clientes_activos, many=True)
        return Response(serializer.data)


class ConductorViewSet(viewsets.ModelViewSet):
    """API endpoint para gestionar conductores"""
    queryset = Conductor.objects.all()
    serializer_class = ConductorSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['estado', 'activo']
    search_fields = ['nombre', 'cedula', 'licencia']
    ordering_fields = ['nombre', 'fecha_contratacion']
    ordering = ['nombre']
    
    def create(self, request, *args, **kwargs):
        """Create conductor with user authentication account"""
        from django.contrib.auth.models import User
        from user_management.models import UserProfile
        from django.db import transaction
        from datetime import date
        import secrets
        
        data = request.data
        
        try:
            with transaction.atomic():
                # Create Django user
                full_name_parts = data.get('nombre', '').strip().split(' ', 1)
                first_name = full_name_parts[0] if full_name_parts else ''
                last_name = full_name_parts[1] if len(full_name_parts) > 1 else ''
                
                # Use email as username for conductors
                username = data.get('email', '').split('@')[0]
                
                # Check if user already exists
                if User.objects.filter(email=data.get('email')).exists():
                    return Response({'error': 'Email ya registrado'}, status=status.HTTP_400_BAD_REQUEST)
                
                # Use provided password or generate a temporary one
                password = data.get('password')
                if not password:
                    # Generate a temporary password (8 characters alphanumeric)
                    password = secrets.token_urlsafe(8)
                
                user = User.objects.create_user(
                    username=username,
                    email=data.get('email'),
                    first_name=first_name,
                    last_name=last_name,
                    password=password
                )
                
                # Create user profile
                UserProfile.objects.create(
                    user=user,
                    role='conductor',
                    telefono=data.get('telefono', ''),
                    direccion=data.get('direccion', '')
                )
                
                # Create conductor record
                conductor_data = {
                    'nombre': data.get('nombre'),
                    'cedula': data.get('cedula'),
                    'licencia': data.get('licencia'),
                    'telefono': data.get('telefono'),
                    'email': data.get('email'),
                    'direccion': data.get('direccion'),
                    'estado': data.get('estado', 'disponible'),
                    'fecha_contratacion': date.today(),
                    'activo': True
                }
                
                serializer = self.get_serializer(data=conductor_data)
                serializer.is_valid(raise_exception=True)
                conductor = serializer.save()
                
                # Create vehicle if placa_vehiculo is provided
                placa_vehiculo = data.get('placa_vehiculo', '').strip().upper()
                if placa_vehiculo:
                    # Check if vehicle with this plate already exists
                    if not Vehiculo.objects.filter(placa=placa_vehiculo).exists():
                        Vehiculo.objects.create(
                            placa=placa_vehiculo,
                            tipo='camion',
                            marca='Sin especificar',
                            modelo='Sin especificar',
                            año=date.today().year,
                            capacidad_kg=1000,
                            estado='disponible',
                            conductor_asignado=conductor,
                            activo=True
                        )
                
                # Prepare response
                response_data = serializer.data
                # If password was auto-generated, include it in response for admin to communicate to conductor
                if not data.get('password'):
                    response_data['password_temporal'] = password
                    response_data['mensaje'] = f'Conductor creado. Contraseña temporal: {password} - Comuníquela al conductor.'
                
                return Response(response_data, status=status.HTTP_201_CREATED)
                
        except Exception as e:
            return Response({'error': f'Error creando conductor: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
    
    def update(self, request, *args, **kwargs):
        """Update conductor and optionally update user password"""
        from django.contrib.auth.models import User
        
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        data = request.data
        
        # If password is provided, update user password
        if data.get('password'):
            try:
                user = User.objects.get(email=instance.email)
                user.set_password(data.get('password'))
                user.save()
            except User.DoesNotExist:
                pass  # Continue with regular update if no user account exists
        
        # Remove password from data before serializing conductor
        conductor_data = data.copy()
        conductor_data.pop('password', None)
        conductor_data.pop('confirmPassword', None)
        
        serializer = self.get_serializer(instance, data=conductor_data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        """Deactivate conductor and associated vehicle"""
        conductor = self.get_object()
        
        # Desactivar conductor
        conductor.activo = False
        conductor.estado = 'inactivo'
        conductor.save()
        
        # Desactivar vehículo asociado si existe
        try:
            vehiculo = Vehiculo.objects.get(conductor_asignado=conductor)
            vehiculo.activo = False
            vehiculo.estado = 'inactivo'
            vehiculo.save()
        except Vehiculo.DoesNotExist:
            pass  # No hay vehículo asociado
        
        return Response({
            'message': 'Conductor y vehículo asociado desactivados exitosamente'
        }, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'])
    def disponibles(self, request):
        """Obtener conductores disponibles"""
        conductores_disponibles = Conductor.objects.filter(estado='disponible', activo=True)
        serializer = self.get_serializer(conductores_disponibles, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def cambiar_estado(self, request, pk=None):
        """Cambiar el estado de un conductor"""
        conductor = self.get_object()
        nuevo_estado = request.data.get('estado')
        
        if nuevo_estado in dict(Conductor.ESTADO_CHOICES):
            conductor.estado = nuevo_estado
            conductor.save()
            serializer = self.get_serializer(conductor)
            return Response(serializer.data)
        else:
            return Response(
                {'error': 'Estado no válido'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=False, methods=['post'])
    def guardar_datos_vehiculo(self, request):
        """Guardar datos temporales del vehículo del conductor"""
        try:
            # Buscar conductor por email del usuario autenticado
            conductor = Conductor.objects.get(email=request.user.email)
            
            # Guardar datos temporales
            conductor.placa_temporal = request.data.get('placa', '').strip().upper()
            conductor.marca_vehiculo_temporal = request.data.get('marca', '').strip()
            conductor.modelo_vehiculo_temporal = request.data.get('modelo', '').strip()
            conductor.año_vehiculo_temporal = request.data.get('año')
            conductor.tipo_vehiculo_temporal = request.data.get('tipo', 'camion')
            conductor.capacidad_kg_temporal = request.data.get('capacidad_kg')
            conductor.color_vehiculo_temporal = request.data.get('color', 'Blanco').strip()
            conductor.combustible_temporal = request.data.get('combustible', 'gasolina')
            conductor.numero_motor_temporal = request.data.get('numero_motor', '').strip()
            conductor.numero_chasis_temporal = request.data.get('numero_chasis', '').strip()
            conductor.save()
            
            return Response({
                'message': 'Datos del vehículo guardados exitosamente',
                'conductor': self.get_serializer(conductor).data
            }, status=status.HTTP_200_OK)
        except Conductor.DoesNotExist:
            return Response(
                {'error': 'Conductor no encontrado'}, 
                status=status.HTTP_404_NOT_FOUND
            )


class VehiculoViewSet(viewsets.ModelViewSet):
    """API endpoint para gestionar vehículos con asignación uno-a-uno de conductores"""
    queryset = Vehiculo.objects.select_related('conductor_asignado').all()
    serializer_class = VehiculoSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['tipo', 'estado', 'activo']
    search_fields = ['placa', 'marca', 'modelo']
    ordering_fields = ['placa', 'marca', 'año']
    ordering = ['placa']
    
    def create(self, request, *args, **kwargs):
        """Create vehicle with conductor assignment validation and automatic data completion"""
        data = request.data.copy()
        placa = data.get('placa', '').strip().upper()
        
        if not placa:
            return Response({'error': 'La placa es requerida'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Buscar conductor que tenga esta placa registrada temporalmente
        try:
            conductor = Conductor.objects.get(placa_temporal=placa)
            
            # Verificar si el conductor ya tiene un vehículo asignado
            existing_vehicle = Vehiculo.objects.filter(conductor_asignado=conductor).first()
            if existing_vehicle:
                return Response({
                    'error': f'El conductor {conductor.nombre} ya tiene asignado el vehículo {existing_vehicle.placa}'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Completar datos del vehículo con los datos temporales del conductor
            if not data.get('marca'):
                data['marca'] = conductor.marca_vehiculo_temporal or 'Sin especificar'
            if not data.get('modelo'):
                data['modelo'] = conductor.modelo_vehiculo_temporal or 'Sin especificar'
            if not data.get('año'):
                data['año'] = conductor.año_vehiculo_temporal or datetime.now().year
            if not data.get('tipo'):
                data['tipo'] = conductor.tipo_vehiculo_temporal or 'camion'
            if not data.get('capacidad_kg'):
                data['capacidad_kg'] = conductor.capacidad_kg_temporal or 1000
            if not data.get('color'):
                data['color'] = conductor.color_vehiculo_temporal or 'Blanco'
            if not data.get('combustible'):
                data['combustible'] = conductor.combustible_temporal or 'gasolina'
            if not data.get('numero_motor'):
                data['numero_motor'] = conductor.numero_motor_temporal or ''
            if not data.get('numero_chasis'):
                data['numero_chasis'] = conductor.numero_chasis_temporal or ''
            
            # Asignar el conductor automáticamente
            data['conductor_asignado'] = conductor.id
            
            # Valores por defecto si no se proporcionan
            if not data.get('estado'):
                data['estado'] = 'disponible'
            if not data.get('activo'):
                data['activo'] = True
            
            # Crear el vehículo
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            
            # Limpiar datos temporales del conductor
            conductor.placa_temporal = None
            conductor.marca_vehiculo_temporal = None
            conductor.modelo_vehiculo_temporal = None
            conductor.año_vehiculo_temporal = None
            conductor.tipo_vehiculo_temporal = None
            conductor.capacidad_kg_temporal = None
            conductor.color_vehiculo_temporal = None
            conductor.combustible_temporal = None
            conductor.numero_motor_temporal = None
            conductor.numero_chasis_temporal = None
            conductor.save()
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Conductor.DoesNotExist:
            return Response({
                'error': f'No se encontró un conductor con la placa {placa} registrada. El conductor debe registrar primero los datos de su vehículo en su primer inicio de sesión.'
            }, status=status.HTTP_400_BAD_REQUEST)
    
    def update(self, request, *args, **kwargs):
        """Update vehicle with conductor assignment validation"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        data = request.data.copy()
        
        # Validate conductor assignment (one-to-one constraint)
        conductor_id = data.get('conductor_asignado')
        if conductor_id:
            try:
                conductor = Conductor.objects.get(id=conductor_id)
                # Check if conductor is already assigned to another vehicle (excluding current)
                existing_vehicle = Vehiculo.objects.filter(
                    conductor_asignado=conductor
                ).exclude(id=instance.id).first()
                if existing_vehicle:
                    return Response({
                        'error': f'El conductor {conductor.nombre} ya está asignado al vehículo {existing_vehicle.placa}'
                    }, status=status.HTTP_400_BAD_REQUEST)
            except Conductor.DoesNotExist:
                return Response({'error': 'Conductor no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def disponibles(self, request):
        """Obtener vehículos disponibles"""
        vehiculos_disponibles = Vehiculo.objects.filter(estado='disponible', activo=True)
        serializer = self.get_serializer(vehiculos_disponibles, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def cambiar_estado(self, request, pk=None):
        """Cambiar el estado de un vehículo"""
        vehiculo = self.get_object()
        nuevo_estado = request.data.get('estado')
        
        if nuevo_estado in dict(Vehiculo.ESTADO_CHOICES):
            vehiculo.estado = nuevo_estado
            vehiculo.save()
            serializer = self.get_serializer(vehiculo)
            return Response(serializer.data)
        else:
            return Response(
                {'error': 'Estado no válido'}, 
                status=status.HTTP_400_BAD_REQUEST
            )


class RutaViewSet(viewsets.ModelViewSet):
    """API endpoint para gestionar rutas"""
    queryset = Ruta.objects.all()
    serializer_class = RutaSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['estado', 'activa']
    search_fields = ['nombre', 'origen', 'destino']
    ordering_fields = ['nombre', 'distancia_km', 'fecha_creacion']
    ordering = ['-fecha_creacion']

    @action(detail=False, methods=['get'])
    def activas(self, request):
        """Obtener rutas activas"""
        rutas_activas = Ruta.objects.filter(activa=True)
        serializer = self.get_serializer(rutas_activas, many=True)
        return Response(serializer.data)


class EnvioViewSet(viewsets.ModelViewSet):
    """API endpoint para gestionar envíos"""
    queryset = Envio.objects.select_related('cliente', 'ruta', 'vehiculo', 'conductor').all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['estado', 'prioridad', 'cliente', 'conductor', 'vehiculo']
    search_fields = ['numero_guia', 'cliente__nombre', 'descripcion_carga']
    ordering_fields = ['fecha_creacion', 'fecha_recogida_programada', 'fecha_entrega_programada']
    ordering = ['-fecha_creacion']

    def get_serializer_class(self):
        """Usar diferentes serializers según la acción"""
        if self.action == 'list':
            return EnvioListSerializer
        elif self.action == 'create':
            return EnvioCreateSerializer
        return EnvioSerializer

    @action(detail=False, methods=['get'])
    def pendientes(self, request):
        """Obtener envíos pendientes"""
        envios_pendientes = Envio.objects.filter(estado='pendiente')
        serializer = EnvioListSerializer(envios_pendientes, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def en_transito(self, request):
        """Obtener envíos en tránsito"""
        envios_transito = Envio.objects.filter(estado='en_transito')
        serializer = EnvioListSerializer(envios_transito, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def cambiar_estado(self, request, pk=None):
        """Cambiar el estado de un envío y crear seguimiento"""
        envio = self.get_object()
        nuevo_estado = request.data.get('estado')
        descripcion = request.data.get('descripcion', '')
        ubicacion = request.data.get('ubicacion', '')
        
        if nuevo_estado in dict(Envio.ESTADO_CHOICES):
            envio.estado = nuevo_estado
            
            # Actualizar fechas según el estado
            if nuevo_estado == 'en_transito' and not envio.fecha_recogida_real:
                envio.fecha_recogida_real = datetime.now()
            elif nuevo_estado == 'entregado' and not envio.fecha_entrega_real:
                envio.fecha_entrega_real = datetime.now()
            
            envio.save()
            
            # Crear seguimiento
            SeguimientoEnvio.objects.create(
                envio=envio,
                estado=nuevo_estado,
                descripcion=descripcion or f"Estado cambiado a {nuevo_estado}",
                ubicacion=ubicacion,
                usuario=request.user if request.user.is_authenticated else None
            )
            
            serializer = self.get_serializer(envio)
            return Response(serializer.data)
        else:
            return Response(
                {'error': 'Estado no válido'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['get'])
    def seguimiento(self, request, pk=None):
        """Obtener el seguimiento completo de un envío"""
        envio = self.get_object()
        seguimientos = envio.seguimientos.all()
        serializer = SeguimientoEnvioSerializer(seguimientos, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def buscar_por_guia(self, request):
        """Buscar envío por número de guía"""
        numero_guia = request.query_params.get('numero_guia')
        if not numero_guia:
            return Response(
                {'error': 'Debe proporcionar un número de guía'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            envio = Envio.objects.get(numero_guia=numero_guia)
            serializer = self.get_serializer(envio)
            return Response(serializer.data)
        except Envio.DoesNotExist:
            return Response(
                {'error': 'Envío no encontrado'}, 
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=True, methods=['post'])
    def asignar_vehiculo_conductor(self, request, pk=None):
        """Asignar vehículo y conductor a un envío"""
        envio = self.get_object()
        vehiculo_id = request.data.get('vehiculo_id')
        conductor_id = request.data.get('conductor_id')
        
        try:
            if vehiculo_id:
                vehiculo = Vehiculo.objects.get(id=vehiculo_id, estado='disponible')
                envio.vehiculo = vehiculo
                vehiculo.estado = 'en_uso'
                vehiculo.save()
            
            if conductor_id:
                conductor = Conductor.objects.get(id=conductor_id, estado='disponible')
                envio.conductor = conductor
                conductor.estado = 'en_ruta'
                conductor.save()
            
            envio.save()
            
            # Crear seguimiento
            SeguimientoEnvio.objects.create(
                envio=envio,
                estado='asignado',
                descripcion=f"Vehículo y conductor asignados",
                usuario=request.user if request.user.is_authenticated else None
            )
            
            serializer = self.get_serializer(envio)
            return Response(serializer.data)
            
        except (Vehiculo.DoesNotExist, Conductor.DoesNotExist) as e:
            return Response(
                {'error': f'Recurso no encontrado: {str(e)}'}, 
                status=status.HTTP_404_NOT_FOUND
            )


class SeguimientoEnvioViewSet(viewsets.ModelViewSet):
    """API endpoint para gestionar seguimientos de envío"""
    queryset = SeguimientoEnvio.objects.all()
    serializer_class = SeguimientoEnvioSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['envio', 'estado']
    ordering_fields = ['fecha_hora']
    ordering = ['-fecha_hora']


# PedidoTransporteViewSet eliminado - funcionalidad consolidada en PedidoViewSet de auth_views
