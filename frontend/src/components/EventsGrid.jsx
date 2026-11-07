import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import EventCard from './EventCard';

function parseEventDate(dateStr) {
  if (!dateStr) return 0;
  const parsed = Date.parse(dateStr);
  return isNaN(parsed) ? 0 : parsed;
}

export default function EventsGrid({ events = [] }) {
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeEventIndex, setActiveEventIndex] = useState(0);
  const trackRef = useRef(null);

  // Timeline ordering: upcoming first (soonest upcoming first), then completed from new to old
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

  const scroll = (direction) => {
    if (trackRef.current) {
      const offset = direction === 'left' ? -380 : 380;
      trackRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const scrollToEvent = (index) => {
    if (trackRef.current) {
      const el = trackRef.current;
      const cardEl = el.children[index];
      if (cardEl) {
        cardEl.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      } else {
        const cardWidth = window.innerWidth < 640 ? 320 : 380;
        el.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
      }
      setActiveEventIndex(index);
    }
  };

  // Geek Room style scroll & touch interaction:
  // Both vertical and horizontal scroll/touch gestures drive horizontal sliding
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const handleScroll = () => {
      const cardWidth = window.innerWidth < 640 ? 320 : 380;
      const index = Math.round(el.scrollLeft / cardWidth);
      setActiveEventIndex(Math.min(Math.max(index, 0), filteredEvents.length - 1));
    };

    // 1. Wheel handling (Trackpad / Mouse wheel)
    const onWheel = (e) => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 4) return;

      // Unify primary delta from either vertical or horizontal scroll
      const primaryDelta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(primaryDelta) < 3) return;

      const atLeft = el.scrollLeft <= 5;
      const atRight = Math.ceil(el.scrollLeft) >= maxScroll - 5;

      // Allow natural page scroll once boundaries are hit
      if ((primaryDelta > 0 && atRight) || (primaryDelta < 0 && atLeft)) {
        return;
      }

      // Convert vertical/horizontal wheel scroll into horizontal track scroll
      e.preventDefault();
      const isTouchpad = e.deltaMode === 0 && Math.abs(primaryDelta) < 65;
      if (isTouchpad) {
        el.scrollLeft += primaryDelta;
      } else {
        el.scrollBy({ left: primaryDelta * 1.2, behavior: 'smooth' });
      }
    };

    // 2. Touch handling on smartphones (Geek Room touch scroll)
    let touchStartX = 0;
    let touchStartY = 0;
    let startScrollLeft = 0;

    const onTouchStart = (e) => {
      if (e.touches.length !== 1) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      startScrollLeft = el.scrollLeft;
    };

    const onTouchMove = (e) => {
      if (e.touches.length !== 1) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 4) return;

      const curX = e.touches[0].clientX;
      const curY = e.touches[0].clientY;
      const diffX = touchStartX - curX; // positive = dragging left -> scroll right
      const diffY = touchStartY - curY; // positive = dragging up -> scroll right

      // Unify vertical or horizontal touch intent (Geek Room style)
      const primaryDiff = Math.abs(diffX) > Math.abs(diffY) ? diffX : diffY;

      const atLeft = el.scrollLeft <= 4;
      const atRight = Math.ceil(el.scrollLeft) >= maxScroll - 4;

      // At boundaries, do not preventDefault -> allows finger to scroll page vertically!
      if ((primaryDiff > 0 && atRight) || (primaryDiff < 0 && atLeft)) {
        return;
      }

      // Inside track: convert vertical or horizontal touch swipe into horizontal card translation
      if (Math.abs(primaryDiff) > 5) {
        e.preventDefault();
        el.scrollLeft = startScrollLeft + primaryDiff;
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('scroll', handleScroll);
    };
  }, [filteredEvents.length]);

  return (
    <div
      id="events"
      className="flex flex-col pt-2 sm:pt-4 pb-6 sm:pb-8 snap-start scroll-mt-20 relative z-10"
    >
      
      {/* Section Header with date prominence */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 gap-3.5">
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
              className="p-2 rounded-lg bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
              aria-label="Scroll events left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-lg bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
              aria-label="Scroll events right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* TIMELINE ANIMATION: Upper part of event section showing timeline order from recent/upcoming ahead */}
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
              TIMELINE ORDER // RECENT & UPCOMING FIRST
            </span>
          </div>

          {/* Interactive timeline bar container */}
          <div className="relative p-3.5 sm:p-4 rounded-2xl bg-zinc-950/70 border border-white/10 backdrop-blur-md overflow-x-auto no-scrollbar">
            {/* Animated Laser Pulse / Scan Line */}
            <div className="absolute top-[38px] sm:top-[42px] left-6 right-6 h-[2px] bg-zinc-800/80 pointer-events-none overflow-hidden">
              <div className="h-full bg-gradient-to-r from-transparent via-emerald-400 to-transparent timeline-beam-pulse opacity-80" />
            </div>

            {/* Timeline event nodes */}
            <div className="relative flex items-center justify-between min-w-[540px] sm:min-w-0 gap-3 sm:gap-6 z-10 px-1">
              {filteredEvents.map((ev, idx) => {
                const isUpcoming = ev.status?.toLowerCase() === 'upcoming' || ev.status?.toLowerCase() === 'live';
                const isCurrent = activeEventIndex === idx;

                return (
                  <button
                    key={ev.id}
                    type="button"
                    onClick={() => scrollToEvent(idx)}
                    className="group flex-1 flex flex-col items-center text-center transition-all focus:outline-none cursor-pointer"
                    title={`View ${ev.title} on timeline`}
                  >
                    {/* Event Date */}
                    <span className={`font-mono text-[10px] sm:text-[11px] tracking-wider mb-1.5 transition-colors ${
                      isUpcoming
                        ? 'text-emerald-400 font-bold'
                        : isCurrent
                        ? 'text-zinc-200 font-medium'
                        : 'text-zinc-400 group-hover:text-zinc-200'
                    }`}>
                      {ev.date}
                    </span>

                    {/* Timeline Node Point */}
                    <div className="relative flex items-center justify-center my-0.5">
                      {isUpcoming && (
                        <span className="absolute -inset-1.5 rounded-full bg-emerald-500/30 animate-pulse pointer-events-none" />
                      )}
                      <div className={`w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${
                        isUpcoming
                          ? 'bg-emerald-500 border-emerald-300 shadow-[0_0_12px_rgba(0,255,136,0.8)] scale-110'
                          : isCurrent
                          ? 'bg-emerald-400 border-white shadow-[0_0_8px_rgba(0,255,136,0.5)] scale-105'
                          : 'bg-zinc-900 border-zinc-600 group-hover:border-emerald-400 group-hover:bg-zinc-800'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          isUpcoming || isCurrent ? 'bg-black' : 'bg-zinc-500 group-hover:bg-emerald-400'
                        }`} />
                      </div>
                    </div>

                    {/* Title */}
                    <span className={`font-display font-semibold text-xs mt-2 truncate max-w-[125px] sm:max-w-[150px] transition-colors ${
                      isUpcoming ? 'text-white' : isCurrent ? 'text-emerald-400' : 'text-zinc-300 group-hover:text-emerald-400'
                    }`}>
                      {ev.title}
                    </span>

                    {/* Category / Status Pill */}
                    <span className={`font-mono text-[9px] uppercase px-1.5 py-0.5 rounded mt-1 border transition-colors ${
                      isUpcoming
                        ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40'
                        : isCurrent
                        ? 'bg-zinc-900 text-emerald-400 border-emerald-500/30'
                        : 'bg-zinc-900 text-zinc-400 border-white/5 group-hover:border-white/20'
                    }`}>
                      {isUpcoming ? 'UPCOMING' : ev.badge || 'COMPLETED'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SINGLE HORIZONTAL ROW WHICH SCROLLS WITH SNAP */}
      <div
        ref={trackRef}
        className="flex gap-6 overflow-x-auto py-3 px-1 no-scrollbar scroll-smooth snap-x snap-mandatory"
      >
        {filteredEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

    </div>
  );
}
