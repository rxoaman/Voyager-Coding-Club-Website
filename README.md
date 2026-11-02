# Voyager Coding Club Web Portal — Django Edition (`voyager-porta-django`)

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

---

## ⚡ How to Run the Django Portal

From the `voyager-porta-django/` directory:

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
voyager-porta-django/
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
│   ├── maintainer.md
│   └── MAINTAINER_GUIDE.md
│
└── frontend/                           <-- React Frontend
    ├── dist/                           <-- Pre-built bundle served by Django
    ├── public/assets/                  <-- Official Logo, ID cards, Member cutouts
    └── src/                            <-- Source code (Vite + React)
```

---

## 🎨 Developing the Frontend (Optional)

If you wish to edit the React frontend UI directly while using Django as your backend:

```bash
# Terminal 1: Run Django Backend
cd voyager-porta-django
python manage.py runserver 8000

# Terminal 2: Run Vite Dev Server (uses proxy to Django)
cd voyager-porta-django/frontend
npm run dev
```

When finished editing, rebuild the bundle:
```bash
npm run build
```
Django will immediately serve your updated React build at `http://127.0.0.1:8000/`!
