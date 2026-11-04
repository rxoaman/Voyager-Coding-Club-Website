"""
=============================================================================
Voyager Coding Club - Vercel Serverless Function Handler
=============================================================================
This file acts as the primary serverless function entrypoint for Vercel.
It initializes Django and exposes the WSGI callable as 'app' and 'application'.
Includes path normalization to ensure requests like /api/events or /events
route cleanly to Django's URL resolver.
=============================================================================
"""

import os
import sys
from pathlib import Path

# Add project root directory to Python system path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

# Ensure VERCEL environment flag is present
os.environ.setdefault('VERCEL', '1')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'portal_backend.settings')

# Initialize WSGI application
from django.core.wsgi import get_wsgi_application

django_app = get_wsgi_application()


class VercelWsgiHandler:
    """
    WSGI wrapper for Vercel serverless functions.
    Restores original requested URL path from Vercel forward headers
    if Vercel rewrite sets PATH_INFO to /api/index or /api/index.py.
    """
    def __init__(self, wsgi_application):
        self.wsgi_application = wsgi_application

    def __call__(self, environ, start_response):
        path_info = environ.get('PATH_INFO', '')

        # If Vercel rewrote the path to the function entrypoint, restore user's original path
        if path_info in ('/api/index', '/api/index.py', '/api', '/api/'):
            original_uri = (
                environ.get('HTTP_X_FORWARDED_URI')
                or environ.get('HTTP_X_MATCHED_PATH')
                or environ.get('REQUEST_URI')
                or ''
            )
            if original_uri:
                clean_path = original_uri.split('?')[0]
                if clean_path:
                    environ['PATH_INFO'] = clean_path
            else:
                environ['PATH_INFO'] = '/api/'

        # Ensure trailing slash for /api and /admin base paths
        current_path = environ.get('PATH_INFO', '')
        if current_path == '/api':
            environ['PATH_INFO'] = '/api/'
        elif current_path == '/admin':
            environ['PATH_INFO'] = '/admin/'
        elif not current_path.startswith('/api') and not current_path.startswith('/admin'):
            environ['PATH_INFO'] = f"/api{current_path}"

        return self.wsgi_application(environ, start_response)


# Expose WSGI callable for Vercel (@vercel/python looks for 'app' or 'application')
app = VercelWsgiHandler(django_app)
application = app
