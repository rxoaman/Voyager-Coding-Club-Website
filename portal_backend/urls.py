import os
from pathlib import Path
from django.conf import settings
from django.contrib import admin
from django.urls import path, include, re_path
from django.http import HttpResponse
from django.views.static import serve

def spa_index_view(request, *args, **kwargs):
    """
    Serves the pre-built React Single Page Application (SPA).
    Any non-API and non-admin route returns index.html for client-side routing.
    """
    index_file = settings.BASE_DIR / 'frontend' / 'dist' / 'index.html'
    if index_file.exists():
        with open(index_file, 'r', encoding='utf-8') as f:
            return HttpResponse(f.read(), content_type='text/html; charset=utf-8')
    return HttpResponse(
        "<h1>Voyager Portal Backend (Django)</h1>"
        "<p>API is active at <a href='/api/events/'>/api/events/</a> and <a href='/api/team/'>/api/team/</a>.</p>"
    )

def serve_assets(request, path):
    """
    Serves static assets by resolving from:
    1. frontend/dist/assets/ (Compiled React JS/CSS bundles)
    2. frontend/public/assets/ (Images, logo, cutouts, card renders)
    """
    dist_assets_dir = settings.BASE_DIR / 'frontend' / 'dist' / 'assets'
    dist_file = dist_assets_dir / path
    if dist_file.exists() and dist_file.is_file():
        return serve(request, path, document_root=str(dist_assets_dir))

    public_assets_dir = settings.BASE_DIR / 'frontend' / 'public' / 'assets'
    return serve(request, path, document_root=str(public_assets_dir))

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('club_api.urls')),
    re_path(r'^assets/(?P<path>.*)$', serve_assets, name='assets_serve'),
    re_path(r'^(?!api/|admin/|assets/|static/).*$', spa_index_view, name='spa_root'),
]
