"""
Management Command: python manage.py buildfrontend

Builds the React frontend using Vite and compiles static bundles into
frontend/dist/ for production or Django local serving.
"""

import os
import subprocess
from pathlib import Path
from django.core.management.base import BaseCommand
from django.conf import settings

class Command(BaseCommand):
    help = "Builds the React SPA using Vite into frontend/dist/"

    def handle(self, *args, **options):
        frontend_dir = settings.BASE_DIR / 'frontend'

        if not frontend_dir.exists():
            self.stderr.write(self.style.ERROR(f"Frontend directory not found at: {frontend_dir}"))
            return

        self.stdout.write(self.style.NOTICE("Building React SPA with Vite..."))

        # Check if node_modules exists
        node_modules = frontend_dir / 'node_modules'
        if not node_modules.exists():
            self.stdout.write(self.style.WARNING("node_modules not found. Running 'npm install' first..."))
            subprocess.run(["npm", "install"], cwd=str(frontend_dir), shell=True, check=True)

        # Run npm run build
        try:
            result = subprocess.run(
                ["npm", "run", "build"],
                cwd=str(frontend_dir),
                shell=True,
                check=True,
                capture_output=True,
                text=True
            )
            self.stdout.write(result.stdout)
            self.stdout.write(self.style.SUCCESS("✓ Successfully built React frontend into frontend/dist/"))
        except subprocess.CalledProcessError as err:
            self.stderr.write(self.style.ERROR(f"Build failed:\n{err.stderr or err.stdout}"))
