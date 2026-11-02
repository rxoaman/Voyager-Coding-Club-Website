"""
=============================================================================
Voyager Coding Club - Django Settings Configuration
=============================================================================
Defines application configuration, security parameters, middleware stack,
database routing, static/media asset serving, and live auto-reload rules.
=============================================================================
"""

import os
from pathlib import Path

# Base directory: points to the root of voyager-portal-django
BASE_DIR = Path(__file__).resolve().parent.parent

# Security Settings
SECRET_KEY = 'django-insecure-voyager-portal-coding-club-key-change-in-prod'
DEBUG = True

# Allows connections from localhost, 127.0.0.1, and any local Wi-Fi / LAN IP (e.g. 192.168.x.x)
ALLOWED_HOSTS = ['*']

# Application Definition
INSTALLED_APPS = [
    # Core Voyager Club API & Custom runserver management override
    # (Must remain before staticfiles to intercept runserver 0.0.0.0 arguments)
    'club_api',

    # Browser live-reload daemon (Server-Sent Events)
    'django_browser_reload',

    # Standard Django administrative and authentication apps
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

# Middleware Pipeline (Executed in top-to-bottom order for requests)
MIDDLEWARE = [
    # 1. Custom Zero-Dependency CORS Middleware (permits API calls from any origin)
    'club_api.middleware.CustomCorsMiddleware',

    # 2. Browser Reload Middleware: Injects SSE reload script into text/html responses
    'django_browser_reload.middleware.BrowserReloadMiddleware',

    # 3. Standard Django Security, Session, and CSRF Protection
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'portal_backend.urls'

# Template Configuration: Allows Django to render frontend/dist/index.html
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            BASE_DIR / 'frontend' / 'dist',
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'portal_backend.wsgi.application'

# Database Configuration: SQLite3 file located at the project root
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Password validation rules
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static Files Configuration
# STATIC_URL: URL prefix for static files (/static/)
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Locations where Django discovers static files (Vite build, public images, and source directory)
STATICFILES_DIRS = [
    BASE_DIR / 'frontend' / 'dist',
    BASE_DIR / 'frontend' / 'public',
    BASE_DIR / 'frontend' / 'src',  # Monitored by auto-reloader for instant updates
]

# Media / Assets Configuration (Emblem, ID cards, member cutouts)
MEDIA_URL = '/assets/'
MEDIA_ROOT = BASE_DIR / 'frontend' / 'public' / 'assets'

# Primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
