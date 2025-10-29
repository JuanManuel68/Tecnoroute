#!/usr/bin/env python
"""
Script para crear productos de electrodomésticos para TecnoRoute
"""
import os
import sys
import django
from decimal import Decimal

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from user_management.models import Categoria, Producto


def create_categories():
    """Crear categorías de electrodomésticos"""
    print("📂 Creando categorías de productos...")
    
    categorias_data = [
        {
            'nombre': 'Refrigeradores',
            'descripcion': 'Refrigeradores y neveras de todas las capacidades',
            'imagen': 'https://via.placeholder.com/300x200?text=Refrigeradores',
            'activa': True
        },
        {
            'nombre': 'Lavadoras',
            'descripcion': 'Lavadoras automáticas y semiautomáticas',
            'imagen': 'https://via.placeholder.com/300x200?text=Lavadoras',
            'activa': True
        },
        {
            'nombre': 'Televisores',
            'descripcion': 'Smart TV y televisores de todas las pulgadas',
            'imagen': 'https://via.placeholder.com/300x200?text=Televisores',
            'activa': True
        },
        {
            'nombre': 'Electrodomésticos Cocina',
            'descripcion': 'Microondas, licuadoras, estufas y más',
            'imagen': 'https://via.placeholder.com/300x200?text=Cocina',
            'activa': True
        },
        {
            'nombre': 'Aires Acondicionados',
            'descripcion': 'Equipos de aire acondicionado y ventilación',
            'imagen': 'https://via.placeholder.com/300x200?text=Aires+AC',
            'activa': True
        }
    ]
    
    created_categories = []
    for categoria_data in categorias_data:
        categoria, created = Categoria.objects.get_or_create(
            nombre=categoria_data['nombre'],
            defaults=categoria_data
        )
        if created:
            created_categories.append(categoria)
            print(f"✅ Categoría creada: {categoria.nombre}")
        else:
            print(f"⚠️ Categoría ya existe: {categoria.nombre}")
    
    return Categoria.objects.all()


