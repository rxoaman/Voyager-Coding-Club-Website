import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import anime from 'animejs';
import EventCard from './EventCard';

function parseEventDate(dateStr) {
  if (!dateStr) return 0;
  const parsed = Date.parse(dateStr);
  return isNaN(parsed) ? 0 : parsed;
}

export default function EventsGrid({ events = [] }) {
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeEventIndex, setActiveEventIndex] = useState(0);

  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const timelineRef = useRef(null);
  const animeCardRef = useRef(null);
  const animeTimelineRef = useRef(null);

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

  // Synchronize Timeline position to center the active node using anime.js
  const syncTimelineToActive = useCallback((targetIndex) => {
    const tEl = timelineRef.current;
    if (!tEl) return;

    const nodeBtn = tEl.querySelector(`[data-timeline-node="${targetIndex}"]`);
    if (nodeBtn) {
      const targetLeft = nodeBtn.offsetLeft - (tEl.clientWidth / 2) + (nodeBtn.clientWidth / 2);
      const maxScroll = tEl.scrollWidth - tEl.clientWidth;
      const safeLeft = Math.max(0, Math.min(targetLeft, maxScroll));

      if (animeTimelineRef.current) animeTimelineRef.current.pause();
      animeTimelineRef.current = anime({
        targets: tEl,
        scrollLeft: safeLeft,
        duration: 380,
        easing: 'easeOutCubic',
      });
    }
  }, []);

  // Smoothly scroll to a specific event card and automatically center its timeline node
  const scrollToEvent = useCallback((index) => {
    const cEl = trackRef.current;
    if (!cEl) return;

    const boundedIndex = Math.max(0, Math.min(index, filteredEvents.length - 1));
    setActiveEventIndex(boundedIndex);
    syncTimelineToActive(boundedIndex);

    const cardEl = cEl.children[boundedIndex];
    if (cardEl) {
      const targetLeft = cardEl.offsetLeft - cEl.offsetLeft;
      if (animeCardRef.current) animeCardRef.current.pause();
      animeCardRef.current = anime({
        targets: cEl,
        scrollLeft: targetLeft,
        duration: 400,
        easing: 'easeOutCubic',
      });
    }
  }, [filteredEvents.length, syncTimelineToActive]);

  const scroll = (direction) => {
    const nextIndex = direction === 'left' ? activeEventIndex - 1 : activeEventIndex + 1;
    scrollToEvent(nextIndex);
  };

  // Scroll and gesture interactions:
  // 1. Touchscreen: Native 120Hz smooth momentum hardware scrolling (ZERO jitter)
  // 2. Trackpad / Wheel: Smooth horizontal conversion
  // 3. Throttled RAF updates active index and synchronizes the timeline without lag
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    let isAnimeActive = false;
    let scrollRafId = null;

    // Passive throttled scroll handler using RAF for fluid tracking
    const handleScroll = () => {
      if (isAnimeActive) return;
      cancelAnimationFrame(scrollRafId);
      scrollRafId = requestAnimationFrame(() => {
        const cardWidth = window.innerWidth < 640 ? 320 : 380;
        const index = Math.round(el.scrollLeft / cardWidth);
        const bounded = Math.min(Math.max(index, 0), filteredEvents.length - 1);
        if (bounded !== activeEventIndex) {
          setActiveEventIndex(bounded);
          syncTimelineToActive(bounded);
        }
      });
    };

    // Wheel handling for desktop / trackpad
    const onWheel = (e) => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 4) return;

      const primaryDelta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(primaryDelta) < 3) return;

      const atLeft = el.scrollLeft <= 5;
      const atRight = Math.ceil(el.scrollLeft) >= maxScroll - 5;

      // Allow natural vertical page scroll at carousel boundaries
      if ((primaryDelta > 0 && atRight) || (primaryDelta < 0 && atLeft)) {
        return;
      }

      e.preventDefault();

      const isTrackpad = e.deltaMode === 0 && Math.abs(primaryDelta) < 60;
      if (isTrackpad) {
        el.scrollLeft += primaryDelta;
      } else {
        const targetScroll = Math.max(0, Math.min(el.scrollLeft + primaryDelta * 1.5, maxScroll));
        isAnimeActive = true;
        if (animeCardRef.current) animeCardRef.current.pause();
        animeCardRef.current = anime({
          targets: el,
          scrollLeft: targetScroll,
          duration: 350,
          easing: 'easeOutQuad',
          complete: () => {
            isAnimeActive = false;
            const cardWidth = window.innerWidth < 640 ? 320 : 380;
            const idx = Math.min(Math.max(Math.round(el.scrollLeft / cardWidth), 0), filteredEvents.length - 1);
            setActiveEventIndex(idx);
            syncTimelineToActive(idx);
          }
        });
      }
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    el.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      cancelAnimationFrame(scrollRafId);
      el.removeEventListener('scroll', handleScroll);
      el.removeEventListener('wheel', onWheel);
    };
  }, [filteredEvents.length, activeEventIndex, syncTimelineToActive]);

  return (
    <div
      id="events"
      ref={sectionRef}
      className="flex flex-col pt-1 sm:pt-4 pb-6 sm:pb-8 relative z-10"
    >
      {/* Section Header with date prominence */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 sm:mb-5 gap-3.5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/10 mb-2">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              28 Nov 2026 • 13th Protocol
            </span>
          </div>

          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
            Club Events
          </h2>
        </div>

        {/* Filter Tabs and Navigation Controls - Only shows tabs that have > 0 events */}
        <div className="flex items-center gap-3">
          <div className="inline-flex p-1 rounded-lg bg-zinc-950 border border-white/10">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-md font-mono text-xs transition-colors ${
                filterStatus === 'all'
                  ? 'bg-emerald-500 text-black font-bold'
                  : 'text-zinc-300 hover:text-white'
              }`}
            >
              ALL ({events.length})
            </button>

            {upcomingCount > 0 && (
              <button
                onClick={() => setFilterStatus('upcoming')}
                className={`px-3 py-1.5 rounded-md font-mono text-xs transition-colors ${
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
                onClick={() => setFilterStatus('completed')}
                className={`px-3 py-1.5 rounded-md font-mono text-xs transition-colors ${
                  filterStatus === 'completed'
                    ? 'bg-emerald-500 text-black font-bold'
                    : 'text-zinc-300 hover:text-white'
                }`}
              >
                COMPLETED ({completedCount})
              </button>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-lg bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              aria-label="Scroll events left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-lg bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              aria-label="Scroll events right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* SYNCHRONIZED TIMELINE ANIMATION:
          Segmented connecting rails centered directly to the circles;
          Laser progress bar terminates with pixel precision exactly on the active circle! */}
      {filteredEvents.length > 0 && (
        <div className="mb-6 relative">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2.5 px-1">
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
              SYNCHRONIZED // RECENT & UPCOMING FIRST
            </span>
          </div>

          {/* Interactive timeline bar container */}
          <div
            ref={timelineRef}
            className="relative p-3.5 sm:p-5 rounded-2xl bg-zinc-950/80 border border-white/10 backdrop-blur-md overflow-x-auto no-scrollbar scroll-smooth"
          >
            {/* The Unified Timeline Row with Segmented Connecting Rails */}
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
                      onClick={() => scrollToEvent(idx)}
                      className="group flex flex-col items-center text-center focus:outline-none cursor-pointer shrink-0 z-10 w-28 sm:w-32"
                      title={`View ${ev.title} on timeline`}
                    >
                      {/* 1. Date */}
                      <span className={`font-mono text-[10px] sm:text-[11px] tracking-wider mb-2 transition-colors ${
                        isUpcoming
                          ? 'text-emerald-400 font-bold'
                          : isCurrent
                          ? 'text-zinc-100 font-semibold'
                          : 'text-zinc-400 group-hover:text-zinc-200'
                      }`}>
                        {ev.date}
                      </span>

                      {/* 2. Node Circle (centered in a 20px box matching connecting rail height) */}
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

                      {/* 3. Title */}
                      <span className={`font-display font-semibold text-xs mt-2 truncate w-full transition-colors ${
                        isCurrent ? 'text-emerald-400 font-bold' : isUpcoming ? 'text-white' : 'text-zinc-300 group-hover:text-emerald-400'
                      }`}>
                        {ev.title}
                      </span>

                      {/* 4. Category / Status Pill */}
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

                    {/* Connecting Rail Segment between Circle idx and Circle idx + 1:
                        Vertically aligned at exactly the same row, terminating exactly at the next circle! */}
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

      {/* SINGLE HORIZONTAL ROW OF EVENT CARDS:
          Silky-smooth native momentum touch scrolling with snap on mobile,
          plus anime.js smooth controls on desktop */}
      <div
        ref={trackRef}
        className="flex gap-6 overflow-x-auto py-3 px-1 no-scrollbar snap-x snap-mandatory scroll-smooth touch-pan-x"
        style={{
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {filteredEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
