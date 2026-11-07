import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Users, Search, ArrowRight, ArrowLeft } from 'lucide-react';
import { animate, onScroll } from 'animejs';
import IdCard from './IdCard';

export default function TeamGrid({ members = [], subTeams = [] }) {
  const [activeTeamIndex, setActiveTeamIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [travelDistance, setTravelDistance] = useState(0);

  const sectionRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const boxRef = useRef(null);
  const teamAnchorRefs = useRef({});

  // The 4 core leadership teams strictly ordered
  const coreTeamIds = ['technical', 'management', 'social-media', 'design'];
  const orderedTeams = coreTeamIds
    .map((id) => subTeams.find((t) => t.id === id))
    .filter(Boolean);

  const currentTeam = orderedTeams[activeTeamIndex] || orderedTeams[0] || { id: 'technical', name: 'Technical Team' };

  // Filtered members if search is active
  const filteredSearchMembers = searchQuery.trim()
    ? members.filter((m) =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.designation && m.designation.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (m.title && m.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (m.subTeam && m.subTeam.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (m.skills && m.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())))
      )
    : null;

  // Calculate dynamic travel distance for horizontal scroll inside the team-focus-card container
  const updateTravelDistance = useCallback(() => {
    if (!trackRef.current || !boxRef.current) return;
    const isLargeScreen = window.innerWidth >= 768;
    setIsDesktop(isLargeScreen);

    if (isLargeScreen) {
      const trackWidth = trackRef.current.scrollWidth;
      const containerWidth = boxRef.current.clientWidth;
      // Exact distance required to translate all member cards across all teams inside the glass container
      const distance = Math.max(0, trackWidth - containerWidth + 48);
      setTravelDistance(distance);
      if (distance <= 0) {
        setScrollProgress(1);
      }
    } else {
      setTravelDistance(0);
      if (trackRef.current) {
        trackRef.current.style.transform = 'none';
      }
    }
  }, []);

  // Exit threshold (600px hold runway) so the pinned section does not snap away easily
  const EXIT_THRESHOLD = 600;

  // Anime.js v4 onScroll: Continuous Multi-Team Horizontal Scroll with Exit Buffer
  useEffect(() => {
    updateTravelDistance();

    if (!isDesktop || travelDistance <= 0 || !sectionRef.current || !trackRef.current) {
      return;
    }

    const totalDistance = travelDistance + EXIT_THRESHOLD;
    const transRatio = travelDistance / totalDistance;

    // 1. Create horizontal translation animation
    const teamAnimation = animate(trackRef.current, {
      translateX: -travelDistance,
      ease: 'linear',
      autoplay: false,
    });

    // 2. Bind directly to vertical scroll via Anime.js v4 onScroll
    const scrollObserver = onScroll({
      target: sectionRef.current,
      sync: 0.18, // Smooth lerp damping
      enter: 'top top',
      leave: 'bottom bottom',
      onUpdate: (self) => {
        // Translation smoothly completes over [0, transRatio] then holds at 1.0 for the exit buffer
        const clampedProgress = Math.min(1, self.progress / transRatio);
        teamAnimation.progress = clampedProgress;
        setScrollProgress(clampedProgress);

        // Dynamically detect which team is currently in view as user scrolls
        if (!searchQuery && trackRef.current && teamAnchorRefs.current) {
          const currentX = clampedProgress * travelDistance;
          let matchedIdx = 0;
          for (let i = orderedTeams.length - 1; i >= 0; i--) {
            const team = orderedTeams[i];
            const anchorEl = teamAnchorRefs.current[team.id];
            if (anchorEl && anchorEl.offsetLeft - 160 <= currentX) {
              matchedIdx = i;
              break;
            }
          }
          setActiveTeamIndex((prev) => (prev !== matchedIdx ? matchedIdx : prev));
        }
      },
    });

    // 3. Dynamic ResizeObserver observing container and track bounds
    const resizeObserver = new ResizeObserver(() => {
      updateTravelDistance();
    });
    resizeObserver.observe(sectionRef.current);
    if (trackRef.current) resizeObserver.observe(trackRef.current);
    if (boxRef.current) resizeObserver.observe(boxRef.current);

    return () => {
      if (scrollObserver && typeof scrollObserver.revert === 'function') {
        scrollObserver.revert();
      }
      resizeObserver.disconnect();
    };
  }, [isDesktop, travelDistance, searchQuery, updateTravelDistance]);

  // Mobile passive scroll listener for the progress bar & active team detection
  const handleMobileScroll = useCallback(() => {
    const trackEl = trackRef.current;
    if (!trackEl || isDesktop) return;

    const maxScroll = trackEl.scrollWidth - trackEl.clientWidth;
    if (maxScroll <= 4) {
      setScrollProgress(1);
    } else {
      const current = trackEl.scrollLeft;
      if (current >= maxScroll - 6) {
        setScrollProgress(1);
      } else {
        setScrollProgress(Math.min(Math.max(current / maxScroll, 0), 1));
      }

      // Mobile active team detection
      if (!searchQuery && teamAnchorRefs.current) {
        let matchedIdx = 0;
        for (let i = orderedTeams.length - 1; i >= 0; i--) {
          const team = orderedTeams[i];
          const anchorEl = teamAnchorRefs.current[team.id];
          if (anchorEl && anchorEl.offsetLeft - 120 <= current) {
            matchedIdx = i;
            break;
          }
        }
        setActiveTeamIndex((prev) => (prev !== matchedIdx ? matchedIdx : prev));
      }
    }
  }, [isDesktop, searchQuery]);

  // Smooth scroll / jump directly to any team
  const scrollToTeam = (index) => {
    const boundedIdx = Math.max(0, Math.min(index, orderedTeams.length - 1));
    setActiveTeamIndex(boundedIdx);
    const targetTeam = orderedTeams[boundedIdx];
    if (!targetTeam) return;

    const anchorEl = teamAnchorRefs.current[targetTeam.id];
    if (isDesktop && travelDistance > 0 && sectionRef.current) {
      const targetOffset = anchorEl ? anchorEl.offsetLeft : 0;
      const targetRatio = Math.min(1, Math.max(0, targetOffset / travelDistance));
      const sectionTop = sectionRef.current.getBoundingClientRect().top + window.scrollY;
      const totalDistance = travelDistance + EXIT_THRESHOLD;
      const transRatio = travelDistance / totalDistance;
      const targetScrollY = sectionTop + (targetRatio * transRatio) * totalDistance;
      window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
    } else if (anchorEl) {
      anchorEl.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    }
  };

  const handlePrevTeam = () => {
    const nextIdx = activeTeamIndex > 0 ? activeTeamIndex - 1 : orderedTeams.length - 1;
    scrollToTeam(nextIdx);
  };

  const handleNextTeam = () => {
    const nextIdx = activeTeamIndex < orderedTeams.length - 1 ? activeTeamIndex + 1 : 0;
    scrollToTeam(nextIdx);
  };

  return (
    <section
      id="team"
      ref={sectionRef}
      className="relative w-full text-slate-100"
      style={{
        // Desktop: tall runway so vertical scroll drives horizontal card movement + 600px exit buffer
        // Mobile: natural auto height
        height: isDesktop && travelDistance > 0 ? `calc(100vh + ${travelDistance + EXIT_THRESHOLD}px)` : 'auto',
      }}
    >
      {/* Anchor targets for hash routing #teams and #team */}
      <div id="teams" className="absolute -top-24 pointer-events-none" />

      {/* STICKY VIEWPORT: Pinned to top of screen on Desktop; natural flow on Mobile */}
      <div
        ref={viewportRef}
        className={`w-full overflow-hidden ${
          isDesktop
            ? 'sticky top-0 h-screen flex flex-col justify-center'
            : 'relative py-6 sm:py-8'
        }`}
      >
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">

          {/* Outer Eyebrow */}
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

          {/* INNER GLASS CONTAINER: Strictly clips all extra cards outside the box */}
          <div
            id="team-focus-card"
            ref={boxRef}
            className="liquid-glass rounded-3xl p-4 sm:p-7 relative flex flex-col justify-between shadow-2xl overflow-hidden border border-white/10"
          >
            {/* Top Controls: Team Switcher Tabs + Search & Team Arrows */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 pb-4 border-b border-white/10">

              {/* Team Switcher Tabs */}
              <div className="flex flex-wrap items-center gap-2">
                {orderedTeams.map((team, idx) => {
                  const teamCount = members.filter(
                    (m) => m.subTeamId === team.id || m.subTeam.toLowerCase() === team.name.toLowerCase()
                  ).length;
                  const isActive = idx === activeTeamIndex && !searchQuery;

                  return (
                    <button
                      key={team.id}
                      type="button"
                      onClick={() => { setSearchQuery(''); scrollToTeam(idx); }}
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
                      onClick={handlePrevTeam}
                      className="p-1.5 rounded-lg bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                      aria-label="Previous Team"
                      title="Previous Team"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextTeam}
                      className="p-1.5 rounded-lg bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                      aria-label="Next Team"
                      title="Next Team"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Team Info Row (Desktop only, hidden during search) */}
            {!searchQuery && (
              <div className="flex items-start justify-between gap-4 py-3 border-b border-white/5">
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-1.5 mb-1">
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400 font-semibold">
                      Department {String(activeTeamIndex + 1).padStart(2, '0')} · {currentTeam.name}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-zinc-400 leading-relaxed max-w-xl truncate">
                    {currentTeam.description}
                  </p>
                </div>

                {!searchQuery && activeTeamIndex < orderedTeams.length - 1 && (
                  <button
                    type="button"
                    onClick={() => scrollToTeam(activeTeamIndex + 1)}
                    className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer group shrink-0"
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

            {/* ID CARDS TRACK: One continuous track for all teams clipped safely inside glass container */}
            <div
              ref={trackRef}
              onScroll={handleMobileScroll}
              className={`flex gap-5 will-change-transform pt-3 pb-2 items-center ${
                isDesktop
                  ? 'w-max pl-1 sm:pl-2'
                  : 'w-full overflow-x-auto px-1 no-scrollbar snap-x snap-mandatory touch-pan-x'
              }`}
              style={{
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {searchQuery ? (
                // Search Mode: Display all matched members
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
              ) : (
                // Continuous Multi-Team Sequence: Technical → Management → Social Media → Design
                // All 14 cards in one flat track, NO separate containers per team
                orderedTeams.map((team, teamIdx) => {
                  const teamMembers = members.filter(
                    (m) => m.subTeamId === team.id || m.subTeam.toLowerCase() === team.name.toLowerCase()
                  );

                  return (
                    <React.Fragment key={team.id}>
                      {/* Department Divider Card — anchor point for scrollToTeam (teams after first) */}
                      {teamIdx > 0 && (
                        <div
                          ref={(el) => (teamAnchorRefs.current[team.id] = el)}
                          className="w-[220px] sm:w-[240px] shrink-0 h-[435px] sm:h-[455px] rounded-2xl border border-dashed border-emerald-500/30 bg-emerald-950/20 backdrop-blur-sm flex flex-col justify-between p-5 text-left select-none relative overflow-hidden group hover:border-emerald-500/60 transition-colors snap-start"
                        >
                          <div className="space-y-3">
                            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                              <Users className="w-4.5 h-4.5" />
                            </div>
                            <span className="inline-block font-mono text-[10px] uppercase tracking-widest text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                              Dept {String(teamIdx + 1).padStart(2, '0')}
                            </span>
                            <h3 className="font-display font-extrabold text-lg text-white leading-tight">
                              {team.name}
                            </h3>
                            <p className="font-mono text-xs text-zinc-400 leading-relaxed line-clamp-4">
                              {team.description}
                            </p>
                          </div>

                          <div className="pt-3 border-t border-white/10 flex items-center justify-between font-mono text-xs text-emerald-400">
                            <span>{teamMembers.length} members</span>
                            <ArrowRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      )}

                      {/* Team Member Cards */}
                      {teamMembers.map((member, mIdx) => (
                        <div
                          key={member.id}
                          ref={
                            teamIdx === 0 && mIdx === 0
                              ? (el) => (teamAnchorRefs.current[team.id] = el)
                              : null
                          }
                          className="shrink-0 snap-start"
                        >
                          <IdCard member={member} />
                        </div>
                      ))}
                    </React.Fragment>
                  );
                })
              )}
            </div>

            {/* Bottom: Progress Bar & Quick Team Navigation */}
            <div className="mt-3 pt-3.5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Progress bar */}
              <div className="flex items-center gap-3 w-full sm:w-80">
                <div className="flex-1 h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-150"
                    style={{
                      width: `${scrollProgress >= 0.98 ? 100 : Math.max(Math.round(scrollProgress * 100), 10)}%`,
                    }}
                  />
                </div>
                <span className="font-mono text-[10px] text-zinc-400 whitespace-nowrap">
                  {Math.round(scrollProgress * 100)}% SEEN
                </span>
              </div>

              {/* Prev / Next Team quick buttons */}
              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
                <button
                  type="button"
                  disabled={activeTeamIndex === 0}
                  onClick={() => scrollToTeam(activeTeamIndex - 1)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 text-xs font-mono text-zinc-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Prev team</span>
                </button>

                <button
                  type="button"
                  disabled={activeTeamIndex === orderedTeams.length - 1}
                  onClick={() => scrollToTeam(activeTeamIndex + 1)}
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
