from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Conductor, Vehiculo, Envio, SeguimientoEnvio, Admin
from user_management.models import UserProfile, Categoria, Producto, Carrito, CarritoItem, Pedido, PedidoItem


class ClienteSerializer(serializers.ModelSerializer):
    # Use Django User model with UserProfile for client data
    nombre = serializers.SerializerMethodField()
    email = serializers.EmailField(read_only=True)
    telefono = serializers.SerializerMethodField()
    ciudad = serializers.SerializerMethodField()
    direccion = serializers.SerializerMethodField()
    fecha_registro = serializers.DateTimeField(source='date_joined', read_only=True)
    activo = serializers.BooleanField(source='is_active', read_only=True)
    
    def get_nombre(self, obj):
        full_name = obj.get_full_name().strip()
        return full_name if full_name else obj.username
    
    def get_telefono(self, obj):
        try:
            return obj.userprofile.telefono if obj.userprofile.telefono else ''
        except (AttributeError, UserProfile.DoesNotExist):
            return ''
    
    def get_ciudad(self, obj):
        try:
            return obj.userprofile.ciudad if obj.userprofile.ciudad else ''
        except (AttributeError, UserProfile.DoesNotExist):
            return ''
    
    def get_direccion(self, obj):
        try:
            return obj.userprofile.direccion if obj.userprofile.direccion else ''
        except (AttributeError, UserProfile.DoesNotExist):
            return ''
    
    class Meta:
        model = User
        fields = ['id', 'nombre', 'email', 'telefono', 'ciudad', 'direccion', 'fecha_registro', 'activo']
        read_only_fields = ['id', 'nombre', 'email', 'telefono', 'ciudad', 'direccion', 'fecha_registro', 'activo']


class ConductorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conductor
        fields = '__all__'


class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = '__all__'
        read_only_fields = ('fecha_contratacion',)


class VehiculoSerializer(serializers.ModelSerializer):
    conductor_asignado_info = serializers.SerializerMethodField()
    
    class Meta:
        model = Vehiculo
        fields = '__all__'
        read_only_fields = ('fecha_registro',)
    
    def get_conductor_asignado_info(self, obj):
        if obj.conductor_asignado:
            return {
                'id': obj.conductor_asignado.id,
                'nombre': obj.conductor_asignado.nombre_completo,
                'cedula': obj.conductor_asignado.cedula,
                'telefono': obj.conductor_asignado.telefono
            }
        return None



class SeguimientoEnvioSerializer(serializers.ModelSerializer):
    class Meta:
        model = SeguimientoEnvio
        fields = '__all__'
        read_only_fields = ('fecha_hora',)


class EnvioSerializer(serializers.ModelSerializer):
    cliente_nombre = serializers.SerializerMethodField()
    cliente_email = serializers.EmailField(source='cliente.email', read_only=True)
    vehiculo_placa = serializers.CharField(source='vehiculo.placa', read_only=True)
    conductor_nombre = serializers.CharField(source='conductor.nombre_completo', read_only=True)
    seguimientos = SeguimientoEnvioSerializer(many=True, read_only=True)
    dias_transito = serializers.ReadOnlyField()
    
    def get_cliente_nombre(self, obj):
        return obj.cliente.get_full_name() or obj.cliente.username
    
    class Meta:
        model = Envio
        fields = '__all__'
        read_only_fields = ('fecha_creacion', 'fecha_actualizacion')
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['cliente_nombre'] = self.get_cliente_nombre(instance)
        return representation


class EnvioCreateSerializer(serializers.ModelSerializer):
    """Serializer específico para la creación de envíos sin campos relacionados expandidos"""
    class Meta:
        model = Envio
        fields = '__all__'
        read_only_fields = ('fecha_creacion', 'fecha_actualizacion')


class EnvioListSerializer(serializers.ModelSerializer):
    """Serializer para listar envíos con información básica"""
    cliente_nombre = serializers.SerializerMethodField()
    ruta_info = serializers.SerializerMethodField()
    
    def get_cliente_nombre(self, obj):
        return obj.cliente.get_full_name() or obj.cliente.username
    
    class Meta:
        model = Envio
        fields = [
            'id', 'numero_guia', 'cliente_nombre', 'ruta_info',
            'descripcion_carga', 'peso_kg', 'estado', 'prioridad',
            'fecha_recogida_programada', 'fecha_entrega_programada',
            'costo_envio', 'fecha_creacion'
        ]
    
    def get_ruta_info(self, obj):
        return f"{obj.origen} → {obj.destino}"


