# 📘 TecnoRoute Frontend - Guía Completa

## 🏗️ Estructura General

```
frontend/
├── public/              # Archivos estáticos
├── src/
│   ├── components/      # Componentes reutilizables
│   ├── pages/          # Páginas principales
│   ├── context/        # Context API (estado global)
│   ├── services/       # Servicios API
│   ├── App.jsx         # Componente raíz
│   └── index.jsx       # Punto de entrada
└── package.json        # Dependencias y scripts
```

---

## 📦 Archivos Raíz

### `package.json`
**Propósito**: Configuración del proyecto Node.js

**Dependencias principales**:
- `react` 19.0.0 - Framework UI
- `react-router-dom` 7.1.1 - Enrutamiento
- `@mui/material` 6.3.1 - Componentes UI
- `@heroicons/react` 2.2.0 - Íconos
- `axios` 1.7.9 - Cliente HTTP

**Scripts**:
- `npm start` - Servidor desarrollo (puerto 3000)
- `npm run build` - Build producción
- `npm test` - Ejecutar tests

### `src/index.jsx`
**Propósito**: Punto de entrada React

- Renderiza `<App />` en el DOM
- Envuelve con `BrowserRouter` para rutas

### `src/App.jsx`
**Propósito**: Componente raíz con rutas

**Funcionalidad**:
- Define todas las rutas de la aplicación
- Envuelve con `<AuthProvider>` para autenticación global
- Layout con Navbar condicional según rol

**Rutas principales**:
- `/` - Login
- `/register` - Registro
- `/admin-dashboard` - Dashboard admin
- `/conductor-dashboard` - Dashboard conductor
- `/cliente-dashboard` - Dashboard cliente
- `/pedidos-admin` - Gestión pedidos (admin)
- `/conductores` - Gestión conductores (admin)
- `/vehiculos` - Gestión vehículos (admin)
- `/clientes` - Gestión clientes (admin)
- `/products` - Catálogo productos
- `/cart` - Carrito compra
- `/my-orders` - Mis pedidos

---

## 🔐 context/ - Estado Global

### `AuthContext.jsx`
**Propósito**: Gestión de autenticación global

**Estado**:
- `user` - Datos del usuario autenticado
- `loading` - Estado de carga
- `isAuthenticated` - Boolean de autenticación

**Funciones**:
- `login(email, password)` - Iniciar sesión
- `register(userData)` - Registrar usuario
- `logout()` - Cerrar sesión

**Almacenamiento**:
- Token en `localStorage.authToken`
- Datos de usuario en `localStorage.user`

**Validación**:
- Verifica token al cargar la app
- Redirige según rol del usuario

---

## 🛠️ services/ - API

### `apiService.jsx`
**Propósito**: Cliente HTTP y endpoints API

**Configuración Axios**:
```javascript
baseURL: 'http://localhost:8000'
timeout: 10000
headers: { 'Content-Type': 'application/json' }
```

**Interceptores**:
- Request: Agrega token de autenticación
- Response: Maneja errores 401 (logout automático)

**APIs exportadas**:

#### `clientesAPI`
- `getAll()`, `getById(id)`, `create(data)`, `update(id, data)`, `delete(id)`
- `getActivos()` - Solo clientes activos

#### `conductoresAPI`
- CRUD completo + `getDisponibles()`, `cambiarEstado(id, estado)`

#### `vehiculosAPI`
- CRUD completo + `getDisponibles()`, `cambiarEstado(id, estado)`

#### `pedidosAPI`
- CRUD completo
- `cambiarEstado(id, estado)` - Actualizar estado
- `tomarPedido(id)` - Conductor toma pedido
- `asignarConductor(pedidoId, conductorId)` - Admin asigna
- `getPendientes()` - Pedidos pendientes
- `getMisPedidos()` - Pedidos del conductor

#### `productosAPI` y `categoriasAPI`
- CRUD de productos y categorías

#### `carritoAPI`
- `get()` - Obtener carrito
- `addItem(productoId, cantidad)` - Agregar producto
- `updateItem(itemId, cantidad)` - Actualizar cantidad
- `removeItem(itemId)` - Eliminar item
- `clear()` - Vaciar carrito

---

## 📄 pages/ - Páginas Principales

### Autenticación

#### `Login.jsx`
- Formulario de login con email/password
- Redirección automática según rol
- Validación de campos

#### `Register.jsx`
- Formulario de registro
- Crea usuario con rol "customer" por defecto

### Dashboards

#### `ModernDashboard.jsx` (Admin)
- Estadísticas generales
- Tarjetas de métricas
- Gráficos de pedidos y envíos
- Enlaces rápidos a gestión

#### `ConductorDashboard.jsx`
- **Modal de bienvenida (3 pasos)**:
  1. Explicación del sistema
  2. Registro datos del vehículo
  3. Cambio de contraseña obligatorio
- **Pedidos Asignados**: Lista de pedidos que el admin asignó
- **Pedido Activo**: Pedido que está entregando
- **Modales de confirmación**: Tomar pedido, completar entrega

#### `ClienteDashboard.jsx`
- Catálogo de productos
- Carrito de compra
- Historial de pedidos
- Seguimiento de pedidos

### Gestión (Admin)

