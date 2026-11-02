import logging
from pathlib import Path
from django.apps import AppConfig
from django.conf import settings

logger = logging.getLogger(__name__)

class ClubApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'club_api'

    def ready(self):
        """
        Connect signals to autoreload frontend data files.
        When club.js or clubData.js changes, notify django_browser_reload.
        """
        try:
            from django.utils.autoreload import autoreload_started, file_changed
            from django.dispatch import receiver

            data_dir = settings.BASE_DIR / 'frontend' / 'src' / 'data'

            @receiver(autoreload_started, dispatch_uid="voyager_watch_club_data")
            def watch_club_data(sender, **kwargs):
                if data_dir.exists():
                    sender.watch_dir(data_dir, "**/*")

            @receiver(file_changed, dispatch_uid="voyager_reload_on_club_data")
            def on_club_data_changed(sender, file_path, **kwargs):
                file_parents = file_path.parents
                if data_dir in file_parents or file_path.parent == data_dir:
                    try:
                        from django_browser_reload.views import trigger_reload_soon
                        trigger_reload_soon()
                        return True  # Tell Django not to restart Python, just reload browser
                    except Exception:
                        pass
        except Exception as exc:
            logger.debug(f"[club_api] Autoreload signal registration skipped: {exc}")
