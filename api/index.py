"""
=============================================================================
Voyager Coding Club - Vercel Serverless Function Handler
=============================================================================
This file acts as the primary serverless function entrypoint for Vercel.
It initializes Django and exposes the WSGI callable as 'app' and 'application'.
=============================================================================
"""

import os
import sys
from pathlib import Path

# Add project root to sys.path so portal_backend and club_api can be resolved
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

# Ensure Django settings module is defined
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'portal_backend.settings')

# Initialize WSGI application
from django.core.wsgi import get_wsgi_application

app = get_wsgi_application()
application = app
