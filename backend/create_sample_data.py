#!/usr/bin/env python
"""
Script para crear datos de prueba para TecnoRoute
"""
import os
import sys
import django
from datetime import datetime, timedelta
from decimal import Decimal
import uuid

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User
from user_management.models import UserProfile
from logistics.models import Cliente, Conductor, Vehiculo, Ruta, Envio, SeguimientoEnvio


def create_sample_users():
    """Crear usuarios de prueba"""
    print("📝 Creando usuarios de prueba...")
    
    users_data = [
        {
            'username': 'cliente1@tecnoroute.com',
            'email': 'cliente1@tecnoroute.com',
            'password': 'cliente123',
            'first_name': 'María',
            'last_name': 'González López',
            'role': 'customer',
            'telefono': '3101234567',
            'direccion': 'Carrera 15 #45-67',
            'ciudad': 'Bogotá',
            'codigo_postal': '110111'
        },
        {
            'username': 'cliente2@tecnoroute.com',
            'email': 'cliente2@tecnoroute.com',
            'password': 'cliente123',
            'first_name': 'Carlos',
            'last_name': 'Martínez Silva',
            'role': 'customer',
            'telefono': '3157890123',
            'direccion': 'Calle 80 #12-34',
            'ciudad': 'Medellín',
            'codigo_postal': '050001'
        },
        {
            'username': 'conductor1@tecnoroute.com',
            'email': 'conductor1@tecnoroute.com',
            'password': 'conductor123',
            'first_name': 'Pedro',
            'last_name': 'Rodríguez Torres',
            'role': 'conductor',
            'telefono': '3209876543',
            'direccion': 'Barrio Kennedy, Calle 38 Sur #78F-23',
            'ciudad': 'Bogotá',
            'codigo_postal': '110831'
        }
    ]
    
    created_users = []
    for user_data in users_data:
        if not User.objects.filter(email=user_data['email']).exists():
            user = User.objects.create_user(
                username=user_data['username'],
                email=user_data['email'],
                password=user_data['password'],
                first_name=user_data['first_name'],
                last_name=user_data['last_name']
            )
            
            profile = UserProfile.objects.create(
                user=user,
                role=user_data['role'],
                telefono=user_data['telefono'],
                direccion=user_data['direccion'],
                ciudad=user_data['ciudad'],
                codigo_postal=user_data['codigo_postal']
            )
            
            created_users.append(user)
            print(f"✅ Usuario creado: {user.get_full_name()} ({user_data['role']})")
        else:
            print(f"⚠️ Usuario ya existe: {user_data['email']}")
    
    return created_users


def create_sample_clientes():
    """Crear clientes de logística de prueba"""
    print("\n🏢 Creando clientes de logística...")
    
    clientes_data = [
        {
            'nombre': 'Distribuidora ABC S.A.S',
            'email': 'ventas@distribuidoraabc.com',
            'telefono': '6013204500',
            'direccion': 'Zona Industrial, Carrera 68 #25B-47',
            'ciudad': 'Bogotá',
            'codigo_postal': '110931'
        },
        {
            'nombre': 'Comercializadora del Valle',
            'email': 'pedidos@comercializadoravalle.com',
            'telefono': '6024441234',
            'direccion': 'Parque Industrial del Cauca, Calle 15 #45-12',
            'ciudad': 'Cali',
            'codigo_postal': '760001'
        },
        {
            'nombre': 'Logística Norte S.A.',
            'email': 'operaciones@logisticanorte.com',
            'telefono': '6045551234',
            'direccion': 'Zona Franca, Carrera 65 #78-90',
            'ciudad': 'Medellín',
            'codigo_postal': '050010'
        }
    ]
    
    created_clientes = []
    for cliente_data in clientes_data:
        if not Cliente.objects.filter(email=cliente_data['email']).exists():
            cliente = Cliente.objects.create(**cliente_data)
            created_clientes.append(cliente)
            print(f"✅ Cliente creado: {cliente.nombre}")
        else:
            print(f"⚠️ Cliente ya existe: {cliente_data['email']}")
    
    return created_clientes


def create_sample_conductores():
    """Crear conductores de prueba"""
    print("\n🚗 Creando conductores...")
    
    conductores_data = [
        {
            'nombre': 'Juan Carlos Pérez García',
            'cedula': '80123456',
            'licencia': 'C2-80123456',
            'telefono': '3112345678',
            'email': 'juan.perez@tecnoroute.com',
            'direccion': 'Barrio La Paz, Calle 45 #12-34',
            'fecha_contratacion': '2023-06-15',
            'estado': 'disponible'
        },
        {
            'nombre': 'Ana Lucía Rodríguez Morales',
            'cedula': '43987654',
            'licencia': 'C2-43987654',
            'telefono': '3207654321',
            'email': 'ana.rodriguez@tecnoroute.com',
            'direccion': 'Comuna 10, Carrera 50 #67-89',
            'fecha_contratacion': '2023-08-20',
            'estado': 'en_ruta'
        }
    ]
    
    created_conductores = []
    for conductor_data in conductores_data:
        if not Conductor.objects.filter(cedula=conductor_data['cedula']).exists():
            conductor = Conductor.objects.create(**conductor_data)
            created_conductores.append(conductor)
            print(f"✅ Conductor creado: {conductor.nombre}")
        else:
            print(f"⚠️ Conductor ya existe: {conductor_data['cedula']}")
    
    return created_conductores


