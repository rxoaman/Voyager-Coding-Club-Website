"""
=============================================================================
Voyager Coding Club - Data Models (SQLite Database Schema)
=============================================================================
Defines relational models for the Django administration panel:
1. ClubProfile: Organization metadata, emblem, and official social handles.
2. SubTeam: Core departments (Technical, Management, Social Media, Design).
3. Member: Club leadership profiles, badge numbers, roles, and cutouts.
4. Event: Flagship hackathons, workshops, dates, and registration links.
=============================================================================
"""

from django.db import models


class ClubProfile(models.Model):
    """
    Stores top-level metadata and branding for Voyager Coding Club.
    Displayed on the Navbar, Hero emblem, and Footer.
    """
    name = models.CharField(max_length=200, default="Voyager Coding Club")
    institution = models.CharField(max_length=300, default="KCC Institute of Technology & Management, Greater Noida")
    tagline = models.CharField(max_length=200, default="Grow | Collaborate | Connect")
    motto = models.TextField(default="Student coding community of KCC Institute of Technology & Management.")
    logo = models.CharField(max_length=300, default="/assets/Logo_Cube.png")
    card_back = models.CharField(max_length=300, default="/assets/id-cards/1.png")
    linkedin = models.URLField(default="https://www.linkedin.com/company/voyager-coding-club")
    instagram = models.URLField(default="https://www.instagram.com/voyager.kccitm/")
    github = models.URLField(default="https://github.com/rxoaman/Voyager-s-Website")

    class Meta:
        verbose_name = "Club Profile"
        verbose_name_plural = "Club Profile"

    def __str__(self):
        return self.name

    def to_dict(self):
        """Serializes the club profile into a JSON-compatible dictionary."""
        return {
            "name": self.name,
            "institution": self.institution,
            "tagline": self.tagline,
            "motto": self.motto,
            "logo": self.logo,
            "cardBack": self.card_back,
            "socials": {
                "linkedin": self.linkedin,
                "instagram": self.instagram,
                "github": self.github,
            }
        }


class SubTeam(models.Model):
    """
    Represents a club department (Technical Team, Management Team, etc.).
    Used to organize and filter ID cards in the Team Members section.
    """
    team_id = models.SlugField(max_length=100, unique=True, help_text="e.g. technical, management")
    name = models.CharField(max_length=150, help_text="e.g. Technical Team")
    description = models.TextField(blank=True, help_text="Sub-team mission text")
    display_order = models.IntegerField(default=0, help_text="Display ordering sequence")

    class Meta:
        ordering = ['display_order', 'id']
        verbose_name = "Sub Team"
        verbose_name_plural = "Sub Teams"

    def __str__(self):
        return self.name

    def to_dict(self):
        """Serializes sub-team into a JSON-compatible dictionary."""
        return {
            "id": self.team_id,
            "name": self.name,
            "description": self.description,
        }


class Member(models.Model):
    """
    Represents an individual student leader in Voyager Coding Club.
    Displayed as a liquid-glass ID card badge and detailed dossier page.
    """
    slug = models.SlugField(max_length=120, unique=True, help_text="URL slug (e.g. purushottam-kumar)")
    name = models.CharField(max_length=200, help_text="Full member name")
    badge_number = models.IntegerField(help_text="Numeric badge identifier (#1)")
    badge_id = models.CharField(max_length=50, help_text="Badge string code (VYR-TECH-001)")
    card_image = models.CharField(max_length=300, help_text="Path to ID card artwork render")
    portrait_image = models.CharField(max_length=300, blank=True, help_text="Path to transparent cutout photo")
    sub_team = models.ForeignKey(SubTeam, on_delete=models.CASCADE, related_name="members")
    designation = models.CharField(max_length=150, help_text="Primary role (Technical Lead)")
    title = models.CharField(max_length=150, blank=True, help_text="Specialization title")
    email = models.EmailField(blank=True, help_text="Member contact email")
    linkedin = models.URLField(blank=True, help_text="Member LinkedIn profile URL")
    bio = models.TextField(blank=True, help_text="Detailed member biography / dossier")
    skills = models.JSONField(default=list, blank=True, help_text="Array of technical skill strings")
    is_active = models.BooleanField(default=True, help_text="Whether member is currently active")
    display_order = models.IntegerField(default=0)

    class Meta:
        ordering = ['sub_team__display_order', 'display_order', 'id']
        verbose_name = "Team Member"
        verbose_name_plural = "Team Members"

    def __str__(self):
        return f"{self.name} ({self.badge_id})"

    def to_dict(self):
        """Serializes team member into a JSON-compatible dictionary matching React props."""
        return {
            "id": self.slug,
            "name": self.name,
            "badgeNumber": self.badge_number,
            "badgeId": self.badge_id,
            "cardImage": self.card_image,
            "photoUrl": self.portrait_image or f"/assets/members/{self.slug}.png",
            "subTeam": self.sub_team.name,
            "subTeamId": self.sub_team.team_id,
            "designation": self.designation,
            "title": self.title,
            "email": self.email,
            "linkedin": self.linkedin,
            "bio": self.bio,
            "skills": self.skills,
        }


class Event(models.Model):
    """
    Represents a club hackathon, workshop, or tech event.
    Displayed on the Club Events grid. Upcoming events are strictly placed first.
    """
    STATUS_CHOICES = [
        ('Upcoming', 'Upcoming'),
        ('Completed', 'Completed'),
    ]

    slug = models.SlugField(max_length=150, unique=True, help_text="URL identifier (e.g. 13th-protocol)")
    title = models.CharField(max_length=250, help_text="Event title")
    badge = models.CharField(max_length=100, default="Hackathon", help_text="Category badge (AI Hackathon)")
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Upcoming')
    date = models.CharField(max_length=100, help_text="Event date string (e.g. 28 Nov 2026)")
    time = models.CharField(max_length=100, blank=True, default="10:00 AM IST")
    location = models.CharField(max_length=150, default="KCCITM", help_text="Strictly KCCITM")
    description = models.TextField(help_text="Detailed event synopsis")
    image_url = models.URLField(max_length=500, help_text="Banner graphic URL")
    registration_url = models.URLField(max_length=500, blank=True, help_text="Registration portal link")
    action_text = models.CharField(max_length=100, blank=True, default="Register Now")
    linkedin_post_url = models.URLField(max_length=500, blank=True, help_text="LinkedIn recap post URL")
    highlights = models.JSONField(default=list, blank=True, help_text="Key highlight badges")
    category = models.CharField(max_length=100, default="Hackathon")
    display_order = models.IntegerField(default=0)

    class Meta:
        ordering = ['-status', 'display_order', 'id']
        verbose_name = "Club Event"
        verbose_name_plural = "Club Events"

    def __str__(self):
        return f"{self.title} ({self.status})"

    def to_dict(self):
        """Serializes event into a JSON-compatible dictionary matching React EventCard props."""
        return {
            "id": self.slug,
            "title": self.title,
            "badge": self.badge,
            "status": self.status,
            "date": self.date,
            "time": self.time,
            "location": self.location,
            "description": self.description,
            "imageUrl": self.image_url,
            "registrationUrl": self.registration_url or self.linkedin_post_url,
            "actionText": self.action_text or ("Register Now" if self.status.lower() == 'upcoming' else "LinkedIn Post"),
            "linkedinPostUrl": self.linkedin_post_url,
            "highlights": self.highlights,
            "category": self.category,
        }
