You are an expert full-stack developer specializing in React.js (SPA), Anime.js, and serverless Node.js architecture.



Build a production-ready, serverless-ready web portal for "Voyager Coding Club" following the exact stack, animations, page transitions, and architecture specified below.



\---



\### 1. Technology Stack

\* \*\*Frontend:\*\* React.js (Vite), Anime.js for scroll-linked and layout animations, Tailwind CSS / modern CSS modules (custom physical ID-card badge styling), React Router v6 (dynamic client-side routing with no browser reloads, YouTube-style).

\* \*\*Backend (Serverless Node.js):\*\* 

&#x20; \* Node.js with Express wrapped for serverless (e.g., using `@vendia/serverless-express` or native Vercel serverless functions `/api/\*`).

&#x20; \* Database: Supabase (PostgreSQL) or MongoDB Atlas / serverless Prisma client.

&#x20; \* Media \& Assets: Public assets directory or cloud storage (e.g., Cloudinary / AWS S3 / Supabase Storage) with graceful fallback placeholders.

\* \*\*Deployment Target:\*\* Vercel / Netlify (Zero-server architecture, single-repo/monorepo deployment).



\---



\### 2. Architecture \& Design Requirements



\#### A. Global Navigation \& Layout

\* \*\*Navbar:\*\* Sticky top bar with links (`Home`, `About`, `Events`, `Team`).

\* \*\*SPA Routing:\*\* Must use React Router v6. All transitions (especially clicking a team member card) must update the route dynamically without a page refresh.



\#### B. Hero Section \& Scroll-Triggered Logo Flight (Anime.js)

\* \*\*Initial State (Above the fold):\*\*

&#x20; \* Left: Club manifesto, tagline, and intro copy.

&#x20; \* Center/Right: Large Voyager Coding Club emblem/logo.

\* \*\*Scroll-Linked Animation:\*\*

&#x20; \* As the user scrolls down, track the scroll delta and map it to an Anime.js timeline or CSS transform matrix.

&#x20; \* The large center Voyager emblem shrinks and moves directly into its target container inside the fixed navbar.

&#x20; \* The left-side hero text dissolves/scales down upward toward the top-right "About" section.



\#### C. Events Section (LinkedIn Integration Format)

\* Display past and upcoming club hackathons, recruitment drives, and workshops.

\* Schema structure mirroring club LinkedIn posts:

&#x20; \* Fields: `id`, `title`, `date`, `description`, `badge` (e.g., "Hackathon", "Workshop"), `imageUrl` (with descriptive `alt`), `linkedinPostUrl`.

\* Clean, interactive card grid with subtle hover scale effects.



\#### D. Team Section \& Dynamic ID-Card Expansion

\* \*\*Team Layout:\*\*

&#x20; \* Categorized by sub-teams (e.g., Tech Leads, Core Organizers, Logistics, PR \& Design).

&#x20; \* Design: Physical \*\*lanyard ID-card badge format\*\* (slot/clip at the top, card border, member photo, name, designation, sub-team tag, and social links).

\* \*\*Card Click \& Detail View (Shared-Element / FLIP Transition):\*\*

&#x20; \* Clicking an ID card routes dynamically to `/team/:id` without refreshing the page.

&#x20; \* Animation:

&#x20;   \* The clicked member's portrait expands smoothly into a large hero image on the left side of the viewport.

&#x20;   \* Detailed background, bio, tech stack badges, and social links slide and fade into view on the right side.

&#x20;   \* Include a "Back to Team" action that animates the expanded layout back down to the card grid.



\#### E. Resilient Image Handling \& Placeholders

\* If any image (logo, event banner, member photo) fails to load or is not yet provided, automatically render an SVG silhouette/avatar placeholder displaying the descriptive `alt` text cleanly.



\---



\### 3. Deliverables Required



1\. \*\*Serverless Node Backend:\*\*

&#x20;  \* Serverless API endpoints (`/api/events`, `/api/team`, `/api/team/:id`).

&#x20;  \* Clean separation of route handlers and data access layers.

&#x20;  \* CORS middleware enabled for local and production origins.



2\. \*\*React SPA Frontend:\*\*

&#x20;  \* Modular components (`Navbar`, `HeroScroll`, `EventsGrid`, `TeamGrid`, `IdCard`, `MemberDetail`).

&#x20;  \* Anime.js timeline orchestrations for:

&#x20;    \* Logo-to-navbar scroll synchronization.

&#x20;    \* ID-card click-to-expanded-profile transition.

&#x20;  \* CSS replicating physical ID cards (strap clip, lanyard hole, textured badge card).



3\. \*\*Documentation:\*\*

&#x20;  \* Complete `README.md` at project root covering installation, running both ends locally, environment variables, serverless deployment commands, and instructions for manually updating member details and images.