def create_sample_vehiculos():
    """Crear vehículos de prueba"""
    print("\n🚛 Creando vehículos...")
    
    vehiculos_data = [
        {
            'placa': 'ABC-123',
            'marca': 'Mercedes-Benz',
            'modelo': 'Sprinter 515',
            'año': 2022,
            'tipo': 'furgoneta',
            'capacidad_peso': Decimal('3500.00'),
            'capacidad_volumen': Decimal('15.50'),
            'estado': 'disponible',
            'kilometraje': 45000
        },
        {
            'placa': 'DEF-456',
            'marca': 'Iveco',
            'modelo': 'Daily 70C17',
            'año': 2021,
            'tipo': 'camion',
            'capacidad_peso': Decimal('7000.00'),
            'capacidad_volumen': Decimal('25.00'),
            'estado': 'en_uso',
            'kilometraje': 78000
        },
        {
            'placa': 'GHI-789',
            'marca': 'Ford',
            'modelo': 'Transit 350',
            'año': 2023,
            'tipo': 'furgoneta',
            'capacidad_peso': Decimal('2000.00'),
            'capacidad_volumen': Decimal('12.00'),
            'estado': 'mantenimiento',
            'kilometraje': 15000
        }
    ]
    
    created_vehiculos = []
    for vehiculo_data in vehiculos_data:
        if not Vehiculo.objects.filter(placa=vehiculo_data['placa']).exists():
            vehiculo = Vehiculo.objects.create(**vehiculo_data)
            created_vehiculos.append(vehiculo)
            print(f"✅ Vehículo creado: {vehiculo.placa} - {vehiculo.marca} {vehiculo.modelo}")
        else:
            print(f"⚠️ Vehículo ya existe: {vehiculo_data['placa']}")
    
    return created_vehiculos


def create_sample_rutas():
    """Crear rutas de prueba"""
    print("\n🛣️ Creando rutas...")
    
    rutas_data = [
        {
            'nombre': 'Bogotá - Medellín Express',
            'origen': 'Bogotá, Cundinamarca',
            'destino': 'Medellín, Antioquia',
            'distancia_km': Decimal('415.00'),
            'tiempo_estimado_horas': Decimal('7.5'),
            'costo_combustible': Decimal('180000.00'),
            'peajes': Decimal('45000.00'),
            'estado': 'planificada'
        },
        {
            'nombre': 'Bogotá - Cali Sur',
            'origen': 'Bogotá, Cundinamarca',
            'destino': 'Cali, Valle del Cauca',
            'distancia_km': Decimal('460.00'),
            'tiempo_estimado_horas': Decimal('8.0'),
            'costo_combustible': Decimal('200000.00'),
            'peajes': Decimal('38000.00'),
            'estado': 'en_progreso'
        },
        {
            'nombre': 'Medellín - Cali Costa',
            'origen': 'Medellín, Antioquia',
            'destino': 'Cali, Valle del Cauca',
            'distancia_km': Decimal('340.00'),
            'tiempo_estimado_horas': Decimal('6.0'),
            'costo_combustible': Decimal('145000.00'),
            'peajes': Decimal('28000.00'),
            'estado': 'planificada'
        }
    ]
    
    created_rutas = []
    for ruta_data in rutas_data:
        if not Ruta.objects.filter(nombre=ruta_data['nombre']).exists():
            ruta = Ruta.objects.create(**ruta_data)
            created_rutas.append(ruta)
            print(f"✅ Ruta creada: {ruta.nombre}")
        else:
            print(f"⚠️ Ruta ya existe: {ruta_data['nombre']}")
    
    return created_rutas


