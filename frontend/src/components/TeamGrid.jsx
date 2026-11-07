import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Users, Search, ArrowRight, Sparkles } from 'lucide-react';
import IdCard from './IdCard';

export default function TeamGrid({ members = [], subTeams = [] }) {
  const [activeTeamId, setActiveTeamId] = useState('technical');
  const [searchQuery, setSearchQuery] = useState('');

  const carouselRefs = useRef({});
  const departmentRefs = useRef({});

  // The 4 core leadership teams strictly ordered
  const coreTeamIds = ['technical', 'management', 'social-media', 'design'];
  const orderedTeams = coreTeamIds
    .map((id) => subTeams.find((t) => t.id === id))
    .filter(Boolean);

  // Filtered members if global search is active
  const filteredSearchMembers = searchQuery.trim()
    ? members.filter((m) =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.designation && m.designation.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (m.title && m.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (m.subTeam && m.subTeam.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (m.skills && m.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())))
      )
    : null;

  // Smooth scroll directly to a specific team's section
  const scrollToDepartment = useCallback((teamId) => {
    setActiveTeamId(teamId);
    const targetEl = departmentRefs.current[teamId] || document.getElementById(`team-${teamId}`);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Update hash cleanly without polluting history
      window.history.replaceState(null, '', `#teams-${teamId}`);
    }
  }, []);

  // Smooth horizontal scroll for a team's card carousel
  const scrollCarousel = (teamId, direction) => {
    const el = carouselRefs.current[teamId];
    if (!el) return;
    const scrollAmount = Math.max(300, el.clientWidth * 0.75);
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  // Dynamic Scroll-Spy: Highlight the active department tab as the user scrolls naturally down the page
  useEffect(() => {
    if (searchQuery) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const teamId = entry.target.getAttribute('data-team-id');
            if (teamId) {
              setActiveTeamId(teamId);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '-20% 0px -55% 0px',
        threshold: 0.1,
      }
    );

    orderedTeams.forEach((team) => {
      const el = departmentRefs.current[team.id];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [orderedTeams, searchQuery]);

  // Handle subteam routing via URL hash on mount or hashchange (e.g. #teams-management)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      const match = hash.match(/^#(?:teams?)[-_]([a-z0-9_-]+)$/);
      if (match && match[1]) {
        const subId = match[1];
        if (orderedTeams.some((t) => t.id === subId)) {
          setTimeout(() => scrollToDepartment(subId), 150);
        }
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [orderedTeams, scrollToDepartment]);

  return (
    <section id="team" className="relative w-full text-slate-100 pt-10 pb-16 sm:pb-24">
      {/* Anchor targets for #teams and #team */}
      <div id="teams" className="absolute -top-24 pointer-events-none" />

      {/* Outer Section Eyebrow Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
          <div className="inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">
              Club Leadership Directory
            </span>
          </div>
          <div className="font-mono text-xs text-zinc-500">
            VOYAGER // {members.length} CORE LEADERSHIP MEMBERS
          </div>
        </div>
      </div>

      {/* Sticky Department Filter Navigation & Global Search Bar */}
      <div className="sticky top-16 sm:top-20 z-30 backdrop-blur-xl bg-black/80 border-y border-white/10 py-3 mb-8 sm:mb-12 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Department Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            {orderedTeams.map((team, idx) => {
              const teamCount = members.filter(
                (m) => m.subTeamId === team.id || m.subTeam.toLowerCase() === team.name.toLowerCase()
              ).length;
              const isActive = activeTeamId === team.id && !searchQuery;

              return (
                <button
                  key={team.id}
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    scrollToDepartment(team.id);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg font-mono text-xs tracking-wider transition-all border whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500 text-black border-emerald-500 font-bold shadow-[0_0_12px_rgba(0,255,136,0.35)]'
                      : 'bg-zinc-950 text-zinc-300 border-white/10 hover:border-white/25 hover:text-white'
                  }`}
                >
                  {team.name.toUpperCase()} ({teamCount})
                </button>
              );
            })}
          </div>

          {/* Search Input across all teams */}
          <div className="relative w-full md:w-64 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search member, role, skill..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-zinc-950 border border-white/10 text-xs font-mono text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-500 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Body: Search Results OR Distinct Department Sections */}
      {searchQuery ? (
        // ── Search Results View ──
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="liquid-glass rounded-3xl p-5 sm:p-7 shadow-2xl border border-white/10">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div>
                <h3 className="font-display font-extrabold text-2xl text-white">
                  Search Results
                </h3>
                <p className="font-mono text-xs text-zinc-400 mt-1">
                  Found {filteredSearchMembers.length} members matching "{searchQuery}"
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="px-3 py-1 rounded-lg bg-zinc-900 border border-white/10 font-mono text-xs text-zinc-300 hover:text-white"
              >
                Clear Search
              </button>
            </div>

            {filteredSearchMembers.length > 0 ? (
              <div className="flex flex-wrap gap-5 justify-center sm:justify-start">
                {filteredSearchMembers.map((member) => (
                  <div key={member.id} className="shrink-0">
                    <IdCard member={member} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center text-zinc-500 font-mono text-xs">
                No team members match "{searchQuery}". Try another keyword or role.
              </div>
            )}
          </div>
        </div>
      ) : (
        // ── Distinct, Dedicated Sections for Each Department (Smooth Continuous Scroll) ──
        <div className="space-y-12 sm:space-y-16">
          {orderedTeams.map((team, teamIdx) => {
            const teamMembers = members.filter(
              (m) => m.subTeamId === team.id || m.subTeam.toLowerCase() === team.name.toLowerCase()
            );

            return (
              <div
                id={`team-${team.id}`}
                key={team.id}
                data-team-id={team.id}
                ref={(el) => (departmentRefs.current[team.id] = el)}
                className="scroll-mt-32 sm:scroll-mt-36 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
              >
                {/* Secondary anchor target matching #teams-technical, #teams-management etc */}
                <div id={`teams-${team.id}`} className="absolute -top-32 pointer-events-none" />

                {/* Distinct Department Glass Container */}
                <div className="liquid-glass rounded-3xl p-5 sm:p-7 shadow-2xl border border-white/10 relative overflow-hidden transition-all duration-300">
                  
                  {/* Department Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/10 mb-2">
                        <Users className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="font-mono text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                          Department 0{teamIdx + 1} • {team.name}
                        </span>
                      </div>
                      <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                        {team.name}
                      </h3>
                      <p className="font-sans text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
                        {team.description}
                      </p>
                    </div>

                    {/* Member Count & Carousel Navigation Chevrons */}
                    <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
                      <span className="font-mono text-xs px-3 py-1 rounded-full bg-zinc-900 text-emerald-400 border border-white/10 font-semibold">
                        {teamMembers.length} members
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => scrollCarousel(team.id, 'left')}
                          className="p-1.5 rounded-lg bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                          aria-label={`Scroll ${team.name} left`}
                          title="Scroll left"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => scrollCarousel(team.id, 'right')}
                          className="p-1.5 rounded-lg bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                          aria-label={`Scroll ${team.name} right`}
                          title="Scroll right"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Dedicated Member Cards Track for this Team (No Switch Cards, Zero State Collisions) */}
                  <div
                    ref={(el) => (carouselRefs.current[team.id] = el)}
                    className="flex gap-5 overflow-x-auto pt-4 pb-3 px-2 no-scrollbar scroll-smooth snap-x snap-mandatory touch-pan-x"
                    style={{
                      WebkitOverflowScrolling: 'touch',
                    }}
                  >
                    {teamMembers.map((member) => (
                      <div key={member.id} className="shrink-0 snap-start">
                        <IdCard member={member} />
                      </div>
                    ))}
                  </div>

                  {/* Department Footer Quick Navigation to Next Department */}
                  {teamIdx < orderedTeams.length - 1 && (
                    <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-zinc-500">
                      <span>VOYAGER // DEPARTMENT 0{teamIdx + 1}</span>
                      <button
                        type="button"
                        onClick={() => scrollToDepartment(orderedTeams[teamIdx + 1].id)}
                        className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-emerald-400 transition-colors cursor-pointer group"
                      >
                        <span>Next department:</span>
                        <span className="text-zinc-200 group-hover:text-emerald-400 font-semibold">
                          {orderedTeams[teamIdx + 1].name}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
