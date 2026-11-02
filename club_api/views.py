from django.http import JsonResponse, Http404
from django.views.decorators.http import require_GET
from .models import ClubProfile, SubTeam, Member, Event
from . import data_loader

@require_GET
def health_check(request):
    return JsonResponse({
        "status": "healthy",
        "service": "Voyager Coding Club Django Backend",
        "version": "1.0.0",
        "framework": "Django 6.1"
    })

@require_GET
def get_club_info(request):
    info = data_loader.get_club_info()
    if info:
        return JsonResponse(info)
    
    profile = ClubProfile.objects.first()
    if not profile:
        profile = ClubProfile.objects.create()
    return JsonResponse(profile.to_dict())

@require_GET
def get_events(request):
    """
    Returns all club events with Upcoming events strictly first.
    Dynamically loads from frontend/src/data/clubData.js,
    with fallback to SQLite models.
    """
    category = request.GET.get('category')
    status = request.GET.get('status')

    events = data_loader.get_events(category=category, status=status)
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

    return JsonResponse({
        "success": True,
        "count": len(events),
        "data": events,
        "events": events
    })

@require_GET
def get_team(request):
    """
    Returns sub-teams and active core members.
    Dynamically loads from frontend/src/data/clubData.js,
    with fallback to SQLite models.
    """
    sub_team = request.GET.get('subTeam') or request.GET.get('category')

    sub_teams = data_loader.get_sub_teams()
    members = data_loader.get_team_members(sub_team=sub_team)
    club_info = data_loader.get_club_info()

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
    Returns detailed dossier for an individual member.
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
