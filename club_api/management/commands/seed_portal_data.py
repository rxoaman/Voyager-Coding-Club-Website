from django.core.management.base import BaseCommand
from club_api.models import ClubProfile, SubTeam, Member, Event

class Command(BaseCommand):
    help = "Seeds initial Voyager Coding Club core leadership and events data"

    def handle(self, *args, **options):
        self.stdout.write("Seeding Voyager Coding Club database...")

        # 1. Club Profile
        club, created = ClubProfile.objects.get_or_create(
            name="Voyager Coding Club",
            defaults={
                "institution": "KCC Institute of Technology & Management, Greater Noida",
                "tagline": "Grow | Collaborate | Connect",
                "motto": "Student coding community of KCC Institute of Technology & Management.",
                "logo": "/assets/Logo_Cube.png",
                "card_back": "/assets/id-cards/1.png",
                "linkedin": "https://www.linkedin.com/company/voyager-coding-club",
                "instagram": "https://www.instagram.com/voyager.kccitm/",
                "github": "https://github.com/rxoaman/Voyager-s-Website"
            }
        )
        self.stdout.write(f"Club Profile: {club.name}")

        # 2. Sub-Teams (strictly the 4 core leadership teams)
        sub_teams_data = [
            {
                "team_id": "technical",
                "name": "Technical Team",
                "description": "Engineers building software architectures, web systems, and competitive programming pathways.",
                "display_order": 1
            },
            {
                "team_id": "management",
                "name": "Management Team",
                "description": "Organizers handling operations, campus coordination, partnerships, and event logistics.",
                "display_order": 2
            },
            {
                "team_id": "social-media",
                "name": "Social Media Team",
                "description": "Community managers handling LinkedIn, Instagram, and event media.",
                "display_order": 3
            },
            {
                "team_id": "design",
                "name": "Design Team",
                "description": "Designers responsible for UI/UX, badge layouts, and visual assets.",
                "display_order": 4
            }
        ]

        sub_teams = {}
        for st_data in sub_teams_data:
            st, _ = SubTeam.objects.update_or_create(
                team_id=st_data["team_id"],
                defaults=st_data
            )
            sub_teams[st.team_id] = st
        self.stdout.write(f"Created {len(sub_teams)} Sub-Teams.")

        # 3. 14 Core Members
        members_data = [
            # Technical Team (5 members)
            {
                "slug": "purushottam-kumar",
                "name": "Purushottam Kumar",
                "badge_number": 1,
                "badge_id": "VYR-TECH-001",
                "card_image": "https://lh3.googleusercontent.com/d/1NLsXQ0-wVwFlXzewYXfb1PQdlBBWCMt3",
                "portrait_image": "https://lh3.googleusercontent.com/d/1Cr-7doCjhJzm6qjtBX3ChL4EYDffuvj5",
                "sub_team": sub_teams["technical"],
                "designation": "Technical Lead",
                "title": "Full-Stack Lead",
                "email": "purushottam.kumxr@gmail.com",
                "linkedin": "https://www.linkedin.com/in/purushottam-kumar-042858331/",
                "bio": "Leads technical architecture and developer workflows at Voyager. Specializes in modern JavaScript, cloud deployments, and resilient frontend architectures.",
                "skills": ["React", "Node.js", "TypeScript", "PostgreSQL", "Anime.js", "Vite"],
                "display_order": 1
            },
            {
                "slug": "nilesh-singh",
                "name": "Nilesh Singh",
                "badge_number": 2,
                "badge_id": "VYR-TECH-002",
                "card_image": "https://lh3.googleusercontent.com/d/1z90gdPSGlPISwPZjhOMj2zfGuzopniLf",
                "portrait_image": "https://lh3.googleusercontent.com/d/1lzGTxOURAxDKjoEq_0cWmbK7W71UPGvC",
                "sub_team": sub_teams["technical"],
                "designation": "Technical Lead",
                "title": "System Architect",
                "email": "nilesh@voyagerkcc.org",
                "linkedin": "https://www.linkedin.com/in/nilesh-singh-612662287/",
                "bio": "Oversees full-stack system architecture, API design, and student hackathon challenge tracks.",
                "skills": ["JavaScript", "Python", "Docker", "REST APIs", "Tailwind CSS"],
                "display_order": 2
            },
            {
                "slug": "pratyush-kumar-singh",
                "name": "Pratyush Kumar Singh",
                "badge_number": 3,
                "badge_id": "VYR-TECH-003",
                "card_image": "https://lh3.googleusercontent.com/d/1A-di8Zj-tTLGRK1XigQ0jQZh7eTz_sVf",
                "portrait_image": "https://lh3.googleusercontent.com/d/1YU-yTw1JDPxzGpeA5mJnWGHlN_qdd8Du",
                "sub_team": sub_teams["technical"],
                "designation": "Technical Expert",
                "title": "Backend Specialist",
                "email": "pratyush@voyagerkcc.org",
                "linkedin": "https://www.linkedin.com/in/pratyush-kumar-singh-002636287/",
                "bio": "Focuses on robust server engineering, distributed data pipelines, and competitive programming mentorship.",
                "skills": ["C++", "Python", "Data Structures", "System Design"],
                "display_order": 3
            },
            {
                "slug": "devender-parmar",
                "name": "Devender Parmar",
                "badge_number": 4,
                "badge_id": "VYR-TECH-004",
                "card_image": "https://lh3.googleusercontent.com/d/1O0vtuF4wnLaTcTGOJfnu5V2YUhm90Ka3",
                "portrait_image": "https://lh3.googleusercontent.com/d/1xkXHC-CmQxa7YRRqsQdV4P2LT8ASLSZ0",
                "sub_team": sub_teams["technical"],
                "designation": "Technical Expert",
                "title": "Web Engineering",
                "email": "devender@voyagerkcc.org",
                "linkedin": "https://www.linkedin.com/in/devender-singh-parmar-963b51290/",
                "bio": "Mentors junior engineers in front-end performance, component architecture, and responsive design systems.",
                "skills": ["React", "CSS Architecture", "Git", "JavaScript"],
                "display_order": 4
            },
            {
                "slug": "ayush-jha",
                "name": "Ayush Jha",
                "badge_number": 5,
                "badge_id": "VYR-TECH-005",
                "card_image": "https://lh3.googleusercontent.com/d/1pZqRDEF2l8EyfnEWj62PSdU4Mr_gAruy",
                "portrait_image": "https://lh3.googleusercontent.com/d/18w7chAZB8e37yZLt0UIyz897fRDFUHQn",
                "sub_team": sub_teams["technical"],
                "designation": "Technical Expert",
                "title": "Algorithms & Web",
                "email": "ayush@voyagerkcc.org",
                "linkedin": "https://www.linkedin.com/in/ayush-jha-764953289/",
                "bio": "Active competitive coder driving problem setting and editorial review sessions for Voyager club events.",
                "skills": ["Competitive Coding", "Python", "JavaScript", "SQL"],
                "display_order": 5
            },

            # Management Team (5 members)
            {
                "slug": "harsh",
                "name": "Harsh",
                "badge_number": 6,
                "badge_id": "VYR-MGT-006",
                "card_image": "https://lh3.googleusercontent.com/d/1U7gYz9nOSSxcEGP2nab7S_BBHiyTGSxD",
                "portrait_image": "https://lh3.googleusercontent.com/d/1w4we_OvmMRyv3igu4wHC8KS67Be5dUZG",
                "sub_team": sub_teams["management"],
                "designation": "President",
                "title": "Club Leadership",
                "email": "harsh@voyagerkcc.org",
                "linkedin": "https://www.linkedin.com/in/harsh-singh-493394287/",
                "bio": "President of Voyager Coding Club. Directs club strategy, industry alliances, hackathons, and institutional leadership.",
                "skills": ["Team Leadership", "Strategic Planning", "Public Speaking", "Event Direction"],
                "display_order": 1
            },
            {
                "slug": "karuna-pradhan",
                "name": "Karuna Pradhan",
                "badge_number": 7,
                "badge_id": "VYR-MGT-007",
                "card_image": "https://lh3.googleusercontent.com/d/1smSvA6aYdwp55e8yc91SuhboBBzGGouM",
                "portrait_image": "https://lh3.googleusercontent.com/d/1fBC-BpAv4JpCSEbqzoPOBsZG1iTvTxnZ",
                "sub_team": sub_teams["management"],
                "designation": "Vice President",
                "title": "Operations & Strategy",
                "email": "karuna@voyagerkcc.org",
                "linkedin": "https://www.linkedin.com/in/karuna-pradhan-3323a7287/",
                "bio": "Vice President coordinating organizational logistics, member engagement, and institutional event approvals.",
                "skills": ["Operations", "Coordination", "Communications", "Project Management"],
                "display_order": 2
            },
            {
                "slug": "bhavya-singh",
                "name": "Bhavya Singh",
                "badge_number": 8,
                "badge_id": "VYR-MGT-008",
                "card_image": "https://lh3.googleusercontent.com/d/1obdoxy-YuFUP2iqL2bCULhCeyq_NygRK",
                "portrait_image": "https://lh3.googleusercontent.com/d/1QtX0SALPhFmkGLIeSWmttzP0lRYs371W",
                "sub_team": sub_teams["management"],
                "designation": "Secretary",
                "title": "Governance & Records",
                "email": "bhavya@voyagerkcc.org",
                "linkedin": "https://www.linkedin.com/in/bhavya-singh-a0703928a/",
                "bio": "Club Secretary managing organizational agendas, formal communication, and club documentation.",
                "skills": ["Governance", "Documentation", "Team Administration", "Logistics"],
                "display_order": 3
            },
            {
                "slug": "raza-masud",
                "name": "Raza Masud",
                "badge_number": 9,
                "badge_id": "VYR-MGT-009",
                "card_image": "https://lh3.googleusercontent.com/d/1dNuQGM5ELORdRYuHdCjSU9GyL9dZ9p9T",
                "portrait_image": "https://lh3.googleusercontent.com/d/1dZSuetsvZLqdnjAY6gmY0FqOJrdusC5x",
                "sub_team": sub_teams["management"],
                "designation": "Treasurer",
                "title": "Finance & Budgets",
                "email": "raza@voyagerkcc.org",
                "linkedin": "https://www.linkedin.com/in/raza-masud-b76b1b287/",
                "bio": "Manages treasury operations, hackathon prize funding, vendor coordination, and club budget allocations.",
                "skills": ["Budgeting", "Financial Planning", "Resource Allocation", "Sponsorship"],
                "display_order": 4
            },
            {
                "slug": "akash",
                "name": "Akash",
                "badge_number": 10,
                "badge_id": "VYR-MGT-010",
                "card_image": "https://lh3.googleusercontent.com/d/1IytkoTuKnHQTHOVDb7jC4nVonCSrmXp2",
                "portrait_image": "https://lh3.googleusercontent.com/d/1KnzPI1UO4ky9TYdn-ThjOJOn_jZhjnJr",
                "sub_team": sub_teams["management"],
                "designation": "Management Lead",
                "title": "Logistics & Outreach",
                "email": "akash@voyagerkcc.org",
                "linkedin": "https://www.linkedin.com/in/akash-kumar-sharma-278065287/",
                "bio": "Leads venue planning, volunteer staffing, and event logistics across flagship hackathons.",
                "skills": ["Campus Logistics", "Team Management", "Volunteer Operations"],
                "display_order": 5
            },

            # Social Media Team (2 members)
            {
                "slug": "chaitanya-mathur",
                "name": "Chaitanya Mathur",
                "badge_number": 11,
                "badge_id": "VYR-SOC-011",
                "card_image": "https://lh3.googleusercontent.com/d/1AlAS7a8yffF6cjWeyiLbP56d9iNOJhKs",
                "portrait_image": "https://lh3.googleusercontent.com/d/1gLxkraumyg4tLfwYx9jo4b7Wz9tHQbte",
                "sub_team": sub_teams["social-media"],
                "designation": "Social Media Lead",
                "title": "Content Strategy",
                "email": "chaitanya@voyagerkcc.org",
                "linkedin": "https://www.linkedin.com/in/chaitanya-mathur-486018287/",
                "bio": "Drives LinkedIn campaigns, Instagram reels, and official press releases for club hackathons.",
                "skills": ["LinkedIn Growth", "Content Writing", "Brand Voice", "Community Outreach"],
                "display_order": 1
            },
            {
                "slug": "rauneet-singh",
                "name": "Rauneet Singh",
                "badge_number": 12,
                "badge_id": "VYR-SOC-012",
                "card_image": "https://lh3.googleusercontent.com/d/18KsJtFmH9Z9t45vC1-I_eX6-o9WEt2I5",
                "portrait_image": "https://lh3.googleusercontent.com/d/1byM7T6DSAbtqytoKr-YTeUOWKh9HHknb",
                "sub_team": sub_teams["social-media"],
                "designation": "Social Media Lead",
                "title": "Visual Media",
                "email": "rauneet@voyagerkcc.org",
                "linkedin": "https://www.linkedin.com/in/rauneet-singh-152016287/",
                "bio": "Produces multimedia promos, community reels, and live event coverage across club handles.",
                "skills": ["Social Media Strategy", "Video Production", "Copywriting", "Engagement Analytics"],
                "display_order": 2
            },

            # Design Team (2 members)
            {
                "slug": "kartikey-sharma",
                "name": "Kartikey Sharma",
                "badge_number": 13,
                "badge_id": "VYR-DSG-013",
                "card_image": "https://lh3.googleusercontent.com/d/1dYQ9eFZkqX42T6g_4xsdPEzzqC0UAYod",
                "portrait_image": "https://lh3.googleusercontent.com/d/1uVG9-9t5A3RLA7dW2PZLkm13W4AYZpJd",
                "sub_team": sub_teams["design"],
                "designation": "Design Lead",
                "title": "UI / Visual Design",
                "email": "kartikey@voyagerkcc.org",
                "linkedin": "https://www.linkedin.com/in/kartikey-sharma-6a0532289/",
                "bio": "Crafts user interfaces, branding assets, ID card graphics, and promotional web design.",
                "skills": ["Figma", "UI/UX Design", "Brand Systems", "Visual Identity"],
                "display_order": 1
            },
            {
                "slug": "adarsh-pandey",
                "name": "Adarsh Pandey",
                "badge_number": 14,
                "badge_id": "VYR-DSG-014",
                "card_image": "https://lh3.googleusercontent.com/d/1qNlse82my4hPnxKInpPr3Dq7S0MUks2z",
                "portrait_image": "https://lh3.googleusercontent.com/d/1FOVP89wrPNxUeZ6V_psPMdRG6EgWvKnS",
                "sub_team": sub_teams["design"],
                "designation": "Design Lead",
                "title": "Graphic Design",
                "email": "adarsh@voyagerkcc.org",
                "linkedin": "https://www.linkedin.com/in/adarsh-pandey-2b2713289/",
                "bio": "Designs hackathon posters, badges, merchandise, and banners for Voyager Coding Club.",
                "skills": ["Illustrator", "Photoshop", "Print Design", "Poster Composition"],
                "display_order": 2
            }
        ]

        for m_data in members_data:
            Member.objects.update_or_create(
                slug=m_data["slug"],
                defaults=m_data
            )
        self.stdout.write(f"Seeded {len(members_data)} Core Team Members.")

        # 4. Events (Upcoming event ALWAYS first)
        events_data = [
            {
                "slug": "13th-protocol",
                "title": "13th Protocol",
                "badge": "AI Hackathon",
                "status": "Upcoming",
                "date": "28 Nov 2026",
                "time": "10:00 AM IST",
                "location": "KCCITM",
                "description": "Overnight AI hackathon powered by HackIndia and supported by OpenAI, hosted by Voyager Coding Club at KCCITM. Teams build working prototypes with 60,000 INR cash prizes, 40,000 INR rewards, and OpenAI API credits.",
                "image_url": "https://i.postimg.cc/mg6PZb7B/13th-Protocol-AI-Hackathon-Banner.png",
                "linkedin_post_url": "https://www.linkedin.com/company/voyager-coding-club",
                "highlights": ["Overnight 24-hour sprint", "60,000 INR cash prizes", "OpenAI API credits"],
                "category": "Hackathon",
                "display_order": 1
            },
            {
                "slug": "hackindia-spark-4",
                "title": "HackIndia Spark 4",
                "badge": "Hackathon",
                "status": "Completed",
                "date": "15 Nov 2026",
                "time": "10:00 AM IST",
                "location": "KCCITM",
                "description": "Regional hackathon powered by HackIndia. Teams prototyped software solutions to campus and community problems over 12 hours.",
                "image_url": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
                "linkedin_post_url": "https://www.linkedin.com/company/voyager-coding-club",
                "highlights": ["12-hour build sprint", "Hardware and web tracks", "Industry mentors"],
                "category": "Hackathon",
                "display_order": 2
            },
            {
                "slug": "build-with-bharat-4",
                "title": "Build With Bharat 4.0",
                "badge": "Hackathon",
                "status": "Completed",
                "date": "11 Oct 2026",
                "time": "11:00 AM IST",
                "location": "KCCITM",
                "description": "National hackathon hosted at KCCITM. Over 300 developers built projects across web, cloud, and open source with a 1,00,000 INR prize pool.",
                "image_url": "https://i.postimg.cc/DzKtXGr1/Build-with-Bharat-4-0-Hackathon-Poster.png",
                "linkedin_post_url": "https://www.linkedin.com/company/voyager-coding-club",
                "highlights": ["300+ participants", "1,00,000 INR prizes", "National teams"],
                "category": "Hackathon",
                "display_order": 3
            },
            {
                "slug": "codefarming",
                "title": "CodeFarming",
                "badge": "Competition",
                "status": "Completed",
                "date": "18 Oct 2026",
                "time": "02:00 PM IST",
                "location": "KCCITM",
                "description": "Competitive programming contest and peer code review session. Participants solved algorithmic challenges in C++, Python, and Java.",
                "image_url": "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
                "linkedin_post_url": "https://www.linkedin.com/company/voyager-coding-club",
                "highlights": ["Algorithm speedrun", "Live leaderboard", "Code review"],
                "category": "Competition",
                "display_order": 4
            }
        ]

        for e_data in events_data:
            Event.objects.update_or_create(
                slug=e_data["slug"],
                defaults=e_data
            )
        self.stdout.write(f"Seeded {len(events_data)} Club Events.")
        self.stdout.write(self.style.SUCCESS("Database seeding completed successfully!"))
