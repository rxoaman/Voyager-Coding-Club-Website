# Voyager Coding Club Web Portal — Master Maintainer Manual

Welcome to the **Voyager Coding Club Web Portal** master maintainer manual. This document is the definitive guide for club leads, maintainers, and developers. It details **every single element** present on the website, where its source code and data reside, and how to **edit, add, or delete** anything with zero ambiguity.

---

## 📑 Table of Contents
1. [Architecture & Central Data Source](#1-architecture--central-data-source)
2. [Navbar & Top Brand Bar](#2-navbar--top-brand-bar)
3. [Hero Section (Emblem, Headings, Metrics & Flight)](#3-hero-section-emblem-headings-metrics--flight)
4. [Club Events Section (Banners, Dates, Filters & Cards)](#4-club-events-section-banners-dates-filters--cards)
   - [How to ADD a New Event](#how-to-add-a-new-event)
   - [How to EDIT an Existing Event](#how-to-edit-an-existing-event)
   - [How to DELETE an Event](#how-to-delete-an-event)
   - [The "Upcoming Always First" Rule](#the-upcoming-always-first-rule)
5. [Team Members Section (Single Container Horizontal Scroll)](#5-team-members-section-single-container-horizontal-scroll)
   - [How to ADD a New Team Member](#how-to-add-a-new-team-member)
   - [How to EDIT an Existing Team Member](#how-to-edit-an-existing-team-member)
   - [How to DELETE a Team Member](#how-to-delete-a-team-member)
   - [How to MOVE a Member Between Sub-Teams](#how-to-move-a-member-between-sub-teams)
   - [How to Add/Replace Member Photos & ID Card Renders](#how-to-addreplace-member-photos--id-card-renders)
6. [Member Detail Page / Dossier View](#6-member-detail-page--dossier-view)
7. [About / Five Pillars Section](#7-about--five-pillars-section)
8. [Footer](#8-footer)
9. [ID Card Dimensions & Scroll Tuning](#9-id-card-dimensions--scroll-tuning)
10. [Liquid Glass & Glassmorphism Design System](#10-liquid-glass--glassmorphism-design-system)
11. [Running Locally & Opening to Wi-Fi / LAN](#11-running-locally--opening-to-wi-fi--lan)
12. [Asset Directory Quick Reference](#12-asset-directory-quick-reference)

---

## 1. Architecture & Central Data Source

The Voyager Coding Club Web Portal is a complete, unified full-stack platform:
* **Backend:** Django 6+ Python framework with custom REST endpoints, zero-dependency CORS, and `django-browser-reload`.
* **Frontend:** High-performance React 18 Single Page Application with Tailwind CSS, Lucide icons, and Liquid Glassmorphism styling.
* **Pre-compiled Distribution:** Production-grade JS/CSS bundles in `frontend/dist/`.

### ⚠️ Important: Editing React JSX Components vs. Editing Club Data (`clubData.js`)

| What You Are Changing | Where to Edit | Do You Need to Rebuild? |
| :--- | :--- | :--- |
| **Club Data** (Events, dates, links, team members, bios, skills) | [`frontend/src/data/clubData.js`](../frontend/src/data/clubData.js) | **NO BUILD NEEDED!** Django parses `clubData.js` dynamically on the fly. Save the file and the browser reloads in ~50ms. |
| **UI Components & Layout** (`IdCard.jsx`, `Navbar.jsx`, `Home.jsx`, CSS) | `frontend/src/components/*.jsx` | **YES, RUN BUILD:** Browsers cannot run raw JSX. Run: <br>`python manage.py buildfrontend` <br>*(Takes ~3 seconds and compiles Vite into `frontend/dist/`)* |

### The Single Source of Truth for Data
All club information, events, sub-teams, and members live inside:
* **File:** [`frontend/src/data/clubData.js`](../frontend/src/data/clubData.js)

> [!TIP]
> Django's `data_loader.py` dynamically monitors `clubData.js`. Whenever you save an edit to `clubData.js`, the Django REST API (`/api/events/`, `/api/team/`, `/api/club/`) immediately serves the new data, and `django-browser-reload` automatically refreshes all connected browsers in ~50ms. No database migrations needed!

---

## 2. Navbar & Top Brand Bar

* **Component File:** [`frontend/src/components/Navbar.jsx`](../frontend/src/components/Navbar.jsx)

### Elements Present & How to Edit:

| Element | Location in `Navbar.jsx` | How to Edit / Delete |
| :--- | :--- | :--- |
| **Club Logo Cube** | Lines ~63–67 (`<img src="/assets/Logo_Cube.png" />`) | Replace the image file at `frontend/public/assets/Logo_Cube.png` or change the `src` attribute. |
| **Logo Text ("VOYAGER")** | Line ~71 (`VOYAGER`) | Change text string directly in `Navbar.jsx`. |
| **Sub-brand Text ("CODING CLUB")** | Line ~74 (`CODING CLUB`) | Change or remove the `<span>` element. |
| **Navigation Links (Home, Events, Team)** | Lines ~20–24 (`navLinks` array) | **Edit/Add/Delete** links in the array: <br> `{ name: 'New Link', path: '/#section', hash: 'section' }` |
| **Top-Right LinkedIn CTA Button** | Lines ~102–112 | Edit URL in `href="https://www.linkedin.com/company/voyager-coding-club"`. To delete, remove lines 101–113. |
| **Mobile Drawer Menu** | Lines ~126–160 | Automatically updates when you edit `navLinks`. |

---

## 3. Hero Section (Emblem, Headings, Metrics & Flight)

* **Component File:** [`frontend/src/components/HeroScroll.jsx`](../frontend/src/components/HeroScroll.jsx)
* **Animation File:** [`frontend/src/animations/heroFlight.js`](../frontend/src/animations/heroFlight.js)

### Elements Present & How to Edit:

#### 1. "KCCITM // VOYAGER" Pill (Below Emblem)
* **File:** `frontend/src/components/HeroScroll.jsx` (Lines ~44–47)
```jsx
<div className="mt-3 flex items-center gap-2 font-mono text-xs text-zinc-400 bg-zinc-950/80 px-3.5 py-1 rounded-full border border-white/10">
  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
  <span>KCCITM // VOYAGER</span>  {/* <-- EDIT OR CHANGE THIS TEXT */}
</div>
```
* **To delete:** Delete this entire `<div>` block.

#### 2. Eyebrow Tag ("STUDENT DEVELOPER COMMUNITY")
* **File:** `frontend/src/components/HeroScroll.jsx` (Lines ~56–60)
* Change text inside `<span className="font-mono text-xs text-emerald-400 uppercase tracking-widest">...</span>`.

#### 3. Main Title & Tagline
* **File:** `frontend/src/components/HeroScroll.jsx` (Lines ~63–72)

#### 4. Mission Description Paragraph
* **File:** `frontend/src/components/HeroScroll.jsx` (Lines ~75–77)
* Plain text describing the club, hackathons, and software projects. Edit directly.

#### 5. Hero Action Buttons ("EXPLORE EVENTS", "TEAM DIRECTORY")
* **File:** `frontend/src/components/HeroScroll.jsx` (Lines ~80–96)
* Links point to `#events` and `#team`. Edit the text, icon, or `href` target.

#### 6. Stat Counters / Metrics (Events, Badges, Participants)
* **File:** `frontend/src/components/HeroScroll.jsx` (Lines ~99–112)
* **To edit values:** Change `4`, `14`, or `300+` directly.
* **To add another metric:** Add a 4th `<div>` column and change `grid-cols-3` to `grid-cols-4`.
* **To delete a metric:** Remove one `<div>` block and adjust `grid-cols-3` to `grid-cols-2`.

#### 7. Scroll Indicator Prompt ("Scroll to explore")
* **File:** `frontend/src/components/HeroScroll.jsx` (Lines ~118–121)
* Bouncing arrow at the bottom. To delete, remove the `<div>`.

---

## 4. Club Events Section (Banners, Dates, Filters & Cards)

* **Container Component:** [`frontend/src/components/EventsGrid.jsx`](../frontend/src/components/EventsGrid.jsx)
* **Card Component:** [`frontend/src/components/EventCard.jsx`](../frontend/src/components/EventCard.jsx)
* **Data File:** [`frontend/src/data/clubData.js`](../frontend/src/data/clubData.js)

### Header Elements in `EventsGrid.jsx`:
1. **Prominent Date Tag:** Line ~64–66 (`28 Nov 2026 • 13th Protocol`). Edit text or date directly in `EventsGrid.jsx`.
2. **Section Title:** Line ~70 (`Club Events`).
3. **Filter Buttons (ALL, LIVE, COMPLETED):** Lines ~76–111. Automatically count and filter events based on `event.status`.

### Anatomy of an Event in `clubData.js`:
Each event is an object in `export const EVENTS = [...]`:
```javascript
{
  id: "13th-protocol",                          // Unique URL-safe identifier
  title: "13th Protocol",                      // Event Name
  badge: "AI Hackathon",                       // Pill tag on top-left of banner
  status: "Upcoming",                          // "Upcoming" (gets "Register Now" CTA) or "Completed" (gets "LinkedIn Post")
  date: "28 Nov 2026",                         // Date string
  time: "10:00 AM IST",                        // Time string
  location: "KCCITM",                          // ALWAYS strictly "KCCITM"
  description: "Overnight AI hackathon...",    // Short summary paragraph
  imageUrl: "https://i.postimg.cc/...",        // Banner image URL or local asset path
  registrationUrl: "https://forms.gle/...",    // Registration link (Google Form, Unstop, Devfolio, etc.)
  actionText: "Register Now",                  // Custom button text (defaults to "Register Now" for upcoming)
  linkedinPostUrl: "https://...",              // Official LinkedIn announcement/recap URL
  highlights: ["Overnight 24-hour sprint", "60,000 INR cash prizes"], // Feature pills
  category: "Hackathon"                        // "Hackathon", "Workshop", etc.
}
```

---

### How to ADD a New Event
1. Open [`frontend/src/data/clubData.js`](../frontend/src/data/clubData.js).
2. Inside `export const EVENTS = [ ... ]`, insert a new event object (see template above).
3. Save the file. The new event will immediately appear on the site!

---

### How to EDIT an Existing Event
1. Open [`frontend/src/data/clubData.js`](../frontend/src/data/clubData.js).
2. Locate the event by its `id` (e.g., `id: "13th-protocol"`).
3. Modify any field — `title`, `date`, `time`, `imageUrl`, `description`, `highlights`.
4. Change `status: "Completed"` once the event is finished (removes the green `UPCOMING` badge automatically).
5. Save the file.

---

### How to DELETE an Event
1. Open [`frontend/src/data/clubData.js`](../frontend/src/data/clubData.js).
2. Highlight and delete the entire `{ ... },` block of the event you wish to remove from `EVENTS`.
3. Save the file. The event disappears from the UI and API instantly.

---

### The "Upcoming Always First" Rule
* Both `frontend/src/components/EventsGrid.jsx` and `club_api/data_loader.py` enforce that **any event with `status: "Upcoming"` is placed first** before completed events.
* If you have multiple upcoming events, they appear in order at the beginning of the list.

---

## 5. Team Members Section (Single Container Horizontal Scroll)

* **Container Component:** [`frontend/src/components/TeamGrid.jsx`](../frontend/src/components/TeamGrid.jsx)
* **ID Card Component:** [`frontend/src/components/IdCard.jsx`](../frontend/src/components/IdCard.jsx)
* **Data File:** [`frontend/src/data/clubData.js`](../frontend/src/data/clubData.js)

### How the Scroll Works:
The team section uses **ONE unified glass container** for all teams:
- **Desktop (≥768px):** The section is `position: sticky` at the top of the viewport. As you **scroll down vertically**, only the active team's member cards are present in the container at a time (no clutter, no divider cards). As you scroll through a team's cards, continuing to scroll advances smoothly to the next team (Technical → Management → Social Media → Design Team). In the top bar, each team's button pops active automatically—guaranteed to pop on Design Team during the final stage before releasing the page scroll.
- **Mobile (<768px):** The container flows naturally in the page. Swipe **horizontally** on the card track to view members; swiping at the end advances to the next team in the same container. Team tabs and Prev/Next buttons also provide instant 1-tap switching.

### Header Elements:
1. **Eyebrow Tag:** `CLUB LEADERSHIP DIRECTORY` (top-left of container)
2. **Desktop Hint:** `SCROLL DOWN TO ADVANCE THROUGH ALL TEAMS ➔` (top-right, desktop only)
3. **Team Filter Tabs:** Four tab buttons — Technical, Management, Social Media, Design. Clicking them smooth-scrolls the page to position that team's first card into view.
4. **Team Navigator:** `1/4` counter + `‹ ›` arrows for keyboard-friendly team switching.
5. **Active Team Description Row:** Shows current team name, department number, and mission description.
6. **Search Bar:** Live search across all teams by name, designation, title, or skills.
7. **Progress Bar:** `XX% SEEN` bar at the bottom tracks how far through all teams you've scrolled.
8. **Prev Team / Next Team buttons:** Quick jump buttons at the bottom of the container.

### Sub-Teams (strictly ordered):
- **Technical Team (5 members)**
- **Management Team (5 members)**
- **Social Media Team (2 members)**
- **Design Team (2 members)**

---

### Anatomy of a Member Object in `clubData.js`:
Each member is an object in `export const TEAM_MEMBERS = [...]`:
```javascript
{
  id: "purushottam-kumar",                           // URL slug (used in /team/<id>)
  name: "Purushottam Kumar",                         // Full member name
  badgeNumber: 1,                                    // Numeric ID (#1)
  badgeId: "VYR-TECH-001",                           // Printed badge string
  cardImage: "/assets/team/id-card/purushottam-kumar.webp",  // Holographic ID card background (WebP)
  photoUrl: "/assets/team/bg-removed/purushottam-kumar.webp", // Cutout portrait (transparent BG, WebP)
  subTeam: "Technical Team",                         // Display name of sub-team
  subTeamId: "technical",                            // Slug: "technical", "management", "social-media", "design"
  designation: "Technical Lead",                     // Role title (printed on card)
  title: "Web Architect",                            // Secondary specialization title
  email: "purushottam.kccitm@gmail.com",             // Contact email
  linkedin: "https://www.linkedin.com/in/...",       // LinkedIn profile URL
  bio: "Full-stack developer building Voyager portal...", // Bio paragraph for dossier page
  skills: ["React", "Django", "Tailwind CSS"]        // Array of skill tags
}
```

---

### How to ADD a New Team Member
1. Optimize the member's transparent cutout portrait to WebP and place it in:
   `frontend/public/assets/team/bg-removed/<slug>.webp`
2. Optimize the ID card artwork to WebP and place it in:
   `frontend/public/assets/team/id-card/<slug>.webp`
3. Open [`frontend/src/data/clubData.js`](../frontend/src/data/clubData.js).
4. Add the new member object to `export const TEAM_MEMBERS = [ ... ]`:
```javascript
  {
    id: "alex-sharma",
    name: "Alex Sharma",
    badgeNumber: 15,
    badgeId: "VYR-TECH-015",
    cardImage: "/assets/team/id-card/alex-sharma.webp",
    photoUrl: "/assets/team/bg-removed/alex-sharma.webp",
    subTeam: "Technical Team",
    subTeamId: "technical",
    designation: "Frontend Specialist",
    title: "UI Engineer",
    email: "alex.sharma@example.com",
    linkedin: "https://www.linkedin.com/in/alexsharma",
    bio: "Passionate about creating fluid interfaces and responsive micro-interactions.",
    skills: ["React", "TypeScript", "Tailwind CSS"]
  },
```
5. Save the file. The new card will render immediately in the Technical Team section.

---

### How to EDIT an Existing Team Member
1. Open [`frontend/src/data/clubData.js`](../frontend/src/data/clubData.js).
2. Search for the member's name or `id`.
3. Edit any field — `linkedin`, `email`, `designation`, `bio`, or `skills`.
4. Save the file.

---

### How to DELETE a Team Member
1. Open [`frontend/src/data/clubData.js`](../frontend/src/data/clubData.js).
2. Delete the member's `{ ... },` block from `TEAM_MEMBERS`.
3. Save the file. The card, its badge count, and its `/team/<id>` route are removed immediately.

---

### How to MOVE a Member Between Sub-Teams
Change both `subTeam` and `subTeamId` on the member object:
* **To Technical Team:** `subTeam: "Technical Team"`, `subTeamId: "technical"`
* **To Management Team:** `subTeam: "Management Team"`, `subTeamId: "management"`
* **To Social Media Team:** `subTeam: "Social Media Team"`, `subTeamId: "social-media"`
* **To Design Team:** `subTeam: "Design Team"`, `subTeamId: "design"`

---

### How to Add/Replace Member Photos & ID Card Renders

> [!IMPORTANT]
> All member images are now stored locally as **WebP** files. Do NOT use PNG or external Google Drive links — WebP reduces file size by ~70% while maintaining image quality.

* **Cutout Portrait Photos (background removed):**
  - Directory: `frontend/public/assets/team/bg-removed/`
  - Filename: `<member-id>.webp` (e.g., `purushottam-kumar.webp`)
  - Format: WebP with transparent background.
  - Linked via `photoUrl: "/assets/team/bg-removed/<slug>.webp"` in `clubData.js`.

* **ID Card Artwork Renders:**
  - Directory: `frontend/public/assets/team/id-card/`
  - Filename: `<member-id>.webp` (e.g., `purushottam-kumar.webp`)
  - Linked via `cardImage: "/assets/team/id-card/<slug>.webp"` in `clubData.js`.

> [!NOTE]
> The old `frontend/public/assets/id-cards/` (numbered PNG files) and `frontend/public/assets/members/` (name-based PNG portraits) directories have been deleted. All images now reside under `frontend/public/assets/team/`.

---

## 6. Member Detail Page / Dossier View

* **Route:** `/team/:id` (e.g., `/team/purushottam-kumar`)
* **Page File:** [`frontend/src/pages/MemberDetailPage.jsx`](../frontend/src/pages/MemberDetailPage.jsx)
* **View Component:** [`frontend/src/components/MemberDetail.jsx`](../frontend/src/components/MemberDetail.jsx)

### Elements Present & How to Edit:
* **"Back to team directory" button:** Line ~70. Returns to `/#team`.
* **Isolated Cutout Figure & Glass Pedestal:** Lines ~81–118. Displays the background-removed photo above a frosted liquid-glass pedestal (`.glass-pedestal`).
* **Badge Telemetry Tag:** Line ~90 (`VYR-TECH-001 • ACTIVE MEMBER`).
* **Member Name & Designation:** Lines ~133–142.
* **Biography Paragraph:** Lines ~145–150. Sourced directly from `member.bio` in `clubData.js`.
* **Specialized Skills Tags:** Lines ~154–168. Renders pill badges for every item in `member.skills`.
* **Direct Action Buttons:** Lines ~172–215:
  - **Email Button:** Opens `mailto:${member.email}`.
  - **LinkedIn Profile Button:** Opens `member.linkedin` in a new tab.

---

## 7. About / Five Pillars Section

* **Component File:** [`frontend/src/components/AboutSection.jsx`](../frontend/src/components/AboutSection.jsx)

### Elements Present & How to Edit:
1. **Section Pill:** Lines ~53–58 (`MISSION & FIVE PILLARS`).
2. **Main Heading:** Lines ~60–62.
3. **Mission Paragraph:** Lines ~64–66.
4. **The 5 Core Domain Cards:** Lines ~11–45 (`domains` array).
   - Card 1: **Software Engineering & Web Architecture**
   - Card 2: **Systems, Cloud & DevOps Infrastructure**
   - Card 3: **Applied AI, Machine Learning & Data Systems**
   - Card 4: **Open Source Development & Tooling**
   - Card 5: **Cybersecurity & Network Protocols**
   - *How to edit a domain:* Change `title`, `desc`, or `icon` in the `domains` array.
   - *How to add a 6th domain:* Add another object to the `domains` array.
   - *How to delete a domain:* Remove one object from the array.

---

## 8. Footer

* **Component File:** [`frontend/src/components/Footer.jsx`](../frontend/src/components/Footer.jsx)

### Elements Present & How to Edit:
1. **Brand Logo & Name:** Lines ~10–20:
   - Logo: `/assets/Logo_Cube.png`
   - Name: `VOYAGER CODING CLUB`
   - Institution: `KCC Institute of Technology & Management`
2. **Social Media Icons & URLs:** Lines ~25–54:
   - **LinkedIn:** `https://www.linkedin.com/company/voyager-coding-club`
   - **Instagram:** `https://www.instagram.com/voyager.kccitm/`
   - **GitHub:** `https://github.com/rxoaman/Voyager-s-Website`
   - *To change a link:* Edit the `href` attribute on the corresponding `<a>` tag.
   - *To delete a social icon:* Remove its `<a>...</a>` block.
3. **Copyright Notice:** Line ~60: `© {new Date().getFullYear()} Voyager Coding Club, KCCITM.` (auto-updates year)

---

## 9. ID Card Dimensions & Scroll Tuning

### ID Card Sizing (in [`frontend/src/components/IdCard.jsx`](../frontend/src/components/IdCard.jsx)):
```jsx
// Outer Badge Container:
<div className="badge-container group cursor-pointer w-[285px] sm:w-[305px] shrink-0 select-none">

// Physical Card Body:
<div className="id-card-badge liquid-glass-card p-4 sm:p-4.5 flex flex-col justify-between h-[435px] sm:h-[455px] relative">

// Portrait Frame:
<div className="relative w-full h-[220px] sm:h-[235px] rounded-xl overflow-hidden border border-white/10 bg-black/60 shadow-inner">
```
* **To make cards wider:** Change `w-[285px] sm:w-[305px]` to `w-[315px] sm:w-[335px]`.
* **To make cards taller:** Change `h-[435px] sm:h-[455px]` to `h-[460px] sm:h-[480px]`.
* **To enlarge the photo frame:** Change `h-[220px] sm:h-[235px]` to `h-[240px] sm:h-[255px]`.

---

### Anime.js Scroll Parameters (in [`frontend/src/components/TeamGrid.jsx`](../frontend/src/components/TeamGrid.jsx)):
```javascript
const TOTAL_RUNWAY = 2200; // px of vertical runway across all 4 teams on desktop
const SEG_BOUNDS = [0.0, 0.26, 0.52, 0.72]; // Team transition boundaries in scroll progress

// Anime.js onScroll sync damping:
sync: 0.18   // Lower = slower/smoother lerp; Higher = more 1:1 scroll tracking
```
* **If scroll feels too fast/jittery:** Decrease `sync` to `0.10`.
* **If the team section runway feels too long:** Decrease `TOTAL_RUNWAY` from `2200` to `1800`.
* **If you want more time per team:** Increase `TOTAL_RUNWAY` to `2600`.

---

## 10. Liquid Glass & Glassmorphism Design System

All glassmorphism effects are defined in [`frontend/src/index.css`](../frontend/src/index.css):

| CSS Class | Visual Effect | Used On |
| :--- | :--- | :--- |
| `.liquid-glass` | Frosted dark glass with subtle border & backdrop-blur | Fixed Navbar, Team Container Card |
| `.liquid-glass-card` | Multi-layer specular reflections with hover elevation | ID Cards, Event Cards |
| `.liquid-glass-button`| Translucent button with soft inner glow | Filter buttons, Back buttons |
| `.glass-pedestal` | Deep frosted plinth with specular radial highlight | Member Detail Photo Pedestal |

### Core Color Palette:
* **Primary Accent Green:** `#00FF88` / Tailwind `emerald-400` / `emerald-500`
* **Deep Space Background:** `#070A0F`
* **Card Backing:** `bg-black/60` / `bg-zinc-950/80`
* **Borders:** `border-white/10` / `border-emerald-500/30`
* **Typography:** Space Grotesk (Headings), JetBrains Mono (Badges & Code), Inter (Body)

> [!NOTE]
> Page-level vertical scroll-snap is configured using `scroll-snap-type: y proximity` on `html`. The primary containers (`#hero`, `#events`, `#team`, and `#footer`) have `snap-start`, enabling smooth, natural docking when navigating between sections. Individual team member cards do NOT have snap applied (`snap-start` removed), allowing member cards to scroll freely and smoothly without jitter or snap-back. The footer retains `snap-start scroll-mt-8` with full margin clearance (`mt-12 sm:mt-16`), ensuring it is 100% accessible at all times without trapping the scroll.

---

## 11. Running Locally & Opening to Wi-Fi / LAN

### Django Edition (`voyager-portal-django`)
Run Django with:
```bash
python manage.py runserver 0.0.0.0
# OR
python manage.py runserver
```
Django automatically normalizes `0.0.0.0` to `0.0.0.0:8000` and displays:
```
  > On this computer:   http://127.0.0.1:8000/
  > On your Wi-Fi/LAN:  http://192.168.x.x:8000/
```
* **Opening on Phone/Tablet:** Connect to the same Wi-Fi and open `http://<your-lan-ip>:8000/`.
* **Auto-Reload:** Enabled automatically via `django-browser-reload`. Any edit to `clubData.js` immediately refreshes all connected devices!

### Compiling React Frontend (`buildfrontend`)
Whenever you edit React JSX components (`frontend/src/components/*.jsx`) or Tailwind styles (`frontend/src/index.css`), compile the bundles with:
```bash
python manage.py buildfrontend
```
This runs Vite inside `frontend/` and updates `frontend/dist/` in ~3 seconds. Refresh your browser to see changes!

---

### Deploying to Vercel

The repository is configured for seamless deployment on [Vercel](https://vercel.com/):

#### How Vercel Deployment Works:
1. **`vercel.json`:** Defines dual build targets:
   - `@vercel/python` compiles `portal_backend/wsgi.py` (and `api/index.py`) into serverless functions handling `/api/*` and `/admin/*`.
   - `@vercel/static-build` builds `frontend/package.json` into static assets on Vercel's Edge CDN.
2. **SPA Routing:** Non-API requests (`/`, `/team/*`) route to `index.html` via Vercel Edge rewrites.
3. **Environment Detection:** When `VERCEL` is detected:
   - Live auto-reload is turned off automatically.
   - SQLite database is initialized in `/tmp/db.sqlite3`.
   - All events and members are served dynamically from `frontend/src/data/clubData.js`.

#### Steps to Deploy:
1. Push your changes to the `main` branch:
   ```bash
   git push origin main
   ```
2. Log in to [Vercel Dashboard](https://vercel.com/).
3. Click **Add New...** -> **Project** and select `Voyager-Coding-Club-Website`.
4. (Optional) Set Environment Variables:
   - `DJANGO_DEBUG`: `False`
   - `SECRET_KEY`: Enter a random secret key for production
5. Click **Deploy**.

---

## 12. Asset Directory Quick Reference

```
frontend/public/assets/
├── Logo_Cube.png                           # Primary 3D Voyager Binary Emblem
└── team/
    ├── id-card/                            # Holographic ID card renders (WebP)
    │   ├── purushottam-kumar.webp
    │   ├── nilesh-singh.webp
    │   ├── adarsh-pandey.webp
    │   ├── akash.webp
    │   ├── ayush-jha.webp
    │   ├── bhavya-singh.webp
    │   ├── chaitanya-mathur.webp
    │   ├── devender-parmar.webp
    │   ├── harsh.webp
    │   ├── kartikey-sharma.webp
    │   ├── karuna-pradhan.webp
    │   ├── pratyush-kumar-singh.webp
    │   ├── rauneet-singh.webp
    │   └── raza-masud.webp
    └── bg-removed/                         # Cutout portraits with transparent BG (WebP)
        ├── purushottam-kumar.webp
        ├── nilesh-singh.webp
        └── ... (all 14 members)
```

> [!IMPORTANT]
> **Member image paths in `clubData.js`:**
> - ID Card background: `cardImage: "/assets/team/id-card/<slug>.webp"`
> - Cutout portrait: `photoUrl: "/assets/team/bg-removed/<slug>.webp"`
>
> The old `assets/id-cards/<number>.png` and `assets/members/<slug>.png` paths are **no longer valid** (those directories have been deleted).
