# 📥 Guía de Instalación - TecnoRoute Mobile

## Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

### Requerido
- ✅ **Node.js 18+** ([Descargar](https://nodejs.org/))
- ✅ **npm** (incluido con Node.js)
- ✅ **Git** (para clonar el proyecto)

### Opcional pero Recomendado
- ✅ **Expo CLI**: `npm install -g expo-cli`
- ✅ **Watchman** (Mac/Linux): Mejora el rendimiento

## Paso 1: Verificar Instalaciones

```bash
# Verificar Node.js
node --version
# Debe mostrar: v18.x.x o superior

# Verificar npm
npm --version
# Debe mostrar: 9.x.x o superior

# Verificar Expo CLI (opcional)
expo --version
```

## Paso 2: Navegar al Directorio Mobile

```bash
cd /c/Users/USUARIO/tecnoroute/mobile
```

## Paso 3: Instalar Dependencias

```bash
npm install
```

Esto instalará:
- React Native
- Expo SDK
- React Navigation
- NativeWind
- Axios
- AsyncStorage
- Y todas las demás dependencias

**Tiempo estimado**: 2-5 minutos (dependiendo de tu conexión)

## Paso 4: Verificar Instalación

```bash
# Verificar que node_modules existe
ls node_modules

# Verificar que las dependencias principales están instaladas
npm list react-native
npm list expo
```

## Paso 5: Configurar Backend (Si es necesario)

### Para Emulador/Simulador (No requiere cambios)
La configuración por defecto (`http://localhost:8000`) funcionará.

### Para Dispositivo Físico

1. **Obtén tu IP local**:
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   # o
   ip addr show
   ```
   
   Busca algo como: `192.168.1.X` o `192.168.0.X`

2. **Edita `src/services/apiService.js`**:
   ```javascript
   // Línea 5
   const API_URL = 'http://TU_IP:8000'; // Reemplaza TU_IP
   ```

3. **Configura el backend Django**:
   
   Edita `backend/backend/settings.py`:
   ```python
   ALLOWED_HOSTS = ['localhost', '127.0.0.1', 'TU_IP']
   
   CORS_ALLOWED_ORIGINS = [
       "http://localhost:3000",
       "http://TU_IP:8000",
   ]
   ```

4. **Inicia el backend**:
   ```bash
   cd ../backend
   python manage.py runserver 0.0.0.0:8000
   ```

## Paso 6: Instalar Expo Go en tu Dispositivo

### iOS
1. Abre App Store
2. Busca "Expo Go"
3. Descarga e instala

### Android
1. Abre Play Store
2. Busca "Expo Go"
3. Descarga e instala

## Paso 7: Iniciar la Aplicación

```bash
# Desde el directorio mobile/
npm start
```

Verás una pantalla con un código QR.

## Paso 8: Conectar tu Dispositivo

### iOS
1. Abre la cámara del iPhone
2. Apunta al código QR
3. Toca la notificación que aparece
4. Se abrirá Expo Go automáticamente

### Android
1. Abre la app Expo Go
2. Toca "Scan QR Code"
3. Escanea el código QR
4. La app se cargará

**Nota**: Tu dispositivo y tu computadora DEBEN estar en la misma red WiFi.

## Paso 9: Verificar que Funciona

1. Deberías ver la pantalla de Login
2. Intenta registrarte con datos de prueba
3. Verifica que puedas iniciar sesión

## Solución de Problemas

### Error: "Unable to resolve module"
```bash
rm -rf node_modules
npm install
npm start -c
```

### Error: "Network request failed"
1. Verifica que el backend esté corriendo
2. Comprueba la URL en `apiService.js`
3. Verifica que estés en la misma red WiFi
4. Desactiva el firewall temporalmente

### Error: "Metro bundler failed to start"
```bash
npm start -c
```

### No puedo escanear el QR
Intenta el modo túnel (más lento pero más confiable):
```bash
npm start --tunnel
```

### Los estilos no se aplican
```bash
npm start -- --reset-cache
```

## Comandos Alternativos

### Abrir en Emulador Android
```bash
npm run android
```
**Requiere**: Android Studio con emulador configurado

### Abrir en Simulador iOS
```bash
npm run ios
```
**Requiere**: Xcode (solo en Mac)

### Abrir en Navegador Web
```bash
npm run web
```

## Estructura Después de Instalación

```
mobile/
├── node_modules/          ← Dependencias (pesado)
├── .expo/                 ← Caché de Expo
├── src/                   ← Tu código
├── App.js
├── package.json
└── ...
```

## Verificación Final

Ejecuta estos comandos para verificar que todo está bien:

```bash
# En directorio mobile/

# 1. Verificar que los archivos existen
ls App.js
ls src/screens/LoginScreen.js
ls src/services/apiService.js

# 2. Verificar que las dependencias están instaladas
npm list react-native --depth=0
npm list expo --depth=0
npm list nativewind --depth=0

# 3. Intentar iniciar
npm start
```

Si todos los comandos funcionan sin errores, ¡estás listo! 🎉

## Próximos Pasos

1. Lee `QUICK_START.md` para guía rápida de uso
2. Lee `README.md` para documentación completa
3. Explora el código en `src/`
4. Prueba login y registro
5. Comienza a personalizar

## Recursos Adicionales

- [Documentación de Expo](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [NativeWind](https://www.nativewind.dev/)
- [React Native](https://reactnative.dev/)

## Soporte

Si encuentras problemas:
1. Revisa la sección "Solución de Problemas" del README.md
2. Busca el error en Google
3. Revisa los logs de Metro bundler
4. Verifica que el backend esté corriendo

---

**¡Feliz desarrollo!** 🚀
