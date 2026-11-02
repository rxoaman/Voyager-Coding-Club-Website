import socket
import re
from django.contrib.staticfiles.management.commands.runserver import Command as StaticfilesRunserverCommand

class Command(StaticfilesRunserverCommand):
    help = "Starts the Voyager Coding Club web server (accessible locally and on your Wi-Fi/LAN)"

    default_addr = '0.0.0.0'
    default_port = '8000'

    def handle(self, *args, **options):
        # If user passed '0.0.0.0' or '0' without port, or None, normalize cleanly
        addrport = options.get('addrport')
        if not addrport:
            options['addrport'] = '0.0.0.0:8000'
        elif addrport in ('0.0.0.0', '0'):
            options['addrport'] = '0.0.0.0:8000'
        elif addrport.isdigit():
            options['addrport'] = f'0.0.0.0:{addrport}'
        return super().handle(*args, **options)

    def run(self, **options):
        try:
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
