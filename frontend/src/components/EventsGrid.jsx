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
        duration: 400,
        easing: 'easeOutCubic',
      });
    }
  }, []);

  // Smoothly scroll to a specific event card and automatically synchronize the timeline line
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
        duration: 450,
        easing: 'easeOutCubic',
      });
    }
  }, [filteredEvents.length, syncTimelineToActive]);

  const scroll = (direction) => {
    const nextIndex = direction === 'left' ? activeEventIndex - 1 : activeEventIndex + 1;
    scrollToEvent(nextIndex);
  };

  // Geek Room style scroll interaction with Anime.js:
  // Both vertical and horizontal scroll/touch gestures drive the cards and timeline simultaneously
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    let isScrollingFromAnime = false;

    // Detect card index from manual scroll
    const onScroll = () => {
      if (isScrollingFromAnime) return;
      const cardWidth = window.innerWidth < 640 ? 320 : 380;
      const index = Math.round(el.scrollLeft / cardWidth);
      const bounded = Math.min(Math.max(index, 0), filteredEvents.length - 1);
      if (bounded !== activeEventIndex) {
        setActiveEventIndex(bounded);
        syncTimelineToActive(bounded);
      }
    };

    // 1. Wheel handling (Mouse wheel and Trackpad)
    let wheelTimeout;
    const onWheel = (e) => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 4) return;

      // Primary delta from vertical or horizontal wheel
      const primaryDelta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(primaryDelta) < 3) return;

      const atLeft = el.scrollLeft <= 4;
      const atRight = Math.ceil(el.scrollLeft) >= maxScroll - 4;

      // When reaching edges, release to standard vertical page scroll
      if ((primaryDelta > 0 && atRight) || (primaryDelta < 0 && atLeft)) {
        return;
      }

      // Convert vertical/horizontal scroll into horizontal movement
      e.preventDefault();

      if (animeCardRef.current) animeCardRef.current.pause();

      const isTrackpad = e.deltaMode === 0 && Math.abs(primaryDelta) < 60;
      if (isTrackpad) {
        el.scrollLeft += primaryDelta;
        const cardWidth = window.innerWidth < 640 ? 320 : 380;
        const index = Math.min(Math.max(Math.round(el.scrollLeft / cardWidth), 0), filteredEvents.length - 1);
        setActiveEventIndex(index);
        syncTimelineToActive(index);
      } else {
        const targetScroll = Math.max(0, Math.min(el.scrollLeft + primaryDelta * 1.6, maxScroll));
        isScrollingFromAnime = true;
        animeCardRef.current = anime({
          targets: el,
          scrollLeft: targetScroll,
          duration: 380,
          easing: 'easeOutQuad',
          complete: () => {
            isScrollingFromAnime = false;
            const cardWidth = window.innerWidth < 640 ? 320 : 380;
            const index = Math.min(Math.max(Math.round(el.scrollLeft / cardWidth), 0), filteredEvents.length - 1);
            setActiveEventIndex(index);
            syncTimelineToActive(index);
          }
        });
      }
    };

    // 2. Touch handling on smartphones
    let touchStartX = 0;
    let touchStartY = 0;
    let startScrollLeft = 0;
    let isTouchActive = false;

    const onTouchStart = (e) => {
      if (e.touches.length !== 1) return;
      if (animeCardRef.current) animeCardRef.current.pause();
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      startScrollLeft = el.scrollLeft;
      isTouchActive = true;
    };

    const onTouchMove = (e) => {
      if (!isTouchActive || e.touches.length !== 1) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 4) return;

      const curX = e.touches[0].clientX;
      const curY = e.touches[0].clientY;
      const diffX = touchStartX - curX;
      const diffY = touchStartY - curY;

      // Both vertical and horizontal swipe gestures drive the card carousel
      const primaryDiff = Math.abs(diffX) > Math.abs(diffY) ? diffX : diffY;

      const atLeft = el.scrollLeft <= 4;
      const atRight = Math.ceil(el.scrollLeft) >= maxScroll - 4;

      // At boundaries, release preventDefault to allow smooth vertical page navigation
      if ((primaryDiff > 0 && atRight) || (primaryDiff < 0 && atLeft)) {
        return;
      }

      if (Math.abs(primaryDiff) > 6) {
        e.preventDefault();
        el.scrollLeft = startScrollLeft + primaryDiff;
        const cardWidth = window.innerWidth < 640 ? 320 : 380;
        const index = Math.min(Math.max(Math.round(el.scrollLeft / cardWidth), 0), filteredEvents.length - 1);
        setActiveEventIndex(index);
        syncTimelineToActive(index);
      }
    };

    const onTouchEnd = () => {
      if (!isTouchActive) return;
      isTouchActive = false;
      // Snap to nearest card smoothly using anime.js
      const cardWidth = window.innerWidth < 640 ? 320 : 380;
      const targetIndex = Math.min(Math.max(Math.round(el.scrollLeft / cardWidth), 0), filteredEvents.length - 1);
      scrollToEvent(targetIndex);
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    el.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('scroll', onScroll);
    };
  }, [filteredEvents.length, activeEventIndex, scrollToEvent, syncTimelineToActive]);

  // Calculate timeline laser progress percentage (0 to 100%)
  const progressPercent = useMemo(() => {
    if (filteredEvents.length <= 1) return 100;
    return (activeEventIndex / (filteredEvents.length - 1)) * 100;
  }, [activeEventIndex, filteredEvents.length]);

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

      {/* SYNCHRONIZED TIMELINE ANIMATION:
          Automatically scrolls & illuminates along with the event cards on vertical or horizontal scroll */}
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

          {/* Interactive timeline bar container - automatically centers active node via anime.js */}
          <div
            ref={timelineRef}
            className="relative p-3.5 sm:p-4 rounded-2xl bg-zinc-950/70 border border-white/10 backdrop-blur-md overflow-x-auto no-scrollbar"
          >
            {/* Base timeline rail */}
            <div className="absolute top-[38px] sm:top-[42px] left-6 right-6 h-[2px] bg-zinc-800/80 pointer-events-none rounded-full overflow-hidden">
              {/* Anime.js synchronized progress laser bar */}
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-300 shadow-[0_0_10px_#00FF88] transition-all duration-400 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Timeline event nodes */}
            <div className="relative flex items-center justify-between min-w-[500px] sm:min-w-0 gap-3 sm:gap-6 z-10 px-1">
              {filteredEvents.map((ev, idx) => {
                const isUpcoming = ev.status?.toLowerCase() === 'upcoming' || ev.status?.toLowerCase() === 'live';
                const isCurrent = activeEventIndex === idx;

                return (
                  <button
                    key={ev.id}
                    type="button"
                    data-timeline-node={idx}
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

      {/* SINGLE HORIZONTAL ROW OF EVENT CARDS */}
      <div
        ref={trackRef}
        className="flex gap-6 overflow-x-auto py-3 px-1 no-scrollbar"
      >
        {filteredEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
