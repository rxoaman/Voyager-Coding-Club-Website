"""
=============================================================================
Voyager Coding Club - Master URL Configuration
=============================================================================
Routes incoming HTTP requests to their appropriate handlers:
1. /admin/              -> Django Built-in Administration Dashboard
2. /api/                -> Voyager Club REST Endpoints (/events, /team, /club)
3. /__reload__/         -> django-browser-reload Server-Sent Events daemon
4. /assets/<path>       -> Static assets (JS/CSS bundles, ID cards, photos)
5. /static/<path>       -> Static files (Django Admin styling, JS bundles)
6. /*                   -> React Single Page Application (SPA catch-all)
=============================================================================
"""

import os
from pathlib import Path
from django.conf import settings
from django.contrib import admin
from django.urls import path, include, re_path
from django.http import HttpResponse
from django.views.static import serve
from django.contrib.staticfiles.urls import staticfiles_urlpatterns


def spa_index_view(request, *args, **kwargs):
    """
    Serves the pre-compiled React Single Page Application (SPA).
    Any non-API, non-admin route returns index.html, allowing React Router
    to manage client-side navigation (e.g. '/', '/#team', '/team/:id').
    """
    index_file = settings.BASE_DIR / 'frontend' / 'dist' / 'index.html'
    if index_file.exists():
        with open(index_file, 'r', encoding='utf-8') as f:
            return HttpResponse(f.read(), content_type='text/html; charset=utf-8')

    # Fallback message if frontend has not been compiled yet
    return HttpResponse(
        "<h1>Voyager Portal Backend (Django)</h1>"
        "<p>React frontend build not found. Run <code>python manage.py buildfrontend</code>.</p>"
        "<p>API is active at <a href='/api/events/'>/api/events/</a> and <a href='/api/team/'>/api/team/</a>.</p>",
        content_type='text/html; charset=utf-8'
    )


def serve_assets(request, path):
    """
    Resolves and serves requested static assets from two locations:
    1. frontend/dist/assets/   -> Compiled React bundles (index-*.js, index-*.css)
    2. frontend/public/assets/ -> Static media assets (Logo_Cube.png, ID card artwork, member cutouts)
    """
    # 1. Check compiled Vite distribution assets
    dist_assets_dir = settings.BASE_DIR / 'frontend' / 'dist' / 'assets'
    dist_file = dist_assets_dir / path
    if dist_file.exists() and dist_file.is_file():
        return serve(request, path, document_root=str(dist_assets_dir))

    # 2. Check public media assets
    public_assets_dir = settings.BASE_DIR / 'frontend' / 'public' / 'assets'
    return serve(request, path, document_root=str(public_assets_dir))


def serve_static(request, path):
    """
    Serves collected static files (Django admin styling, JS, etc.)
    Ensures static files resolve smoothly in production and Vercel environments.
    """
    static_dir = settings.BASE_DIR / 'staticfiles'
    return serve(request, path, document_root=str(static_dir))


# Core URL patterns
urlpatterns = [
    # Django Admin site
    path('admin/', admin.site.urls),

    # Voyager Club REST API routes
    path('api/', include('club_api.urls')),
]

# Live auto-reloader SSE endpoints (Active only in local development)
if settings.DEBUG and not getattr(settings, 'IS_VERCEL', False):
    urlpatterns += [
        path('__reload__/', include('django_browser_reload.urls')),
    ]

urlpatterns += [
    # Assets route (matches /assets/<path>)
    re_path(r'^assets/(?P<path>.*)$', serve_assets, name='assets_serve'),

    # Static files route (matches /static/<path>)
    re_path(r'^static/(?P<path>.*)$', serve_static, name='static_serve'),
]

# Development static files handler (serves reload-listener.js and static files)
urlpatterns += staticfiles_urlpatterns()

# React SPA catch-all route (serves index.html for all other URLs)
# Uses negative lookahead regex to avoid intercepting api, admin, assets, static, or reload
urlpatterns += [
    re_path(r'^(?!api/|admin/|assets/|static/|__reload__/).*$', spa_index_view, name='spa_root'),
]
