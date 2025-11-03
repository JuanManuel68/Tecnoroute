from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .auth_views import (
    AuthView, RegisterView, LogoutView, UserProfileView, ChangePasswordView,
    CategoriaViewSet, ProductoViewSet, CarritoView, PedidoViewSet,
    test_connection, check_email, check_phone
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
    # Carrito
    path('carrito/', CarritoView.as_view(), name='carrito'),
    # Test
    path('test/', test_connection, name='test-connection'),
]
