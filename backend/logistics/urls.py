from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .auth_views import (
    AuthView, RegisterView, LogoutView, UserProfileView, ChangePasswordView,
    CategoriaViewSet, ProductoViewSet, CarritoView, PedidoViewSet,
    test_connection, check_email, check_phone, send_verification_code, verify_code,
    request_password_reset, verify_reset_code, reset_password
)

router = DefaultRouter()
router.register(r'clientes', views.ClienteViewSet, basename='cliente')
router.register(r'conductores', views.ConductorViewSet)
router.register(r'vehiculos', views.VehiculoViewSet)
router.register(r'envios', views.EnvioViewSet)
router.register(r'categorias', CategoriaViewSet)
router.register(r'productos', ProductoViewSet)
router.register(r'pedidos', PedidoViewSet, basename='pedido')
# pedidos-transporte eliminado - usar pedidos de user_management
router.register(r'seguimientos', views.SeguimientoEnvioViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # Autenticación
    path('auth/login/', AuthView.as_view(), name='auth-login'),
    path('auth/register/', RegisterView.as_view(), name='auth-register'),
    path('auth/logout/', LogoutView.as_view(), name='auth-logout'),
    path('auth/profile/', UserProfileView.as_view(), name='auth-profile'),
    path('auth/change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('auth/check-email/', check_email, name='check-email'),
    path('auth/check-phone/', check_phone, name='check-phone'),
    path('auth/send-verification-code/', send_verification_code, name='send-verification-code'),
    path('auth/verify-code/', verify_code, name='verify-code'),
    path('auth/request-password-reset/', request_password_reset, name='request-password-reset'),
    path('auth/verify-reset-code/', verify_reset_code, name='verify-reset-code'),
    path('auth/reset-password/', reset_password, name='reset-password'),
    # Carrito
    path('carrito/', CarritoView.as_view(), name='carrito'),
    # Test
    path('test/', test_connection, name='test-connection'),
]