#### `Conductores.jsx`
- **Tabla**: Lista de conductores con búsqueda y filtros
- **Buscador**: Por nombre, cédula, email, teléfono
- **Filtro**: Por estado (disponible, en ruta, descanso, inactivo)
- **CRUD**: Crear, ver, editar conductores
- **Modal especial**: Muestra contraseña temporal al crear
- **Modal de eliminación**: Confirmación detallada
- **Estadísticas**: Contadores por estado

#### `Vehiculos.jsx`
- **Tabla**: Lista de vehículos con búsqueda y filtros
- **Buscador**: Por placa, marca, modelo, conductor
- **Filtro**: Por estado (disponible, en uso, mantenimiento, inactivo)
- **CRUD**: Crear, ver, editar, eliminar vehículos
- **Validación**: Un conductor = un vehículo
- **Modal de eliminación**: Advertencia sobre desasignación

#### `Clientes.jsx`
- **Tabla**: Lista de usuarios clientes
- **Buscador**: Por nombre, email, teléfono, ciudad
- **Filtro**: Activos/inactivos
- **Edición**: Datos de perfil del cliente
- **Desactivación**: Soft delete

#### `PedidosAdmin.jsx`
- **Tabla**: Todos los pedidos del sistema
- **Columna conductor**: Muestra si está asignado
- **Botón "Asignar"**: Abre modal con conductores disponibles
- **Modal de asignación**:
  - Lista de conductores disponibles
  - Información de licencia y teléfono
  - Confirmación de asignación
- **Cambio de estado**: Dropdown en cada pedido
- **Ver detalles**: Modal con info completa del pedido

### E-commerce

#### `ModernProducts.jsx`
- Catálogo de productos con categorías
- Búsqueda y filtrado
- Botón "Agregar al carrito"
- Indicador de stock

#### `ModernCart.jsx`
- Listado de items en carrito
- Actualizar cantidades
- Eliminar items
- Total calculado
- Botón "Procesar pedido"

#### `ModernOrders.jsx`
- Historial de pedidos del cliente
- Estados y fechas
- Detalles de cada pedido

---

## 🧩 components/ - Componentes Reutilizables

### `Navbar.jsx`
- Barra de navegación adaptativa por rol
- Menú desplegable de usuario
- Logout
- Links según permisos

### `ProtectedRoute.jsx`
- HOC para proteger rutas
- Verifica autenticación
- Valida roles permitidos
- Redirige si no autorizado

---

## 🎨 Estilos y UI

### Tailwind CSS
- Configurado en `tailwind.config.js`
- Utilizado principalmente en dashboards

### Material-UI (MUI)
- Tema personalizado en tonos grises
- Componentes: Tables, Dialogs, Buttons, Forms
- Utilizado en páginas de gestión

### Heroicons
- Íconos para dashboards
- Versión outline y solid

---

## 🔄 Flujos Principales

### Flujo de Login
1. Usuario ingresa credenciales
2. `AuthContext.login()` llama a `/api/auth/login/`
3. Guarda token y user en localStorage
4. Redirige según rol:
   - admin → `/admin-dashboard`
   - conductor → `/conductor-dashboard`
   - customer → `/cliente-dashboard`

### Flujo de Conductor (Primera vez)
1. Admin crea conductor → recibe contraseña temporal
2. Conductor hace login
3. Ve modal de bienvenida (3 pasos):
   - Paso 1: Explicación
   - Paso 2: Datos del vehículo
   - Paso 3: Cambiar contraseña
4. Guarda datos y cambia contraseña
5. Accede al dashboard

### Flujo de Pedido
1. Cliente agrega productos al carrito
2. Procesa pedido desde `/cart`
3. Pedido se crea con estado "pendiente"
4. Admin ve pedido en `/pedidos-admin`
5. Admin asigna conductor disponible
6. Pedido cambia a "confirmado"
7. Conductor ve pedido en "Pedidos Asignados"
8. Conductor toma pedido → estado "en_curso"
9. Conductor completa entrega → estado "entregado"

### Flujo de Asignación de Vehículo
1. Conductor completa modal de bienvenida
2. Datos se guardan temporalmente en Conductor
3. Admin crea vehículo
4. Si ingresa placa de conductor con datos temporales:
   - Auto-completa formulario
   - Asocia vehículo al conductor
   - Limpia datos temporales

---

## 📚 Dependencias Principales

```json
{
  "react": "^19.0.0",
  "react-router-dom": "^7.1.1",
  "@mui/material": "^6.3.1",
  "@heroicons/react": "^2.2.0",
  "axios": "^1.7.9",
  "tailwindcss": "^3.4.17"
}
```

---

## 🔑 Variables de Entorno

### Base URL API
Por defecto: `http://localhost:8000`

Para cambiar en producción, editar `src/services/apiService.jsx`:
```javascript
const apiService = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  // ...
});
```

---

## 🚨 Modales Implementados

Todos los modales usan diseño personalizado con Tailwind:

1. **Error/Success** - Notificaciones generales
2. **Confirmación de entrega** - Conductor confirma pedido
3. **Tomar pedido** - Éxito al tomar pedido
4. **Eliminar conductor** - Advertencia detallada
5. **Eliminar vehículo** - Advertencia con consecuencias
6. **Asignar conductor** - Lista de conductores disponibles
7. **Contraseña temporal** - Muestra password al crear conductor
8. **Bienvenida conductor** - 3 pasos (explicación, vehículo, password)

---

**Ver también**: [BACKEND_GUIDE.md](./BACKEND_GUIDE.md) para documentación del backend
