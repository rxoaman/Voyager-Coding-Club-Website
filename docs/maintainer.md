# Voyager Coding Club Web Portal — Maintainer Manual (`maintainer.md`)

Welcome to the **Voyager Coding Club Web Portal** maintainer reference. This document is designed for any current or future club lead, maintainer, or developer to understand exactly where every piece of text, graphic, data entry, layout size, snap behavior, and animation lives, and how to change it with zero guesswork.

---

## ⚡ Quick-Change Cheat Sheet (Where to Edit What)

### 1. How to change `KCCITM // VOYAGER` below the Hero Logo
* **File:** `frontend/src/components/HeroScroll.jsx`
* **Lines:** ~44–47
* **Code snippet:**
  ```jsx
  <div className="mt-3 flex items-center gap-2 font-mono text-xs text-zinc-400 bg-zinc-950/80 px-3.5 py-1 rounded-full border border-white/10">
    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
    <span>KCCITM // VOYAGER</span>  {/* <-- EDIT THIS TEXT HERE */}
  </div>
  ```

---

### 2. How to change ID Card Sizing & Typography
* **File:** `frontend/src/components/IdCard.jsx`
* **Outer Badge Width:**
  ```jsx
  <div className="badge-container group cursor-pointer w-[285px] sm:w-[305px] shrink-0 snap-start select-none">
  ```
  *(To make cards wider, increase to `w-[310px] sm:w-[330px]`; to make narrower, decrease to `w-[260px]`)*
* **Card Body Height & Padding:**
  ```jsx
  <div className="id-card-badge liquid-glass-card p-4 sm:p-4.5 flex flex-col justify-between h-[435px] sm:h-[455px] relative">
  ```
* **Member Portrait Frame Height:**
  ```jsx
  <div className="relative w-full h-[220px] sm:h-[235px] rounded-xl overflow-hidden border border-white/10 bg-black/60 shadow-inner">
  ```
* **Member Typography:**
  - Name: `font-display font-bold text-base sm:text-lg text-white`
  - Role: `font-mono text-xs sm:text-sm text-zinc-400`

---

### 3. How the Inner Div Snap Works for Team Members
* **File:** `frontend/src/components/TeamGrid.jsx`
* Instead of snapping to the outer container or title, the snap point is attached directly to the **inner liquid-glass card container**:
  ```jsx
  <div
    id="team-focus-card"
    ref={boxRef}
    className="liquid-glass rounded-3xl p-5 sm:p-7 relative flex flex-col justify-between shadow-2xl snap-start scroll-mt-24"
  >
  ```
* **Why this matters:** When the user scrolls past Events, the browser locks cleanly onto `#team-focus-card`. The active sub-team (Technical Team first, with its larger ID badges) immediately occupies center stage beneath the fixed navbar (`scroll-mt-24`).

---

### 4. How Scroll Threshold & Jitter Prevention Work
* **Files:** `frontend/src/components/TeamGrid.jsx` and `frontend/src/index.css`
* **Scroll Snap Proximity (in `index.css`):**
  ```css
  html {
    scroll-behavior: smooth;
    scroll-snap-type: y proximity;
  }
  ```
  `proximity` ensures that small up/down scroll movements do NOT violently jerk or snap prematurely. It only snaps when you scroll close to the section.
* **Wheel Threshold Parameters (in `TeamGrid.jsx`):**
  ```javascript
  const JITTER_THRESHOLD = 24;       // Ignores micro-scroll twitches (< 24px)
  const EDGE_SWITCH_THRESHOLD = 180; // Deliberate 180px scroll required to switch teams
  const SWITCH_COOLDOWN = 650;       // 650ms cooldown prevents skipping teams accidentally
  ```
* **How to tweak sensitivity:**
  - If team switching feels too stiff: lower `EDGE_SWITCH_THRESHOLD` from `180` to `120`.
  - If team switching triggers too easily: raise `EDGE_SWITCH_THRESHOLD` to `220`.

---

### 5. Opening to the Local Network (`0.0.0.0` / Wi-Fi Access)

#### Option A: Node.js Frontend (`voyager-portal`)
In `frontend/vite.config.js`:
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Binds to all network interfaces
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
});
```
When you run `npm run dev`, Vite displays:
```
➜  Local:   http://localhost:5173/
➜  Network: http://192.168.1.5:5173/
```
Open the **Network URL** on any phone, tablet, or laptop connected to the same Wi-Fi!

#### Option B: Django Edition (`voyager-portal-django`)
Run Django with any of these commands (all bind to all local network interfaces automatically):
```bash
python manage.py runserver
# OR
python manage.py runserver 0.0.0.0
# OR
python manage.py runserver 0.0.0.0:8000
```
Django will output:
```
  > On this computer:   http://127.0.0.1:8000/
  > On your Wi-Fi/LAN:  http://192.168.x.x:8000/
```
*Note for Windows:* Do not type `0.0.0.0` in your Chrome/Edge address bar (Windows returns invalid IP for 0.0.0.0). Always use `http://127.0.0.1:8000/` or your LAN IP.

---

### 6. How to change the Hero Heading, Tagline, or Metrics
* **File:** `frontend/src/components/HeroScroll.jsx`
* Eyebrow pill: Lines ~56–60
* Main Title: Lines ~64–67
* Tagline: Lines ~69–71
* Hero Paragraph: Lines ~75–77
* Key metrics: Lines ~99–112

---

### 7. How to change Club Events (Upcoming & Completed)
* **Files:** `frontend/src/data/clubData.js` and `api/lib/data.js` (or Django `club_api/models.py`)
* **Upcoming event priority:** Set `status: "Upcoming"`. Upcoming events automatically sort to index 0.
* **Venue:** Always kept strictly as `"KCCITM"`.
* **Date Tag in header:** `frontend/src/components/EventsGrid.jsx` (Lines ~52–57).

---

### 8. How to change Core Team Members
* **Files:** `frontend/src/data/club.js` or `frontend/src/data/clubData.js`
* Cutout transparent portraits: `frontend/public/assets/members/<slug>.png`
* ID card renders: `frontend/public/assets/id-cards/<number>.png`
* Sub-team IDs: `technical`, `management`, `social-media`, `design`.

---

### 9. Editing Club Data (`club.js` / `clubData.js`) & Django Auto-Reloader
In the Django project (`voyager-portal-django`), you can edit data directly in either:
- `frontend/src/data/club.js` (Recommended shortcut)
- `frontend/src/data/clubData.js`

#### How it works:
1. **Zero-Config Dynamic Parser:** Django's `club_api/data_loader.py` dynamically monitors both files. Whichever file was modified most recently is parsed directly into Python dictionaries and immediately served over the REST API (`/api/events/`, `/api/team/`, `/api/club/`).
2. **Instant Browser Auto-Reloader:** The Django server includes `django-browser-reload`. Whenever you save `club.js` or `clubData.js`, Django signals all connected browsers via Server-Sent Events (SSE). The browser automatically refreshes in ~50ms, requests the updated data from the API, and renders your changes immediately on screen — **no Node.js required!**
3. **No Migration Needed:** You do NOT need to run `makemigrations` or `migrate` when editing team members or events in `club.js`. It takes effect immediately.

---

## 💻 Running Locally

### Node Edition (`voyager-portal`):
```bash
npm run dev:all    # Runs backend (3001) & frontend on local network (5173)
```

### Django Edition (`voyager-portal-django`):
```bash
python manage.py runserver 0.0.0.0:8000    # Runs full website on local network (8000)
```
