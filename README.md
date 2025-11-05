# 🚛 TecnoRoute - Sistema de Transporte y Logística

Sistema integral de gestión de transporte con e-commerce integrado, desarrollado con Django + React.

## ⚡ Inicio Rápido

```bash
# 1. Backend
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python create_products.py migrate
python manage.py runserver

# 2. Frontend (nueva terminal)
cd frontend
npm install
npm start
```

**URLs**:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Admin Panel: http://localhost:8000/admin

## 📚 Documentación

- **[SETUP.md](./SETUP.md)** - Guía completa de instalación desde cero
- **[BACKEND_GUIDE.md](./BACKEND_GUIDE.md)** - Documentación detallada del backend
- **[FRONTEND_GUIDE.md](./FRONTEND_GUIDE.md)** - Documentación detallada del frontend

## 🎯 Características Principales

### 👨‍💼 Administrador
- Dashboard con estadísticas
- Gestión de conductores, vehículos y clientes
- **Asignación de pedidos a conductores**
- Gestión de productos y categorías
- Control total del sistema

### 🚛 Conductor
- **Modal de bienvenida (3 pasos)**:
  1. Explicación del sistema
  2. Registro de datos del vehículo
  3. Cambio de contraseña obligatorio
- Ver pedidos asignados por el admin
- Tomar y completar entregas
- Actualizar estados en tiempo real

### 👤 Cliente
- Catálogo de productos
- Carrito de compras
- Crear y seguir pedidos
- Historial de compras

## 🛠️ Stack Tecnológico

### Backend
- **Django 4.2.24** - Framework web
- **Django REST Framework** - API REST
- **SQLite** - Base de datos
- **Token Authentication** - Autenticación por roles

### Frontend
- **React 19** - Framework UI
- **Material-UI** - Componentes UI
- **Tailwind CSS** - Estilos modernos
- **Axios** - Cliente HTTP
- **React Router v7** - Navegación

## 🔄 Flujo Principal

```
1. ADMIN crea Conductor → Se genera contraseña temporal

2. CONDUCTOR login (primera vez) → Modal de bienvenida:
   - Paso 1: Explicación
   - Paso 2: Datos del vehículo
   - Paso 3: Cambiar contraseña

3. ADMIN crea Vehículo → Auto-completa con datos del conductor

4. CLIENTE crea Pedido → Estado: "pendiente"

5. ADMIN asigna Conductor → Estado: "confirmado"

6. CONDUCTOR toma Pedido → Estado: "en_curso"

7. CONDUCTOR completa entrega → Estado: "entregado"
```

## 📁 Estructura del Proyecto

```
tecnoroute/
├── backend/
│   ├── backend/          # Configuración Django
│   ├── logistics/        # App de transporte
│   ├── user_management/  # App de e-commerce
│   └── tecnoroute.sqlite3
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── services/
│   └── package.json
├── SETUP.md             # Guía de instalación
├── BACKEND_GUIDE.md     # Docs backend
└── FRONTEND_GUIDE.md    # Docs frontend
```

## 🔑 Credenciales por Defecto

Después de `createsuperuser`:
- **Usuario**: admin
- **Email**: admin@tecnoroute.com
- **Contraseña**: admin123

## 🚨 Problemas Comunes

**Backend no inicia**: Verifica que el entorno virtual esté activado  
**Frontend no conecta**: Asegura que backend esté en puerto 8000  
**Database locked**: Cierra todos los procesos Django y reinicia

## 📖 Endpoints Principales

### Autenticación
- `POST /api/auth/login/` - Iniciar sesión
- `POST /api/auth/register/` - Registrar usuario
- `POST /api/auth/change-password/` - Cambiar contraseña

### Gestión
- `/api/conductores/` - CRUD conductores
- `/api/vehiculos/` - CRUD vehículos
- `/api/pedidos/` - CRUD pedidos
- `/api/productos/` - CRUD productos

### Pedidos
- `POST /api/pedidos/{id}/asignar_conductor/` - Asignar conductor (admin)
- `GET /api/pedidos/mis_pedidos/` - Pedidos del conductor
- `PATCH /api/pedidos/{id}/cambiar_estado/` - Actualizar estado

## 💡 Características Destacadas

✅ **Búsqueda y filtros** en todas las tablas de gestión  
✅ **Modales de confirmación** profesionales  
✅ **Contraseñas temporales** seguras para conductores  
✅ **Auto-completado** de datos del vehículo  
✅ **Asignación inteligente** de pedidos  
✅ **Validación en frontend y backend**  
✅ **Soft delete** para mantener integridad histórica  

## 🧪 Testing

```bash
# Backend
cd backend
python manage.py test

# Frontend
cd frontend
npm test
```

## 📦 Build para Producción

```bash
# Frontend
cd frontend
npm run build

# Configurar Django para producción:
# - DEBUG = False
# - ALLOWED_HOSTS configurado
# - Base de datos PostgreSQL
# - Servir static files con WhiteNoise
```

---

**TecnoRoute v1.0** - Sistema profesional de transporte y logística  
Desarrollado con ❤️ usando Django, React y SQLite