# Nuevos serializers para autenticación y productos
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = '__all__'

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    password_confirm = serializers.CharField(write_only=True)
    telefono = serializers.CharField(required=False, allow_blank=True)
    phone = serializers.CharField(required=False, allow_blank=True, write_only=True)
    direccion = serializers.CharField(required=False, allow_blank=True)
    address = serializers.CharField(required=False, allow_blank=True, write_only=True)
    city = serializers.CharField(required=False, allow_blank=True)
    role = serializers.ChoiceField(choices=['customer', 'conductor', 'admin'], default='customer')
    
    # Campos para nombres/apellidos (alternativa a first_name/last_name)
    nombres = serializers.CharField(required=False, allow_blank=True, write_only=True)
    apellidos = serializers.CharField(required=False, allow_blank=True, write_only=True)
    
    # Campos adicionales para conductor
    cedula = serializers.CharField(required=False, allow_blank=True)
    licencia = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        model = User
        fields = [
            'username', 'email', 'first_name', 'last_name', 'nombres', 'apellidos',
            'password', 'password_confirm', 'telefono', 'phone', 'direccion', 'address',
            'city', 'role', 'cedula', 'licencia'
        ]
    
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Las contraseñas no coinciden.")
        
        # Validaciones específicas para conductor
        if data.get('role') == 'conductor':
            if not data.get('cedula'):
                raise serializers.ValidationError("La cédula es requerida para conductores.")
            if not data.get('licencia'):
                raise serializers.ValidationError("La licencia es requerida para conductores.")
        
        return data
    
    def create(self, validated_data):
        from datetime import date
        
        validated_data.pop('password_confirm')
        
        # Manejar ambos formatos: telefono/phone y direccion/address
        telefono = validated_data.pop('telefono', '') or validated_data.pop('phone', '')
        direccion = validated_data.pop('direccion', '') or validated_data.pop('address', '')
        city = validated_data.pop('city', '')
        role = validated_data.pop('role', 'customer')
        cedula = validated_data.pop('cedula', '')
        licencia = validated_data.pop('licencia', '')
        
        # Manejar nombres/apellidos o first_name/last_name
        nombres = validated_data.pop('nombres', '') or validated_data.get('first_name', '')
        apellidos = validated_data.pop('apellidos', '') or validated_data.get('last_name', '')
        
        # Crear el usuario base
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=nombres,
            last_name=apellidos,
            password=validated_data['password']
        )
        
        # Crear el perfil de usuario
        user_profile = UserProfile.objects.create(
            user=user,
            role=role,
            nombres=nombres,
            apellidos=apellidos,
            telefono=telefono,
            direccion=direccion,
            ciudad=city
        )
        
        # Crear registros específicos según el rol
        full_name = f"{user.first_name} {user.last_name}".strip()
        if not full_name:
            full_name = user.username
            
        if role == 'conductor':
            Conductor.objects.create(
                nombres=nombres,
                apellidos=apellidos,
                cedula=cedula,
                licencia=licencia,
                telefono=telefono,
                email=user.email,
                direccion=direccion,
                fecha_contratacion=date.today(),
                activo=True
            )
        elif role == 'admin':
            Admin.objects.create(
                user=user,
                nombre=full_name,
                email=user.email,
                telefono=telefono,
                direccion=direccion,
                fecha_contratacion=date.today(),
                activo=True
            )
        
        return user

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

class ProductoSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.CharField(source='categoria.nombre', read_only=True)
    
    class Meta:
        model = Producto
        fields = '__all__'

class CarritoItemSerializer(serializers.ModelSerializer):
    producto = ProductoSerializer(read_only=True)
    producto_id = serializers.IntegerField(write_only=True)
    subtotal = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    
    class Meta:
        model = CarritoItem
        fields = ['id', 'producto', 'producto_id', 'cantidad', 'subtotal', 'fecha_agregado']

class CarritoSerializer(serializers.ModelSerializer):
    items = CarritoItemSerializer(many=True, read_only=True)
    total = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    
    class Meta:
        model = Carrito
        fields = ['id', 'items', 'total', 'fecha_creacion', 'fecha_actualizacion']

class PedidoItemSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)
    imagen_url = serializers.CharField(source='producto.imagen_url', read_only=True)
    
    class Meta:
        model = PedidoItem
        fields = '__all__'

class PedidoSerializer(serializers.ModelSerializer):
    items = PedidoItemSerializer(many=True, read_only=True)
    usuario_nombre = serializers.SerializerMethodField()
    usuario_email = serializers.EmailField(source='usuario.email', read_only=True)
    conductor_info = serializers.SerializerMethodField()
    
    class Meta:
        model = Pedido
        fields = '__all__'
    
    def get_usuario_nombre(self, obj):
        return obj.usuario.get_full_name() or obj.usuario.username
    
    def get_conductor_info(self, obj):
        if obj.conductor:
            return {
                'id': obj.conductor.id,
                'nombre': obj.conductor.nombre_completo,
                'cedula': obj.conductor.cedula,
                'telefono': obj.conductor.telefono
            }
        return None


# PedidoTransporte serializers eliminados - funcionalidad consolidada en Pedido de user_management
