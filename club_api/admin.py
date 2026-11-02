from django.contrib import admin
from .models import ClubProfile, SubTeam, Member, Event

@admin.register(ClubProfile)
class ClubProfileAdmin(admin.ModelAdmin):
    list_display = ('name', 'institution', 'tagline')

@admin.register(SubTeam)
class SubTeamAdmin(admin.ModelAdmin):
    list_display = ('name', 'team_id', 'display_order')
    prepopulated_fields = {'team_id': ('name',)}

@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ('name', 'badge_id', 'sub_team', 'designation', 'is_active', 'badge_number')
    list_filter = ('sub_team', 'is_active')
    search_fields = ('name', 'badge_id', 'designation', 'email', 'skills')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'badge', 'status', 'date', 'location')
    list_filter = ('status', 'badge')
    search_fields = ('title', 'description', 'location')
    prepopulated_fields = {'slug': ('title',)}
