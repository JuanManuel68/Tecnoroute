# 📘 TecnoRoute Backend - Guía Completa

## 🏗️ Estructura General

```
backend/
├── backend/              # Configuración principal del proyecto Django
├── logistics/            # App principal - Gestión de transporte
├── user_management/      # App de e-commerce y pedidos
├── core/                 # (Sin uso actualmente)
├── manage.py            # Script principal de Django
├── requirements.txt     # Dependencias Python
└── tecnoroute.sqlite3  # Base de datos SQLite
```

---

## 📦 backend/ - Configuración del Proyecto

### `backend/settings.py`
**Propósito**: Configuración central de Django

**Configuraciones clave**:
- `SECRET_KEY`: Clave secreta de Django
- `DEBUG = True`: Modo desarrollo
- `ALLOWED_HOSTS`: Hosts permitidos
- `INSTALLED_APPS`: Apps instaladas (logistics, user_management, rest_framework, corsheaders)
- `DATABASES`: SQLite configurado
- `CORS_ALLOW_ALL_ORIGINS = True`: Permite peticiones desde React
- `REST_FRAMEWORK`: Configuración de API (autenticación por Token)

### `backend/urls.py`
**Propósito**: Enrutamiento principal del proyecto

**URLs configuradas**:
- `/api/` → `logistics.urls` (API principal)
- `/admin/` → Panel de administración de Django

### `backend/wsgi.py` y `backend/asgi.py`
**Propósito**: Punto de entrada para servidores WSGI/ASGI (producción)

---

## 🚛 logistics/ - App Principal de Transporte

### `logistics/models.py`
**Propósito**: Modelos de base de datos para logística

**Modelos definidos**:

#### `Cliente` (OBSOLETO - usar auth_user)
- Información básica de clientes
- **No se usa actualmente**, se reemplazó por sistema de usuarios Django

#### `Conductor`
- `nombre`, `cedula`, `licencia` - Datos personales
- `telefono`, `email`, `direccion` - Contacto
- `estado` - Opciones: disponible, en_ruta, descanso, inactivo
- `activo` - Booleano para soft delete
- `fecha_contratacion` - Fecha de ingreso
- Campos temporales para registro de vehículo

**Funcionalidades**:
- Gestión completa de conductores
- Asignación de pedidos
- Control de estados

#### `Vehiculo`
- `placa`, `marca`, `modelo`, `año` - Identificación
- `tipo` - camion, furgon, camioneta, motocicleta
- `capacidad_kg` - Capacidad de carga
- `color`, `combustible` - Detalles
- `numero_motor`, `numero_chasis` - Identificación técnica
- `estado` - disponible, en_uso, mantenimiento, inactivo
- `conductor_asignado` - FK a Conductor (único)

**Funcionalidades**:
- Un conductor = un vehículo
- Gestión de flota
- Control de disponibilidad

#### `Ruta`
- `origen`, `destino` - Ubicaciones
- `distancia_km`, `tiempo_estimado` - Métricas
- `costo_base` - Precio base de la ruta
- `activa` - Estado de la ruta

#### `Envio`
- `numero_guia` - Identificador único
- `cliente` - FK a Cliente
- `conductor`, `vehiculo` - Asignaciones
- `ruta` - FK a Ruta
- `fecha_envio`, `fecha_entrega_estimada`
- `estado` - pendiente, en_transito, entregado, cancelado
- `costo_total`, `peso_kg`
- `notas`, `direccion_recogida`, `direccion_entrega`

#### `SeguimientoEnvio`
- `envio` - FK a Envio
- `estado` - Estado en momento específico
- `ubicacion_actual` - Ubicación GPS
- `observaciones` - Notas del conductor
- `fecha_registro` - Timestamp automático

### `logistics/views.py`
**Propósito**: ViewSets y vistas personalizadas

**ViewSets principales**:

#### `ClienteViewSet`
- `GET /api/clientes/` - Listar clientes
- `POST /api/clientes/` - Crear cliente  
- `PUT/PATCH /api/clientes/{id}/` - Actualizar
- `DELETE /api/clientes/{id}/` - Eliminar
- Acción custom: `get_activos/` - Solo clientes activos

#### `ConductorViewSet`
- CRUD completo de conductores
- `cambiar_estado/` - Cambiar disponibilidad
- `guardar_datos_vehiculo/` - Guardar datos temporales del vehículo (modal bienvenida)
- Filtros: activos, disponibles
- **Importante**: Al crear conductor se genera contraseña temporal

#### `VehiculoViewSet`
- CRUD de vehículos
- `cambiar_estado/` - Cambiar estado del vehículo
- **Validación**: No permite duplicar placas
- **Auto-completado**: Usa datos temporales del conductor al crear

#### `RutaViewSet`
- CRUD de rutas
- `get_activas/` - Solo rutas activas

#### `EnvioViewSet`
- CRUD de envíos
- `cambiar_estado/` - Actualizar estado
- `buscar_por_guia/` - Buscar por número de guía
- `asignar_vehiculo_conductor/` - Asignar recursos
- `get_seguimiento/` - Obtener historial de seguimiento

### `logistics/auth_views.py`
**Propósito**: Autenticación y gestión de pedidos (e-commerce)

**Vistas de autenticación**:

#### `AuthView` (POST /api/auth/login/)
- Login con email o username
- Retorna token y datos de usuario
- Identifica rol (admin, conductor, customer)
- Incluye información específica por rol

