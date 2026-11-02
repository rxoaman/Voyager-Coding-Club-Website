from django.http import JsonResponse, Http404
from django.views.decorators.http import require_GET
from .models import ClubProfile, SubTeam, Member, Event

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
    profile = ClubProfile.objects.first()
    if not profile:
        profile = ClubProfile.objects.create()
    return JsonResponse(profile.to_dict())

@require_GET
def get_events(request):
    """
    Returns all club events with Upcoming events strictly first,
    ordered by status ('Upcoming' before 'Completed') then display_order.
    """
    events = list(Event.objects.all())
    # Explicitly ensure Upcoming events are first
    events_sorted = sorted(events, key=lambda e: (0 if e.status.lower() == 'upcoming' else 1, e.display_order))
    return JsonResponse([e.to_dict() for e in events_sorted], safe=False)

@require_GET
def get_team(request):
    """
    Returns sub-teams and active core members.
    """
    sub_teams = [st.to_dict() for st in SubTeam.objects.all()]
    members = [m.to_dict() for m in Member.objects.filter(is_active=True)]
    return JsonResponse({
        "subTeams": sub_teams,
        "members": members
    })

@require_GET
def get_member_detail(request, slug):
    try:
        member = Member.objects.get(slug=slug, is_active=True)
        return JsonResponse(member.to_dict())
    except Member.DoesNotExist:
        return JsonResponse({"error": f"Member '{slug}' not found"}, status=404)
