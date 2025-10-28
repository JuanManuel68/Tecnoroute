from django.shortcuts import render
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.db import transaction
import json

from .models import UserProfile


@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """
    Registro de nuevos usuarios con datos completos
    """
    try:
        data = request.data if hasattr(request, 'data') else json.loads(request.body)
        
        # Validar datos requeridos
        required_fields = ['name', 'email', 'password', 'phone', 'address', 'city']
        for field in required_fields:
            if not data.get(field):
                return Response({
                    'success': False,
                    'error': f'El campo {field} es requerido'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        # Verificar si el email ya existe
        if User.objects.filter(email=data['email']).exists():
            return Response({
                'success': False,
                'error': 'Este email ya está registrado'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Crear usuario y perfil en una transacción
        with transaction.atomic():
            # Separar nombre y apellido
            name_parts = data['name'].strip().split()
            first_name = name_parts[0] if name_parts else ''
            last_name = ' '.join(name_parts[1:]) if len(name_parts) > 1 else ''
            
            # Crear usuario Django
            user = User.objects.create_user(
                username=data['email'],  # Usar email como username
                email=data['email'],
                password=data['password'],
                first_name=first_name,
                last_name=last_name,
            )
            
            # Crear perfil de usuario
            UserProfile.objects.create(
                user=user,
                role='customer',  # Por defecto todos son clientes
                telefono=data['phone'],
                direccion=data['address'],
                ciudad=data['city'],
                codigo_postal=data.get('postalCode', '')
            )
            
            # Crear token de autenticación
            token, created = Token.objects.get_or_create(user=user)
            
            return Response({
                'success': True,
                'message': 'Usuario registrado exitosamente',
                'token': token.key,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'role': 'customer'
                }
            }, status=status.HTTP_201_CREATED)
            
    except json.JSONDecodeError:
        return Response({
            'success': False,
            'error': 'Datos JSON inválidos'
        }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({
            'success': False,
            'error': f'Error interno del servidor: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    """
    Login de usuarios con email/password
    """
    try:
        data = request.data if hasattr(request, 'data') else json.loads(request.body)
        
        username = data.get('username') or data.get('email')
        password = data.get('password')
        
        if not username or not password:
            return Response({
                'success': False,
                'error': 'Email y contraseña son requeridos'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Intentar autenticar
        user = authenticate(username=username, password=password)
        
        if user is not None:
            if user.is_active:
                # Obtener o crear token
                token, created = Token.objects.get_or_create(user=user)
                
                # Obtener perfil del usuario
                try:
                    profile = UserProfile.objects.get(user=user)
                    role = profile.role
                except UserProfile.DoesNotExist:
                    # Crear perfil básico si no existe
                    profile = UserProfile.objects.create(
                        user=user,
                        role='admin' if user.is_superuser else 'customer'
                    )
                    role = profile.role
                
                return Response({
                    'success': True,
                    'message': f'Bienvenido {user.get_full_name() or user.username}',
                    'token': token.key,
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                        'role': role,
                        'is_superuser': user.is_superuser
                    }
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'success': False,
                    'error': 'Cuenta desactivada'
                }, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({
                'success': False,
                'error': 'Credenciales inválidas'
            }, status=status.HTTP_401_UNAUTHORIZED)
            
    except json.JSONDecodeError:
        return Response({
            'success': False,
            'error': 'Datos JSON inválidos'
        }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({
            'success': False,
            'error': f'Error interno del servidor: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_user(request):
    """
    Logout del usuario (eliminar token)
    """
    try:
        # Eliminar el token del usuario
        Token.objects.filter(user=request.user).delete()
        return Response({
            'success': True,
            'message': 'Sesión cerrada exitosamente'
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'success': False,
            'error': f'Error al cerrar sesión: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    """
    Obtener o actualizar el perfil del usuario
    """
    try:
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        
        if request.method == 'GET':
            # Obtener perfil
            return Response({
                'success': True,
                'user': {
                    'id': request.user.id,
                    'username': request.user.username,
                    'email': request.user.email,
                    'first_name': request.user.first_name,
                    'last_name': request.user.last_name,
                    'full_name': request.user.get_full_name(),
                    'role': profile.role,
                    'telefono': profile.telefono,
                    'direccion': profile.direccion,
                    'ciudad': profile.ciudad,
                    'codigo_postal': profile.codigo_postal,
                    'fecha_creacion': profile.fecha_creacion,
                    'fecha_actualizacion': profile.fecha_actualizacion,
                }
            }, status=status.HTTP_200_OK)
        
        elif request.method == 'PUT':
            # Actualizar perfil
            data = request.data
            
            # Actualizar usuario Django
            if 'first_name' in data:
                request.user.first_name = data['first_name']
            if 'last_name' in data:
                request.user.last_name = data['last_name']
            if 'email' in data and data['email'] != request.user.email:
                # Verificar que el nuevo email no esté en uso
                if User.objects.filter(email=data['email']).exclude(id=request.user.id).exists():
                    return Response({
                        'success': False,
                        'error': 'Este email ya está en uso por otro usuario'
                    }, status=status.HTTP_400_BAD_REQUEST)
                request.user.email = data['email']
                request.user.username = data['email']  # Mantener username sincronizado
                
            request.user.save()
            
            # Actualizar perfil
            if 'telefono' in data:
                profile.telefono = data['telefono']
            if 'direccion' in data:
                profile.direccion = data['direccion']
            if 'ciudad' in data:
                profile.ciudad = data['ciudad']
            if 'codigo_postal' in data:
                profile.codigo_postal = data['codigo_postal']
            
            profile.save()
            
            return Response({
                'success': True,
                'message': 'Perfil actualizado exitosamente',
                'user': {
                    'id': request.user.id,
                    'username': request.user.username,
                    'email': request.user.email,
                    'first_name': request.user.first_name,
                    'last_name': request.user.last_name,
                    'full_name': request.user.get_full_name(),
                    'role': profile.role,
                    'telefono': profile.telefono,
                    'direccion': profile.direccion,
                    'ciudad': profile.ciudad,
                    'codigo_postal': profile.codigo_postal,
                }
            }, status=status.HTTP_200_OK)
            
    except Exception as e:
        return Response({
            'success': False,
            'error': f'Error procesando perfil: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
