from django.contrib import admin
from .models import (
    Cliente, Conductor, Vehiculo, Ruta, Envio, 
    SeguimientoEnvio, Admin
)


@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'email', 'telefono', 'ciudad', 'activo', 'fecha_registro']
    list_filter = ['activo', 'ciudad', 'fecha_registro']
    search_fields = ['nombre', 'email', 'telefono']
    list_editable = ['activo']
    date_hierarchy = 'fecha_registro'


@admin.register(Conductor)
class ConductorAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'cedula', 'email', 'telefono', 'estado', 'activo']
    list_filter = ['estado', 'activo', 'fecha_contratacion']
    search_fields = ['nombre', 'cedula', 'email', 'licencia']
    list_editable = ['estado', 'activo']
    date_hierarchy = 'fecha_contratacion'


@admin.register(Vehiculo)
class VehiculoAdmin(admin.ModelAdmin):
    list_display = ['placa', 'marca', 'modelo', 'año', 'tipo', 'estado', 'activo']
    list_filter = ['tipo', 'estado', 'activo', 'marca']
    search_fields = ['placa', 'marca', 'modelo']
    list_editable = ['estado', 'activo']


@admin.register(Ruta)
class RutaAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'origen', 'destino', 'distancia_km', 'estado', 'activa']
    list_filter = ['estado', 'activa', 'fecha_creacion']
    search_fields = ['nombre', 'origen', 'destino']
    list_editable = ['estado', 'activa']
    date_hierarchy = 'fecha_creacion'


@admin.register(Envio)
class EnvioAdmin(admin.ModelAdmin):
    list_display = ['numero_guia', 'cliente', 'estado', 'prioridad', 'fecha_creacion']
    list_filter = ['estado', 'prioridad', 'fecha_creacion']
    search_fields = ['numero_guia', 'cliente__nombre', 'descripcion_carga']
    list_editable = ['estado', 'prioridad']
    date_hierarchy = 'fecha_creacion'
    raw_id_fields = ['cliente', 'ruta', 'vehiculo', 'conductor']


# PedidoTransporte eliminado - usar Pedido de user_management para pedidos de electrodomésticos

@admin.register(Admin)
class AdminUserAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'email', 'nivel_acceso', 'activo', 'fecha_contratacion']
    list_filter = ['nivel_acceso', 'activo', 'fecha_contratacion']
    search_fields = ['nombre', 'email', 'telefono']
    list_editable = ['nivel_acceso', 'activo']


@admin.register(SeguimientoEnvio)
class SeguimientoEnvioAdmin(admin.ModelAdmin):
    list_display = ['envio', 'estado', 'fecha_hora', 'usuario']
    list_filter = ['estado', 'fecha_hora']
    search_fields = ['envio__numero_guia', 'descripcion', 'ubicacion']
    date_hierarchy = 'fecha_hora'
    raw_id_fields = ['envio', 'usuario']
