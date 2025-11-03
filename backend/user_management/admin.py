from django.contrib import admin
from .models import UserProfile, Categoria, Producto, Carrito, CarritoItem, Pedido, PedidoItem, Contacto


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'nombres', 'apellidos', 'telefono', 'ciudad', 'fecha_creacion')
    list_filter = ('role', 'ciudad')
    search_fields = ('user__username', 'user__email', 'nombres', 'apellidos', 'telefono')


@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'activa', 'fecha_creacion')
    list_filter = ('activa',)
    search_fields = ('nombre',)


@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'categoria', 'precio', 'stock', 'activo', 'fecha_creacion')
    list_filter = ('categoria', 'activo')
    search_fields = ('nombre', 'descripcion')


@admin.register(Carrito)
class CarritoAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'fecha_creacion', 'fecha_actualizacion')
    search_fields = ('usuario__username',)


@admin.register(CarritoItem)
class CarritoItemAdmin(admin.ModelAdmin):
    list_display = ('carrito', 'producto', 'cantidad', 'subtotal', 'fecha_agregado')
    list_filter = ('fecha_agregado',)


@admin.register(Pedido)
class PedidoAdmin(admin.ModelAdmin):
    list_display = ('numero_pedido', 'usuario', 'estado', 'total', 'conductor', 'fecha_creacion')
    list_filter = ('estado', 'fecha_creacion')
    search_fields = ('numero_pedido', 'usuario__username', 'usuario__email')
    date_hierarchy = 'fecha_creacion'


@admin.register(PedidoItem)
class PedidoItemAdmin(admin.ModelAdmin):
    list_display = ('pedido', 'producto', 'cantidad', 'precio_unitario', 'subtotal')
    search_fields = ('pedido__numero_pedido', 'producto__nombre')


@admin.register(Contacto)
class ContactoAdmin(admin.ModelAdmin):
    list_display = ('get_nombre_completo', 'email', 'asunto', 'fecha_envio', 'leido', 'respondido', 'usuario')
    list_filter = ('leido', 'respondido', 'fecha_envio')
    search_fields = ('nombres', 'apellidos', 'email', 'asunto', 'mensaje')
    date_hierarchy = 'fecha_envio'
    readonly_fields = ('fecha_envio',)
    
    def get_nombre_completo(self, obj):
        return f"{obj.nombres} {obj.apellidos}"
    get_nombre_completo.short_description = 'Nombre Completo'
    
    fieldsets = (
        ('Información del Remitente', {
            'fields': ('usuario', 'nombres', 'apellidos', 'email')
        }),
        ('Mensaje', {
            'fields': ('asunto', 'mensaje')
        }),
        ('Estado', {
            'fields': ('fecha_envio', 'leido', 'respondido')
        }),
    )
