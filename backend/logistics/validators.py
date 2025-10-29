from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
from django.db.models import Q
from .models import Conductor


def validate_unique_email_sistema(email):
    """
    Valida que el email no exista en ninguna parte del sistema:
    - User model
    - Conductor model
    """
    errors = []
    
    # Verificar en User
    if User.objects.filter(email=email).exists():
        errors.append('Este email ya está registrado como usuario.')
    
    # Verificar en Conductor
    if Conductor.objects.filter(email=email).exists():
        errors.append('Este email ya está registrado como conductor.')
    
    if errors:
        raise ValidationError(' '.join(errors))



def validate_unique_email_conductor(email, conductor_id=None):
    """
    Valida que el email no exista en otros conductores
    """
    queryset = Conductor.objects.filter(email=email)
    if conductor_id:
        queryset = queryset.exclude(id=conductor_id)
    
    if queryset.exists():
        raise ValidationError('Ya existe un conductor con este email.')


def validate_unique_licencia(licencia, conductor_id=None):
    """
    Valida que la licencia sea única entre conductores
    """
    queryset = Conductor.objects.filter(licencia=licencia)
    if conductor_id:
        queryset = queryset.exclude(id=conductor_id)
    
    if queryset.exists():
        raise ValidationError('Ya existe un conductor con esta licencia.')


def validate_unique_cedula(cedula, conductor_id=None):
    """
    Valida que la cédula sea única entre conductores
    """
    queryset = Conductor.objects.filter(cedula=cedula)
    if conductor_id:
        queryset = queryset.exclude(id=conductor_id)
    
    if queryset.exists():
        raise ValidationError('Ya existe un conductor con esta cédula.')