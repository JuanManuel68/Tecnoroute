from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.db.models import Q, Count, Sum
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.utils import timezone
from datetime import datetime, timedelta
import uuid

from user_management.models import UserProfile, Categoria, Producto, Carrito, CarritoItem, Pedido, PedidoItem
from .serializers import (
    UserSerializer, UserProfileSerializer, UserRegistrationSerializer,
    CategoriaSerializer, ProductoSerializer, CarritoSerializer, CarritoItemSerializer,
    PedidoSerializer, PedidoItemSerializer
)


class IsAdminOrReadOnly(permissions.BasePermission):
    """Permiso personalizado para permitir solo lectura a usuarios normales"""
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated
        return request.user.is_authenticated and hasattr(request.user, 'userprofile') and request.user.userprofile.role == 'admin'


class AuthView(APIView):
    """Vista para autenticación de usuarios con roles diferenciados"""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')  # Permitir login con email
        
        if not (username or email) or not password:
            return Response({
                'error': 'Username/email y password son requeridos'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Intentar autenticación con username o email
        user = None
        if email:
            try:
                user_obj = User.objects.get(email=email)
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                pass
        
        if not user and username:
            user = authenticate(username=username, password=password)
        
        if user and user.is_active:
            token, created = Token.objects.get_or_create(user=user)
            try:
                profile = user.userprofile
            except UserProfile.DoesNotExist:
                # Crear perfil si no existe (para usuarios existentes)
                role = 'admin' if user.is_superuser else 'customer'
                profile = UserProfile.objects.create(user=user, role=role)
            
            # Datos básicos del usuario
            user_data = {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': profile.role,
                'telefono': profile.telefono,
                'direccion': profile.direccion,
                'ciudad': profile.ciudad,
                'date_joined': user.date_joined.isoformat()
            }
            
            # Datos específicos según el rol
            if profile.role == 'conductor':
                try:
                    from .models import Conductor
                    conductor = Conductor.objects.get(email=user.email)
                    user_data['conductor_info'] = {
                        'id': conductor.id,
                        'cedula': conductor.cedula,
                        'licencia': conductor.licencia,
                        'estado': conductor.estado
                    }
                except Conductor.DoesNotExist:
                    pass
            elif profile.role == 'admin':
                try:
                    from .models import Admin
                    admin = Admin.objects.get(user=user)
                    user_data['admin_info'] = {
                        'id': admin.id,
                        'nivel_acceso': admin.nivel_acceso,
                        'fecha_contratacion': admin.fecha_contratacion.strftime('%Y-%m-%d')
                    }
                except Admin.DoesNotExist:
                    pass
            
            return Response({
                'token': token.key,
                'user': user_data,
                'message': f'Bienvenido {user.get_full_name() or user.username}'
            })
        else:
            return Response({
                'error': 'Correo o contraseña incorrectas'
            }, status=status.HTTP_401_UNAUTHORIZED)


class RegisterView(APIView):
    """Vista para registro de nuevos usuarios"""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            
            # Obtener el rol del perfil creado
            try:
                profile = user.userprofile
                role = profile.role
            except UserProfile.DoesNotExist:
                role = 'customer'
            
            # Crear datos de usuario completos incluyendo información del rol
            user_data = {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': role,
                'telefono': profile.telefono,
                'direccion': profile.direccion,
                'ciudad': profile.ciudad,
                'date_joined': user.date_joined.isoformat()
            }
            
            # Agregar datos específicos según el rol
            if role == 'conductor':
                try:
                    from .models import Conductor
                    conductor = Conductor.objects.get(email=user.email)
                    user_data['conductor_info'] = {
                        'id': conductor.id,
                        'cedula': conductor.cedula,
                        'licencia': conductor.licencia,
                        'estado': conductor.estado
                    }
                except Conductor.DoesNotExist:
                    pass
            elif role == 'admin':
                try:
                    from .models import Admin
                    admin = Admin.objects.get(user=user)
                    user_data['admin_info'] = {
                        'id': admin.id,
                        'nivel_acceso': admin.nivel_acceso,
                        'fecha_contratacion': admin.fecha_contratacion.strftime('%Y-%m-%d')
                    }
                except Admin.DoesNotExist:
                    pass
            
            return Response({
                'success': True,
                'message': 'Usuario registrado exitosamente',
                'token': token.key,
                'user': user_data
            }, status=status.HTTP_201_CREATED)
        return Response({
            'success': False,
            'error': 'Error en los datos enviados',
            'details': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    """Vista para cerrar sesión"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            request.user.auth_token.delete()
            return Response({'message': 'Sesión cerrada exitosamente'})
        except:
            return Response({'error': 'Error al cerrar sesión'}, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(APIView):
    """Vista para obtener y actualizar perfil del usuario actual"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            profile = request.user.userprofile
        except UserProfile.DoesNotExist:
            profile = UserProfile.objects.create(
                user=request.user, 
                role='admin' if request.user.is_superuser else 'customer'
            )
        
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)
    
    def put(self, request):
        """Actualizar perfil del usuario actual"""
        try:
            profile = request.user.userprofile
        except UserProfile.DoesNotExist:
            profile = UserProfile.objects.create(
                user=request.user,
                role='admin' if request.user.is_superuser else 'customer'
            )
        
        # Actualizar datos del usuario
        user = request.user
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        email = request.data.get('email')
        
        if first_name is not None:
            user.first_name = first_name
        if last_name is not None:
            user.last_name = last_name
        if email is not None:
            # Verificar que el email no esté en uso por otro usuario
            if User.objects.filter(email=email).exclude(id=user.id).exists():
                return Response({
                    'error': 'Este correo ya está registrado por otro usuario'
                }, status=status.HTTP_400_BAD_REQUEST)
            user.email = email
            user.username = email  # Actualizar username también
        
        user.save()
        
        # Actualizar datos del perfil
        telefono = request.data.get('telefono')
        direccion = request.data.get('direccion')
        ciudad = request.data.get('ciudad')
        
        if telefono is not None:
            profile.telefono = telefono
        if direccion is not None:
            profile.direccion = direccion
        if ciudad is not None:
            profile.ciudad = ciudad
        
        profile.save()
        
        serializer = UserProfileSerializer(profile)
        return Response({
            'message': 'Perfil actualizado exitosamente',
            'profile': serializer.data
        })


class ChangePasswordView(APIView):
    """Vista para cambiar contraseña del usuario autenticado"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        new_password = request.data.get('new_password')
        
        if not new_password:
            return Response({
                'error': 'new_password es requerido'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validar requisitos de seguridad
        if len(new_password) < 8:
            return Response({
                'error': 'La contraseña debe tener al menos 8 caracteres'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if not any(c.isupper() for c in new_password):
            return Response({
                'error': 'La contraseña debe contener al menos una letra mayúscula'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if not any(c.isdigit() for c in new_password):
            return Response({
                'error': 'La contraseña debe contener al menos un número'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Cambiar contraseña
        user = request.user
        user.set_password(new_password)
        user.save()
        
        return Response({
            'message': 'Contraseña actualizada exitosamente'
        }, status=status.HTTP_200_OK)


class CategoriaViewSet(viewsets.ModelViewSet):
    """ViewSet para categorías de productos"""
    queryset = Categoria.objects.filter(activa=True)
    serializer_class = CategoriaSerializer
    permission_classes = [permissions.AllowAny]  # Temporal para testing


class ProductoViewSet(viewsets.ModelViewSet):
    """ViewSet para productos"""
    queryset = Producto.objects.filter(activo=True).select_related('categoria')
    serializer_class = ProductoSerializer
    permission_classes = [permissions.AllowAny]  # Temporal para testing
    
    def get_queryset(self):
        queryset = super().get_queryset()
        categoria = self.request.query_params.get('categoria', None)
        search = self.request.query_params.get('search', None)
        
        if categoria:
            queryset = queryset.filter(categoria=categoria)
        if search:
            queryset = queryset.filter(
                Q(nombre__icontains=search) | 
                Q(descripcion__icontains=search)
            )
        
        return queryset


class CarritoView(APIView):
    """Vista para manejar el carrito de compras"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """Obtener el carrito del usuario actual"""
        carrito, created = Carrito.objects.get_or_create(usuario=request.user)
        serializer = CarritoSerializer(carrito)
        return Response(serializer.data)

    def post(self, request):
        """Agregar producto al carrito"""
        producto_id = request.data.get('producto_id')
        cantidad = request.data.get('cantidad', 1)

        if not producto_id:
            return Response({'error': 'producto_id es requerido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            producto = Producto.objects.get(id=producto_id, activo=True)
        except Producto.DoesNotExist:
            return Response({'error': 'Producto no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        if cantidad > producto.stock:
            return Response({'error': 'Stock insuficiente'}, status=status.HTTP_400_BAD_REQUEST)

        carrito, created = Carrito.objects.get_or_create(usuario=request.user)
        
        carrito_item, created = CarritoItem.objects.get_or_create(
            carrito=carrito,
            producto=producto,
            defaults={'cantidad': cantidad}
        )

        if not created:
            nueva_cantidad = carrito_item.cantidad + cantidad
            if nueva_cantidad > producto.stock:
                return Response({'error': 'Stock insuficiente'}, status=status.HTTP_400_BAD_REQUEST)
            carrito_item.cantidad = nueva_cantidad
            carrito_item.save()

        serializer = CarritoSerializer(carrito)
        return Response(serializer.data)

    def patch(self, request):
        """Actualizar cantidad de un item en el carrito"""
        item_id = request.data.get('item_id')
        cantidad = request.data.get('cantidad')

        if not item_id or cantidad is None:
            return Response({'error': 'item_id y cantidad son requeridos'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            carrito_item = CarritoItem.objects.get(
                id=item_id, 
                carrito__usuario=request.user
            )
        except CarritoItem.DoesNotExist:
            return Response({'error': 'Item no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        if cantidad <= 0:
            carrito_item.delete()
        else:
            if cantidad > carrito_item.producto.stock:
                return Response({'error': 'Stock insuficiente'}, status=status.HTTP_400_BAD_REQUEST)
            carrito_item.cantidad = cantidad
            carrito_item.save()

        carrito = carrito_item.carrito
        serializer = CarritoSerializer(carrito)
        return Response(serializer.data)

    def delete(self, request):
        """Eliminar item del carrito"""
        item_id = request.data.get('item_id')
        
        if not item_id:
            return Response({'error': 'item_id es requerido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            carrito_item = CarritoItem.objects.get(
                id=item_id, 
                carrito__usuario=request.user
            )
            carrito_item.delete()
            
            carrito = Carrito.objects.get(usuario=request.user)
            serializer = CarritoSerializer(carrito)
            return Response(serializer.data)
        except CarritoItem.DoesNotExist:
            return Response({'error': 'Item no encontrado'}, status=status.HTTP_404_NOT_FOUND)


class PedidoViewSet(viewsets.ModelViewSet):
    """ViewSet para pedidos"""
    serializer_class = PedidoSerializer
    permission_classes = [permissions.IsAuthenticated]  # Solo usuarios autenticados

    def get_queryset(self):
        # Filtrar pedidos según el tipo de usuario
        try:
            user_profile = self.request.user.userprofile
        except AttributeError:
            user_profile = None
        
        print(f"\n=== DEBUG get_queryset ===")
        print(f"User: {self.request.user.email}")
        print(f"Has profile: {user_profile is not None}")
        if user_profile:
            print(f"Role: {user_profile.role}")
        
        if user_profile and user_profile.role == 'admin':
            # Si es admin, mostrar todos los pedidos
            queryset = Pedido.objects.all().select_related('usuario', 'conductor').prefetch_related('items')
            print(f"Admin - Pedidos totales: {queryset.count()}")
            return queryset
        elif user_profile and user_profile.role == 'conductor':
            # Si es conductor, mostrar solo pedidos asignados a él
            from .models import Conductor
            try:
                conductor = Conductor.objects.get(email=self.request.user.email)
                print(f"Conductor encontrado: {conductor.nombre_completo} (ID: {conductor.id})")
                queryset = Pedido.objects.filter(conductor=conductor).select_related('usuario', 'conductor').prefetch_related('items')
                print(f"Pedidos del conductor: {queryset.count()}")
                for p in queryset:
                    print(f"  - {p.numero_pedido}: estado={p.estado}")
                return queryset
            except Conductor.DoesNotExist:
                print(f"Conductor NO encontrado para email: {self.request.user.email}")
                return Pedido.objects.none()
        else:
            # Si es usuario normal, solo sus pedidos
            queryset = Pedido.objects.filter(usuario=self.request.user).select_related('conductor').prefetch_related('items')
            print(f"Cliente - Pedidos: {queryset.count()}")
            return queryset

    @transaction.atomic
    def create(self, request):
        """Crear pedido desde el carrito"""
        direccion_envio = request.data.get('direccion_envio')
        telefono_contacto = request.data.get('telefono_contacto')
        notas = request.data.get('notas', '')

        if not direccion_envio or not telefono_contacto:
            return Response({
                'error': 'direccion_envio y telefono_contacto son requeridos'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            carrito = Carrito.objects.get(usuario=request.user)
            if not carrito.items.exists():
                return Response({'error': 'El carrito está vacío'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Verificar stock
            for item in carrito.items.all():
                if item.cantidad > item.producto.stock:
                    return Response({
                        'error': f'Stock insuficiente para {item.producto.nombre}'
                    }, status=status.HTTP_400_BAD_REQUEST)

            # Crear pedido
            pedido = Pedido.objects.create(
                usuario=request.user,
                numero_pedido=f'PED-{uuid.uuid4().hex[:8].upper()}',
                total=carrito.total,
                direccion_envio=direccion_envio,
                telefono_contacto=telefono_contacto,
                notas=notas
            )

            # Crear items del pedido y actualizar stock
            for item in carrito.items.all():
                PedidoItem.objects.create(
                    pedido=pedido,
                    producto=item.producto,
                    cantidad=item.cantidad,
                    precio_unitario=item.producto.precio,
                    subtotal=item.subtotal
                )
                
                # Actualizar stock
                item.producto.stock -= item.cantidad
                item.producto.save()

            # Limpiar carrito
            carrito.items.all().delete()
            
            # AUTO-CREAR ENVÍO automáticamente
            try:
                from .models import Envio
                from datetime import timedelta
                
                # Generar número de guía único
                numero_guia = f'ENV-{uuid.uuid4().hex[:8].upper()}'
                
                # Calcular peso estimado basado en los productos
                peso_total = sum(item.cantidad * 5 for item in pedido.items.all())  # Estimación: 5kg por producto
                volumen_total = sum(item.cantidad * 0.1 for item in pedido.items.all())  # Estimación: 0.1m³ por producto
                
                # Crear descripción de carga
                productos_str = ', '.join([f"{item.producto.nombre} (x{item.cantidad})" for item in pedido.items.all()])
                
                # Crear el envío
                envio = Envio.objects.create(
                    numero_guia=numero_guia,
                    cliente=request.user,
                    origen='Bodega TecnoRoute',
                    destino=direccion_envio,
                    conductor=pedido.conductor if pedido.conductor else None,
                    descripcion_carga=f"Pedido #{pedido.numero_pedido}: {productos_str}",
                    peso_kg=peso_total,
                    volumen_m3=volumen_total,
                    direccion_recogida='Calle Principal 123, Bogotá',  # Dirección de bodega
                    direccion_entrega=direccion_envio,
                    contacto_recogida='Bodega TecnoRoute',
                    contacto_entrega=f"{request.user.first_name} {request.user.last_name}",
                    telefono_recogida='3001234567',
                    telefono_entrega=telefono_contacto,
                    fecha_recogida_programada=timezone.now(),
                    fecha_entrega_programada=timezone.now() + timedelta(days=2),
                    costo_envio=0,  # Envío gratis por ahora
                    valor_declarado=pedido.total,
                    estado='pendiente',
                    prioridad='media',
                    observaciones=notas
                )
                
                print(f"Envío creado automáticamente: {envio.numero_guia} para pedido {pedido.numero_pedido}")
                
            except Exception as e:
                print(f"Error creando envío automático: {str(e)}")
                # No fallar el pedido si el envío no se puede crear
                pass

            serializer = PedidoSerializer(pedido)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Carrito.DoesNotExist:
            return Response({'error': 'Carrito no encontrado'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'])
    def asignar_conductor(self, request, pk=None):
        """Asignar un conductor específico a un pedido (solo admin)"""
        pedido = self.get_object()
        conductor_id = request.data.get('conductor_id')
        
        # Verificar que sea admin
        try:
            user_profile = request.user.userprofile
        except AttributeError:
            user_profile = None
        if not user_profile or user_profile.role != 'admin':
            return Response({'error': 'Solo administradores pueden asignar conductores'}, status=status.HTTP_403_FORBIDDEN)
        
        if not conductor_id:
            return Response({'error': 'conductor_id es requerido'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            from .models import Conductor
            conductor = Conductor.objects.get(id=conductor_id, activo=True)
            
            # Asignar conductor al pedido
            pedido.conductor = conductor
            pedido.fecha_asignacion = timezone.now()
            # Cambiar estado a confirmado si está pendiente
            if pedido.estado == 'pendiente':
                pedido.estado = 'confirmado'
            pedido.save()
            
            serializer = PedidoSerializer(pedido)
            return Response({
                'message': f'Pedido asignado a {conductor.nombre_completo}',
                'pedido': serializer.data
            })
            
        except Conductor.DoesNotExist:
            return Response({'error': 'Conductor no encontrado o inactivo'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=True, methods=['patch'])
    def cambiar_estado(self, request, pk=None):
        """Cambiar estado del pedido"""
        pedido = self.get_object()
        nuevo_estado = request.data.get('estado')
        
        # Verificar permisos según el rol
        try:
            user_profile = request.user.userprofile
        except AttributeError:
            user_profile = None
        if not user_profile:
            return Response({'error': 'Usuario no tiene perfil'}, status=status.HTTP_403_FORBIDDEN)
        
        # Admins pueden cambiar cualquier estado
        if user_profile.role == 'admin':
            pass  # Permitir cualquier cambio
        # Conductores pueden cambiar: pendiente->confirmado, confirmado->en_curso, en_curso->entregado
        elif user_profile.role == 'conductor':
            from .models import Conductor
            try:
                conductor = Conductor.objects.get(email=request.user.email)
            except Conductor.DoesNotExist:
                return Response({'error': 'Conductor no encontrado'}, status=status.HTTP_404_NOT_FOUND)
            
            # Validar transiciones de estado permitidas
            if nuevo_estado == 'confirmado' and pedido.estado == 'pendiente':
                # Asignar conductor al pedido
                pedido.conductor = conductor
                pedido.fecha_asignacion = timezone.now()
            elif nuevo_estado == 'en_curso' and pedido.estado == 'confirmado':
                # Tomar pedido asignado - verificar que sea el conductor asignado
                if pedido.conductor != conductor:
                    return Response({'error': 'Solo el conductor asignado puede tomar este pedido'}, status=status.HTTP_403_FORBIDDEN)
            elif nuevo_estado == 'entregado' and pedido.estado == 'en_curso':
                # Completar entrega - verificar que sea el conductor asignado
                if pedido.conductor != conductor:
                    return Response({'error': 'Solo el conductor asignado puede marcar como entregado'}, status=status.HTTP_403_FORBIDDEN)
            else:
                return Response({'error': f'Cambio de estado no permitido: {pedido.estado} -> {nuevo_estado}'}, status=status.HTTP_403_FORBIDDEN)
        else:
            return Response({'error': 'No autorizado'}, status=status.HTTP_403_FORBIDDEN)
        
        if nuevo_estado not in [choice[0] for choice in Pedido.ESTADOS_PEDIDO]:
            return Response({'error': 'Estado no válido'}, status=status.HTTP_400_BAD_REQUEST)
        
        pedido.estado = nuevo_estado
        pedido.save()
        
        serializer = PedidoSerializer(pedido)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        """Actualizar pedido - solo permitido en estado pendiente"""
        pedido = self.get_object()
        
        # Solo el propietario del pedido puede editarlo (excepto admins)
        try:
            user_profile = request.user.userprofile
        except AttributeError:
            user_profile = None
        if not user_profile:
            return Response({'error': 'Usuario no tiene perfil'}, status=status.HTTP_403_FORBIDDEN)
        
        # Verificar si es el propietario o admin
        if user_profile.role != 'admin' and pedido.usuario != request.user:
            return Response({'error': 'No autorizado para editar este pedido'}, status=status.HTTP_403_FORBIDDEN)
        
        # Solo se pueden editar pedidos en estado pendiente
        if pedido.estado.lower() != 'pendiente':
            return Response({
                'error': f'No se puede editar un pedido en estado "{pedido.estado}". Solo los pedidos pendientes pueden ser editados.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Campos editables
        direccion_envio = request.data.get('direccion_envio')
        telefono_contacto = request.data.get('telefono_contacto')
        notas = request.data.get('notas', '')
        
        # Validaciones
        if not direccion_envio or not direccion_envio.strip():
            return Response({'error': 'La dirección de envío es obligatoria'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not telefono_contacto or not telefono_contacto.strip():
            return Response({'error': 'El teléfono de contacto es obligatorio'}, status=status.HTTP_400_BAD_REQUEST)
        
        if len(direccion_envio.strip()) < 10:
            return Response({'error': 'La dirección debe tener al menos 10 caracteres'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Actualizar campos
            pedido.direccion_envio = direccion_envio.strip()
            pedido.telefono_contacto = telefono_contacto.strip()
            pedido.notas = notas.strip()
            pedido.save()
            
            serializer = PedidoSerializer(pedido)
            return Response({
                'message': 'Pedido actualizado exitosamente',
                'pedido': serializer.data
            })
            
        except Exception as e:
            return Response({
                'error': f'Error actualizando pedido: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def destroy(self, request, *args, **kwargs):
        """Eliminar pedido - solo permitido en estado pendiente"""
        pedido = self.get_object()
        
        # Solo el propietario del pedido puede eliminarlo (excepto admins)
        try:
            user_profile = request.user.userprofile
        except AttributeError:
            user_profile = None
        if not user_profile:
            return Response({'error': 'Usuario no tiene perfil'}, status=status.HTTP_403_FORBIDDEN)
        
        # Verificar si es el propietario o admin
        if user_profile.role != 'admin' and pedido.usuario != request.user:
            return Response({'error': 'No autorizado para eliminar este pedido'}, status=status.HTTP_403_FORBIDDEN)
        
        # Solo se pueden eliminar pedidos en estado pendiente
        if pedido.estado.lower() != 'pendiente':
            return Response({
                'error': f'No se puede eliminar un pedido en estado "{pedido.estado}". Solo los pedidos pendientes pueden ser eliminados.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            with transaction.atomic():
                # Restaurar stock de los productos antes de eliminar
                for item in pedido.items.all():
                    producto = item.producto
                    producto.stock += item.cantidad
                    producto.save()
                
                # Eliminar el pedido (esto también eliminará los items por CASCADE)
                pedido.delete()
                
                return Response({
                    'message': 'Pedido eliminado exitosamente y stock restaurado'
                }, status=status.HTTP_204_NO_CONTENT)
                
        except Exception as e:
            return Response({
                'error': f'Error eliminando pedido: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'])
    def estadisticas(self, request):
        """Obtener estadísticas de pedidos"""
        try:
            # Estadísticas generales
            total_pedidos = Pedido.objects.count()
            total_ingresos = Pedido.objects.aggregate(total=Sum('total'))['total'] or 0
            
            # Pedidos por estado
            pedidos_por_estado = Pedido.objects.values('estado').annotate(count=Count('id'))
            estados_dict = dict(pedidos_por_estado.values_list('estado', 'count'))
            
            # Pedidos del día
            hoy = datetime.now().date()
            pedidos_hoy = Pedido.objects.filter(fecha_creacion__date=hoy).count()
            
            # Pedidos de la semana
            inicio_semana = hoy - timedelta(days=hoy.weekday())
            pedidos_semana = Pedido.objects.filter(fecha_creacion__date__gte=inicio_semana).count()
            
            # Pedidos del mes
            inicio_mes = hoy.replace(day=1)
            pedidos_mes = Pedido.objects.filter(fecha_creacion__date__gte=inicio_mes).count()
            
            return Response({
                'total_pedidos': total_pedidos,
                'total_ingresos': float(total_ingresos),
                'pedidos_hoy': pedidos_hoy,
                'pedidos_semana': pedidos_semana,
                'pedidos_mes': pedidos_mes,
                'pedidos_pendientes': estados_dict.get('pendiente', 0),
                'pedidos_confirmados': estados_dict.get('confirmado', 0),
                'pedidos_enviados': estados_dict.get('enviado', 0),
                'pedidos_entregados': estados_dict.get('entregado', 0),
                'pedidos_cancelados': estados_dict.get('cancelado', 0),
            })
        except Exception as e:
            return Response({
                'error': f'Error obteniendo estadísticas: {str(e)}',
                'total_pedidos': 0,
                'total_ingresos': 0,
                'pedidos_hoy': 0,
                'pedidos_semana': 0,
                'pedidos_mes': 0,
                'pedidos_pendientes': 0,
                'pedidos_confirmados': 0,
                'pedidos_enviados': 0,
                'pedidos_entregados': 0,
                'pedidos_cancelados': 0,
            })

    @action(detail=False, methods=['get'])
    def recientes(self, request):
        """Obtener pedidos recientes"""
        try:
            limit = request.query_params.get('limit', 10)
            try:
                limit = int(limit)
            except ValueError:
                limit = 10
                
            pedidos_recientes = Pedido.objects.select_related('usuario').prefetch_related('items').order_by('-fecha_creacion')[:limit]
            serializer = PedidoSerializer(pedidos_recientes, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({
                'error': f'Error obteniendo pedidos recientes: {str(e)}',
                'data': []
            })


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def check_email(request):
    """Check if email already exists"""
    email = request.data.get('email')
    if not email:
        return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    exists = User.objects.filter(email=email).exists()
    return Response({'exists': exists})


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def check_phone(request):
    """Check if phone already exists"""
    phone = request.data.get('phone')
    if not phone:
        return Response({'error': 'Phone is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    from user_management.models import UserProfile
    exists = UserProfile.objects.filter(telefono=phone).exists()
    return Response({'exists': exists})


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def send_verification_code(request):
    """Enviar código de verificación al email"""
    email = request.data.get('email')
    
    if not email:
        return Response({
            'error': 'Email es requerido'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Verificar que el email no esté registrado
    if User.objects.filter(email=email).exists():
        return Response({
            'error': 'Este correo ya está registrado'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        from user_management.verification import EmailVerificationCode
        
        # Crear y enviar código
        code = EmailVerificationCode.create_code(email)
        EmailVerificationCode.send_verification_email(email, code)
        
        return Response({
            'success': True,
            'message': 'Código de verificación enviado',
            'debug_code': code if hasattr(status, 'DEBUG') else None  # Solo en desarrollo
        })
    except Exception as e:
        return Response({
            'error': f'Error enviando código: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def verify_code(request):
    """Verificar código de email"""
    email = request.data.get('email')
    code = request.data.get('code')
    
    if not email or not code:
        return Response({
            'error': 'Email y código son requeridos'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        from user_management.verification import EmailVerificationCode
        
        if EmailVerificationCode.verify_code(email, code):
            return Response({
                'success': True,
                'message': 'Código verificado correctamente'
            })
        else:
            return Response({
                'error': 'Código inválido o expirado'
            }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({
            'error': f'Error verificando código: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def test_connection(request):
    """Endpoint de prueba para verificar conexión"""
    from user_management.models import Pedido
    total_pedidos = Pedido.objects.count()
    return Response({
        'status': 'API funcionando correctamente',
        'total_pedidos': total_pedidos,
        'timestamp': '2025-09-25'
    })


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def request_password_reset(request):
    """Enviar código de recuperación de contraseña al email"""
    from logistics.models import PasswordResetCode
    from django.core.mail import send_mail
    from django.conf import settings
    
    email = request.data.get('email')
    
    if not email:
        return Response({
            'error': 'Email es requerido'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Verificar que el email esté registrado
    if not User.objects.filter(email=email).exists():
        return Response({
            'error': 'No existe una cuenta con este correo electrónico'
        }, status=status.HTTP_404_NOT_FOUND)
    
    try:
        # Generar código de 6 dígitos
        code = PasswordResetCode.generate_code()
        
        # Crear registro con expiración de 15 minutos
        expires_at = timezone.now() + timedelta(minutes=15)
        PasswordResetCode.objects.create(
            email=email,
            code=code,
            expires_at=expires_at
        )
        
        # Enviar email
        subject = 'Código de Recuperación de Contraseña - TecnoRoute'
        message = f'''
Hola,

Has solicitado recuperar tu contraseña en TecnoRoute.

Tu código de verificación es: {code}

Este código es válido por 15 minutos.

Si no solicitaste este código, puedes ignorar este mensaje.

Saludos,
Equipo TecnoRoute
        '''
        
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False,
        )
        
        return Response({
            'success': True,
            'message': 'Código de recuperación enviado a tu correo',
            'debug_code': code  # Solo para desarrollo - ELIMINAR EN PRODUCCIÓN
        })
    except Exception as e:
        return Response({
            'error': f'Error enviando código: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def verify_reset_code(request):
    """Verificar código de recuperación"""
    from logistics.models import PasswordResetCode
    
    email = request.data.get('email')
    code = request.data.get('code')
    
    if not email or not code:
        return Response({
            'error': 'Email y código son requeridos'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Buscar código válido
        reset_code = PasswordResetCode.objects.filter(
            email=email,
            code=code,
            used=False
        ).order_by('-created_at').first()
        
        if not reset_code:
            return Response({
                'error': 'Código inválido'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if not reset_code.is_valid():
            return Response({
                'error': 'Código expirado. Solicita uno nuevo'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({
            'success': True,
            'message': 'Código verificado correctamente'
        })
    except Exception as e:
        return Response({
            'error': f'Error verificando código: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def reset_password(request):
    """Restablecer contraseña con código válido"""
    from logistics.models import PasswordResetCode
    
    email = request.data.get('email')
    code = request.data.get('code')
    new_password = request.data.get('new_password')
    
    if not email or not code or not new_password:
        return Response({
            'error': 'Email, código y nueva contraseña son requeridos'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Validar longitud de contraseña
    if len(new_password) < 8:
        return Response({
            'error': 'La contraseña debe tener al menos 8 caracteres'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Buscar código válido
        reset_code = PasswordResetCode.objects.filter(
            email=email,
            code=code,
            used=False
        ).order_by('-created_at').first()
        
        if not reset_code:
            return Response({
                'error': 'Código inválido'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if not reset_code.is_valid():
            return Response({
                'error': 'Código expirado. Solicita uno nuevo'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Buscar usuario
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({
                'error': 'Usuario no encontrado'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Cambiar contraseña
        user.set_password(new_password)
        user.save()
        
        # Marcar código como usado
        reset_code.used = True
        reset_code.save()
        
        return Response({
            'success': True,
            'message': 'Contraseña restablecida exitosamente'
        })
    except Exception as e:
        return Response({
            'error': f'Error restableciendo contraseña: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
