import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { animate, onScroll } from 'animejs';
import EventCard from './EventCard';

function parseEventDate(dateStr) {
  if (!dateStr) return 0;
  const parsed = Date.parse(dateStr);
  return isNaN(parsed) ? 0 : parsed;
}

export default function EventsGrid({ events = [] }) {
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeEventIndex, setActiveEventIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [travelDistance, setTravelDistance] = useState(0);

  const sectionRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const timelineRef = useRef(null);

  // Timeline ordering: upcoming/live first (soonest upcoming first), then completed from new to old
  const filteredEvents = useMemo(() => {
    const list = events.filter((ev) => {
      if (filterStatus === 'all') return true;
      if (filterStatus === 'upcoming') {
        const s = ev.status?.toLowerCase();
        return s === 'upcoming' || s === 'live';
      }
      return ev.status?.toLowerCase() === filterStatus.toLowerCase();
    });

    return [...list].sort((a, b) => {
      const aUpcoming = a.status?.toLowerCase() === 'upcoming' || a.status?.toLowerCase() === 'live';
      const bUpcoming = b.status?.toLowerCase() === 'upcoming' || b.status?.toLowerCase() === 'live';

      if (aUpcoming && !bUpcoming) return -1;
      if (!aUpcoming && bUpcoming) return 1;

      const aTime = parseEventDate(a.date);
      const bTime = parseEventDate(b.date);

      if (aUpcoming && bUpcoming) {
        return aTime - bTime;
      }

      return bTime - aTime;
    });
  }, [events, filterStatus]);

  const upcomingCount = events.filter((e) => {
    const s = e.status?.toLowerCase();
    return s === 'upcoming' || s === 'live';
  }).length;
  const completedCount = events.filter((e) => e.status?.toLowerCase() === 'completed').length;

  // Auto-reset filter if active filter becomes empty
  useEffect(() => {
    if (filterStatus === 'upcoming' && upcomingCount === 0) {
      setFilterStatus('all');
    }
    if (filterStatus === 'completed' && completedCount === 0) {
      setFilterStatus('all');
    }
  }, [filterStatus, upcomingCount, completedCount]);

  // Calculate dynamic horizontal scroll travel distance
  const updateTravelDistance = useCallback(() => {
    if (!trackRef.current) return;
    const isLargeScreen = window.innerWidth >= 768;
    setIsDesktop(isLargeScreen);

    if (isLargeScreen) {
      const trackWidth = trackRef.current.scrollWidth;
      const viewportWidth = window.innerWidth;
      // Add right padding so the last card clears the viewport comfortably
      const distance = Math.max(0, trackWidth - viewportWidth + 96);
      setTravelDistance(distance);
    } else {
      setTravelDistance(0);
      if (trackRef.current) {
        trackRef.current.style.transform = 'none';
      }
    }
  }, []);

  // Anime.js v4 onScroll Observer: Pinned Horizontal Scroll
  useEffect(() => {
    updateTravelDistance();

    if (!isDesktop || travelDistance <= 0 || !sectionRef.current || !trackRef.current) {
      return;
    }

    // 1. Create horizontal translation animation
    const cardAnimation = animate(trackRef.current, {
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
        // Apply progress directly to horizontal card track
        cardAnimation.progress = self.progress;

        // Synchronize active event index and timeline with scroll progress
        const count = filteredEvents.length;
        if (count > 0) {
          const rawIndex = Math.floor(self.progress * count);
          const bounded = Math.min(Math.max(rawIndex, 0), count - 1);
          setActiveEventIndex(bounded);
        }
      },
    });

    // 3. Dynamic ResizeObserver for responsive adaptation
    const resizeObserver = new ResizeObserver(() => {
      updateTravelDistance();
    });
    resizeObserver.observe(sectionRef.current);
    if (trackRef.current) resizeObserver.observe(trackRef.current);

    return () => {
      if (scrollObserver && typeof scrollObserver.revert === 'function') {
        scrollObserver.revert();
      }
      resizeObserver.disconnect();
    };
  }, [isDesktop, travelDistance, filteredEvents.length, updateTravelDistance]);

  // Navigate to an event by smoothly scrolling the page or card
  const navigateToEvent = useCallback((index) => {
    const bounded = Math.max(0, Math.min(index, filteredEvents.length - 1));
    setActiveEventIndex(bounded);

    if (isDesktop && travelDistance > 0 && sectionRef.current) {
      // On Desktop: Smoothly scroll the window to the corresponding pinned position
      const sectionTop = sectionRef.current.getBoundingClientRect().top + window.scrollY;
      const progressTarget = filteredEvents.length > 1 ? bounded / (filteredEvents.length - 1) : 0;
      const targetScrollY = sectionTop + progressTarget * travelDistance;
      window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
    } else if (trackRef.current) {
      // On Mobile: Scroll card track horizontally
      const cardEl = trackRef.current.children[bounded];
      if (cardEl) {
        cardEl.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      }
    }
  }, [isDesktop, travelDistance, filteredEvents.length]);

  const handleArrowNav = (direction) => {
    const nextIdx = direction === 'left' ? activeEventIndex - 1 : activeEventIndex + 1;
    navigateToEvent(nextIdx);
  };

  return (
    <section
      id="events"
      ref={sectionRef}
      className="relative w-full text-slate-100"
      style={{
        // Desktop height provides the vertical scroll runway; Mobile height is natural
        height: isDesktop && travelDistance > 0 ? `calc(100vh + ${travelDistance}px)` : 'auto',
      }}
    >
      {/* STICKY VIEWPORT: Pinned at top: 0 for 100vh on Desktop */}
      <div
        ref={viewportRef}
        className={`w-full overflow-hidden ${
          isDesktop
            ? 'sticky top-0 h-screen flex flex-col justify-center'
            : 'relative pt-4 pb-8'
        }`}
      >
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 sm:mb-5 gap-3.5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/10 mb-2">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-mono text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  28 Nov 2026 • 13th Protocol
                </span>
              </div>

              <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white tracking-tight">
                Club Events
              </h2>
            </div>

            {/* Filter Tabs and Navigation Controls */}
            <div className="flex items-center gap-3">
              <div className="inline-flex p-1 rounded-lg bg-zinc-950 border border-white/10">
                <button
                  type="button"
                  onClick={() => setFilterStatus('all')}
                  className={`px-3 py-1.5 rounded-md font-mono text-xs transition-colors cursor-pointer ${
                    filterStatus === 'all'
                      ? 'bg-emerald-500 text-black font-bold'
                      : 'text-zinc-300 hover:text-white'
                  }`}
                >
                  ALL ({events.length})
                </button>

                {upcomingCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setFilterStatus('upcoming')}
                    className={`px-3 py-1.5 rounded-md font-mono text-xs transition-colors cursor-pointer ${
                      filterStatus === 'upcoming'
                        ? 'bg-emerald-500 text-black font-bold'
                        : 'text-zinc-300 hover:text-white'
                    }`}
                  >
                    UPCOMING ({upcomingCount})
                  </button>
                )}

                {completedCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setFilterStatus('completed')}
                    className={`px-3 py-1.5 rounded-md font-mono text-xs transition-colors cursor-pointer ${
                      filterStatus === 'completed'
                        ? 'bg-emerald-500 text-black font-bold'
                        : 'text-zinc-300 hover:text-white'
                    }`}
                  >
                    COMPLETED ({completedCount})
                  </button>
                )}
              </div>

              {/* Navigation Chevrons */}
              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleArrowNav('left')}
                  disabled={activeEventIndex === 0}
                  className="p-2 rounded-lg bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                  aria-label="Scroll events left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleArrowNav('right')}
                  disabled={activeEventIndex >= filteredEvents.length - 1}
                  className="p-2 rounded-lg bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                  aria-label="Scroll events right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* SYNCHRONIZED TIMELINE ANIMATION:
              Segmented connecting rails centered to circles;
              Laser progress bar terminates with pixel precision on the active circle */}
          {filteredEvents.length > 0 && (
            <div className="mb-6 relative">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2 px-1">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="text-zinc-200 font-semibold tracking-wider uppercase text-[11px] sm:text-xs">
                    Event Chronology Timeline
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] text-zinc-500 font-mono">
                  {isDesktop ? 'SCROLL DOWN TO ADVANCE TIMELINE ➔' : 'SWIPE TO EXPLORE ➔'}
                </span>
              </div>

              {/* Timeline Container */}
              <div
                ref={timelineRef}
                className="relative p-3.5 sm:p-5 rounded-2xl bg-zinc-950/80 border border-white/10 backdrop-blur-md overflow-x-auto no-scrollbar scroll-smooth"
              >
                <div className="relative flex items-start min-w-[520px] sm:min-w-0 w-full px-2">
                  {filteredEvents.map((ev, idx) => {
                    const isUpcoming = ev.status?.toLowerCase() === 'upcoming' || ev.status?.toLowerCase() === 'live';
                    const isCurrent = activeEventIndex === idx;
                    const isPassed = activeEventIndex >= idx;
                    const isLast = idx === filteredEvents.length - 1;

                    return (
                      <React.Fragment key={ev.id}>
                        {/* Event Node Column */}
                        <button
                          type="button"
                          data-timeline-node={idx}
                          onClick={() => navigateToEvent(idx)}
                          className="group flex flex-col items-center text-center focus:outline-none cursor-pointer shrink-0 z-10 w-28 sm:w-32"
                          title={`View ${ev.title} on timeline`}
                        >
                          {/* Date */}
                          <span className={`font-mono text-[10px] sm:text-[11px] tracking-wider mb-2 transition-colors ${
                            isUpcoming
                              ? 'text-emerald-400 font-bold'
                              : isCurrent
                              ? 'text-zinc-100 font-semibold'
                              : 'text-zinc-400 group-hover:text-zinc-200'
                          }`}>
                            {ev.date}
                          </span>

                          {/* Node Circle */}
                          <div className="relative flex items-center justify-center my-0.5 w-5 h-5">
                            {isCurrent && (
                              <span className="absolute -inset-1.5 rounded-full bg-emerald-500/35 animate-ping pointer-events-none" />
                            )}
                            <div className={`w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${
                              isCurrent
                                ? 'bg-emerald-400 border-white shadow-[0_0_12px_rgba(0,255,136,0.9)] scale-125'
                                : isPassed
                                ? 'bg-emerald-500 border-emerald-300 shadow-[0_0_8px_rgba(0,255,136,0.6)]'
                                : 'bg-zinc-900 border-zinc-700 group-hover:border-emerald-400 group-hover:bg-zinc-800'
                            }`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${
                                isCurrent || isPassed ? 'bg-black' : 'bg-zinc-600 group-hover:bg-emerald-400'
                              }`} />
                            </div>
                          </div>

                          {/* Title */}
                          <span className={`font-display font-semibold text-xs mt-2 truncate w-full transition-colors ${
                            isCurrent ? 'text-emerald-400 font-bold' : isUpcoming ? 'text-white' : 'text-zinc-300 group-hover:text-emerald-400'
                          }`}>
                            {ev.title}
                          </span>

                          {/* Badge */}
                          <span className={`font-mono text-[9px] uppercase px-1.5 py-0.5 rounded mt-1 border transition-colors ${
                            isUpcoming
                              ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40'
                              : isCurrent
                              ? 'bg-zinc-900 text-emerald-400 border-emerald-500/30 font-semibold'
                              : 'bg-zinc-900 text-zinc-400 border-white/5 group-hover:border-white/20'
                          }`}>
                            {isUpcoming ? 'UPCOMING' : ev.badge || 'COMPLETED'}
                          </span>
                        </button>

                        {/* Connecting Rail Segment */}
                        {!isLast && (
                          <div className="flex-1 flex items-center self-start mt-[28px] sm:mt-[29px] h-5 min-w-[24px]">
                            <div className="w-full h-[2.5px] bg-zinc-800/90 rounded-full overflow-hidden relative">
                              <div
                                className="h-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-300 shadow-[0_0_8px_#00FF88] transition-all duration-500 ease-out"
                                style={{
                                  width: activeEventIndex > idx ? '100%' : '0%',
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* OVERFLOWING CARDS TRACK:
            - Desktop: translates along X via Anime.js v4 onScroll
            - Mobile: native hardware-accelerated momentum touch scrolling with snap */}
        <div
          ref={trackRef}
          className={`flex gap-6 will-change-transform ${
            isDesktop
              ? 'w-max pl-4 sm:pl-8 cursor-grab active:cursor-grabbing'
              : 'w-full overflow-x-auto py-3 px-4 no-scrollbar snap-x snap-mandatory touch-pan-x'
          }`}
          style={{
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

      </div>
    </section>
  );
}
