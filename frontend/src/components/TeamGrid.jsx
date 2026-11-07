import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Users, Search, ArrowRight, ArrowLeft } from 'lucide-react';
import { onScroll } from 'animejs';
import IdCard from './IdCard';

export default function TeamGrid({ members = [], subTeams = [] }) {
  const [activeTeamIndex, setActiveTeamIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDesktop, setIsDesktop] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 768);

  const sectionRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const boxRef = useRef(null);

  // Total runway in px for desktop pinned vertical scroll
  const TOTAL_RUNWAY = 2200;

  // Normalized progress boundaries [0, 1] for the 4 core teams
  const SEG_BOUNDS = [0.0, 0.26, 0.52, 0.72];

  const activeTeamIndexRef = useRef(activeTeamIndex);
  activeTeamIndexRef.current = activeTeamIndex;

  // The 4 core leadership teams strictly ordered (memoized to keep stable reference)
  const orderedTeams = useMemo(() => {
    const coreTeamIds = ['technical', 'management', 'social-media', 'design'];
    return coreTeamIds
      .map((id) => subTeams.find((t) => t.id === id))
      .filter(Boolean);
  }, [subTeams]);

  const currentTeam = orderedTeams[activeTeamIndex] || orderedTeams[0] || { id: 'technical', name: 'Technical Team' };

  // Members belonging ONLY to the currently active team
  const currentMembers = members.filter(
    (m) => m.subTeamId === currentTeam.id || (m.subTeam && m.subTeam.toLowerCase() === currentTeam.name.toLowerCase())
  );

  // Global search across all members
  const isSearching = Boolean(searchQuery.trim());
  const filteredSearchMembers = isSearching
    ? members.filter((m) =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.designation && m.designation.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (m.title && m.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (m.subTeam && m.subTeam.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (m.skills && m.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())))
      )
    : [];

  // Track responsive breakpoint
  useEffect(() => {
    const checkScreen = () => {
      const isLarge = window.innerWidth >= 768;
      setIsDesktop(isLarge);
      if (!isLarge && trackRef.current) {
        trackRef.current.style.transform = 'none';
      }
    };
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  // Smooth scroll / jump directly to any team
  const scrollToTeam = useCallback((index) => {
    const boundedIdx = Math.max(0, Math.min(index, orderedTeams.length - 1));
    const isTeamChange = boundedIdx !== activeTeamIndexRef.current;
    activeTeamIndexRef.current = boundedIdx;
    setActiveTeamIndex(boundedIdx);

    const targetTeam = orderedTeams[boundedIdx];
    if (targetTeam && window.location.hash.includes('team')) {
      window.history.replaceState(null, '', `#teams-${targetTeam.id}`);
    }

    if (window.innerWidth >= 768 && sectionRef.current) {
      const targetRatio = SEG_BOUNDS[boundedIdx] + 0.02;
      const sectionTop = sectionRef.current.getBoundingClientRect().top + window.scrollY;
      const targetScrollY = sectionTop + targetRatio * TOTAL_RUNWAY;
      window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
    } else if (trackRef.current && isTeamChange) {
      trackRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, [orderedTeams, TOTAL_RUNWAY]);

  // Anime.js v4 onScroll: Desktop vertical scroll maps sequentially across teams
  useEffect(() => {
    if (!isDesktop || !sectionRef.current) return;

    const scrollObserver = onScroll({
      target: sectionRef.current,
      sync: 0.18, // Smooth lerp damping
      enter: 'top top',
      leave: 'bottom bottom',
      onUpdate: (self) => {
        const p = self.progress;
        setScrollProgress(p);

        // Calculate which team is active based on normalized scroll progress
        let idx = 0;
        let teamP = 0;

        if (p >= SEG_BOUNDS[3]) {
          // Team 3: Design Team (Guaranteed to pop ON and stay ON throughout final stage)
          idx = 3;
          teamP = Math.min(1, Math.max(0, (p - SEG_BOUNDS[3]) / 0.18));
        } else if (p >= SEG_BOUNDS[2]) {
          // Team 2: Social Media Team
          idx = 2;
          teamP = Math.min(1, Math.max(0, (p - SEG_BOUNDS[2]) / 0.15));
        } else if (p >= SEG_BOUNDS[1]) {
          // Team 1: Management Team
          idx = 1;
          teamP = Math.min(1, Math.max(0, (p - SEG_BOUNDS[1]) / 0.21));
        } else {
          // Team 0: Technical Team
          idx = 0;
          teamP = Math.min(1, Math.max(0, p / 0.21));
        }

        if (activeTeamIndexRef.current !== idx) {
          activeTeamIndexRef.current = idx;
          setActiveTeamIndex(idx);
        }

        // Translate the active team's member cards horizontally
        const trackEl = trackRef.current;
        const boxEl = boxRef.current;
        if (trackEl && boxEl) {
          const maxTravel = Math.max(0, trackEl.scrollWidth - boxEl.clientWidth + 48);
          const translateX = -teamP * maxTravel;
          trackEl.style.transform = `translateX(${translateX}px)`;
        }
      },
    });

    return () => {
      if (scrollObserver && typeof scrollObserver.revert === 'function') {
        scrollObserver.revert();
      }
    };
  }, [isDesktop, TOTAL_RUNWAY]);

  // Handle URL hash changes (e.g. #teams-design or #teams-management)
  useEffect(() => {
    let timeoutId;
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      const match = hash.match(/^#(?:teams?)[-_]([a-z0-9_-]+)$/);
      if (match && match[1]) {
        const subId = match[1];
        const teamIdx = orderedTeams.findIndex((t) => t.id === subId);
        if (teamIdx >= 0 && teamIdx !== activeTeamIndexRef.current) {
          timeoutId = setTimeout(() => scrollToTeam(teamIdx), 100);
        }
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener('hashchange', handleHash);
    };
  }, [orderedTeams, scrollToTeam]);

  // Mobile passive horizontal scroll listener for the Seen/Progress bar
  const handleMobileScroll = useCallback(() => {
    const trackEl = trackRef.current;
    if (!trackEl || isDesktop) return;

    const maxScroll = trackEl.scrollWidth - trackEl.clientWidth;
    if (maxScroll <= 4) {
      setScrollProgress(1);
    } else {
      setScrollProgress(Math.min(Math.max(trackEl.scrollLeft / maxScroll, 0), 1));
    }
  }, [isDesktop]);

  const handlePrevTeam = () => {
    if (activeTeamIndex > 0) {
      scrollToTeam(activeTeamIndex - 1);
    }
  };

  const handleNextTeam = () => {
    if (activeTeamIndex < orderedTeams.length - 1) {
      scrollToTeam(activeTeamIndex + 1);
    }
  };

  return (
    <section
      id="team"
      ref={sectionRef}
      className="relative w-full text-slate-100 snap-start scroll-mt-0"
      style={{
        height: isDesktop ? `calc(100vh + ${TOTAL_RUNWAY}px)` : 'auto',
      }}
    >
      {/* Anchor targets for hash routing #teams and #team */}
      <div id="teams" className="absolute -top-24 pointer-events-none" />

      {/* STICKY VIEWPORT: Pinned at top of screen on Desktop; natural flow on Mobile */}
      <div
        ref={viewportRef}
        className={`w-full overflow-hidden ${
          isDesktop
            ? 'sticky top-0 h-screen flex flex-col justify-center'
            : 'relative py-6 sm:py-8'
        }`}
      >
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">

          {/* Outer Eyebrow Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 px-1 gap-2">
            <div className="inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">
                Club Leadership Directory
              </span>
            </div>
            <div className="font-mono text-xs text-zinc-500">
              {isDesktop ? 'SCROLL DOWN TO ADVANCE THROUGH ALL TEAMS ➔' : 'VOYAGER // CORE LEADERSHIP'}
            </div>
          </div>

          {/* SINGLE INNER GLASS CONTAINER FOR ALL TEAMS */}
          <div
            id="team-focus-card"
            ref={boxRef}
            className="liquid-glass rounded-3xl p-4 sm:p-7 relative flex flex-col justify-between shadow-2xl overflow-hidden border border-white/10"
          >
            {/* Top Controls: Team Switcher Tabs + Search & Team Arrows */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 pb-4 border-b border-white/10">

              {/* Team Switcher Tabs (Technical, Management, Social Media, Design) */}
              <div className="flex flex-wrap items-center gap-2">
                {orderedTeams.map((team, idx) => {
                  const teamCount = members.filter(
                    (m) => m.subTeamId === team.id || (m.subTeam && m.subTeam.toLowerCase() === team.name.toLowerCase())
                  ).length;
                  const isActive = idx === activeTeamIndex && !isSearching;

                  return (
                    <button
                      key={team.id}
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        scrollToTeam(idx);
                        if (!isDesktop && trackRef.current && idx === activeTeamIndex) {
                          trackRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                        }
                      }}
                      className={`px-3.5 py-1.5 rounded-lg font-mono text-xs tracking-wider transition-all border cursor-pointer ${
                        isActive
                          ? 'bg-emerald-500 text-black border-emerald-500 font-bold shadow-sm'
                          : 'bg-zinc-950 text-zinc-300 border-white/10 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      {team.name.toUpperCase()} ({teamCount})
                    </button>
                  );
                })}
              </div>

              {/* Search Input & Team Navigation Arrows */}
              <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
                <div className="relative w-44 sm:w-56">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search member or role..."
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

                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-zinc-400 whitespace-nowrap">
                    {activeTeamIndex + 1}/{orderedTeams.length}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={activeTeamIndex === 0}
                      onClick={handlePrevTeam}
                      className="p-1.5 rounded-lg bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                      aria-label="Previous Team"
                      title="Previous Team"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={activeTeamIndex === orderedTeams.length - 1}
                      onClick={handleNextTeam}
                      className="p-1.5 rounded-lg bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                      aria-label="Next Team"
                      title="Next Team"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Team Headline & Mission Description */}
            {!isSearching && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 pb-2 border-b border-white/5">
                <div>
                  <div className="inline-flex items-center gap-2 mb-1">
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400 font-semibold">
                      Department {String(activeTeamIndex + 1).padStart(2, '0')} · {currentTeam.name}
                    </span>
                  </div>
                  <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                    {currentTeam.name}
                  </h2>
                  <p className="font-sans text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
                    {currentTeam.description}
                  </p>
                </div>

                {activeTeamIndex < orderedTeams.length - 1 && (
                  <button
                    type="button"
                    onClick={() => scrollToTeam(activeTeamIndex + 1)}
                    className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer group shrink-0 self-start sm:self-auto"
                  >
                    <span>Next:</span>
                    <span className="text-zinc-200 group-hover:text-emerald-400 font-semibold transition-colors">
                      {orderedTeams[activeTeamIndex + 1].name}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>
            )}

            {/* ID CARDS TRACK: Native smooth horizontal scrolling on mobile; Anime.js translate on desktop */}
            <div
              ref={trackRef}
              onScroll={handleMobileScroll}
              className={`flex gap-5 pt-3 pb-2 items-center ${
                isDesktop
                  ? 'w-max pl-1 sm:pl-2 will-change-transform'
                  : 'w-full overflow-x-auto px-1 no-scrollbar'
              }`}
              style={{
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {isSearching ? (
                filteredSearchMembers.length > 0 ? (
                  filteredSearchMembers.map((member) => (
                    <div key={member.id} className="shrink-0">
                      <IdCard member={member} />
                    </div>
                  ))
                ) : (
                  <div className="py-16 px-8 text-center text-zinc-500 font-mono text-xs w-full min-w-[320px]">
                    No members match your search &ldquo;{searchQuery}&rdquo;.
                  </div>
                )
              ) : currentMembers.length > 0 ? (
                currentMembers.map((member) => (
                  <div key={member.id} className="shrink-0">
                    <IdCard member={member} />
                  </div>
                ))
              ) : (
                <div className="py-16 px-8 text-center text-zinc-500 font-mono text-xs w-full min-w-[320px]">
                  No members currently registered in this department.
                </div>
              )}
            </div>

            {/* Bottom: Seen/Progress Bar & Quick Team Navigation */}
            <div className="mt-3 pt-3.5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Progress bar */}
              <div className="flex items-center gap-3 w-full sm:w-80">
                <div className="flex-1 h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-150"
                    style={{
                      width: isDesktop
                        ? `${scrollProgress >= 0.98 ? 100 : Math.max(Math.round(scrollProgress * 100), 10)}%`
                        : `${Math.round(((activeTeamIndex + 1) / orderedTeams.length) * 100)}%`,
                    }}
                  />
                </div>
                <span className="font-mono text-[10px] text-zinc-400 whitespace-nowrap">
                  {isDesktop
                    ? `${Math.round(scrollProgress * 100)}% SEEN`
                    : `TEAM ${activeTeamIndex + 1} OF ${orderedTeams.length}`}
                </span>
              </div>

              {/* Prev / Next Team quick buttons */}
              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
                <button
                  type="button"
                  disabled={activeTeamIndex === 0}
                  onClick={handlePrevTeam}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 text-xs font-mono text-zinc-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Prev team</span>
                </button>

                <button
                  type="button"
                  disabled={activeTeamIndex === orderedTeams.length - 1}
                  onClick={handleNextTeam}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 text-xs font-mono text-zinc-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                >
                  <span>Next team</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
