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
    status: "Live",
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
  // Completed events in timeline order: newest to oldest
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
    badgeNumber: 1,
    badgeId: "VYR-TECH-001",
    cardImage: "https://lh3.googleusercontent.com/d/1NLsXQ0-wVwFlXzewYXfb1PQdlBBWCMt3",
    photoUrl: "https://lh3.googleusercontent.com/d/1Cr-7doCjhJzm6qjtBX3ChL4EYDffuvj5",
    gdrivePhotoUrl: "https://lh3.googleusercontent.com/d/1Cr-7doCjhJzm6qjtBX3ChL4EYDffuvj5",
    subTeam: "Technical Team",
    subTeamId: "technical",
    designation: "Technical Lead",
    title: "Full-Stack Lead",
    email: "rxo.aman@gmail.com",
    linkedin: "https://www.linkedin.com/in/rxoaman/",
    bio: "Leads technical architecture and developer workflows at Voyager. Builds web systems using React, Node.js, and serverless functions.",
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "Anime.js", "Vite"]
  },
  {
    id: "nilesh-singh",
    name: "Nilesh Singh",
    badgeNumber: 2,
    badgeId: "VYR-TECH-002",
    cardImage: "https://lh3.googleusercontent.com/d/1z90gdPSGlPISwPZjhOMj2zfGuzopniLf",
    photoUrl: "https://lh3.googleusercontent.com/d/1lzGTxOURAxDKjoEq_0cWmbK7W71UPGvC",
    gdrivePhotoUrl: "https://lh3.googleusercontent.com/d/1lzGTxOURAxDKjoEq_0cWmbK7W71UPGvC",
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
    badgeNumber: 3,
    badgeId: "VYR-TECH-003",
    cardImage: "https://lh3.googleusercontent.com/d/1A-di8Zj-tTLGRK1XigQ0jQZh7eTz_sVf",
    photoUrl: "https://lh3.googleusercontent.com/d/1YU-yTw1JDPxzGpeA5mJnWGHlN_qdd8Du",
    gdrivePhotoUrl: "https://lh3.googleusercontent.com/d/1YU-yTw1JDPxzGpeA5mJnWGHlN_qdd8Du",
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
    badgeNumber: 4,
    badgeId: "VYR-TECH-004",
    cardImage: "https://lh3.googleusercontent.com/d/1O0vtuF4wnLaTcTGOJfnu5V2YUhm90Ka3",
    photoUrl: "https://lh3.googleusercontent.com/d/1xkXHC-CmQxa7YRRqsQdV4P2LT8ASLSZ0",
    gdrivePhotoUrl: "https://lh3.googleusercontent.com/d/1xkXHC-CmQxa7YRRqsQdV4P2LT8ASLSZ0",
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
    badgeNumber: 5,
    badgeId: "VYR-TECH-005",
    cardImage: "https://lh3.googleusercontent.com/d/1pZqRDEF2l8EyfnEWj62PSdU4Mr_gAruy",
    photoUrl: "https://lh3.googleusercontent.com/d/18w7chAZB8e37yZLt0UIyz897fRDFUHQn",
    gdrivePhotoUrl: "https://lh3.googleusercontent.com/d/18w7chAZB8e37yZLt0UIyz897fRDFUHQn",
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
    cardImage: "https://lh3.googleusercontent.com/d/1U7gYz9nOSSxcEGP2nab7S_BBHiyTGSxD",
    photoUrl: "https://lh3.googleusercontent.com/d/1w4we_OvmMRyv3igu4wHC8KS67Be5dUZG",
    gdrivePhotoUrl: "https://lh3.googleusercontent.com/d/1w4we_OvmMRyv3igu4wHC8KS67Be5dUZG",
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
    badgeNumber: 7,
    badgeId: "VYR-MGT-007",
    cardImage: "https://lh3.googleusercontent.com/d/1smSvA6aYdwp55e8yc91SuhboBBzGGouM",
    photoUrl: "https://lh3.googleusercontent.com/d/1fBC-BpAv4JpCSEbqzoPOBsZG1iTvTxnZ",
    gdrivePhotoUrl: "https://lh3.googleusercontent.com/d/1fBC-BpAv4JpCSEbqzoPOBsZG1iTvTxnZ",
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
    badgeNumber: 8,
    badgeId: "VYR-MGT-008",
    cardImage: "https://lh3.googleusercontent.com/d/1obdoxy-YuFUP2iqL2bCULhCeyq_NygRK",
    photoUrl: "https://lh3.googleusercontent.com/d/1QtX0SALPhFmkGLIeSWmttzP0lRYs371W",
    gdrivePhotoUrl: "https://lh3.googleusercontent.com/d/1QtX0SALPhFmkGLIeSWmttzP0lRYs371W",
    subTeam: "Management Team",
    subTeamId: "management",
    designation: "Core Organizer",
    title: "Event Operations",
    email: "singhbhavya037@gmail.com",
    linkedin: "https://www.linkedin.com/in/bhavy4-singh/",
    bio: "Oversees attendee check-in desks, hospitality, and venue flow during hackathons.",
    skills: ["Event Operations", "Hospitality", "Logistics"]
  },
  {
    id: "raza-masud",
    name: "Raza Masud",
    badgeNumber: 9,
    badgeId: "VYR-MGT-009",
    cardImage: "https://lh3.googleusercontent.com/d/1dNuQGM5ELORdRYuHdCjSU9GyL9dZ9p9T",
    photoUrl: "https://lh3.googleusercontent.com/d/1dZSuetsvZLqdnjAY6gmY0FqOJrdusC5x",
    gdrivePhotoUrl: "https://lh3.googleusercontent.com/d/1dZSuetsvZLqdnjAY6gmY0FqOJrdusC5x",
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
    badgeNumber: 10,
    badgeId: "VYR-MGT-010",
    cardImage: "https://lh3.googleusercontent.com/d/1IytkoTuKnHQTHOVDb7jC4nVonCSrmXp2",
    photoUrl: "https://lh3.googleusercontent.com/d/1KnzPI1UO4ky9TYdn-ThjOJOn_jZhjnJr",
    gdrivePhotoUrl: "https://lh3.googleusercontent.com/d/1KnzPI1UO4ky9TYdn-ThjOJOn_jZhjnJr",
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
    badgeNumber: 11,
    badgeId: "VYR-SOC-011",
    cardImage: "https://lh3.googleusercontent.com/d/1AlAS7a8yffF6cjWeyiLbP56d9iNOJhKs",
    photoUrl: "https://lh3.googleusercontent.com/d/1gLxkraumyg4tLfwYx9jo4b7Wz9tHQbte",
    gdrivePhotoUrl: "https://lh3.googleusercontent.com/d/1gLxkraumyg4tLfwYx9jo4b7Wz9tHQbte",
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
    badgeNumber: 12,
    badgeId: "VYR-SOC-012",
    cardImage: "https://lh3.googleusercontent.com/d/18KsJtFmH9Z9t45vC1-I_eX6-o9WEt2I5",
    photoUrl: "https://lh3.googleusercontent.com/d/1byM7T6DSAbtqytoKr-YTeUOWKh9HHknb",
    gdrivePhotoUrl: "https://lh3.googleusercontent.com/d/1byM7T6DSAbtqytoKr-YTeUOWKh9HHknb",
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
    badgeNumber: 13,
    badgeId: "VYR-DSG-013",
    cardImage: "https://lh3.googleusercontent.com/d/1dYQ9eFZkqX42T6g_4xsdPEzzqC0UAYod",
    photoUrl: "https://lh3.googleusercontent.com/d/1uVG9-9t5A3RLA7dW2PZLkm13W4AYZpJd",
    gdrivePhotoUrl: "https://lh3.googleusercontent.com/d/1uVG9-9t5A3RLA7dW2PZLkm13W4AYZpJd",
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
    badgeNumber: 14,
    badgeId: "VYR-DSG-014",
    cardImage: "https://lh3.googleusercontent.com/d/1qNlse82my4hPnxKInpPr3Dq7S0MUks2z",
    photoUrl: "https://lh3.googleusercontent.com/d/1FOVP89wrPNxUeZ6V_psPMdRG6EgWvKnS",
    gdrivePhotoUrl: "https://lh3.googleusercontent.com/d/1FOVP89wrPNxUeZ6V_psPMdRG6EgWvKnS",
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