def create_sample_envios():
    """Crear envíos de prueba"""
    print("\n📦 Creando envíos...")
    
    # Obtener datos existentes
    clientes = Cliente.objects.all()
    conductores = Conductor.objects.all()
    vehiculos = Vehiculo.objects.all()
    rutas = Ruta.objects.all()
    
    if not (clientes and conductores and vehiculos and rutas):
        print("⚠️ No hay suficientes datos para crear envíos")
        return []
    
    envios_data = [
        {
            'numero_guia': f'TR{str(uuid.uuid4()).replace("-", "").upper()[:8]}',
            'cliente': clientes[0],
            'ruta': rutas[0],
            'vehiculo': vehiculos[0],
            'conductor': conductores[0],
            'descripcion_carga': 'Equipos electrónicos - Computadores y accesorios',
            'peso_kg': Decimal('450.00'),
            'volumen_m3': Decimal('2.5'),
            'direccion_recogida': 'Zona Industrial, Carrera 68 #25B-47, Bogotá',
            'direccion_entrega': 'Centro Comercial Santa Fe, Medellín',
            'contacto_recogida': 'María González - Logística',
            'contacto_entrega': 'Carlos Pérez - Almacén',
            'telefono_recogida': '3101234567',
            'telefono_entrega': '3157890123',
            'fecha_recogida_programada': datetime.now() + timedelta(days=1),
            'fecha_entrega_programada': datetime.now() + timedelta(days=2),
            'costo_envio': Decimal('380000.00'),
            'valor_declarado': Decimal('2500000.00'),
            'estado': 'pendiente',
            'prioridad': 'alta'
        },
        {
            'numero_guia': f'TR{str(uuid.uuid4()).replace("-", "").upper()[:8]}',
            'cliente': clientes[1] if len(clientes) > 1 else clientes[0],
            'ruta': rutas[1] if len(rutas) > 1 else rutas[0],
            'vehiculo': vehiculos[1] if len(vehiculos) > 1 else vehiculos[0],
            'conductor': conductores[1] if len(conductores) > 1 else conductores[0],
            'descripcion_carga': 'Productos farmacéuticos - Medicamentos temperatura controlada',
            'peso_kg': Decimal('180.00'),
            'volumen_m3': Decimal('1.2'),
            'direccion_recogida': 'Parque Industrial del Cauca, Calle 15 #45-12, Cali',
            'direccion_entrega': 'Hospital Central, Bogotá',
            'contacto_recogida': 'Ana Torres - Producción',
            'contacto_entrega': 'Dr. Luis Martínez - Farmacia',
            'telefono_recogida': '3207654321',
            'telefono_entrega': '3112345678',
            'fecha_recogida_programada': datetime.now() - timedelta(hours=2),
            'fecha_entrega_programada': datetime.now() + timedelta(hours=6),
            'fecha_recogida_real': datetime.now() - timedelta(hours=1, minutes=30),
            'costo_envio': Decimal('420000.00'),
            'valor_declarado': Decimal('800000.00'),
            'estado': 'en_transito',
            'prioridad': 'urgente'
        }
    ]
    
    created_envios = []
    for envio_data in envios_data:
        if not Envio.objects.filter(numero_guia=envio_data['numero_guia']).exists():
            envio = Envio.objects.create(**envio_data)
            created_envios.append(envio)
            
            # Crear seguimiento inicial
            SeguimientoEnvio.objects.create(
                envio=envio,
                estado=envio.estado,
                descripcion=f'Envío creado - Estado inicial: {envio.get_estado_display()}',
                ubicacion=envio.direccion_recogida.split(',')[0],
            )
            
            print(f"✅ Envío creado: {envio.numero_guia} - {envio.cliente.nombre}")
        else:
            print(f"⚠️ Envío ya existe: {envio_data['numero_guia']}")
    
    return created_envios


def main():
    """Función principal"""
    print("🚀 CREANDO DATOS DE PRUEBA PARA TECNOROUTE")
    print("=" * 50)
    
    try:
        # Crear datos en orden de dependencias
        users = create_sample_users()
        clientes = create_sample_clientes()
        conductores = create_sample_conductores()
        vehiculos = create_sample_vehiculos()
        rutas = create_sample_rutas()
        envios = create_sample_envios()
        
        print("\n🎉 ¡DATOS DE PRUEBA CREADOS EXITOSAMENTE!")
        print("=" * 50)
        print(f"👥 Usuarios creados: {len(users)}")
        print(f"🏢 Clientes creados: {len(clientes)}")
        print(f"🚗 Conductores creados: {len(conductores)}")
        print(f"🚛 Vehículos creados: {len(vehiculos)}")
        print(f"🛣️ Rutas creadas: {len(rutas)}")
        print(f"📦 Envíos creados: {len(envios)}")
        
        print("\n📝 CREDENCIALES DISPONIBLES:")
        print("🔐 Admin: admin@tecnoroute.com / admin123")
        print("👤 Cliente 1: cliente1@tecnoroute.com / cliente123")
        print("👤 Cliente 2: cliente2@tecnoroute.com / cliente123")
        print("🚗 Conductor: conductor1@tecnoroute.com / conductor123")
        
        print("\n🌐 URLs DISPONIBLES:")
        print("🖥️ Backend API: http://localhost:8000/api/")
        print("👨‍💻 Django Admin: http://localhost:8000/admin/")
        print("🌍 Frontend: http://localhost:3000/")
        
    except Exception as e:
        print(f"❌ Error creando datos de prueba: {str(e)}")
        return False
    
    return True


if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)