def create_products():
    """Crear productos de electrodomésticos"""
    print("\n🛍️ Creando productos de electrodomésticos...")
    
    # Obtener categorías
    categorias = {cat.nombre: cat for cat in Categoria.objects.all()}
    
    productos_data = [
        # Refrigeradores
        {
            'nombre': 'Refrigerador LG 420L Frost Free',
            'descripcion': 'Refrigerador LG de 420 litros con tecnología Frost Free, dispensador de agua y compartimento para vegetales.',
            'categoria': categorias.get('Refrigeradores'),
            'precio': Decimal('1299000.00'),
            'stock': 15,
            'imagen_url': 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=400&fit=crop',
            'activo': True
        },
        {
            'nombre': 'Nevera Samsung 350L No Frost',
            'descripcion': 'Nevera Samsung de 350 litros con tecnología No Frost, eficiencia energética A+ y diseño moderno.',
            'categoria': categorias.get('Refrigeradores'),
            'precio': Decimal('1150000.00'),
            'stock': 12,
            'imagen_url': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=400&fit=crop',
            'activo': True
        },
        {
            'nombre': 'Refrigerador Whirlpool 280L',
            'descripcion': 'Refrigerador compacto Whirlpool ideal para apartamentos, 280 litros de capacidad.',
            'categoria': categorias.get('Refrigeradores'),
            'precio': Decimal('899000.00'),
            'stock': 20,
            'imagen_url': 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400&h=400&fit=crop',
            'activo': True
        },
        
        # Lavadoras
        {
            'nombre': 'Lavadora LG 18kg Carga Superior',
            'descripcion': 'Lavadora LG de 18kg con carga superior, 10 programas de lavado y función turbo wash.',
            'categoria': categorias.get('Lavadoras'),
            'precio': Decimal('1450000.00'),
            'stock': 8,
            'imagen_url': 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&h=400&fit=crop',
            'activo': True
        },
        {
            'nombre': 'Lavadora Samsung 16kg Digital Inverter',
            'descripcion': 'Lavadora Samsung con tecnología Digital Inverter, 16kg de capacidad y 12 programas de lavado.',
            'categoria': categorias.get('Lavadoras'),
            'precio': Decimal('1350000.00'),
            'stock': 10,
            'imagen_url': 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400&h=400&fit=crop',
            'activo': True
        },
        {
            'nombre': 'Lavadora Electrolux 12kg EcoTurbo',
            'descripcion': 'Lavadora Electrolux de 12kg con tecnología EcoTurbo para mayor eficiencia en el lavado.',
            'categoria': categorias.get('Lavadoras'),
            'precio': Decimal('980000.00'),
            'stock': 15,
            'imagen_url': 'https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=400&h=400&fit=crop',
            'activo': True
        },
        
        # Televisores
        {
            'nombre': 'Smart TV Samsung 55" 4K UHD',
            'descripcion': 'Smart TV Samsung de 55 pulgadas con resolución 4K UHD, HDR y sistema operativo Tizen.',
            'categoria': categorias.get('Televisores'),
            'precio': Decimal('1899000.00'),
            'stock': 12,
            'imagen_url': 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&h=400&fit=crop',
            'activo': True
        },
        {
            'nombre': 'Smart TV LG 43" Full HD',
            'descripcion': 'Smart TV LG de 43 pulgadas Full HD con WebOS, WiFi integrado y control por voz.',
            'categoria': categorias.get('Televisores'),
            'precio': Decimal('1299000.00'),
            'stock': 18,
            'imagen_url': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop',
            'activo': True
        },
        {
            'nombre': 'TV Sony 65" 4K Android TV',
            'descripcion': 'Televisor Sony Bravia de 65 pulgadas con 4K, Android TV y tecnología Triluminos.',
            'categoria': categorias.get('Televisores'),
            'precio': Decimal('2799000.00'),
            'stock': 6,
            'imagen_url': 'https://images.unsplash.com/photo-1601944177325-f8867652837f?w=400&h=400&fit=crop',
            'activo': True
        },
        
        # Electrodomésticos Cocina
        {
            'nombre': 'Microondas Panasonic 1.2 Cu.Ft',
            'descripcion': 'Microondas Panasonic de 1.2 pies cúbicos con 10 niveles de potencia y función descongelar.',
            'categoria': categorias.get('Electrodomésticos Cocina'),
            'precio': Decimal('349000.00'),
            'stock': 25,
            'imagen_url': 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=400&h=400&fit=crop',
            'activo': True
        },
        {
            'nombre': 'Licuadora Oster 3 Velocidades',
            'descripcion': 'Licuadora Oster con jarra de vidrio, 3 velocidades y función pulso para preparaciones perfectas.',
            'categoria': categorias.get('Electrodomésticos Cocina'),
            'precio': Decimal('189000.00'),
            'stock': 30,
            'imagen_url': 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=400&fit=crop',
            'activo': True
        },
        {
            'nombre': 'Estufa Haceb 4 Puestos Gas',
            'descripcion': 'Estufa Haceb de 4 puestos a gas con horno, parrillas en hierro fundido y encendido eléctrico.',
            'categoria': categorias.get('Electrodomésticos Cocina'),
            'precio': Decimal('899000.00'),
            'stock': 12,
            'imagen_url': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
            'activo': True
        },
        
        # Aires Acondicionados
        {
            'nombre': 'Aire Acondicionado LG 12000 BTU',
            'descripcion': 'Aire acondicionado LG Split de 12000 BTU con función frío/calor y control remoto.',
            'categoria': categorias.get('Aires Acondicionados'),
            'precio': Decimal('1299000.00'),
            'stock': 10,
            'imagen_url': 'https://images.unsplash.com/photo-1631545804749-7416cf5e1b31?w=400&h=400&fit=crop',
            'activo': True
        },
        {
            'nombre': 'Aire Acondicionado Samsung 18000 BTU Inverter',
            'descripcion': 'Aire acondicionado Samsung con tecnología Inverter, 18000 BTU, ultra silencioso.',
            'categoria': categorias.get('Aires Acondicionados'),
            'precio': Decimal('1799000.00'),
            'stock': 8,
            'imagen_url': 'https://images.unsplash.com/photo-1635274538481-52ab53c81d1e?w=400&h=400&fit=crop',
            'activo': True
        },
        {
            'nombre': 'Ventilador de Techo Hunter 52"',
            'descripcion': 'Ventilador de techo Hunter de 52 pulgadas con luz LED integrada y control remoto.',
            'categoria': categorias.get('Aires Acondicionados'),
            'precio': Decimal('449000.00'),
            'stock': 20,
            'imagen_url': 'https://images.unsplash.com/photo-1622289662807-16d0d07e3b0f?w=400&h=400&fit=crop',
            'activo': True
        },
        
        # Productos adicionales para completar 16+
        {
            'nombre': 'Refrigerador Mabe 300L Frost Free',
            'descripcion': 'Refrigerador Mabe de 300 litros con tecnología Frost Free, ideal para familias pequeñas.',
            'categoria': categorias.get('Refrigeradores'),
            'precio': Decimal('999000.00'),
            'stock': 14,
            'imagen_url': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&sat=20',
            'activo': True
        },
        {
            'nombre': 'Lavadora Secadora LG 15kg WashTower',
            'descripcion': 'Lavadora y secadora apilable LG WashTower de 15kg con tecnología TurboWash y Steam.',
            'categoria': categorias.get('Lavadoras'),
            'precio': Decimal('2299000.00'),
            'stock': 5,
            'imagen_url': 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&h=400&fit=crop',
            'activo': True
        },
        {
            'nombre': 'Smart TV TCL 32" Android TV',
            'descripcion': 'Smart TV TCL de 32 pulgadas con Android TV, Chromecast integrado y Google Assistant.',
            'categoria': categorias.get('Televisores'),
            'precio': Decimal('899000.00'),
            'stock': 25,
            'imagen_url': 'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=400&h=400&fit=crop',
            'activo': True
        },
        {
            'nombre': 'Freidora de Aire Ninja 5.5L',
            'descripcion': 'Freidora de aire Ninja de 5.5 litros con 6 funciones de cocción y control digital.',
            'categoria': categorias.get('Electrodomésticos Cocina'),
            'precio': Decimal('459000.00'),
            'stock': 20,
            'imagen_url': 'https://images.unsplash.com/photo-1629385103725-2e4634fb1c09?w=400&h=400&fit=crop',
            'activo': True
        },
        {
            'nombre': 'Cafetera Oster 12 Tazas Programable',
            'descripcion': 'Cafetera Oster programable de 12 tazas con filtro permanente y función auto-apagado.',
            'categoria': categorias.get('Electrodomésticos Cocina'),
            'precio': Decimal('229000.00'),
            'stock': 35,
            'imagen_url': 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=400&fit=crop',
            'activo': True
        },
        {
            'nombre': 'Aire Acondicionado Carrier 24000 BTU',
            'descripcion': 'Aire acondicionado Carrier tipo ventana de 24000 BTU, ideal para espacios grandes.',
            'categoria': categorias.get('Aires Acondicionados'),
            'precio': Decimal('1599000.00'),
            'stock': 7,
            'imagen_url': 'https://images.unsplash.com/photo-1597925376185-1f8bf6451c62?w=400&h=400&fit=crop',
            'activo': True
        },
        {
            'nombre': 'Lavaplatos Electrolux 14 Servicios',
            'descripcion': 'Lavaplatos Electrolux empotrable para 14 servicios con 6 programas de lavado.',
            'categoria': categorias.get('Electrodomésticos Cocina'),
            'precio': Decimal('1899000.00'),
            'stock': 8,
            'imagen_url': 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=400&fit=crop',
            'activo': True
        },
        {
            'nombre': 'TV Samsung 75" QLED 4K',
            'descripcion': 'Smart TV Samsung QLED de 75 pulgadas con tecnología Quantum Dot y HDR10+.',
            'categoria': categorias.get('Televisores'),
            'precio': Decimal('4299000.00'),
            'stock': 3,
            'imagen_url': 'https://images.unsplash.com/photo-1593359863503-f598531ec1ca?w=400&h=400&fit=crop',
            'activo': True
        },
        {
            'nombre': 'Batidora KitchenAid Stand Mixer',
            'descripcion': 'Batidora de pedestal KitchenAid con bowl de 4.8L, 10 velocidades y múltiples accesorios.',
            'categoria': categorias.get('Electrodomésticos Cocina'),
            'precio': Decimal('1299000.00'),
            'stock': 12,
            'imagen_url': 'https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=400&h=400&fit=crop',
            'activo': True
        },
        {
            'nombre': 'Refrigerador Side by Side Whirlpool 600L',
            'descripcion': 'Refrigerador Whirlpool lado a lado de 600L con dispensador de agua y hielo.',
            'categoria': categorias.get('Refrigeradores'),
            'precio': Decimal('2799000.00'),
            'stock': 6,
            'imagen_url': 'https://images.unsplash.com/photo-1565480013926-d9c43bbf7115?w=400&h=400&fit=crop',
            'activo': True
        }
    ]
    
    created_products = []
    for producto_data in productos_data:
        # Verificar si el producto ya existe
        existing_product = Producto.objects.filter(
            nombre=producto_data['nombre']
        ).first()
        
        if not existing_product:
            producto = Producto.objects.create(**producto_data)
            created_products.append(producto)
            print(f"✅ Producto creado: {producto.nombre} - ${producto.precio:,.0f}")
        else:
            # Actualizar la imagen del producto existente
            existing_product.imagen_url = producto_data['imagen_url']
            existing_product.save()
            print(f"🔄 Producto actualizado: {producto_data['nombre']}")
    
    return created_products


