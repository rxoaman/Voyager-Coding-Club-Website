#!/usr/bin/env python
"""
=============================================================================
Voyager Coding Club - Django Management CLI Entry Point
=============================================================================
This script provides the command-line interface for administrative,
development, and deployment tasks for the Voyager Web Portal.

Common Commands:
    python manage.py runserver 0.0.0.0:8000   # Starts development server on LAN
    python manage.py buildfrontend            # Compiles Vite React SPA
    python manage.py seed_data                # Seeds SQLite database
    python manage.py check                    # Verifies Django setup integrity
=============================================================================
"""
import os
import sys


def main():
    """Configure settings module and delegate execution to Django core."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'portal_backend.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
