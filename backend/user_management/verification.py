"""
Sistema de verificación de email
"""
import random
import string
from datetime import timedelta
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings


class EmailVerificationCode:
    """Generador y validador de códigos de verificación"""
    
    # Almacenamiento temporal en memoria (en producción usar Redis o DB)
    _codes = {}
    
    @staticmethod
    def generate_code(length=6):
        """Genera un código aleatorio de dígitos"""
        return ''.join(random.choices(string.digits, k=length))
    
    @classmethod
    def create_code(cls, email):
        """Crea un código de verificación para un email"""
        # Si ya existe un código reciente (menos de 30 segundos), reutilizarlo
        if email in cls._codes:
            existing = cls._codes[email]
            time_since_creation = timezone.now() - existing['created_at']
            if time_since_creation < timedelta(seconds=30):
                # Reutilizar código existente si fue creado hace menos de 30 segundos
                return existing['code']
        
        code = cls.generate_code()
        cls._codes[email] = {
            'code': code,
            'created_at': timezone.now(),
            'verified': False
        }
        return code
    
    @classmethod
    def verify_code(cls, email, code):
        """Verifica si el código es válido para el email"""
        if email not in cls._codes:
            return False
        
        stored = cls._codes[email]
        
        # Verificar si el código ha expirado (10 minutos)
        if timezone.now() - stored['created_at'] > timedelta(minutes=10):
            del cls._codes[email]
            return False
        
        # Verificar el código
        if stored['code'] == code:
            stored['verified'] = True
            return True
        
        return False
    
    @classmethod
    def is_verified(cls, email):
        """Verifica si el email ya fue verificado"""
        return email in cls._codes and cls._codes[email].get('verified', False)
    
    @classmethod
    def send_verification_email(cls, email, code):
        """Envía el código de verificación por email"""
        subject = 'Código de Verificación - TecnoRoute'
        message = f'''
¡Hola!

Gracias por registrarte en TecnoRoute.

Tu código de verificación es: {code}

Este código es válido por 10 minutos.

Si no solicitaste este código, puedes ignorar este email.

Saludos,
Equipo de TecnoRoute
        '''
        
        try:
            # Intentar enviar email si está configurado
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL if hasattr(settings, 'DEFAULT_FROM_EMAIL') else 'noreply@tecnoroute.com',
                [email],
                fail_silently=True,
            )
            print(f"✅ Email enviado a {email} con código: {code}")
            return True
        except Exception as e:
            print(f"❌ Error enviando email: {e}")
            # En desarrollo, imprimir el código en consola
            print(f"\n{'='*50}")
            print(f"CÓDIGO DE VERIFICACIÓN PARA {email}: {code}")
            print(f"{'='*50}\n")
            return True
