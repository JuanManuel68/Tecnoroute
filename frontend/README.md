# TecnoRoute Frontend

Sistema frontend para la plataforma TecnoRoute - Gestión Logística y Tienda de Electrodomésticos.

## 🚀 Tecnologías

- **React 18** - Framework principal
- **React Router Dom** - Navegación SPA
- **Tailwind CSS** - Estilos y diseño responsivo
- **Material UI** - Componentes de interfaz
- **Heroicons** - Iconografía
- **Axios** - Cliente HTTP para API

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── ModernNavbar.jsx    # Navbar administrativo
│   └── ModernPublicNavbar.jsx # Navbar público
├── context/             # Contextos de React
│   ├── AuthContext.jsx     # Autenticación y sesiones
│   └── CartContext.jsx     # Carrito de compras
├── pages/               # Páginas de la aplicación
│   ├── Home.jsx            # Página de inicio
│   ├── ModernLogin.jsx     # Login de usuarios
│   ├── ModernRegister.jsx  # Registro de usuarios
│   ├── ModernProducts.jsx  # Tienda de productos
│   ├── ModernCart.jsx      # Carrito de compras
│   ├── ModernCheckout.jsx  # Proceso de compra
│   ├── ModernProfile.jsx   # Perfil de usuario
│   ├── ModernContact.jsx   # Página de contacto
│   ├── Orders.jsx          # Pedidos de usuario
│   ├── ModernDashboard.jsx # Dashboard administrativo
│   ├── PedidosAdmin.jsx    # Gestión de pedidos (admin)
│   ├── Clientes.jsx        # Gestión de clientes
│   ├── Conductores.jsx     # Gestión de conductores
│   ├── Vehiculos.jsx       # Gestión de vehículos
│   ├── Rutas.jsx           # Gestión de rutas
│   ├── Envios.jsx          # Gestión de envíos
│   └── SeguimientoEnvio.jsx # Seguimiento de envíos
├── services/            # Servicios y APIs
│   └── apiService.jsx      # Cliente HTTP configurado
├── App.jsx             # Componente principal
├── index.jsx           # Punto de entrada
└── index.css           # Estilos globales (Tailwind)
```

## 🔐 Características de Autenticación

- **Doble rol**: Administrador y Usuario Cliente
- **Login/Registro** con validación completa
- **Sesiones persistentes** con localStorage
- **Rutas protegidas** según rol de usuario
- **Fallback de autenticación** cuando API no está disponible

## 🛍️ Funcionalidades de Tienda

- **Catálogo de productos** con filtros y búsqueda
- **Carrito de compras** persistente
- **Checkout completo** con validación de pagos
- **Historial de pedidos** para usuarios
- **Gestión de perfil** con foto y datos personales

## 👥 Panel Administrativo

- **Dashboard con estadísticas** en tiempo real
- **Gestión de pedidos** con cambio de estados
- **CRUD completo** para clientes, conductores, vehículos
- **Gestión de rutas y envíos**
- **Seguimiento de envíos** en tiempo real

## 📱 Rutas de la Aplicación

### Rutas Públicas
- `/` - Página de inicio
- `/login` - Iniciar sesión
- `/register` - Registrar cuenta
- `/contact` - Contacto

### Rutas de Usuario (Protegidas)
- `/productos` - Catálogo de productos
- `/cart` - Carrito de compras
- `/checkout` - Proceso de compra
- `/profile` - Perfil de usuario
- `/orders` - Historial de pedidos

### Rutas de Administrador (Protegidas)
- `/admin` - Dashboard administrativo
- `/admin/pedidos` - Gestión de pedidos
- `/admin/clientes` - Gestión de clientes
- `/admin/conductores` - Gestión de conductores
- `/admin/vehiculos` - Gestión de vehículos
- `/admin/rutas` - Gestión de rutas
- `/admin/envios` - Gestión de envíos
- `/admin/seguimiento` - Seguimiento de envíos

## 🔧 Configuración

### Variables de Entorno

```bash
REACT_APP_API_URL=http://localhost:8000
```

### Instalación

```bash
# Instalar dependencias
npm install

# Iniciar en desarrollo
npm start

# Construir para producción
npm run build
```

## 🧪 Credenciales de Prueba

```
Administrador:
- Email: admin@tecnoroute.com
- Contraseña: admin123

Usuario Cliente:
- Email: usuario@tecnoroute.com
- Contraseña: user123
```

## 🔄 Integración con API

El frontend se conecta automáticamente con la API de Django:
- **Autenticación JWT** con interceptores de Axios
- **Manejo de errores** centralizado
- **Fallback local** cuando la API no está disponible
- **Carga dinámica** de datos desde la base de datos

## 📝 Características Técnicas

- **Validación completa** de formularios con feedback visual
- **Manejo de estado** con Context API
- **Navegación programática** con React Router
- **Componentes modulares** y reutilizables
- **Código limpio** sin datos hardcodeados
- **Responsive design** para móviles y desktop
- **Optimizado para producción**

---

Desarrollado con ❤️ para TecnoRoute - Sistema de Gestión Logística y Tienda Online

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
