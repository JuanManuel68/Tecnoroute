# 🚀 Inicio Rápido - TecnoRoute Mobile

## 1. Instalar Dependencias

```bash
cd mobile
npm install
```

## 2. Configurar Backend

### Opción A: Dispositivo Emulador/Simulador
Si usas un emulador Android o simulador iOS, no necesitas cambiar nada. La app se conectará a `http://localhost:8000`.

### Opción B: Dispositivo Físico (Recomendado)

1. **Encuentra tu IP local:**
   - Windows: Abre CMD y ejecuta `ipconfig`, busca "Dirección IPv4"
   - Mac/Linux: Abre Terminal y ejecuta `ifconfig` o `ip addr`

2. **Actualiza la URL en `src/services/apiService.js`:**
   ```javascript
   const API_URL = 'http://TU_IP_AQUI:8000'; // Ejemplo: http://192.168.1.5:8000
   ```

3. **Configura el backend Django:**
   
   En `backend/backend/settings.py`:
   ```python
   ALLOWED_HOSTS = ['localhost', '127.0.0.1', 'TU_IP_AQUI']
   
   CORS_ALLOWED_ORIGINS = [
       "http://localhost:3000",
       "http://TU_IP_AQUI:8000",
   ]
   ```

4. **Inicia el backend con:**
   ```bash
   cd backend
   python manage.py runserver 0.0.0.0:8000
   ```

## 3. Instalar Expo Go

- **iOS**: [App Store](https://apps.apple.com/app/expo-go/id982107779)
- **Android**: [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

## 4. Iniciar la App

```bash
cd mobile
npm start
```

Escanea el código QR:
- **iOS**: Usa la cámara del iPhone
- **Android**: Usa la app Expo Go

## 5. Probar la App

### Credenciales de Prueba
Si ya tienes usuarios en el backend web, puedes usar las mismas credenciales.

### Crear Nueva Cuenta
1. Toca "Regístrate aquí" en la pantalla de login
2. Completa el formulario
3. La cuenta se creará en el mismo backend que el frontend web

## ⚡ Comandos Útiles

```bash
npm start           # Inicia el servidor de desarrollo
npm start -c        # Inicia limpiando la caché
npm run android     # Abre en emulador Android
npm run ios         # Abre en simulador iOS (solo Mac)
```

## 🔧 Solución de Problemas

### "Network response timed out"
- Verifica que estés en la misma red WiFi
- Comprueba que el backend esté corriendo
- Verifica la URL en `apiService.js`

### "Unable to resolve module"
```bash
npm install
expo start -c
```

### Estilos no se aplican
```bash
npm start -c
```

## 📱 Funcionalidades Disponibles

✅ Login con validación
✅ Registro con formulario completo
✅ Persistencia de sesión
✅ Selector de ciudades colombianas
✅ Validación en tiempo real
✅ Diseño responsivo

## 🎯 Próximos Pasos

Una vez que la app funcione, puedes:
1. Explorar el código en `src/`
2. Agregar nuevas pantallas
3. Conectar con más endpoints del backend
4. Personalizar el diseño con NativeWind

¡Disfruta desarrollando con TecnoRoute Mobile! 🚀