#### `RegisterView` (POST /api/auth/register/)
- Registro de nuevos usuarios
- Crea UserProfile automáticamente
- Genera token inmediatamente

#### `LogoutView` (POST /api/auth/logout/)
- Elimina token de autenticación

#### `ChangePasswordView` (POST /api/auth/change-password/)
- Cambio de contraseña para usuarios autenticados
- Validaciones de seguridad:
  - Mínimo 8 caracteres
  - Al menos una mayúscula
  - Al menos un número

**ViewSets de e-commerce**:

#### `CategoriaViewSet`
- CRUD de categorías de productos

#### `ProductoViewSet`
- CRUD de productos
- Filtros por categoría y búsqueda
- Gestión de stock

#### `CarritoView`
- `GET` - Obtener carrito actual
- `POST` - Agregar producto
- `PATCH` - Actualizar cantidad
- `DELETE` - Eliminar item

#### `PedidoViewSet`
- `create()` - Crear pedido desde carrito
  - Valida stock
  - Crea pedido y items
  - Actualiza stock
  - Limpia carrito
- `cambiar_estado/` - Actualizar estado del pedido
- `asignar_conductor/` - Asignar conductor a pedido (solo admin)
- `getPendientes/` - Pedidos pendientes
- `getMisPedidos/` - Pedidos del conductor autenticado

### `logistics/serializers.py`
**Propósito**: Serialización de datos para API REST

**Serializers principales**:
- `ClienteSerializer` - Datos de cliente
- `ConductorSerializer` - Datos de conductor
- `VehiculoSerializer` - Datos de vehículo (con conductor anidado)
- `RutaSerializer` - Datos de ruta
- `EnvioSerializer` - Datos de envío (con relaciones anidadas)
- `SeguimientoEnvioSerializer` - Datos de seguimiento
- `UserSerializer` - Usuario Django
- `UserProfileSerializer` - Perfil de usuario con rol
- `PedidoSerializer` - Pedido con items anidados
- `ProductoSerializer` - Producto con categoría

### `logistics/urls.py`
**Propósito**: Rutas de la API

**Router (ViewSets)**:
- `/api/clientes/`
- `/api/conductores/`
- `/api/vehiculos/`
- `/api/rutas/`
- `/api/envios/`
- `/api/pedidos/`
- `/api/productos/`
- `/api/categorias/`

**Rutas directas**:
- `/api/auth/login/`
- `/api/auth/register/`
- `/api/auth/logout/`
- `/api/auth/change-password/`
- `/api/carrito/`

### `logistics/admin.py`
**Propósito**: Configuración del panel de administración

**Modelos registrados**:
- Conductor, Vehiculo, Ruta, Envio, SeguimientoEnvio
- Configuración de listado, filtros y búsqueda

### `logistics/validators.py`
**Propósito**: Validadores personalizados

- `validate_phone` - Valida formato de teléfono
- `validate_license` - Valida formato de licencia

---

## 👤 user_management/ - App de E-commerce

### `user_management/models.py`
**Propósito**: Modelos para sistema de pedidos

**Modelos**:

#### `UserProfile`
- Extiende auth_user con rol y datos adicionales
- `role` - admin, customer, conductor
- `telefono`, `direccion`, `ciudad`, `codigo_postal`

#### `Categoria`
- Categorías de productos
- `nombre`, `descripcion`, `activa`

#### `Producto`
- Catálogo de productos
- `nombre`, `descripcion`, `precio`, `stock`
- `categoria` - FK a Categoria
- `imagen_url`, `activo`

#### `Carrito`
- Carrito de compra por usuario
- `usuario` - FK a User (unique)
- `created_at`, `updated_at`
- Propiedad `total` calculada

#### `CarritoItem`
- Items en el carrito
- `carrito` - FK a Carrito
- `producto` - FK a Producto
- `cantidad`
- Propiedad `subtotal` calculada

#### `Pedido`
- Pedidos realizados
- `usuario` - FK a User
- `numero_pedido` - Único (PED-XXXXXXXX)
- `total`, `estado`
- `direccion_envio`, `telefono_contacto`
- `conductor` - FK a Conductor (nullable)
- `fecha_asignacion` - Cuando se asigna conductor

#### `PedidoItem`
- Items del pedido
- `pedido` - FK a Pedido
- `producto` - FK a Producto (on_delete=SET_NULL)
- `cantidad`, `precio_unitario`, `subtotal`
- `producto_nombre` - Snapshot del nombre

---

## 🔧 Scripts Útiles

### `create_products.py`
- Crea productos de ejemplo
- Categorías: Electrónica, Ropa, Alimentos

### `create_sample_data.py`
- Crea datos de muestra: clientes, conductores, vehículos

---

## 🗄️ Base de Datos

### `tecnoroute.sqlite3`
- Base de datos SQLite
- Incluye todas las tablas de Django + Apps
- ~339KB con datos de prueba

---

## 🔑 Autenticación y Permisos

### Tokens
- Sistema de tokens de Django REST Framework
- Token generado al login/registro
- Header: `Authorization: Token <token>`

### Roles
1. **admin** - Acceso completo
2. **conductor** - Ver pedidos asignados, actualizar estados
3. **customer** - Crear pedidos, ver historial

---

## 📚 Dependencias Principales

```
Django==4.2.24                # Framework web
djangorestframework==3.16.1   # API REST
django-cors-headers==4.7.0    # CORS para React
django-filter==25.1           # Filtros en API
```

---

**Ver también**: [FRONTEND_GUIDE.md](./FRONTEND_GUIDE.md) para documentación del frontend
