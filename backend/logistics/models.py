from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator


class Admin(models.Model):
    """Modelo para administradores del sistema"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, verbose_name="Usuario")
    nombre = models.CharField(max_length=200, verbose_name="Nombre")
    email = models.EmailField(unique=True, verbose_name="Correo Electrónico")
    telefono = models.CharField(max_length=20, verbose_name="Teléfono")
    direccion = models.TextField(blank=True, verbose_name="Dirección")
    nivel_acceso = models.CharField(max_length=20, choices=[
        ('superadmin', 'Super Administrador'),
        ('admin', 'Administrador'),
        ('moderador', 'Moderador'),
    ], default='admin', verbose_name="Nivel de Acceso")
    fecha_contratacion = models.DateField(verbose_name="Fecha de Contratación")
    activo = models.BooleanField(default=True, verbose_name="Activo")
    
    class Meta:
        verbose_name = "Administrador"
        verbose_name_plural = "Administradores"
        ordering = ['nombre']
    
    def __str__(self):
        return f"{self.nombre} - {self.get_nivel_acceso_display()}"



class Conductor(models.Model):
    ESTADO_CHOICES = [
        ('disponible', 'Disponible'),
        ('en_ruta', 'En Ruta'),
        ('descanso', 'En Descanso'),
        ('inactivo', 'Inactivo'),
    ]
    
    nombre = models.CharField(max_length=200, verbose_name="Nombre")
    cedula = models.CharField(max_length=20, unique=True, verbose_name="Cédula")
    licencia = models.CharField(max_length=50, verbose_name="Licencia de Conducir")
    telefono = models.CharField(max_length=20, verbose_name="Teléfono")
    email = models.EmailField(unique=True, verbose_name="Correo Electrónico")
    direccion = models.TextField(verbose_name="Dirección")
    fecha_contratacion = models.DateField(verbose_name="Fecha de Contratación")
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='disponible', verbose_name="Estado")
    activo = models.BooleanField(default=True, verbose_name="Activo")
    
    # Datos temporales del vehículo (para cuando el conductor completa el formulario en primer login)
    placa_temporal = models.CharField(max_length=20, blank=True, null=True, verbose_name="Placa Temporal")
    marca_vehiculo_temporal = models.CharField(max_length=100, blank=True, null=True, verbose_name="Marca Temporal")
    modelo_vehiculo_temporal = models.CharField(max_length=100, blank=True, null=True, verbose_name="Modelo Temporal")
    año_vehiculo_temporal = models.IntegerField(blank=True, null=True, verbose_name="Año Temporal")
    tipo_vehiculo_temporal = models.CharField(max_length=20, blank=True, null=True, verbose_name="Tipo Temporal")
    capacidad_kg_temporal = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True, verbose_name="Capacidad Temporal")
    color_vehiculo_temporal = models.CharField(max_length=50, blank=True, null=True, verbose_name="Color Temporal")
    combustible_temporal = models.CharField(max_length=20, blank=True, null=True, verbose_name="Combustible Temporal")
    numero_motor_temporal = models.CharField(max_length=50, blank=True, null=True, verbose_name="Motor Temporal")
    numero_chasis_temporal = models.CharField(max_length=50, blank=True, null=True, verbose_name="Chasis Temporal")

    class Meta:
        verbose_name = "Conductor"
        verbose_name_plural = "Conductores"
        ordering = ['nombre']

    def __str__(self):
        return f"{self.nombre} - {self.cedula}"


class Vehiculo(models.Model):
    TIPO_CHOICES = [
        ('camion', 'Camión'),
        ('furgon', 'Furgón'),
        ('camioneta', 'Camioneta'),
        ('motocicleta', 'Motocicleta'),
    ]
    
    ESTADO_CHOICES = [
        ('disponible', 'Disponible'),
        ('en_uso', 'En Uso'),
        ('mantenimiento', 'En Mantenimiento'),
        ('inactivo', 'Inactivo'),
    ]
    
    COMBUSTIBLE_CHOICES = [
        ('gasolina', 'Gasolina'),
        ('diesel', 'Diesel'),
        ('electrico', 'Eléctrico'),
        ('hibrido', 'Híbrido'),
    ]
    
    placa = models.CharField(max_length=20, unique=True, verbose_name="Placa")
    marca = models.CharField(max_length=100, verbose_name="Marca")
    modelo = models.CharField(max_length=100, verbose_name="Modelo")
    año = models.IntegerField(verbose_name="Año")
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES, verbose_name="Tipo")
    capacidad_kg = models.DecimalField(max_digits=8, decimal_places=2, verbose_name="Capacidad de Peso (kg)")
    color = models.CharField(max_length=50, default='Blanco', verbose_name="Color")
    combustible = models.CharField(max_length=20, choices=COMBUSTIBLE_CHOICES, default='gasolina', verbose_name="Combustible")
    numero_motor = models.CharField(max_length=50, blank=True, default='', verbose_name="Número de Motor")
    numero_chasis = models.CharField(max_length=50, blank=True, default='', verbose_name="Número de Chasis")
    conductor_asignado = models.OneToOneField(Conductor, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Conductor Asignado")
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='disponible', verbose_name="Estado")
    kilometraje = models.IntegerField(default=0, verbose_name="Kilometraje")
    fecha_registro = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Registro")
    activo = models.BooleanField(default=True, verbose_name="Activo")

    class Meta:
        verbose_name = "Vehículo"
        verbose_name_plural = "Vehículos"
        ordering = ['placa']

    def __str__(self):
        return f"{self.placa} - {self.marca} {self.modelo}"


class Ruta(models.Model):
    ESTADO_CHOICES = [
        ('planificada', 'Planificada'),
        ('en_progreso', 'En Progreso'),
        ('completada', 'Completada'),
        ('cancelada', 'Cancelada'),
    ]
    
    nombre = models.CharField(max_length=200, verbose_name="Nombre de la Ruta")
    origen = models.CharField(max_length=200, verbose_name="Origen")
    destino = models.CharField(max_length=200, verbose_name="Destino")
    distancia_km = models.DecimalField(max_digits=8, decimal_places=2, verbose_name="Distancia (km)")
    tiempo_estimado_horas = models.DecimalField(max_digits=6, decimal_places=2, verbose_name="Tiempo Estimado (horas)")
    costo_combustible = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Costo de Combustible")
    peajes = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name="Costo de Peajes")
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='planificada', verbose_name="Estado")
    fecha_creacion = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Creación")
    activa = models.BooleanField(default=True, verbose_name="Activa")

    class Meta:
        verbose_name = "Ruta"
        verbose_name_plural = "Rutas"
        ordering = ['-fecha_creacion']

    def __str__(self):
        return f"{self.nombre} ({self.origen} → {self.destino})"

    @property
    def costo_total(self):
        return self.costo_combustible + self.peajes


class Envio(models.Model):
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('en_transito', 'En Tránsito'),
        ('entregado', 'Entregado'),
        ('cancelado', 'Cancelado'),
        ('devuelto', 'Devuelto'),
    ]
    
    PRIORIDAD_CHOICES = [
        ('baja', 'Baja'),
        ('media', 'Media'),
        ('alta', 'Alta'),
        ('urgente', 'Urgente'),
    ]
    
    numero_guia = models.CharField(max_length=50, unique=True, verbose_name="Número de Guía")
    cliente = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="Cliente")
    ruta = models.ForeignKey(Ruta, on_delete=models.CASCADE, verbose_name="Ruta")
    vehiculo = models.ForeignKey(Vehiculo, on_delete=models.CASCADE, null=True, blank=True, verbose_name="Vehículo")
    conductor = models.ForeignKey(Conductor, on_delete=models.CASCADE, null=True, blank=True, verbose_name="Conductor")
    
    descripcion_carga = models.TextField(verbose_name="Descripción de la Carga")
    peso_kg = models.DecimalField(max_digits=8, decimal_places=2, verbose_name="Peso (kg)")
    volumen_m3 = models.DecimalField(max_digits=8, decimal_places=2, verbose_name="Volumen (m³)")
    
    direccion_recogida = models.TextField(verbose_name="Dirección de Recogida")
    direccion_entrega = models.TextField(verbose_name="Dirección de Entrega")
    contacto_recogida = models.CharField(max_length=200, verbose_name="Contacto Recogida")
    contacto_entrega = models.CharField(max_length=200, verbose_name="Contacto Entrega")
    telefono_recogida = models.CharField(max_length=20, verbose_name="Teléfono Recogida")
    telefono_entrega = models.CharField(max_length=20, verbose_name="Teléfono Entrega")
    
    fecha_recogida_programada = models.DateTimeField(verbose_name="Fecha de Recogida Programada")
    fecha_entrega_programada = models.DateTimeField(verbose_name="Fecha de Entrega Programada")
    fecha_recogida_real = models.DateTimeField(null=True, blank=True, verbose_name="Fecha de Recogida Real")
    fecha_entrega_real = models.DateTimeField(null=True, blank=True, verbose_name="Fecha de Entrega Real")
    
    costo_envio = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Costo del Envío")
    valor_declarado = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="Valor Declarado")
    
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='pendiente', verbose_name="Estado")
    prioridad = models.CharField(max_length=20, choices=PRIORIDAD_CHOICES, default='media', verbose_name="Prioridad")
    
    observaciones = models.TextField(blank=True, verbose_name="Observaciones")
    
    fecha_creacion = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Creación")
    fecha_actualizacion = models.DateTimeField(auto_now=True, verbose_name="Fecha de Actualización")
    
    class Meta:
        verbose_name = "Envío"
        verbose_name_plural = "Envíos"
        ordering = ['-fecha_creacion']

    def __str__(self):
        cliente_nombre = self.cliente.get_full_name() or self.cliente.username
        return f"Envío {self.numero_guia} - {cliente_nombre}"

    @property
    def dias_transito(self):
        if self.fecha_recogida_real and self.fecha_entrega_real:
            return (self.fecha_entrega_real - self.fecha_recogida_real).days
        return None


class SeguimientoEnvio(models.Model):
    envio = models.ForeignKey(Envio, on_delete=models.CASCADE, related_name='seguimientos', verbose_name="Envío")
    estado = models.CharField(max_length=100, verbose_name="Estado")
    descripcion = models.TextField(verbose_name="Descripción")
    ubicacion = models.CharField(max_length=200, blank=True, verbose_name="Ubicación")
    fecha_hora = models.DateTimeField(auto_now_add=True, verbose_name="Fecha y Hora")
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, verbose_name="Usuario")
    
    class Meta:
        verbose_name = "Seguimiento de Envío"
        verbose_name_plural = "Seguimientos de Envío"
        ordering = ['-fecha_hora']

    def __str__(self):
        return f"Seguimiento {self.envio.numero_guia} - {self.estado}"


# ELIMINADO: PedidoTransporte se unificó con Pedido en user_management
# Los pedidos de productos electrodomésticos usan el modelo Pedido
# Los envíos de logística usan el modelo Envio
