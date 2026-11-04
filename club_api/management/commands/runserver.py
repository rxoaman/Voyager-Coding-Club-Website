"""
=============================================================================
Voyager Coding Club - Custom Runserver Management Command
=============================================================================
Overrides Django's default runserver command to:
1. Automatically bind to 0.0.0.0:8000 so the site is accessible across the
   local Wi-Fi / LAN without requiring special flags.
2. Normalize bare '0.0.0.0' or port-only inputs to prevent Windows CommandErrors.
3. Automatically detect and display your computer's local Wi-Fi IP address
   (e.g., http://192.168.1.5:8000/) for mobile testing.
=============================================================================
"""

import socket
import re
from django.contrib.staticfiles.management.commands.runserver import Command as StaticfilesRunserverCommand


class Command(StaticfilesRunserverCommand):
    help = "Starts the Voyager Coding Club web server (accessible locally and on your Wi-Fi/LAN)"

    default_addr = '0.0.0.0'
    default_port = '8000'

    def handle(self, *args, **options):
        """
        Normalizes command-line arguments to prevent address/port syntax errors:
        - python manage.py runserver            -> 0.0.0.0:8000
        - python manage.py runserver 0.0.0.0    -> 0.0.0.0:8000
        - python manage.py runserver 8080       -> 0.0.0.0:8080
        """
        addrport = options.get('addrport')
        if not addrport:
            options['addrport'] = '0.0.0.0:8000'
        elif addrport in ('0.0.0.0', '0'):
            options['addrport'] = '0.0.0.0:8000'
        elif addrport.isdigit():
            options['addrport'] = f'0.0.0.0:{addrport}'
        return super().handle(*args, **options)

    def run(self, **options):
        """
        Detects local Wi-Fi IP address and displays formatted access URLs.
        """
        try:
            # Query an external routing address to determine local Wi-Fi network interface
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.connect(("8.8.8.8", 80))
            local_ip = s.getsockname()[0]
            s.close()
        except Exception:
            local_ip = "127.0.0.1"

        addrport = options.get('addrport') or '0.0.0.0:8000'
        port = addrport.split(':')[-1] if ':' in addrport else (addrport if addrport.isdigit() else '8000')

        self.stdout.write(self.style.SUCCESS(
            "\n"
            "========================================================\n"
            "  VOYAGER CODING CLUB — DJANGO WEB PORTAL IS RUNNING\n"
            "========================================================\n"
            f"  > On this computer:   http://127.0.0.1:{port}/\n"
            f"  > On your Wi-Fi/LAN:  http://{local_ip}:{port}/\n"
            f"  > REST API:           http://127.0.0.1:{port}/api/events/\n"
            f"  > Django Admin:       http://127.0.0.1:{port}/admin/\n"
            "========================================================\n"
            "  * Note: Open http://127.0.0.1:8000/ in your browser.\n"
            "    (do not type '0.0.0.0' directly into your browser address bar)\n"
            "========================================================\n"
        ))
        super().run(**options)
