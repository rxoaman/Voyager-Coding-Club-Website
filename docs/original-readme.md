# Voyager Coding Club Official Portal (Serverless Stack)

A dynamic single-page web portal and API for Voyager Coding Club, powered by React.js, Anime.js, and a Serverless Node.js backend.

---

## 🛠 Tech Stack

- **Frontend:** React.js (Vite), Anime.js, React Router v6, Tailwind CSS / Custom CSS
- **Backend:** Node.js (Serverless API Functions), Express / Vercel Serverless
- **Database/Storage:** Supabase (PostgreSQL) or MongoDB Atlas
- **Hosting / CI:** Vercel (recommended for zero-config serverless deployments)

---

## 📁 Repository Structure

```text
voyager-portal/
├── api/                       # Serverless Node.js endpoints (Vercel routes)
│   ├── events.js              # GET /api/events
│   ├── team.js                # GET /api/team
│   └── [id].js                # GET /api/team/:id
├── frontend/
│   ├── public/
│   │   └── assets/            # Static image placeholders and logos
│   ├── src/
│   │   ├── animations/        # Anime.js timelines (scroll & page transitions)
│   │   ├── components/        # Navbar, HeroScroll, IdCard, EventCard
│   │   ├── pages/             # Home.jsx, MemberDetail.jsx
│   │   ├── services/          # API fetch client
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── vercel.json                # Serverless deployment configuration
├── package.json               # Root monorepo scripts
└── README.md