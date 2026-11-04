import React from 'react';
import { Calendar, MapPin, ExternalLink, Clock, Linkedin } from 'lucide-react';
import ResilientImage from './ResilientImage';

export default function EventCard({ event }) {
  const isUpcoming = event.status?.toLowerCase() === 'upcoming';

  return (
    <article className="group liquid-glass-card rounded-2xl overflow-hidden flex flex-col justify-between w-[320px] sm:w-[380px] shrink-0 snap-start select-none">
      
      {/* Event banner */}
      <div className="relative w-full h-48 bg-black/60 overflow-hidden">
        <ResilientImage
          src={event.imageUrl}
          alt={event.title}
          fallbackType="banner"
          className="w-full h-full"
          imageClassName="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
          <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-black/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
            {event.badge}
          </span>
          {isUpcoming && (
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500 text-black">
              UPCOMING
            </span>
          )}
        </div>

        {/* Prominent Date Tag */}
        <div className="absolute bottom-3 right-3 bg-black/90 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded flex items-center gap-1.5 text-xs font-mono text-zinc-200">
          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
          <span>{event.date}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          {/* Metadata: Date, Time and strictly KCCITM as venue */}
          <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
            <div className="flex items-center gap-1 text-emerald-400 font-semibold">
              <Calendar className="w-3 h-3" />
              <span>{event.date}</span>
            </div>
            {event.time && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-zinc-500" />
                <span>{event.time}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span className="text-zinc-300 font-semibold">KCCITM</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-display font-bold text-lg text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
            {event.title}
          </h3>

          {/* Description */}
          <p className="font-sans text-xs sm:text-sm text-zinc-300 leading-relaxed line-clamp-3">
            {event.description}
          </p>

          {/* Highlights */}
          {event.highlights && event.highlights.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {event.highlights.map((h, i) => (
                <span
                  key={i}
                  className="text-[11px] font-mono px-2 py-0.5 rounded liquid-glass-button text-zinc-300"
                >
                  {h}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Link: Register Now for Upcoming events, or LinkedIn Post for completed */}
        <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between">
          <span className="text-[11px] font-mono text-zinc-400">Voyager Coding Club</span>

          <a
            href={event.registrationUrl || event.registerUrl || event.actionUrl || event.linkedinPostUrl || 'https://www.linkedin.com/company/voyager-kccitm/'}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${
              isUpcoming
                ? 'bg-emerald-500 hover:bg-emerald-400 text-black font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                : 'liquid-glass-button text-zinc-200 hover:text-white'
            }`}
          >
            {isUpcoming ? (
              <>
                <span>{event.actionText || 'Register Now'}</span>
                <ExternalLink className="w-3.5 h-3.5 text-black" />
              </>
            ) : (
              <>
                <Linkedin className="w-3 h-3 text-emerald-400" />
                <span>{event.actionText || 'LinkedIn Post'}</span>
                <ExternalLink className="w-3 h-3" />
              </>
            )}
          </a>
        </div>
      </div>

    </article>
  );
}
