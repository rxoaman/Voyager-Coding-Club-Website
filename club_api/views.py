"""
=============================================================================
Voyager Coding Club - API View Controllers
=============================================================================
Provides clean REST API endpoints for the React Single Page Application:
- GET /api/health/       -> Health verification and service status.
- GET /api/club/         -> Club metadata, emblem, and official social links.
- GET /api/events/       -> All events with Upcoming strictly first.
- GET /api/team/         -> Active leadership organized by sub-teams.
- GET /api/team/<slug>/  -> Individual member dossier with biography and skills.

Data Priority:
All endpoints dynamically read and parse frontend/src/data/clubData.js first.
If the file is absent or incomplete, queries gracefully fall back to SQLite.
=============================================================================
"""

from django.http import JsonResponse, Http404
from django.views.decorators.http import require_GET
from .models import ClubProfile, SubTeam, Member, Event
from . import data_loader


@require_GET
def health_check(request):
    """
    Health check endpoint: Verifies backend uptime and framework version.
    Returns HTTP 200 with service telemetry.
    """
    return JsonResponse({
        "status": "healthy",
        "service": "Voyager Coding Club Django Backend",
        "version": "1.0.0",
        "framework": "Django 6.1"
    })


@require_GET
def get_club_info(request):
    """
    Returns organization profile metadata, emblem path, and official socials.
    Priority: frontend/src/data/clubData.js -> SQLite ClubProfile.
    """
    info = data_loader.get_club_info()
    if info:
        return JsonResponse(info)

    # Fallback to SQLite database
    profile = ClubProfile.objects.first()
    if not profile:
        profile = ClubProfile.objects.create()
    return JsonResponse(profile.to_dict())


@require_GET
def get_events(request):
    """
    Returns all club events.
    Enforces the 'Upcoming Always First' business rule: any event with
    status='Upcoming' is placed at the beginning of the list.

    Query Parameters:
        category: Filter by event category (e.g. 'Hackathon')
        status:   Filter by status ('Upcoming' or 'Completed')
    """
    category = request.GET.get('category')
    status = request.GET.get('status')

    # 1. Attempt dynamic load from clubData.js
    events = data_loader.get_events(category=category, status=status)

    # 2. Fallback to SQLite if clubData.js returned no records
    if not events:
        db_events = list(Event.objects.all())
        events = [e.to_dict() for e in sorted(
            db_events,
            key=lambda e: (0 if e.status.lower() == 'upcoming' else 1, e.display_order)
        )]
        if category:
            events = [e for e in events if e.get('category', '').lower() == category.lower()]
        if status:
            events = [e for e in events if e.get('status', '').lower() == status.lower()]

    # Return standard response containing both 'data' and 'events' for client compatibility
    return JsonResponse({
        "success": True,
        "count": len(events),
        "data": events,
        "events": events
    })


@require_GET
def get_team(request):
    """
    Returns active leadership members and sub-teams.

    Query Parameters:
        subTeam / category: Optional sub-team filter ('technical', 'management', etc.)
    """
    sub_team = request.GET.get('subTeam') or request.GET.get('category')

    # 1. Attempt dynamic load from clubData.js
    sub_teams = data_loader.get_sub_teams()
    members = data_loader.get_team_members(sub_team=sub_team)
    club_info = data_loader.get_club_info()

    # 2. Fallback to SQLite if file records are missing
    if not sub_teams or not members:
        if not sub_teams:
            sub_teams = [st.to_dict() for st in SubTeam.objects.all()]
        if not members:
            qs = Member.objects.filter(is_active=True)
            if sub_team:
                qs = qs.filter(sub_team__team_id=sub_team)
            members = [m.to_dict() for m in qs]
        if not club_info:
            profile = ClubProfile.objects.first()
            club_info = profile.to_dict() if profile else {}

    return JsonResponse({
        "success": True,
        "club": club_info,
        "subTeams": sub_teams,
        "count": len(members),
        "data": members,
        "members": members
    })


@require_GET
def get_member_detail(request, slug):
    """
    Returns complete profile dossier for an individual team member by URL slug or badge ID.
    Used by the /team/:id route and MemberDetail view.
    """
    member = data_loader.get_member_by_slug(slug)
    if not member:
        try:
            m = Member.objects.get(slug=slug, is_active=True)
            member = m.to_dict()
        except Member.DoesNotExist:
            return JsonResponse({
                "success": False,
                "error": f"Member '{slug}' not found"
            }, status=404)

    payload = {
        "success": True,
        "data": member
    }
    payload.update(member)
    return JsonResponse(payload)
