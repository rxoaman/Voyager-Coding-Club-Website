import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Linkedin, Mail, ArrowUpRight } from 'lucide-react';
import ResilientImage from './ResilientImage';

export default function IdCard({ member }) {
  const navigate = useNavigate();

  const handleCardClick = (e) => {
    if (e.target.closest('a')) return;
    navigate(`/team/${member.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="badge-container group cursor-pointer w-[min(calc(100vw-5rem),285px)] sm:w-[285px] shrink-0 select-none pt-2"
    >
      {/* Compact Top Badge Clip - Sits flush right at the top of the card without projecting upwards */}
      <div className="w-full flex justify-center -mb-2 z-20 relative">
        <div className="lanyard-clip" />
      </div>

      {/* The Physical Card Body with Liquid Glass effect */}
      <div className="id-card-badge liquid-glass-card p-3.5 sm:p-4 flex flex-col justify-between h-[415px] sm:h-[430px] relative overflow-hidden rounded-2xl border border-white/10">
        
        {/* Lanyard slot punch */}
        <div className="lanyard-slot mb-2 shrink-0">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-5 h-1 bg-zinc-800 rounded-full" />
          </div>
        </div>

        {/* Card Header */}
        <div className="flex items-center justify-between px-1 mb-1.5 shrink-0">
          <span className="font-mono text-[11px] text-zinc-400 font-semibold tracking-wider">
            {member.badgeId || `VYR-${member.badgeNumber}`}
          </span>
          <span className="font-mono text-[9px] uppercase tracking-widest text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 font-bold">
            ACTIVE
          </span>
        </div>

        {/* Member Portrait Frame - Sized to prevent any card overflow */}
        <div className="relative w-full h-[195px] sm:h-[205px] rounded-xl overflow-hidden border border-white/10 bg-black/60 shadow-inner shrink-0">
          <ResilientImage
            src={member.cardImage}
            alt={`${member.name} ID Card`}
            name={member.name}
            className="w-full h-full"
            imageClassName="w-full h-full object-contain p-1 group-hover:scale-103 transition-transform duration-300"
          />
        </div>

        {/* Member Information */}
        <div className="mt-2 space-y-0.5 text-left px-1 shrink-0">
          <div className="flex items-center justify-between gap-1">
            <h3 className="font-display font-bold text-sm sm:text-base text-white group-hover:text-emerald-400 transition-colors truncate">
              {member.name}
            </h3>
            <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
          </div>

          <p className="font-mono text-xs text-zinc-400 truncate">
            {member.designation || member.title}
          </p>
        </div>

        {/* Card Footer: Barcode + Social Links */}
        <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between px-1 shrink-0">
          {/* Barcode */}
          <div className="barcode-strip" title="Security Token Hash">
            <div className="barcode-bar w-1" />
            <div className="barcode-bar w-0.5" />
            <div className="barcode-bar w-1.5" />
            <div className="barcode-bar w-1" />
            <div className="barcode-bar w-0.5" />
            <div className="barcode-bar w-1" />
            <div className="barcode-bar w-2" />
            <div className="barcode-bar w-0.5" />
            <div className="barcode-bar w-1.5" />
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-1.5">
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 rounded-lg liquid-glass-button text-zinc-400 hover:text-white"
                title="LinkedIn Profile"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>
            )}

            {member.email && (
              <a
                href={`mailto:${member.email}`}
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 rounded-lg liquid-glass-button text-zinc-400 hover:text-white"
                title="Email Member"
              >
                <Mail className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
