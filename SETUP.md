# 🚀 TecnoRoute - Guía de Instalación desde Cero

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Python 3.8+** - [Descargar Python](https://www.python.org/downloads/)
- **Node.js 16+** y npm - [Descargar Node.js](https://nodejs.org/)
- **Git** - [Descargar Git](https://git-scm.com/downloads/)
- Editor de código (recomendado: VS Code)

## 📥 Paso 1: Clonar el Repositorio

```bash
# Clonar el proyecto
git clone <url-del-repositorio>
cd tecnoroute
```

## 🐍 Paso 2: Configurar el Backend (Django)

### 2.1 Crear y Activar Entorno Virtual

```bash
# Navegar al directorio backend
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# En Windows:
venv\Scripts\activate
# En Linux/Mac:
source venv/bin/activate
```

### 2.2 Instalar Dependencias

```bash
# Instalar todas las dependencias
pip install -r requirements.txt
```

### 2.3 Configurar la Base de Datos

```bash
# Aplicar todas las migraciones
python manage.py migrate

# La base de datos tecnoroute.sqlite3 se creará automáticamente
```

### 2.4 Crear Superusuario Administrador

```bash
# Crear usuario administrador
python manage.py createsuperuser

# Ingresar los siguientes datos cuando se soliciten:
# Username: admin
# Email: admin@tecnoroute.com
# Password: admin123
# Password (again): admin123
```

### 2.5 (Opcional) Cargar Datos de Prueba

```bash
# Crear productos de ejemplo
python create_products.py

# Crear datos de muestra (clientes, conductores, vehículos)
python create_sample_data.py
```

### 2.6 Iniciar el Servidor Backend

```bash
# Iniciar servidor Django en puerto 8000
python manage.py runserver

# El servidor estará disponible en: http://localhost:8000
```

✅ **Backend configurado correctamente!**

---

## ⚛️ Paso 3: Configurar el Frontend (React)

### 3.1 Abrir Nueva Terminal

Deja el servidor backend corriendo y abre una **nueva terminal**.

### 3.2 Navegar al Frontend

```bash
cd frontend
```

### 3.3 Instalar Dependencias de Node.js

```bash
# Instalar todas las dependencias del proyecto
npm install

# Esto puede tomar varios minutos la primera vez
```

### 3.4 Iniciar el Servidor de Desarrollo

```bash
# Iniciar servidor React en puerto 3000
npm start

# El navegador se abrirá automáticamente en: http://localhost:3000
```

✅ **Frontend configurado correctamente!**

---

## 🧪 Paso 4: Verificar la Instalación

### 4.1 Verificar Backend

1. Abre tu navegador en: **http://localhost:8000/admin/**
2. Inicia sesión con:
   - Usuario: `admin`
   - Contraseña: `admin123`

### 4.2 Verificar Frontend

1. El frontend debe estar en: **http://localhost:3000**
2. Deberías ver la página de login de TecnoRoute
3. Intenta iniciar sesión con el admin:
   - Email: `admin@tecnoroute.com`
   - Contraseña: `admin123`

### 4.3 Verificar API

```bash
# Probar endpoint de login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tecnoroute.com","password":"admin123"}'
```

---

## 🗄️ Paso 5: Estructura de Base de Datos

La base de datos SQLite (`backend/tecnoroute.sqlite3`) incluye las siguientes tablas principales:

### Tablas de Autenticación
- `auth_user` - Usuarios del sistema (Django)
- `authtoken_token` - Tokens de autenticación
- `user_management_userprofile` - Perfiles de usuario con roles

### Tablas de Logística
- `logistics_cliente` - Información de clientes (OBSOLETA)
- `logistics_conductor` - Conductores con licencias y estado
- `logistics_vehiculo` - Flota de vehículos
- `logistics_ruta` - Rutas de transporte
- `logistics_envio` - Envíos de logística
- `logistics_seguimientoenvio` - Seguimiento de envíos

### Tablas de Pedidos (E-commerce)
- `user_management_categoria` - Categorías de productos
- `user_management_producto` - Catálogo de productos
- `user_management_carrito` - Carritos de compra
- `user_management_carritoitem` - Items en carritos
- `user_management_pedido` - Pedidos de clientes
- `user_management_pedidoitem` - Items de pedidos

---

## 🔧 Comandos Útiles

### Backend

```bash
# Ver migraciones pendientes
python manage.py showmigrations

# Crear nuevas migraciones (después de cambios en models.py)
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate

# Abrir shell de Django
python manage.py shell

# Verificar integridad del proyecto
python manage.py check
```

### Frontend

```bash
# Instalar nueva dependencia
npm install <nombre-paquete>

# Build para producción
npm run build

# Ejecutar tests
npm test
```

---

## 🚨 Problemas Comunes

### Error: "No module named django"
```bash
# Asegúrate de que el entorno virtual esté activado
# Reinstala las dependencias
pip install -r requirements.txt
```

### Error: "Port 8000 is already in use"
```bash
# Busca el proceso usando el puerto 8000
# En Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# En Linux/Mac:
lsof -ti:8000 | xargs kill -9
```

### Error: "Database is locked"
```bash
# Cierra todos los procesos de Django
# Reinicia la terminal
# Si persiste, elimina db.sqlite3 y vuelve a hacer migrate
```

### Frontend no conecta con Backend
1. Verifica que el backend esté corriendo en puerto 8000
2. Revisa la configuración CORS en `backend/settings.py`
3. Asegúrate de que el frontend usa `http://localhost:8000` en las peticiones

---

## 🎯 Siguientes Pasos

1. ✅ **Explorar el Panel Admin**: http://localhost:8000/admin/
2. ✅ **Crear conductores**: Usar el formulario en el frontend
3. ✅ **Crear vehículos**: Asociarlos a conductores
4. ✅ **Crear productos**: Para el sistema de pedidos
5. ✅ **Probar flujo de pedidos**: Cliente → Pedido → Asignación → Entrega

---

## 📚 Documentación Adicional

- **Backend**: Ver [BACKEND_GUIDE.md](./BACKEND_GUIDE.md) para detalles de cada archivo
- **Frontend**: Ver [FRONTEND_GUIDE.md](./FRONTEND_GUIDE.md) para estructura React

---

**TecnoRoute** - Sistema de Transporte y Logística  
Desarrollado con Django + React + SQLite
