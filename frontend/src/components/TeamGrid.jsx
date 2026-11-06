import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Users, Search, ArrowRight, ArrowLeft } from 'lucide-react';
import IdCard from './IdCard';

export default function TeamGrid({ members = [], subTeams = [] }) {
  const [activeTeamIndex, setActiveTeamIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const trackRef = useRef(null);
  const boxRef = useRef(null);

  // The 4 core leadership teams strictly ordered
  const coreTeamIds = ['technical', 'management', 'social-media', 'design'];
  const orderedTeams = coreTeamIds
    .map(id => subTeams.find(t => t.id === id))
    .filter(Boolean);

  const currentTeam = orderedTeams[activeTeamIndex] || orderedTeams[0] || { id: 'technical', name: 'Technical Team' };

  // Members of the currently active team
  let currentMembers = members.filter(
    (m) => m.subTeamId === currentTeam.id || m.subTeam.toLowerCase() === currentTeam.name.toLowerCase()
  );

  if (searchQuery) {
    currentMembers = currentMembers.filter((m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.designation && m.designation.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (m.skills && m.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())))
    );
  }

  // Updates seen/loading progress line to 100% on PC/wider screens and when scrolled
  const updateScrollProgress = useCallback(() => {
    const trackEl = trackRef.current;
    if (!trackEl) return;

    const maxScroll = trackEl.scrollWidth - trackEl.clientWidth;
    if (maxScroll <= 4) {
      // All cards fit comfortably in view (wide screen / small team) -> 100% seen
      setScrollProgress(1);
    } else {
      const current = trackEl.scrollLeft;
      if (current >= maxScroll - 6) {
        setScrollProgress(1);
      } else {
        setScrollProgress(Math.min(Math.max(current / maxScroll, 0), 1));
      }
    }
  }, []);

  // Handle wheel-driven horizontal scroll and team switching with Touchpad calibration
  useEffect(() => {
    const trackEl = trackRef.current;
    if (!trackEl) return;

    updateScrollProgress();

    let isSwitching = false;
    let edgeAccumulator = 0;
    let lastSwitchTime = 0;
    const EDGE_SWITCH_THRESHOLD = 140;
    const SWITCH_COOLDOWN = 600;

    const onWheel = (e) => {
      // Allow native horizontal swipe gestures from touchpad
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        return;
      }

      // Ignore trivial noise
      if (Math.abs(e.deltaY) < 3) return;

      const isScrollingDown = e.deltaY > 0;
      const isScrollingUp = e.deltaY < 0;

      const maxScrollLeft = trackEl.scrollWidth - trackEl.clientWidth;
      const atRightEnd = maxScrollLeft <= 4 || Math.ceil(trackEl.scrollLeft) >= maxScrollLeft - 6;
      const atLeftEnd = trackEl.scrollLeft <= 6;

      // Touchpad detection: continuous sub-integer/pixel delta
      const isTouchpad = e.deltaMode === 0 && Math.abs(e.deltaY) < 65;

      // 1. Horizontal scroll within current team cards
      if (isScrollingDown && !atRightEnd) {
        e.preventDefault();
        edgeAccumulator = 0;
        if (isTouchpad) {
          trackEl.scrollLeft += e.deltaY;
        } else {
          trackEl.scrollBy({ left: e.deltaY * 1.2, behavior: 'smooth' });
        }
        return;
      }

      if (isScrollingUp && !atLeftEnd) {
        e.preventDefault();
        edgeAccumulator = 0;
        if (isTouchpad) {
          trackEl.scrollLeft += e.deltaY;
        } else {
          trackEl.scrollBy({ left: e.deltaY * 1.2, behavior: 'smooth' });
        }
        return;
      }

      // 2. At right edge:
      // If at the last team (Design Team), do NOT preventDefault -> let user scroll to Footer!
      if (isScrollingDown && atRightEnd) {
        if (activeTeamIndex >= orderedTeams.length - 1) {
          // Release scroll lock: allow natural page scroll into footer
          return;
        }

        // Between teams: intentional scroll switches to next team
        const now = Date.now();
        if (now - lastSwitchTime < SWITCH_COOLDOWN) {
          return;
        }

        edgeAccumulator += e.deltaY;
        if (edgeAccumulator >= EDGE_SWITCH_THRESHOLD && !isSwitching) {
          isSwitching = true;
          lastSwitchTime = now;
          edgeAccumulator = 0;
          setActiveTeamIndex((prev) => Math.min(prev + 1, orderedTeams.length - 1));
          setTimeout(() => {
            if (trackEl) trackEl.scrollLeft = 0;
            isSwitching = false;
          }, 80);
        }
        return;
      }

      // 3. At left edge:
      // If at the first team (Technical Team), do NOT preventDefault -> let user scroll to Events!
      if (isScrollingUp && atLeftEnd) {
        if (activeTeamIndex === 0) {
          // Release scroll lock: allow natural page scroll back up
          return;
        }

        const now = Date.now();
        if (now - lastSwitchTime < SWITCH_COOLDOWN) {
          return;
        }

        edgeAccumulator += e.deltaY;
        if (edgeAccumulator <= -EDGE_SWITCH_THRESHOLD && !isSwitching) {
          isSwitching = true;
          lastSwitchTime = now;
          edgeAccumulator = 0;
          setActiveTeamIndex((prev) => Math.max(prev - 1, 0));
          setTimeout(() => {
            if (trackEl) trackEl.scrollLeft = trackEl.scrollWidth;
            isSwitching = false;
          }, 80);
        }
        return;
      }

      edgeAccumulator = 0;
    };

    trackEl.addEventListener('wheel', onWheel, { passive: false });
    trackEl.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('resize', updateScrollProgress, { passive: true });

    const rafId = requestAnimationFrame(updateScrollProgress);

    return () => {
      cancelAnimationFrame(rafId);
      trackEl.removeEventListener('wheel', onWheel);
      trackEl.removeEventListener('scroll', updateScrollProgress);
      window.removeEventListener('resize', updateScrollProgress);
    };
  }, [activeTeamIndex, orderedTeams.length, updateScrollProgress]);

  const handleTeamChange = (index) => {
    setActiveTeamIndex(index);
    if (trackRef.current) {
      trackRef.current.scrollLeft = 0;
    }
    requestAnimationFrame(updateScrollProgress);
  };

  const scrollRow = (direction) => {
    if (trackRef.current) {
      const offset = direction === 'left' ? -310 : 310;
      trackRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div id="team" className="relative z-10 py-6 sm:py-8">
      
      {/* Outer Eyebrow */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 px-1 gap-2">
        <div className="inline-flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">
            Club Leadership Directory
          </span>
        </div>
        <div className="font-mono text-xs text-zinc-500">
          VOYAGER // CORE TEAM DIRECTORY
        </div>
      </div>

      {/* INNER DIV SNAP: Snaps directly to the active team & larger card view */}
      <div
        id="team-focus-card"
        ref={boxRef}
        className="liquid-glass rounded-3xl p-5 sm:p-7 relative flex flex-col justify-between shadow-2xl snap-start scroll-mt-24"
      >
        {/* Top Controls: Team Switcher Tabs + Search & Stepper */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 pb-4 border-b border-white/10">
          
          {/* Team Switcher Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {orderedTeams.map((team, idx) => {
              const teamCount = members.filter(
                (m) => m.subTeamId === team.id || m.subTeam.toLowerCase() === team.name.toLowerCase()
              ).length;
              const isActive = idx === activeTeamIndex;

              return (
                <button
                  key={team.id}
                  onClick={() => handleTeamChange(idx)}
                  className={`px-3.5 py-1.5 rounded-lg font-mono text-xs tracking-wider transition-all border ${
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

          {/* Search Input & Stepper info */}
          <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
            <div className="relative w-44 sm:w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search member..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-zinc-950 border border-white/10 text-xs font-mono text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-zinc-400 whitespace-nowrap">
                {activeTeamIndex + 1}/{orderedTeams.length}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => scrollRow('left')}
                  className="p-1.5 rounded-lg bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollRow('right')}
                  className="p-1.5 rounded-lg bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Current Active Team Header: Technical Team (or current team) with clear prominent title */}
        <div className="pt-4 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                {currentTeam.name}
              </h2>
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-zinc-900 text-emerald-400 border border-white/10 font-semibold">
                {currentMembers.length} {currentMembers.length === 1 ? 'member' : 'members'}
              </span>
            </div>
            {currentTeam.description && (
              <p className="font-sans text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
                {currentTeam.description}
              </p>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-zinc-400">
            {activeTeamIndex < orderedTeams.length - 1 && (
              <span className="flex items-center gap-1 text-zinc-400">
                Next: <span className="text-zinc-200">{orderedTeams[activeTeamIndex + 1].name}</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
              </span>
            )}
          </div>
        </div>

        {/* Horizontal Track of ID Badges with Snap - Left margin on PC so leftmost card is not clipped */}
        {currentMembers.length > 0 ? (
          <div
            ref={trackRef}
            className="flex gap-6 overflow-x-auto py-3 px-2 sm:px-6 md:px-8 no-scrollbar scroll-smooth snap-x snap-mandatory scroll-pl-2 sm:scroll-pl-6 md:scroll-pl-8"
          >
            {currentMembers.map((member) => (
              <IdCard key={member.id} member={member} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-zinc-500 font-mono text-xs">
            No members in {currentTeam.name} match your search.
          </div>
        )}

        {/* Bottom Seen/Progress Bar & Team Navigation: reaches 100% on PC and when seen */}
        <div className="mt-4 pt-3.5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Progress bar */}
          <div className="w-full sm:w-72 h-1.5 bg-zinc-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-150"
              style={{
                width: `${scrollProgress >= 0.98 ? 100 : Math.max(Math.round(scrollProgress * 100), 15)}%`
              }}
            />
          </div>

          {/* Next / Previous Team quick buttons */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
            <button
              disabled={activeTeamIndex === 0}
              onClick={() => handleTeamChange(activeTeamIndex - 1)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 text-xs font-mono text-zinc-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Prev team</span>
            </button>

            <button
              disabled={activeTeamIndex === orderedTeams.length - 1}
              onClick={() => handleTeamChange(activeTeamIndex + 1)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 text-xs font-mono text-zinc-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              <span>Next team</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
