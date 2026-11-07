# Voyager Coding Club Web Portal — Django Edition (`voyager-portal-django`)

A complete, production-ready implementation of the **Voyager Coding Club Web Portal** powered entirely by **Python & Django** as the backend, with zero Node runtime required to serve the application and APIs.

---

## 🚀 Key Highlights of the Django Edition

1. **Zero Node Runtime Required for Serving:**
   - The entire website—including the interactive liquid-glass frontend, SVG generators, assets, cutouts, and REST API—runs directly from Django using Python (`python manage.py runserver`).
2. **Native Django Models & SQLite Database:**
   - `ClubProfile`: Club branding, socials, and institution metadata.
   - `SubTeam`: Technical, Management, Social Media, Design.
   - `Member`: 14 Core leadership members with roles, badge IDs, cutouts, and social links.
   - `Event`: Flagship events with Upcoming status priority, strict KCCITM venue formatting.
3. **Official Django Admin Interface:**
   - Manage club members, add new events, update roles directly via the web admin panel at `/admin/`.
4. **Built-in Zero-Dependency CORS Middleware:**
   - Allows seamless consumption from any frontend dev server or external client.
5. **Pre-Seeded Database:**
   - Included management command `python manage.py seed_portal_data` seeds all 14 core members and 4 events into SQLite instantly.
6. **Local WebP Team Assets:**
   - All 14 member photos (background-removed cutouts + holographic ID card renders) are stored locally as optimized WebP images in `frontend/public/assets/team/`. No external CDN or Google Drive dependencies.

---

## ⚡ How to Run the Django Portal

From the `voyager-portal-django/` directory:

```bash
# 1. Install dependencies (Django only)
pip install -r requirements.txt

# 2. Run migrations
python manage.py migrate

# 3. Seed initial database records (14 core members & 4 events)
python manage.py seed_portal_data

# 4. (Optional) Create a superuser for Django Admin
python manage.py createsuperuser

# 5. Start the Django Server
python manage.py runserver 8000
```

* **Live Web Portal (Frontend UI):** `http://127.0.0.1:8000/`
* **Events API:** `http://127.0.0.1:8000/api/events/`
* **Team Directory API:** `http://127.0.0.1:8000/api/team/`
* **Member Detail API:** `http://127.0.0.1:8000/api/team/purushottam-kumar/`
* **Club Info API:** `http://127.0.0.1:8000/api/club/`
* **Health Check:** `http://127.0.0.1:8000/api/health/`
* **Django Admin:** `http://127.0.0.1:8000/admin/`

---

## 📁 Directory Structure

```
voyager-portal-django/
├── manage.py                           <-- Django CLI
├── requirements.txt                    <-- Python dependencies
├── db.sqlite3                          <-- Pre-seeded SQLite database
├── README.md                           <-- This documentation
│
├── portal_backend/                     <-- Core Django Project
│   ├── settings.py                     <-- App configuration, static dirs & media
│   ├── urls.py                         <-- Routes & SPA fallback
│   ├── wsgi.py
│   └── asgi.py
│
├── club_api/                           <-- Voyager Club Django App
│   ├── models.py                       <-- ClubProfile, SubTeam, Member, Event
│   ├── views.py                        <-- REST API JSON endpoints
│   ├── urls.py                         <-- /api/ URLs
│   ├── admin.py                        <-- Django Admin models registration
│   ├── middleware.py                   <-- Native CORS middleware
│   └── management/
│       └── commands/
│           └── seed_portal_data.py     <-- Pre-populates all 14 core members & events
│
├── docs/                               <-- Maintainer documentation
│   └── maintainer.md                   <-- Master guide: how to edit every element
│
└── frontend/                           <-- React Frontend (Vite + React 18)
    ├── dist/                           <-- Pre-built bundle served by Django
    ├── public/
    │   └── assets/
    │       ├── Logo_Cube.png           <-- Primary 3D Voyager emblem
    │       └── team/
    │           ├── id-card/            <-- Holographic ID card renders (WebP, 14 members)
    │           └── bg-removed/         <-- Transparent cutout portraits (WebP, 14 members)
    └── src/                            <-- Source code
        ├── components/
        │   ├── TeamGrid.jsx            <-- Single-container horizontal scroll team section
        │   ├── EventsGrid.jsx          <-- Events section
        │   ├── IdCard.jsx              <-- Member ID card component
        │   ├── Navbar.jsx
        │   ├── HeroScroll.jsx
        │   ├── AboutSection.jsx
        │   └── Footer.jsx
        ├── data/
        │   └── clubData.js             <-- ⭐ Single source of truth for all club data
        └── pages/
            ├── Home.jsx
            └── MemberDetailPage.jsx
```

---

## 🎨 Team Members Section — Single Container Horizontal Scroll

The team section uses a **single unified glass container** for all 4 sub-teams (14 total members):

- **Desktop:** As you scroll **down** the page, only the active team's member cards are present in the container at a time (no divider cards). Member cards translate **horizontally** inside the container powered by Anime.js v4 `onScroll`. When a team ends, continuing to scroll advances smoothly to the next team (Technical → Management → Social Media → Design), dynamically popping each team's button in the top bar.
- **Mobile:** Swipe **horizontally** directly on the card track; reaching the end advances to the next team in the same container. Team tabs and Prev/Next buttons also provide instant 1-tap switching.
- **Team tabs** at the top of the container let you jump directly to any team's cards.
- **Progress bar** at the bottom shows `XX% SEEN` as you advance through all teams.

> **Note:** Page-level scroll snapping uses `scroll-snap-type: y proximity` on `html` on desktop screens (`@media (min-width: 768px)`) with `snap-start` on the Event, Team, and Footer containers. On mobile devices, page-level scroll snap and touch locks are removed to allow phone users to scroll through freely and smoothly whenever they want, while desktop users retain the pinned horizontal runway experience.

---

## 🎨 Developing the Frontend (Optional)

If you wish to edit the React frontend UI directly while using Django as your backend:

```bash
# Terminal 1: Run Django Backend
cd voyager-portal-django
python manage.py runserver 8000

# Terminal 2: Run Vite Dev Server (uses proxy to Django)
cd voyager-portal-django/frontend
npm run dev
```

When finished editing, rebuild the bundle:
```bash
npm run build
```
Django will immediately serve your updated React build at `http://127.0.0.1:8000/`!

---

## 📸 Asset Management

All team member images are stored locally as optimized **WebP** files:

| Path | Contents |
|------|----------|
| `frontend/public/assets/team/id-card/` | Holographic ID card renders (one per member, `<slug>.webp`) |
| `frontend/public/assets/team/bg-removed/` | Transparent cutout portraits (one per member, `<slug>.webp`) |
| `frontend/public/assets/Logo_Cube.png` | 3D Voyager emblem used in Navbar & Footer |

**Image paths in `clubData.js`:**
```javascript
cardImage: "/assets/team/id-card/<member-slug>.webp"   // ID card background
photoUrl:  "/assets/team/bg-removed/<member-slug>.webp" // Portrait cutout
```

> For detailed instructions on editing any part of the site, see [`docs/maintainer.md`](docs/maintainer.md).
