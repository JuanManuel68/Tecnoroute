# 📧 Configuración Rápida de Email (2 minutos)

## ¿Qué necesito hacer?

**Solo configurar TU email UNA VEZ**. Después, el sistema enviará códigos automáticamente a CADA usuario nuevo.

```
┌─────────────────────────────────────────────────────────┐
│  FLUJO DEL SISTEMA:                                     │
│                                                          │
│  1. Usuario se registra con: maria@example.com          │
│  2. Sistema envía código DESDE: tucorreo@gmail.com      │
│  3. Código llega A: maria@example.com                   │
│                                                          │
│  Solo configuras TU correo (paso 2) UNA SOLA VEZ       │
└─────────────────────────────────────────────────────────┘
```

## Pasos (2 minutos):

### 1️⃣ Abre esta página en tu navegador:
```
https://myaccount.google.com/apppasswords
```

### 2️⃣ Si te pide iniciar sesión, usa tu Gmail

### 3️⃣ Verás esto:
- **Seleccionar app**: Elige "Correo"
- **Seleccionar dispositivo**: Elige "Otro" y escribe "TecnoRoute"
- Click en **GENERAR**

### 4️⃣ Google te mostrará una contraseña de 16 caracteres:
```
Ejemplo: abcd efgh ijkl mnop
```
**¡CÓPIALA!** (sin espacios)

### 5️⃣ Edita el archivo `.env` en `backend/`:
```env
EMAIL_HOST_USER=tu-correo-real@gmail.com
EMAIL_HOST_PASSWORD=abcdefghijklmnop
DEFAULT_FROM_EMAIL=TecnoRoute <tu-correo-real@gmail.com>
```

### 6️⃣ Reinicia el servidor Django:
```bash
# Detén el servidor (Ctrl+C)
python manage.py runserver
```

### 7️⃣ Verás este mensaje en la consola:
```
✅ Email configurado: Los correos se enviarán desde tu-correo-real@gmail.com
```

## ¡Listo! 🎉

Ahora cuando CUALQUIER usuario se registre:
- ✅ Recibirá el código en SU email
- ✅ El código viene de TU email (TecnoRoute)
- ✅ No tienes que hacer nada más

## ⚠️ Si no te aparece "Contraseñas de aplicaciones":

1. Ve a: https://myaccount.google.com/signinoptions/two-step-verification
2. Activa la **Verificación en 2 pasos**
3. Vuelve al paso 1

## 💡 Por qué necesito esto:

Google no permite enviar emails sin autenticación (para evitar spam). Por eso necesitas:
- **Tu email** = Para que el sistema pueda enviar correos
- **Contraseña de aplicación** = Para que Django pueda usar tu cuenta de forma segura

**Es seguro**: La contraseña de aplicación solo sirve para enviar emails, no da acceso completo a tu cuenta.

---

**Tiempo total: 2-3 minutos** ⏱️
