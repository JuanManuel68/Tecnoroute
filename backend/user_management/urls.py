from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()

urlpatterns = [
    # URLs de autenticación
    path('auth/register/', views.register_user, name='register'),
    path('auth/login/', views.login_user, name='login'),
    path('auth/logout/', views.logout_user, name='logout'),
    path('auth/profile/', views.user_profile, name='profile'),
    path('auth/change-password/', views.change_password, name='change-password'),
    path('auth/delete-account/', views.delete_account, name='delete-account'),
    
    # URL de contacto
    path('contact/', views.contact_message, name='contact-message'),
    
    # URLs de API REST
    path('', include(router.urls)),
]
