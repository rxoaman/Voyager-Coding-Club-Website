"""
=============================================================================
Voyager Coding Club - REST API URL Routing
=============================================================================
Prefix: /api/

Routes (Both with and without trailing slashes are supported directly):
- /api/ & /api            -> API root telemetry
- /api/health & /api/health/ -> Backend status check
- /api/club   & /api/club/   -> Organization metadata & branding
- /api/events & /api/events/ -> All events (Upcoming strictly first)
- /api/team   & /api/team/   -> Active team members and sub-teams
- /api/team/<slug> & /api/team/<slug>/ -> Individual member dossier by slug
=============================================================================
"""

from django.urls import path
from . import views

urlpatterns = [
    # API root telemetry check (/api and /api/)
    path('', views.health_check, name='api_root'),

    # Health telemetry check
    path('health', views.health_check, name='api_health_noslash'),
    path('health/', views.health_check, name='api_health'),

    # Top-level club profile & branding
    path('club', views.get_club_info, name='api_club_info_noslash'),
    path('club/', views.get_club_info, name='api_club_info'),

    # Flagship hackathons & workshops
    path('events', views.get_events, name='api_events_noslash'),
    path('events/', views.get_events, name='api_events'),

    # Sub-teams and leadership directory
    path('team', views.get_team, name='api_team_noslash'),
    path('team/', views.get_team, name='api_team'),

    # Individual member detail endpoint (e.g. /api/team/purushottam-kumar)
    path('team/<slug:slug>', views.get_member_detail, name='api_member_detail_noslash'),
    path('team/<slug:slug>/', views.get_member_detail, name='api_member_detail'),
]
