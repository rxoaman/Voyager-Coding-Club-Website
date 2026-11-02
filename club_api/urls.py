from django.urls import path
from . import views

urlpatterns = [
    path('health/', views.health_check, name='api_health'),
    path('club/', views.get_club_info, name='api_club_info'),
    path('events/', views.get_events, name='api_events'),
    path('team/', views.get_team, name='api_team'),
    path('team/<slug:slug>/', views.get_member_detail, name='api_member_detail'),
]
