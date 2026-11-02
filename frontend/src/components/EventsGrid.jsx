import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import EventCard from './EventCard';

export default function EventsGrid({ events = [] }) {
  const [filterStatus, setFilterStatus] = useState('all');
  const trackRef = useRef(null);

  const filteredEvents = useMemo(() => {
    const list = events.filter((ev) => {
      if (filterStatus === 'all') return true;
      return ev.status?.toLowerCase() === filterStatus.toLowerCase();
    });

    // Upcoming event is ALWAYS first in the display order
    return [...list].sort((a, b) => {
      const aUpcoming = a.status?.toLowerCase() === 'upcoming' ? 1 : 0;
      const bUpcoming = b.status?.toLowerCase() === 'upcoming' ? 1 : 0;
      return bUpcoming - aUpcoming;
    });
  }, [events, filterStatus]);

  const upcomingCount = events.filter((e) => e.status?.toLowerCase() === 'upcoming').length;
  const completedCount = events.filter((e) => e.status?.toLowerCase() === 'completed').length;

  const scroll = (direction) => {
    if (trackRef.current) {
      const offset = direction === 'left' ? -380 : 380;
      trackRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const onWheel = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        const atLeft = el.scrollLeft <= 5 && e.deltaY < 0;
        const atRight = Math.ceil(el.scrollLeft + el.clientWidth) >= el.scrollWidth - 5 && e.deltaY > 0;
        
        if (!atLeft && !atRight) {
          e.preventDefault();
          el.scrollBy({ left: e.deltaY * 1.5, behavior: 'smooth' });
        }
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <div
      id="events"
      className="min-h-[calc(100vh-5rem)] flex flex-col justify-center py-6 sm:py-8 snap-start scroll-mt-20 relative z-10"
    >
      
      {/* Section Header with date prominence */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
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

        {/* Filter Tabs and Navigation Controls */}
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
