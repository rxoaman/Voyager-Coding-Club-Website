"""
=============================================================================
Voyager Coding Club - WSGI Web Server Configuration
=============================================================================
Exposes the WSGI callable as 'application' (standard WSGI) and 'app' (Vercel).
=============================================================================
"""

import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'portal_backend.settings')

application = get_wsgi_application()
app = application
