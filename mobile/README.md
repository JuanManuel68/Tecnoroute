# TecnoRoute Mobile App

Aplicación móvil de TecnoRoute desarrollada con React Native, Expo y NativeWind (Tailwind CSS para React Native).

## 📱 Características

- ✅ Autenticación (Login y Registro)
- ✅ Diseño moderno con NativeWind (Tailwind CSS)
- ✅ Conexión con backend Django
- ✅ Navegación con React Navigation
- ✅ Almacenamiento local con AsyncStorage
- ✅ Validación de formularios
- ✅ Gestión de estado con Context API

## 🚀 Requisitos Previos

- Node.js 18+ instalado
- npm o yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app en tu dispositivo móvil (iOS o Android)
- Backend de TecnoRoute corriendo en `http://localhost:8000`

## 📦 Instalación

1. Navega al directorio mobile:
```bash
cd mobile
```

2. Instala las dependencias:
```bash
npm install
```

## 🔧 Configuración

### Configurar URL del Backend

Por defecto, la app se conecta a `http://localhost:8000`. Para conectarte desde un dispositivo físico, necesitas cambiar la URL del backend:

1. Abre `src/services/apiService.js`
2. Cambia `API_URL` a la IP de tu computadora:
```javascript
const API_URL = 'http://192.168.1.XXX:8000'; // Reemplaza con tu IP
```

Para encontrar tu IP:
- **Windows**: `ipconfig` en cmd
- **Mac/Linux**: `ifconfig` o `ip addr`

### Configurar Backend para Aceptar Conexiones Móviles

En el backend Django, asegúrate de agregar tu IP a `ALLOWED_HOSTS` en `settings.py`:

```python
ALLOWED_HOSTS = ['localhost', '127.0.0.1', '192.168.1.XXX']
```

Y en `CORS_ALLOWED_ORIGINS`:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://192.168.1.XXX:8000",
]
```

Luego ejecuta el backend con:
```bash
python manage.py runserver 0.0.0.0:8000
```

## ▶️ Ejecución

1. Inicia el servidor de desarrollo:
```bash
npm start
```

2. Escanea el código QR con:
   - **iOS**: Cámara del iPhone
   - **Android**: Expo Go app

3. La app se abrirá en tu dispositivo

### Comandos Alternativos

```bash
npm run android  # Abre en emulador Android
npm run ios      # Abre en simulador iOS (solo Mac)
npm run web      # Abre en navegador web
```

## 📂 Estructura del Proyecto

```
mobile/
├── App.js                      # Componente principal con navegación
├── app.json                    # Configuración de Expo
├── package.json                # Dependencias
├── babel.config.js             # Configuración de Babel
├── tailwind.config.js          # Configuración de TailwindCSS
├── src/
│   ├── context/
│   │   └── AuthContext.js      # Context de autenticación
│   ├── services/
│   │   └── apiService.js       # Servicios de API
│   └── screens/
│       ├── LoginScreen.js      # Pantalla de login
│       ├── RegisterScreen.js   # Pantalla de registro
│       └── HomeScreen.js       # Pantalla principal
└── assets/                     # Imágenes e iconos
```

## 🎨 Tecnologías Utilizadas

- **React Native**: Framework para apps móviles
- **Expo**: Plataforma de desarrollo
- **NativeWind v4**: Tailwind CSS para React Native
- **React Navigation**: Navegación entre pantallas
- **Axios**: Cliente HTTP
- **AsyncStorage**: Almacenamiento local
- **Expo Vector Icons**: Iconos

## 🔐 Autenticación

La app utiliza el mismo sistema de autenticación que el frontend web:

- **Login**: `/api/auth/login/`
- **Register**: `/api/auth/register/`
- **Token**: Almacenado en AsyncStorage

## 📱 Pantallas Principales

### Login Screen
- Validación de email y contraseña
- Toggle para mostrar/ocultar contraseña
- Navegación a registro
- Manejo de errores

### Register Screen
- Formulario completo con validaciones
- Campos: nombres, apellidos, email, teléfono, dirección, ciudad, contraseña
- Selector de ciudades colombianas
- Validación en tiempo real

### Home Screen
- Información del usuario
- Acciones rápidas
- Botón de logout

## 🐛 Solución de Problemas

### Error de conexión con el backend

1. Verifica que el backend esté corriendo
2. Comprueba que la URL en `apiService.js` sea correcta
3. Asegúrate de que tu dispositivo y PC estén en la misma red WiFi
4. Verifica CORS y ALLOWED_HOSTS en el backend

### NativeWind no aplica estilos

1. Limpia la caché: `expo start -c`
2. Verifica que `tailwind.config.js` y `babel.config.js` estén configurados correctamente

### Expo no conecta

1. Asegúrate de tener Expo Go actualizado
2. Verifica que estés en la misma red WiFi
3. Intenta con el modo túnel: `expo start --tunnel`

## 📝 Notas Importantes

- La app NO entra en conflicto con el proyecto web frontend
- Comparte el mismo backend Django
- Las credenciales creadas en web funcionan en mobile y viceversa
- Los estilos de NativeWind son similares a Tailwind CSS web

## 🔄 Próximos Pasos

Puedes extender la app con:
- Pantalla de productos
- Carrito de compras
- Historial de pedidos
- Perfil de usuario editable
- Notificaciones push
- Tracking de envíos en tiempo real

## 📞 Soporte

Para problemas o preguntas, consulta la documentación de:
- [React Native](https://reactnative.dev/)
- [Expo](https://docs.expo.dev/)
- [NativeWind](https://www.nativewind.dev/)

## 📄 Licencia

Este proyecto es parte de TecnoRoute. © 2024 Todos los derechos reservados.
