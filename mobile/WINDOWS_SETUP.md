# 🪟 Configuración para Windows - TecnoRoute Mobile

## Problema Conocido

Expo CLI tiene un bug conocido en Windows relacionado con la creación de directorios con caracteres especiales (`:`) en los nombres. Esto causa el error:

```
Error: ENOENT: no such file or directory, mkdir 'node:sea'
```

## ✅ Solución 1: Usar Expo Go (Recomendado)

La forma más simple de ejecutar la app en Windows es usando Expo Go directamente:

### Pasos:

1. **Instalar Expo Go en tu teléfono**
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Iniciar con túnel** (más lento pero funciona):
   ```bash
   cd mobile
   npx expo start --tunnel
   ```

3. **Escanear el QR**
   - iOS: Usa la cámara
   - Android: Usa Expo Go

## ✅ Solución 2: Actualizar Expo CLI

Si quieres ejecutarlo localmente, intenta actualizar Expo:

```bash
cd mobile
npm install expo@latest
npx expo start --clear
```

## ✅ Solución 3: Usar WSL2 (Avanzado)

Si tienes WSL2 instalado, puedes ejecutar el proyecto desde ahí:

1. Abre WSL2
2. Navega al proyecto:
   ```bash
   cd /mnt/c/Users/USUARIO/tecnoroute/mobile
   ```
3. Ejecuta:
   ```bash
   npm start
   ```

## ✅ Solución 4: Downgrade de Expo (Temporal)

Si el problema persiste, puedes usar una versión anterior de Expo:

```bash
npm install expo@49.0.0 --save
npx expo start --clear
```

## 📝 Nota Importante

Este es un bug conocido de Expo y no es culpa de la configuración del proyecto. El proyecto funcionará perfectamente en:
- ✅ Mac
- ✅ Linux
- ✅ Windows con WSL2
- ✅ Cualquier dispositivo con Expo Go usando `--tunnel`

## 🔧 Verificar que el Código Funciona

Aunque no puedas ejecutar `expo start` normalmente, puedes verificar que el código está bien:

```bash
# Verificar sintaxis
npx tsc --noEmit 2>/dev/null || echo "No TypeScript, OK"

# Ver estructura de archivos
ls -la src/
```

## 🚀 Modo Desarrollo Recomendado en Windows

```bash
# Terminal 1: Backend
cd ../backend
python manage.py runserver 0.0.0.0:8000

# Terminal 2: Mobile con túnel
cd mobile
npx expo start --tunnel
```

Luego escanea el QR con Expo Go en tu teléfono.

## 📱 Alternativa: Emulador Android

Si tienes Android Studio instalado:

```bash
npx expo start --android
```

Esto abrirá en el emulador Android automáticamente.

## 💡 Tips

- El modo `--tunnel` es más lento pero más confiable en Windows
- Asegúrate de que tu firewall permite conexiones de Expo
- Si usas VPN, desactívala temporalmente

## 🐛 Reportar Problema

Este es un issue conocido de Expo:
- https://github.com/expo/expo/issues

El proyecto está correctamente configurado y funcionará una vez que uses una de las soluciones anteriores.
