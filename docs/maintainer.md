# Voyager Coding Club Web Portal — Master Maintainer Manual (`maintainer.md`)

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
5. [Team Members Section (Tabs, ID Badges & Sizing)](#5-team-members-section-tabs-id-badges--sizing)
   - [How to ADD a New Team Member](#how-to-add-a-new-team-member)
   - [How to EDIT an Existing Team Member](#how-to-edit-an-existing-team-member)
   - [How to DELETE a Team Member](#how-to-delete-a-team-member)
   - [How to MOVE a Member Between Sub-Teams](#how-to-move-a-member-between-sub-teams)
   - [How to Add/Replace Member Photos & ID Card Renders](#how-to-addreplace-member-photos--id-card-renders)
6. [Member Detail Page / Dossier View](#6-member-detail-page--dossier-view)
7. [About / Five Pillars Section](#7-about--five-pillars-section)
8. [Footer](#8-footer)
9. [ID Card Dimensions, Scroll Snap & Threshold Tuning](#9-id-card-dimensions-scroll-snap--threshold-tuning)
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
| **Club Data** (Events, dates, links, team members, bios, skills) | [`frontend/src/data/clubData.js`](file:///frontend/src/data/clubData.js) | **NO BUILD NEEDED!** Django parses `clubData.js` dynamically on the fly. Save the file and the browser reloads in ~50ms. |
| **UI Components & Layout** (`IdCard.jsx`, `Navbar.jsx`, `Home.jsx`, CSS) | `frontend/src/components/*.jsx` | **YES, RUN BUILD:** Browsers cannot run raw JSX. Run: <br>`python manage.py buildfrontend` <br>*(Takes ~3 seconds and compiles Vite into `frontend/dist/`)* |

### The Single Source of Truth for Data
All club information, events, sub-teams, and members live inside:
* **File:** [`frontend/src/data/clubData.js`](file:///frontend/src/data/clubData.js)

> [!TIP]
> Django's `data_loader.py` dynamically monitors `clubData.js`. Whenever you save an edit to `clubData.js`, the Django REST API (`/api/events/`, `/api/team/`, `/api/club/`) immediately serves the new data, and `django-browser-reload` automatically refreshes all connected browsers in ~50ms. No database migrations needed!

---

## 2. Navbar & Top Brand Bar

* **Component File:** [`frontend/src/components/Navbar.jsx`](file:///frontend/src/components/Navbar.jsx)

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

* **Component File:** [`frontend/src/components/HeroScroll.jsx`](file:///frontend/src/components/HeroScroll.jsx)
* **Animation File:** [`frontend/src/animations/heroFlight.js`](file:///frontend/src/animations/heroFlight.js)

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
```jsx
<h1 className="font-display font-extrabold text-4xl sm:text-6xl text-white tracking-tight leading-none">
  Voyager <br />
  <span className="text-emerald-400">Coding Club</span>
</h1>
<p className="font-mono text-sm sm:text-base text-zinc-300 tracking-wider">
  Grow | Collaborate | Connect
</p>
```

#### 4. Mission Description Paragraph
* **File:** `frontend/src/components/HeroScroll.jsx` (Lines ~75–77)
* Plain text describing the club, hackathons, and software projects. Edit directly.

#### 5. Hero Action Buttons ("EXPLORE EVENTS", "TEAM DIRECTORY")
* **File:** `frontend/src/components/HeroScroll.jsx` (Lines ~80–96)
* Links point to `#events` and `#team`. Edit the text, icon, or `href` target.

#### 6. Stat Counters / Metrics (Events, Badges, Participants)
* **File:** `frontend/src/components/HeroScroll.jsx` (Lines ~99–112)
```jsx
<div>
  <div className="font-mono text-2xl font-bold text-white">4</div>
  <div className="text-xs font-mono text-zinc-400">Flagship events</div>
</div>
<div>
  <div className="font-mono text-2xl font-bold text-emerald-400">14</div>
  <div className="text-xs font-mono text-zinc-400">Core badges</div>
</div>
<div>
  <div className="font-mono text-2xl font-bold text-white">300+</div>
  <div className="text-xs font-mono text-zinc-400">Participants</div>
</div>
```
* **To edit values:** Change `4`, `14`, or `300+`.
* **To add another metric:** Add a 4th `<div>` column and change `grid-cols-3` to `grid-cols-4`.
* **To delete a metric:** Remove one `<div>` block and adjust `grid-cols-3` to `grid-cols-2`.

#### 7. Scroll Indicator Prompt ("Scroll to explore")
* **File:** `frontend/src/components/HeroScroll.jsx` (Lines ~118–121)
* Bouncing arrow at the bottom. To delete, remove the `<div>`.

---

## 4. Club Events Section (Banners, Dates, Filters & Cards)

* **Container Component:** [`frontend/src/components/EventsGrid.jsx`](file:///frontend/src/components/EventsGrid.jsx)
* **Card Component:** [`frontend/src/components/EventCard.jsx`](file:///frontend/src/components/EventCard.jsx)
* **Data File:** [`frontend/src/data/clubData.js`](file:///frontend/src/data/clubData.js) 

### Header Elements in `EventsGrid.jsx`:
1. **Prominent Date Tag:** Line ~64–66 (`28 Nov 2026 • 13th Protocol`). Edit text or date directly in `EventsGrid.jsx`.
2. **Section Title:** Line ~70 (`Club Events`).
3. **Filter Buttons (ALL, UPCOMING, COMPLETED):** Lines ~76–111. Automatically count and filter events based on `event.status`.

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

### How to Change the Action Button to "Register Now" & Change the Registration Link

The action button at the bottom of each event card automatically adapts based on whether the event is **Upcoming** or **Completed**:

1. **For Upcoming Events:**
   - The button automatically displays **"Register Now"** styled as a high-contrast emerald CTA button (`bg-emerald-500 text-black font-bold`).
   - It clicks through to `registrationUrl` (or `registerUrl`, `actionUrl`, or `linkedinPostUrl`).
2. **For Completed Events:**
   - The button automatically displays **"LinkedIn Post"** with the LinkedIn logo, linking to `linkedinPostUrl`.

#### How to change the registration link for an upcoming event:
1. Open [`frontend/src/data/clubData.js`](file:///frontend/src/data/clubData.js).
2. Locate the upcoming event object (e.g. `id: "13th-protocol"`).
3. Set or update the `registrationUrl` property with your actual registration link:
   ```javascript
   registrationUrl: "https://unstop.com/hackathons/13th-protocol-kccitm",
   ```
   *(You can paste a Google Form URL, Unstop link, Devfolio page, Luma event, or any external registration URL here).*
4. (Optional) Custom button text: If you want the button to say something other than "Register Now" (e.g., *"Apply on Unstop"* or *"RSVP Now"*), simply add:
   ```javascript
   actionText: "Apply on Unstop",
   ```
5. Save the file. The button on the website will instantly link to your new registration URL!

#### Where this logic is defined in code:
* **File:** [`frontend/src/components/EventCard.jsx`](file:///frontend/src/components/EventCard.jsx) (Lines ~86–105)
* Checks:
  ```jsx
  const href = event.registrationUrl || event.registerUrl || event.actionUrl || event.linkedinPostUrl;
  const label = event.actionText || (isUpcoming ? 'Register Now' : 'LinkedIn Post');
  ```

---

### How to ADD a New Event
1. Open [`frontend/src/data/clubData.js`](file:///frontend/src/data/clubData.js).
2. Inside `export const EVENTS = [ ... ]`, insert a new event object:
```javascript
  {
    id: "new-hackathon-2027",
    title: "Voyager CodeFest 2027",
    badge: "Hackathon",
    status: "Upcoming",       // Set to "Upcoming" if it is in the future
    date: "15 Jan 2027",
    time: "09:30 AM IST",
    location: "KCCITM",       // Keep strictly as KCCITM
    description: "Annual campus-wide software hackathon for students of KCCITM.",
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
    linkedinPostUrl: "https://www.linkedin.com/company/voyager-coding-club",
    highlights: ["24-Hour Build", "Prizes & Swag", "Industry Mentors"],
    category: "Hackathon"
  },
```
3. Save the file. The new event will immediately appear on the site!

---

### How to EDIT an Existing Event
1. Open [`frontend/src/data/clubData.js`](file:///frontend/src/data/clubData.js).
2. Locate the event by its `id` (e.g., `id: "13th-protocol"`).
3. Modify any field:
   - Change `title` to rename the event.
   - Change `date` or `time` to reschedule.
   - Change `imageUrl` to change the banner.
   - Change `description` or `highlights`.
   - Change `status: "Completed"` once the event is finished (this will automatically remove the green `UPCOMING` badge).
4. Save the file.

---

### How to DELETE an Event
1. Open [`frontend/src/data/clubData.js`](file:///frontend/src/data/clubData.js).
2. Highlight and delete the entire `{ ... },` block of the event you wish to remove from `EVENTS`.
3. Save the file. The event will disappear from the UI and API instantly.

---

### The "Upcoming Always First" Rule
* Both `frontend/src/components/EventsGrid.jsx` and `club_api/data_loader.py` enforce that **any event with `status: "Upcoming"` is placed first** before completed events.
* If you have multiple upcoming events, they appear in order at the beginning of the list.

---

## 5. Team Members Section (Tabs, ID Badges & Sizing)

* **Container Component:** [`frontend/src/components/TeamGrid.jsx`](file:///frontend/src/components/TeamGrid.jsx)
* **ID Card Component:** [`frontend/src/components/IdCard.jsx`](file:///frontend/src/components/IdCard.jsx)
* **Data File:** [`frontend/src/data/clubData.js`](file:///frontend/src/data/clubData.js) 

### Header Elements in `TeamGrid.jsx`:
1. **Section Pill:** Line ~65 (`CLUB LEADERSHIP DIRECTORY`).
2. **Section Title:** Line ~70 (`Team Members`).
3. **Live Search Bar:** Lines ~75–88. Searches live by name, designation, or skills array.
4. **Sub-Team Navigation Tabs:** Lines ~98–117.
   - **Technical Team (5)**
   - **Management Team (5)**
   - **Social Media Team (2)**
   - **Design Team (2)**
5. **Team Navigation Arrows:** Lines ~120–136 (`Team 1 of 4`, `<` Prev, `>` Next).
6. **Active Sub-Team Mission Description:** Lines ~145–158 (e.g., *"Engineers building software architectures, web systems, and competitive programming pathways."*).

---

### Anatomy of a Member Object in `clubData.js`:
Each member is an object in `export const TEAM_MEMBERS = [...]`:
```javascript
{
  id: "purushottam-kumar",                         // URL slug (used in /team/<id>)
  name: "Purushottam Kumar",                       // Full member name
  badgeNumber: 1,                                  // Numeric ID (#1)
  badgeId: "VYR-TECH-001",                         // Printed badge string
  cardImage: "/assets/id-cards/1.png",             // Holographic ID card background
  photoUrl: "/assets/members/purushottam-kumar.png", // Cutout portrait photo (transparent BG)
  gdrivePhotoUrl: "https://...",                   // Google Drive backup link
  subTeam: "Technical Team",                       // Display name of sub-team
  subTeamId: "technical",                          // Slug: "technical", "management", "social-media", "design"
  designation: "Technical Lead",                   // Role title (printed on card)
  title: "Web Architect",                          // Secondary specialization title
  email: "purushottam.kccitm@gmail.com",           // Contact email
  linkedin: "https://www.linkedin.com/in/...",     // LinkedIn profile URL
  bio: "Full-stack developer building Voyager portal...", // Bio paragraph for dossier page
  skills: ["React", "Django", "Tailwind CSS"]      // Array of skill tags
}
```

---

### How to ADD a New Team Member
1. Place the member's transparent cutout portrait in `frontend/public/assets/members/<slug>.png`.
2. (Optional) Place the ID card artwork in `frontend/public/assets/id-cards/<number>.png`.
3. Open [`frontend/src/data/clubData.js`](file:///frontend/src/data/clubData.js).
4. Add the new member object to `export const TEAM_MEMBERS = [ ... ]`:
```javascript
  {
    id: "alex-sharma",
    name: "Alex Sharma",
    badgeNumber: 15,
    badgeId: "VYR-TECH-015",
    cardImage: "/assets/id-cards/1.png",
    photoUrl: "/assets/members/alex-sharma.png",
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
5. Save the file. The new card will render immediately in the Technical Team tab.

---

### How to EDIT an Existing Team Member
1. Open [`frontend/src/data/clubData.js`](file:///frontend/src/data/clubData.js).
2. Search for the member's name or `id` (e.g., `"Harsh Sharma"`).
3. Edit any field:
   - To update **LinkedIn**: change `linkedin: "https://www.linkedin.com/in/your-url/"`.
   - To update **Email**: change `email: "new-email@example.com"`.
   - To update **Role/Designation**: change `designation: "Senior Lead"`.
   - To update **Bio** or **Skills**: change `bio: "..."` or edit the `skills: [...]` array.
4. Save the file.

---

### How to DELETE a Team Member
1. Open [`frontend/src/data/clubData.js`](file:///frontend/src/data/clubData.js).
2. Delete the member's `{ ... },` block from `TEAM_MEMBERS`.
3. Save the file. The card, its badge count, and its `/team/<id>` route are removed immediately.

---

### How to MOVE a Member Between Sub-Teams
Change both `subTeam` and `subTeamId` on the member object:
* **To Technical Team:**
  `subTeam: "Technical Team"`, `subTeamId: "technical"`
* **To Management Team:**
  `subTeam: "Management Team"`, `subTeamId: "management"`
* **To Social Media Team:**
  `subTeam: "Social Media Team"`, `subTeamId: "social-media"`
* **To Design Team:**
  `subTeam: "Design Team"`, `subTeamId: "design"`

---

### How to Add/Replace Member Photos & ID Card Renders
* **Cutout Portrait Photos:**
  - Directory: [`frontend/public/assets/members/`](file:///frontend/public/assets/members/)
  - Format: PNG with a **transparent background** (BG removed).
  - Linked via `photoUrl: "/assets/members/<filename>.png"` in `clubData.js`.
  - Alternatively, a direct Google Drive link or external CDN URL can be pasted into `photoUrl`.
* **ID Card Artwork Renders:**
  - Directory: [`frontend/public/assets/id-cards/`](file:///frontend/public/assets/id-cards/)
  - Linked via `cardImage: "/assets/id-cards/<number>.png"` in `clubData.js`.

---

## 6. Member Detail Page / Dossier View

* **Route:** `/team/:id` (e.g., `/team/purushottam-kumar`)
* **Page File:** [`frontend/src/pages/MemberDetailPage.jsx`](file:///frontend/src/pages/MemberDetailPage.jsx)
* **View Component:** [`frontend/src/components/MemberDetail.jsx`](file:///frontend/src/components/MemberDetail.jsx)

### Elements Present & How to Edit:
* **"Back to team directory" button:** Line ~70. Returns to `/#team`.
* **Isolated Cutout Figure & Glass Pedestal:** Lines ~81–118.
  - Displays the background-removed photo popping out above a frosted liquid-glass pedestal (`.glass-pedestal`).
  - Ambient emerald glow behind the figure.
* **Badge Telemetry Tag:** Line ~90 (`VYR-TECH-001 • ACTIVE MEMBER`).
* **Member Name & Designation:** Lines ~133–142.
* **Biography Paragraph:** Lines ~145–150. Sourced directly from `member.bio` in `clubData.js`.
* **Specialized Skills Tags:** Lines ~154–168. Renders pill badges for every item in `member.skills`.
* **Direct Action Buttons:** Lines ~172–215:
  - **Email Button:** Opens `mailto:${member.email}`.
  - **LinkedIn Profile Button:** Opens `member.linkedin` in a new tab.

---

## 7. About / Five Pillars Section

* **Component File:** [`frontend/src/components/AboutSection.jsx`](file:///frontend/src/components/AboutSection.jsx)

### Elements Present & How to Edit:
1. **Section Pill:** Lines ~53–58 (`MISSION & FIVE PILLARS`).
2. **Main Heading:** Lines ~60–62:
   ```jsx
   <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
     Engineering The Future at <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF88] to-cyan-400">KCCITM</span>
   </h2>
   ```
3. **Mission Paragraph:** Lines ~64–66. Text describing the bridge between classroom theory and real-world tech systems at KCCITM.
4. **The 5 Core Domain Cards:** Lines ~11–45 (`domains` array).
   - Card 1: **Software Engineering & Web Architecture**
   - Card 2: **Systems, Cloud & DevOps Infrastructure**
   - Card 3: **Applied AI, Machine Learning & Data Systems**
   - Card 4: **Open Source Development & Tooling**
   - Card 5: **Cybersecurity & Network Protocols**
   - *How to edit a domain:* Change `title`, `desc`, or `icon` in the `domains` array at lines ~11–45.
   - *How to add a 6th domain:* Add another object to the `domains` array.
   - *How to delete a domain:* Remove one object from the array.

---

## 8. Footer

* **Component File:** [`frontend/src/components/Footer.jsx`](file:///frontend/src/components/Footer.jsx)

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
   - *To add a new social icon (e.g. Discord, X):* Import the icon from `lucide-react` and add a new `<a>` block.
3. **Copyright Notice:** Line ~60:
   ```jsx
   © {new Date().getFullYear()} Voyager Coding Club, KCCITM.
   ```
   Automatically updates the year dynamically.

---

## 9. ID Card Dimensions, Scroll Snap & Threshold Tuning

### ID Card Sizing (in [`frontend/src/components/IdCard.jsx`](file:///frontend/src/components/IdCard.jsx)):
```jsx
// Outer Badge Container:
<div className="badge-container group cursor-pointer w-[285px] sm:w-[305px] shrink-0 snap-start select-none">

// Physical Card Body:
<div className="id-card-badge liquid-glass-card p-4 sm:p-4.5 flex flex-col justify-between h-[435px] sm:h-[455px] relative">

// Portrait Frame:
<div className="relative w-full h-[220px] sm:h-[235px] rounded-xl overflow-hidden border border-white/10 bg-black/60 shadow-inner">
```
* **To make cards wider:** Change `w-[285px] sm:w-[305px]` to `w-[315px] sm:w-[335px]`.
* **To make cards taller:** Change `h-[435px] sm:h-[455px]` to `h-[460px] sm:h-[480px]`.
* **To enlarge the photo frame:** Change `h-[220px] sm:h-[235px]` to `h-[240px] sm:h-[255px]`.

---

### Inner Div Snap Anchor (in [`frontend/src/components/TeamGrid.jsx`](file:///frontend/src/components/TeamGrid.jsx)):
Instead of snapping prematurely to the title or outer margin, the snap point is attached directly to the **inner container**:
```jsx
<div
  id="team-focus-card"
  ref={boxRef}
  className="liquid-glass rounded-3xl p-5 sm:p-7 relative flex flex-col justify-between shadow-2xl snap-start scroll-mt-24"
>
```
* `snap-start`: Locks the inner card to the viewport top when scrolling down.
* `scroll-mt-24`: Offsets the snap point by 96px so it rests cleanly below the fixed navbar.

---

### Scroll Thresholds & Anti-Jitter Parameters (in [`frontend/src/components/TeamGrid.jsx`](file:///frontend/src/components/TeamGrid.jsx)):
```javascript
const JITTER_THRESHOLD = 24;       // Micro-scroll twitches (< 24px) are completely ignored
const EDGE_SWITCH_THRESHOLD = 180; // Requires deliberate 180px scroll at the edge to switch sub-teams
const SWITCH_COOLDOWN = 650;       // 650ms cooldown prevents accidental rapid team skipping
```
* **If switching sub-teams feels too stiff:** Decrease `EDGE_SWITCH_THRESHOLD` from `180` to `120`.
* **If switching sub-teams happens too easily:** Increase `EDGE_SWITCH_THRESHOLD` from `180` to `220`.
* **Scroll Snap Mode (in [`frontend/src/index.css`](file:///frontend/src/index.css)):**
  `scroll-snap-type: y proximity;` ensures smooth, natural scrolling that does not violently seize the screen.

---

## 10. Liquid Glass & Glassmorphism Design System

All glassmorphism effects are defined in [`frontend/src/index.css`](file:///frontend/src/index.css):

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
* **Auto-Reload:** Enabled automatically via `django-browser-reload`. Any edit to `clubData.js` immediately refreshes all connected devices without restarting the server!

### Compiling React Frontend (`buildfrontend`)
Whenever you edit React JSX components (`frontend/src/components/*.jsx`) or Tailwind styles (`frontend/src/index.css`), compile the bundles into `frontend/dist/` with:
```bash
python manage.py buildfrontend
```
This runs Vite inside `frontend/` and updates the compiled bundles in ~3 seconds. Once finished, refresh your browser to see your UI updates!

---

### Deploying to Vercel

The repository is configured for seamless deployment on [Vercel](https://vercel.com/):

#### How Vercel Deployment Works:
1. **`vercel.json`:** Defines dual build targets:
   - `@vercel/python` compiles `portal_backend/wsgi.py` (and `api/index.py`) into high-speed serverless functions handling `/api/*` and `/admin/*`.
   - `@vercel/static-build` builds `frontend/package.json` into static assets deployed globally across Vercel's Edge CDN.
2. **SPA Routing:** Non-API requests (`/`, `/team/*`) automatically route to `index.html` via Vercel Edge rewrites.
3. **Environment Detection:** When `VERCEL` is detected:
   - Live auto-reload is turned off automatically.
   - SQLite database is safely initialized in `/tmp/db.sqlite3` to comply with serverless read-only filesystems.
   - All events and members are served dynamically from `frontend/src/data/clubData.js`.

#### Steps to Deploy:
1. Push your changes to the `main` branch:
   ```bash
   git push origin main
   ```
2. Log in to [Vercel Dashboard](https://vercel.com/).
3. Click **Add New...** -> **Project** and select `Voyager-Coding-Club-Website`.
4. (Optional) Set Environment Variables:
   - `DJANGO_DEBUG`: `False` (defaults to False on Vercel)
   - `SECRET_KEY`: Enter a random secret key for production
5. Click **Deploy**. Vercel will build and assign a live URL (e.g., `https://voyager-coding-club-website.vercel.app`).

---

## 12. Asset Directory Quick Reference

```
frontend/public/assets/
├── Logo_Cube.png              # Primary 3D Voyager Binary Emblem
├── id-cards/
│   ├── 1.png                  # ID Card holographic render 1
│   ├── 2.png                  # ID Card holographic render 2
│   └── ...                    # Additional card artwork renders
└── members/
    ├── purushottam-kumar.png   # Transparent cutout portrait
    ├── nilesh-singh.png        # Transparent cutout portrait
    ├── pratyush-kumar-singh.png# Transparent cutout portrait
    └── ...                     # Cutouts for all active members
```
To update an asset, replace the file with an image of the identical filename, or update the corresponding path in [`frontend/src/data/clubData.js`](file:///frontend/src/data/clubData.js).