def main():
    """Función principal"""
    print("🛍️ CREANDO CATÁLOGO DE PRODUCTOS PARA TECNOROUTE")
    print("=" * 60)
    
    try:
        # Crear categorías primero
        categorias = create_categories()
        
        # Crear productos
        productos = create_products()
        
        # Mostrar resumen
        total_categorias = Categoria.objects.filter(activa=True).count()
        total_productos = Producto.objects.filter(activo=True).count()
        
        print(f"\n🎉 ¡CATÁLOGO CREADO EXITOSAMENTE!")
        print("=" * 60)
        print(f"📂 Categorías activas: {total_categorias}")
        print(f"🛍️ Productos activos: {total_productos}")
        
        print(f"\n💰 RANGO DE PRECIOS:")
        min_precio = Producto.objects.filter(activo=True).order_by('precio').first()
        max_precio = Producto.objects.filter(activo=True).order_by('-precio').first()
        if min_precio and max_precio:
            print(f"Desde: ${min_precio.precio:,.0f} ({min_precio.nombre})")
            print(f"Hasta: ${max_precio.precio:,.0f} ({max_precio.nombre})")
        
        print(f"\n🌐 URLS DISPONIBLES:")
        print("🖥️ Frontend: http://localhost:3001/productos")
        print("👨‍💻 Django Admin: http://localhost:8000/admin/")
        
        print(f"\n🔐 CREDENCIALES PARA PROBAR:")
        print("👤 Usuario: cliente1@tecnoroute.com / cliente123")
        print("👤 Usuario: cliente2@tecnoroute.com / cliente123")
        print("🔐 Admin: admin@tecnoroute.com / admin123")
        
    except Exception as e:
        print(f"❌ Error creando catálogo: {str(e)}")
        return False
    
    return True


if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)