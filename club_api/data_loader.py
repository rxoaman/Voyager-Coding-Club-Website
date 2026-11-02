"""
Dynamic Data Access Layer for Voyager Coding Club (Django Edition)

Directly parses and serves data from frontend/src/data/club.js and clubData.js.
When someone edits club.js (or clubData.js), changes reflect immediately in the API
and frontend without needing Node or manual database migrations.
"""

import os
import re
import json
import logging
from pathlib import Path
from django.conf import settings

logger = logging.getLogger(__name__)

_CACHE = {
    'file_path': None,
    'mtime': None,
    'data': {
        'club_info': None,
        'events': None,
        'sub_teams': None,
        'team_members': None,
    }
}


def _remove_comments(js_text: str) -> str:
    """
    Strips single-line and multi-line comments from JavaScript source,
    preserving strings (such as URLs containing 'https://...').
    """
    def replacer(match):
        if match.group(1):
            return match.group(1)
        return ""
    pattern = r'("(?:\\[\s\S]|[^"\\])*"|\'(?:\\[\s\S]|[^\'\\])*\')|(//.*?$)|(/\*[\s\S]*?\*/)'
    return re.sub(pattern, replacer, js_text, flags=re.MULTILINE)


def _parse_js_export(content: str, var_name: str):
    """
    Extracts and parses an exported constant (Object or Array) from JavaScript source.
    """
    pattern = rf'export\s+const\s+{var_name}\s*=\s*([\[\{{][\s\S]*?[\]\}}]);'
    match = re.search(pattern, content)
    if not match:
        return None

    js_raw = match.group(1)
    clean = _remove_comments(js_raw)

    # Quote unquoted property keys (e.g., id: "..." -> "id": "...")
    clean = re.sub(r'([{,\n]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:', r'\1"\2":', clean)

    # Remove trailing commas before closing braces or brackets
    clean = re.sub(r',\s*([}\]])', r'\1', clean)

    try:
        return json.loads(clean, strict=False)
    except Exception as exc:
        logger.warning(f"[data_loader] Failed parsing JS variable {var_name}: {exc}")
        return None


def get_active_data_file() -> Path | None:
    """
    Determines the active club data file.
    Checks frontend/src/data/club.js and frontend/src/data/clubData.js.
    Returns whichever file exists and was modified most recently.
    """
    data_dir = settings.BASE_DIR / 'frontend' / 'src' / 'data'
    club_js = data_dir / 'club.js'
    club_data_js = data_dir / 'clubData.js'

    candidates = []
    if club_js.exists() and club_js.is_file():
        candidates.append((club_js.stat().st_mtime, club_js))
    if club_data_js.exists() and club_data_js.is_file():
        candidates.append((club_data_js.stat().st_mtime, club_data_js))

    if not candidates:
        return None

    # Pick the one with highest mtime (most recently modified)
    candidates.sort(key=lambda x: x[0], reverse=True)
    return candidates[0][1]


def load_all_data(force_reload: bool = False) -> dict:
    """
    Loads CLUB_INFO, EVENTS, SUB_TEAMS, and TEAM_MEMBERS from active JS file.
    Caches parsed data based on file modification time.
    """
    target_file = get_active_data_file()
    if not target_file:
        return _CACHE['data']

    try:
        current_mtime = target_file.stat().st_mtime
    except OSError:
        return _CACHE['data']

    # Return cached data if file hasn't changed
    if (
        not force_reload
        and _CACHE['file_path'] == target_file
        and _CACHE['mtime'] == current_mtime
        and _CACHE['data']['events'] is not None
    ):
        return _CACHE['data']

    try:
        content = target_file.read_text(encoding='utf-8')
    except Exception as exc:
        logger.error(f"[data_loader] Cannot read {target_file}: {exc}")
        return _CACHE['data']

    club_info = _parse_js_export(content, 'CLUB_INFO')
    events = _parse_js_export(content, 'EVENTS')
    sub_teams = _parse_js_export(content, 'SUB_TEAMS')
    team_members = _parse_js_export(content, 'TEAM_MEMBERS')

    # If any export was missing in the newest file (e.g., if user created a partial file),
    # fallback to the other file (clubData.js or club.js)
    if not (club_info and events and sub_teams and team_members):
        data_dir = settings.BASE_DIR / 'frontend' / 'src' / 'data'
        alt_file = (data_dir / 'clubData.js') if target_file.name == 'club.js' else (data_dir / 'club.js')
        if alt_file.exists() and alt_file.is_file():
            try:
                alt_content = alt_file.read_text(encoding='utf-8')
                if not club_info:
                    club_info = _parse_js_export(alt_content, 'CLUB_INFO')
                if not events:
                    events = _parse_js_export(alt_content, 'EVENTS')
                if not sub_teams:
                    sub_teams = _parse_js_export(alt_content, 'SUB_TEAMS')
                if not team_members:
                    team_members = _parse_js_export(alt_content, 'TEAM_MEMBERS')
            except Exception:
                pass

    # Ensure Upcoming events are strictly first
    if events and isinstance(events, list):
        events = sorted(
            events,
            key=lambda e: (0 if str(e.get('status', '')).lower() == 'upcoming' else 1)
        )

    # Update cache
    _CACHE['file_path'] = target_file
    _CACHE['mtime'] = current_mtime
    _CACHE['data'] = {
        'club_info': club_info or _CACHE['data']['club_info'],
        'events': events or _CACHE['data']['events'],
        'sub_teams': sub_teams or _CACHE['data']['sub_teams'],
        'team_members': team_members or _CACHE['data']['team_members'],
    }

    return _CACHE['data']


def get_club_info() -> dict | None:
    data = load_all_data()
    return data.get('club_info')


def get_events(category: str | None = None, status: str | None = None) -> list:
    data = load_all_data()
    events = data.get('events') or []
    if category:
        events = [e for e in events if str(e.get('category', '')).lower() == category.lower()]
    if status:
        events = [e for e in events if str(e.get('status', '')).lower() == status.lower()]
    # Re-sort to guarantee Upcoming is strictly first
    return sorted(
        events,
        key=lambda e: (0 if str(e.get('status', '')).lower() == 'upcoming' else 1)
    )


def get_sub_teams() -> list:
    data = load_all_data()
    return data.get('sub_teams') or []


def get_team_members(sub_team: str | None = None) -> list:
    data = load_all_data()
    members = data.get('team_members') or []
    if sub_team:
        st_lower = sub_team.lower()
        members = [
            m for m in members
            if str(m.get('subTeamId', '')).lower() == st_lower
            or str(m.get('subTeam', '')).lower() == st_lower
        ]
    return members


def get_member_by_slug(slug_or_id: str) -> dict | None:
    data = load_all_data()
    members = data.get('team_members') or []
    target = slug_or_id.lower()
    for m in members:
        if str(m.get('id', '')).lower() == target:
            return m
        if str(m.get('badgeId', '')).lower() == target:
            return m
    return None
