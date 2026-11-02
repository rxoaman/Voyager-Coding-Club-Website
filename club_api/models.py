from django.db import models

class ClubProfile(models.Model):
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
    team_id = models.SlugField(max_length=100, unique=True)
    name = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    display_order = models.IntegerField(default=0)

    class Meta:
        ordering = ['display_order', 'id']
        verbose_name = "Sub Team"
        verbose_name_plural = "Sub Teams"

    def __str__(self):
        return self.name

    def to_dict(self):
        return {
            "id": self.team_id,
            "name": self.name,
            "description": self.description,
        }


class Member(models.Model):
    slug = models.SlugField(max_length=120, unique=True)
    name = models.CharField(max_length=200)
    badge_number = models.IntegerField()
    badge_id = models.CharField(max_length=50)
    card_image = models.CharField(max_length=300)
    portrait_image = models.CharField(max_length=300, blank=True)
    sub_team = models.ForeignKey(SubTeam, on_delete=models.CASCADE, related_name="members")
    designation = models.CharField(max_length=150)
    title = models.CharField(max_length=150, blank=True)
    email = models.EmailField(blank=True)
    linkedin = models.URLField(blank=True)
    bio = models.TextField(blank=True)
    skills = models.JSONField(default=list, blank=True)
    is_active = models.BooleanField(default=True)
    display_order = models.IntegerField(default=0)

    class Meta:
        ordering = ['sub_team__display_order', 'display_order', 'id']
        verbose_name = "Team Member"
        verbose_name_plural = "Team Members"

    def __str__(self):
        return f"{self.name} ({self.badge_id})"

    def to_dict(self):
        return {
            "id": self.slug,
            "name": self.name,
            "badgeNumber": self.badge_number,
            "badgeId": self.badge_id,
            "cardImage": self.card_image,
            "portraitImage": self.portrait_image or f"/assets/members/{self.slug}.png",
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
    STATUS_CHOICES = [
        ('Upcoming', 'Upcoming'),
        ('Completed', 'Completed'),
    ]

    slug = models.SlugField(max_length=150, unique=True)
    title = models.CharField(max_length=250)
    badge = models.CharField(max_length=100, default="Hackathon")
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Upcoming')
    date = models.CharField(max_length=100)
    time = models.CharField(max_length=100, blank=True, default="10:00 AM IST")
    location = models.CharField(max_length=150, default="KCCITM")
    description = models.TextField()
    image_url = models.URLField(max_length=500)
    linkedin_post_url = models.URLField(max_length=500, blank=True)
    highlights = models.JSONField(default=list, blank=True)
    category = models.CharField(max_length=100, default="Hackathon")
    display_order = models.IntegerField(default=0)

    class Meta:
        ordering = ['-status', 'display_order', 'id']
        verbose_name = "Club Event"
        verbose_name_plural = "Club Events"

    def __str__(self):
        return f"{self.title} ({self.status})"

    def to_dict(self):
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
            "linkedinPostUrl": self.linkedin_post_url,
            "highlights": self.highlights,
            "category": self.category,
        }
