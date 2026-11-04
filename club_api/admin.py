"""
=============================================================================
Voyager Coding Club - Django Admin Dashboard Configuration
=============================================================================
Registers data models with the Django Admin site (/admin/).
Provides filtering, searching, and slug auto-generation for maintainers.
=============================================================================
"""

from django.contrib import admin
from .models import ClubProfile, SubTeam, Member, Event


@admin.register(ClubProfile)
class ClubProfileAdmin(admin.ModelAdmin):
    """Admin interface for top-level club metadata and official links."""
    list_display = ('name', 'institution', 'tagline')


@admin.register(SubTeam)
class SubTeamAdmin(admin.ModelAdmin):
    """Admin interface for core departments (Technical, Management, Social, Design)."""
    list_display = ('name', 'team_id', 'display_order')
    prepopulated_fields = {'team_id': ('name',)}


@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    """Admin interface for club student leaders and badge assignments."""
    list_display = ('name', 'badge_id', 'sub_team', 'designation', 'is_active', 'badge_number')
    list_filter = ('sub_team', 'is_active')
    search_fields = ('name', 'badge_id', 'designation', 'email', 'skills')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    """Admin interface for flagship hackathons, workshops, and upcoming missions."""
    list_display = ('title', 'badge', 'status', 'date', 'location')
    list_filter = ('status', 'badge')
    search_fields = ('title', 'description', 'location')
    prepopulated_fields = {'slug': ('title',)}
