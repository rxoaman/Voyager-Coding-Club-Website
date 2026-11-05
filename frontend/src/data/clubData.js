// Voyager Coding Club - Central Data Access Layer

export const CLUB_INFO = {
  name: "Voyager Coding Club",
  institution: "KCC Institute of Technology & Management, Greater Noida",
  tagline: "Grow | Collaborate | Connect",
  motto: "Student coding community of KCC Institute of Technology & Management.",
  logo: "/assets/Logo_Cube.png",
  cardBack: "/assets/id-cards/1.png",
  socials: {
    linkedin: "https://www.linkedin.com/company/voyager-kccitm/",
    instagram: "https://www.instagram.com/voyager.kccitm/"
  }
};

export const EVENTS = [
  // Upcoming event ALWAYS first
  {
    id: "13th-protocol",
    title: "13th Protocol",
    badge: "AI Hackathon",
    status: "Upcoming",
    date: "28 Nov 2026",
    time: "10:00 AM IST",
    location: "KCCITM",
    description: "Overnight AI hackathon powered by HackIndia and supported by OpenAI, hosted by Voyager Coding Club at KCCITM. Teams build working prototypes with 60,000 INR cash prizes, 40,000 INR rewards, and OpenAI API credits.",
    imageUrl: "https://i.postimg.cc/mg6PZb7B/13th-Protocol-AI-Hackathon-Banner.png",
    registrationUrl: "https://unstop.com/o/ERTASPu?lb=Sx7S3f78&utm_medium=Share&utm_source=voyaggol83580&utm_campaign=Online_coding_challenge",
    actionText: "Register Now",
    linkedinPostUrl: "https://www.linkedin.com/",
    highlights: ["Overnight 24-hour sprint", "60,000 INR cash prizes", "OpenAI API credits"],
    category: "Hackathon"
  },
  // Completed events
  {
    id: "hackindia-spark-4",
    title: "HackIndia Spark 4",
    badge: "Hackathon",
    status: "Completed",
    date: "20 Mar 2026",
    time: "8:00 AM IST",
    location: "KCCITM",
    description: "Regional hackathon powered by HackIndia. Teams prototyped software solutions to campus and community problems over 12 hours.",
    imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    linkedinPostUrl: "https://www.linkedin.com/company/voyager-kccitm/",
    highlights: ["12-hour build sprint", "Hardware and web tracks", "Industry mentors"],
    category: "Hackathon"
  },
  {
    id: "build-with-bharat-4",
    title: "Build With Bharat 4.0",
    badge: "Hackathon",
    status: "Completed",
    date: "11 Oct 2026",
    time: "11:00 AM IST",
    location: "KCCITM",
    description: "National hackathon hosted at KCCITM. Over 300 developers built projects across web, cloud, and open source with a 1,00,000 INR prize pool.",
    imageUrl: "https://i.postimg.cc/DzKtXGr1/Build-with-Bharat-4-0-Hackathon-Poster.png",
    linkedinPostUrl: "https://www.linkedin.com/company/voyager-kccitm/",
    highlights: ["700+ participants", "1,00,000 INR prizes", "National teams"],
    category: "Hackathon"
  },
  {
    id: "codefarming",
    title: "CodeFarming",
    badge: "Competition",
    status: "Completed",
    date: "18 Oct 2026",
    time: "02:00 PM IST",
    location: "KCCITM",
    description: "Competitive programming contest and peer code review session. Participants solved algorithmic challenges in C++, Python, and Java.",
    imageUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
    linkedinPostUrl: "https://www.linkedin.com/company/voyager-kccitm/",
    highlights: ["Algorithm speedrun", "Live leaderboard", "Code review"],
    category: "Competition"
  }
];

// Core 4 leadership sub-teams
export const SUB_TEAMS = [
  { id: "technical", name: "Technical Team", description: "Engineers building software architectures, web systems, and competitive programming pathways." },
  { id: "management", name: "Management Team", description: "Organizers handling operations, campus coordination, partnerships, and event logistics." },
  { id: "social-media", name: "Social Media Team", description: "Community managers handling LinkedIn, Instagram, and event media." },
  { id: "design", name: "Design Team", description: "Designers responsible for UI/UX, badge layouts, and visual assets." }
];

export const TEAM_MEMBERS = [
  // ── Technical Team ──
  {
    id: "purushottam-kumar",
    name: "Purushottam Kumar",
    badgeNumber: 12,
    badgeId: "VYR-TECH-012",
    cardImage: "/assets/id-cards/12.png",
    photoUrl: "/assets/members/purushottam-kumar.png",
    gdrivePhotoUrl: "https://drive.google.com/thumbnail?id=1NcGq9_wGXZWAYdjPexUbUMnBefJwcKfB&sz=w1200",
    subTeam: "Technical Team",
    subTeamId: "technical",
    designation: "Technical Lead",
    title: "Full-Stack Lead",
    email: "purushottam.kumxr@gmail.com",
    linkedin: "https://www.linkedin.com/in/rxoaman/",
    bio: "Leads technical architecture and developer workflows at Voyager. Builds web systems using React, Node.js, and serverless functions.",
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "Anime.js", "Vite"]
  },
  {
    id: "nilesh-singh",
    name: "Nilesh Singh",
    badgeNumber: 11,
    badgeId: "VYR-TECH-011",
    cardImage: "/assets/id-cards/11.png",
    photoUrl: "/assets/members/nilesh-singh.png",
    gdrivePhotoUrl: "https://drive.google.com/thumbnail?id=1As7xuPpaBCxuYYmM3wMyLEsMC531QjxA&sz=w1200",
    subTeam: "Technical Team",
    subTeamId: "technical",
    designation: "Technical Lead",
    title: "Web Systems Lead",
    email: "ns2026504@gmail.com",
    linkedin: "https://www.linkedin.com/in/nilesh-singh7897/",
    bio: "Focuses on frontend engineering, build tooling, and website architecture for Voyager Coding Club.",
    skills: ["JavaScript", "React", "Vite", "Tailwind CSS", "Git", "DevOps"]
  },
  {
    id: "pratyush-kumar-singh",
    name: "Pratyush Kumar Singh",
    badgeNumber: 10,
    badgeId: "VYR-TECH-010",
    cardImage: "/assets/id-cards/10.png",
    photoUrl: "/assets/members/pratyush-kumar-singh.png",
    gdrivePhotoUrl: "https://drive.google.com/thumbnail?id=1S12F4fQmcl0szPaGxr6Rjqgg9Tq9BoxH&sz=w1200",
    subTeam: "Technical Team",
    subTeamId: "technical",
    designation: "Technical Expert",
    title: "Algorithms & Systems",
    email: "pratyush@kcc.edu",
    linkedin: "https://www.linkedin.com/in/pratyush-kumar-singh-64b615210/",
    bio: "Specializes in data structures, algorithms, and competitive programming problem setting.",
    skills: ["C++", "Data Structures", "Algorithms", "Competitive Programming", "Linux"]
  },
  {
    id: "devender-parmar",
    name: "Devender Parmar",
    badgeNumber: 7,
    badgeId: "VYR-TECH-007",
    cardImage: "/assets/id-cards/7.png",
    photoUrl: "/assets/members/devender-parmar.png",
    gdrivePhotoUrl: "https://drive.google.com/thumbnail?id=1Vab0AVYhVbV_6D3IIJwDZmkNJWHb24iS&sz=w1200",
    subTeam: "Technical Team",
    subTeamId: "technical",
    designation: "Technical Expert",
    title: "Frontend Engineering",
    email: "devparmar2906@gmail.com",
    linkedin: "https://www.linkedin.com/in/devender-parmar-4a68a9331/",
    bio: "Builds responsive web interfaces and client-side applications for club initiatives.",
    skills: ["React", "JavaScript", "CSS3", "REST APIs", "HTML5"]
  },
  {
    id: "ayush-jha",
    name: "Ayush Jha",
    badgeNumber: 8,
    badgeId: "VYR-TECH-008",
    cardImage: "/assets/id-cards/8.png",
    photoUrl: "/assets/members/ayush-jha.png",
    gdrivePhotoUrl: "https://drive.google.com/thumbnail?id=1sVqFlamq594Ux1Kf6dR7UefcvNyp5jZS&sz=w1200",
    subTeam: "Technical Team",
    subTeamId: "technical",
    designation: "Technical Expert",
    title: "Machine Learning & Python",
    email: "jhayushk@gmail.com",
    linkedin: "https://www.linkedin.com/in/ayush-jha-204310360/",
    bio: "Works on Python data pipelines, model experiments, and applied machine learning projects.",
    skills: ["Python", "PyTorch", "Data Science", "Scikit-Learn"]
  },

  // ── Management Team ──
  {
    id: "harsh",
    name: "Harsh",
    badgeNumber: 6,
    badgeId: "VYR-MGT-006",
    cardImage: "/assets/id-cards/6.png",
    photoUrl: "/assets/members/harsh.png",
    gdrivePhotoUrl: "https://drive.google.com/thumbnail?id=1A7YgBXdWtzMl6kqYY3zGuvKrYRhz9mQI&sz=w1200",
    subTeam: "Management Team",
    subTeamId: "management",
    designation: "Management Lead",
    title: "Operations Lead",
    email: "harshsharma97748@gmail.com",
    linkedin: "https://www.linkedin.com/in/iharshhs",
    bio: "Coordinates event schedules, campus permissions, and logistics for Voyager hackathons.",
    skills: ["Operations", "Event Planning", "Team Leadership"]
  },
  {
    id: "karuna-pradhan",
    name: "Karuna Pradhan",
    badgeNumber: 4,
    badgeId: "VYR-MGT-004",
    cardImage: "/assets/id-cards/4.png",
    photoUrl: "/assets/members/karuna-pradhan.png",
    gdrivePhotoUrl: "https://drive.google.com/thumbnail?id=1XOu_YUpK6wPx473aJ0esL8z4rY6S625Q&sz=w1200",
    subTeam: "Management Team",
    subTeamId: "management",
    designation: "Core Organizer",
    title: "Student Relations",
    email: "pradhankaruna071@gmail.com",
    linkedin: "https://www.linkedin.com/company/voyager-kccitm/",
    bio: "Manages student outreach, community communications, and onboarding new members.",
    skills: ["Communications", "Outreach", "Student Support"]
  },
  {
    id: "bhavya-singh",
    name: "Bhavya Singh",
    badgeNumber: 9,
    badgeId: "VYR-MGT-009",
    cardImage: "/assets/id-cards/9.png",
    photoUrl: "/assets/members/bhavya-singh.png",
    gdrivePhotoUrl: "https://drive.google.com/thumbnail?id=1W2vFhMrkJRD0DnEeUihcZbuhjRbsalHn&sz=w1200",
    subTeam: "Management Team",
    subTeamId: "management",
    designation: "Core Organizer",
    title: "Event Operations",
    email: "singhbhavya037@gmail.com",
    linkedin: "https://www.linkedin.com/in/bhavya-singh-594a90325/",
    bio: "Oversees attendee check-in desks, hospitality, and venue flow during hackathons.",
    skills: ["Event Operations", "Hospitality", "Logistics"]
  },
  {
    id: "raza-masud",
    name: "Raza Masud",
    badgeNumber: 5,
    badgeId: "VYR-MGT-005",
    cardImage: "/assets/id-cards/5.png",
    photoUrl: "/assets/members/raza-masud.png",
    gdrivePhotoUrl: "https://drive.google.com/thumbnail?id=1Fffe9Qg3AnWkLx3FGagNM2WDYnRRfZhi&sz=w1200",
    subTeam: "Management Team",
    subTeamId: "management",
    designation: "Core Organizer",
    title: "Partnerships",
    email: "versifier.metrist@gmail.com",
    linkedin: "https://www.linkedin.com/in/raza-masud-9aa445313/",
    bio: "Coordinates sponsor communications, partner outreach, and community collaborations.",
    skills: ["Partnerships", "Sponsorship", "Outreach"]
  },
  {
    id: "akash",
    name: "Akash",
    badgeNumber: 13,
    badgeId: "VYR-MGT-013",
    cardImage: "/assets/id-cards/13.png",
    photoUrl: "/assets/members/akash.png",
    gdrivePhotoUrl: "https://drive.google.com/thumbnail?id=1BK7aZAXQ7nJlqH6l0UmRbzZ8MVEibm_w&sz=w1200",
    subTeam: "Management Team",
    subTeamId: "management",
    designation: "Core Organizer",
    title: "Logistics Support",
    email: "09jash2004@gmail.com",
    linkedin: "https://www.linkedin.com/company/voyager-kccitm/",
    bio: "Handles day-of-event stage equipment, audio-visual testing, and venue setup.",
    skills: ["Operations", "Logistics", "Equipment"]
  },

  // ── Social Media Team ──
  {
    id: "chaitanya-mathur",
    name: "Chaitanya Mathur",
    badgeNumber: 2,
    badgeId: "VYR-SOC-002",
    cardImage: "/assets/id-cards/2.png",
    photoUrl: "/assets/members/chaitanya-mathur.png",
    gdrivePhotoUrl: "https://drive.google.com/thumbnail?id=1z3xgHPR0BKyUe02_5TEXC0iXPtaQb8MM&sz=w1200",
    subTeam: "Social Media Team",
    subTeamId: "social-media",
    designation: "Social Media Lead",
    title: "Media Lead",
    email: "chaitanyamathur4u@gmail.com",
    linkedin: "https://www.linkedin.com/in/mathurchaitanya/",
    bio: "Manages Voyager's LinkedIn and Instagram announcements, event recaps, and video updates.",
    skills: ["Content Writing", "Social Media", "Video Production"]
  },
  {
    id: "rauneet-singh",
    name: "Rauneet Singh",
    badgeNumber: 14,
    badgeId: "VYR-SOC-014",
    cardImage: "/assets/id-cards/14.png",
    photoUrl: "/assets/members/rauneet-singh.png",
    gdrivePhotoUrl: "https://drive.google.com/thumbnail?id=12l-5nhiOek_dB3DkyRtGa_6cvk03SkpX&sz=w1200",
    subTeam: "Social Media Team",
    subTeamId: "social-media",
    designation: "Social Media Strategist",
    title: "Community Media",
    email: "rauneetsingh1@gmail.com",
    linkedin: "https://www.linkedin.com/in/rauneet-singh-058a0a247/",
    bio: "Writes event copy, designs social carousels, and publishes tech updates for club members.",
    skills: ["Copywriting", "Instagram", "Community Engagement"]
  },

  // ── Design Team ──
  {
    id: "kartikey-sharma",
    name: "Kartikey Sharma",
    badgeNumber: 3,
    badgeId: "VYR-DSG-003",
    cardImage: "/assets/id-cards/3.png",
    photoUrl: "/assets/members/kartikey-sharma.png",
    gdrivePhotoUrl: "https://drive.google.com/thumbnail?id=11hpZeEmABgUFizPvW19s01F7vCdNOJyZ&sz=w1200",
    subTeam: "Design Team",
    subTeamId: "design",
    designation: "Design Lead",
    title: "Visual Design Lead",
    email: "kartiksharmasharmakartik@gmail.com",
    linkedin: "https://www.linkedin.com/in/kartikey-kartik-sharma-3361a9358/",
    bio: "Designs club visual assets, 3D emblems, and physical ID badges for Voyager events.",
    skills: ["Figma", "UI/UX", "3D Modeling", "Brand Design"]
  },
  {
    id: "adarsh-pandey",
    name: "Adarsh Pandey",
    badgeNumber: 15,
    badgeId: "VYR-DSG-015",
    cardImage: "/assets/id-cards/15.png",
    photoUrl: "/assets/members/adarsh-pandey.png",
    gdrivePhotoUrl: "https://drive.google.com/thumbnail?id=1ay2aQyodYMMs84hIHNhlTganvaxRRcPs&sz=w1200",
    subTeam: "Design Team",
    subTeamId: "design",
    designation: "Product Designer",
    title: "UI/UX Designer",
    email: "adarshpandey880079@gmail.com",
    linkedin: "https://www.linkedin.com/in/adarsh-pandey-cse",
    bio: "Designs user flows, typographic hierarchy, and website mockups for Voyager projects.",
    skills: ["Figma", "UI Design", "Design Systems"]
  }
];

export function getAllEvents(filterCategory, filterStatus) {
  let result = [...EVENTS];
  if (filterCategory) {
    result = result.filter(e => e.category.toLowerCase() === filterCategory.toLowerCase());
  }
  if (filterStatus) {
    result = result.filter(e => e.status.toLowerCase() === filterStatus.toLowerCase());
  }
  return result;
}

export function getAllTeamMembers(subTeam) {
  if (subTeam) {
    return TEAM_MEMBERS.filter(m => m.subTeamId === subTeam || m.subTeam.toLowerCase() === subTeam.toLowerCase());
  }
  return TEAM_MEMBERS;
}

export function getTeamMemberById(id) {
  if (!id) return null;
  const cleanId = String(id).toLowerCase().trim();
  return TEAM_MEMBERS.find(m => 
    m.id.toLowerCase() === cleanId || 
    String(m.badgeNumber) === cleanId || 
    m.badgeId.toLowerCase() === cleanId
  ) || null;
}
