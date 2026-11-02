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
      className="badge-container group cursor-pointer w-[285px] sm:w-[305px] shrink-0 snap-start select-none"
    >
      {/* Physical Lanyard Assembly: Clip and Strap */}
      <div className="relative w-full h-6 sm:h-7 flex items-center justify-center">
        <div className="lanyard-strap" />
        <div className="lanyard-clip" />
      </div>

      {/* The Physical Card Body with Liquid Glass effect */}
      <div className="id-card-badge liquid-glass-card p-4 sm:p-4.5 flex flex-col justify-between h-[435px] sm:h-[455px] relative">
        
        {/* Lanyard slot punch */}
        <div className="lanyard-slot mb-2.5">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-1 bg-zinc-800 rounded-full" />
          </div>
        </div>

        {/* Card Header */}
        <div className="flex items-center justify-between px-1 mb-2">
          <span className="font-mono text-[11px] text-zinc-400 font-semibold tracking-wider">
            {member.badgeId || `VYR-${member.badgeNumber}`}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
            ACTIVE
          </span>
        </div>

        {/* Member Portrait Frame - Larger and prominent */}
        <div className="relative w-full h-[220px] sm:h-[235px] rounded-xl overflow-hidden border border-white/10 bg-black/60 shadow-inner">
          <ResilientImage
            src={member.cardImage}
            alt={`${member.name} ID Card`}
            name={member.name}
            className="w-full h-full"
            imageClassName="w-full h-full object-contain p-1 group-hover:scale-103 transition-transform duration-300"
          />
        </div>

        {/* Member Information - Larger readable typography */}
        <div className="mt-2.5 space-y-1 text-left px-1">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base sm:text-lg text-white group-hover:text-emerald-400 transition-colors truncate">
              {member.name}
            </h3>
            <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>

          <p className="font-mono text-xs sm:text-sm text-zinc-400 truncate">
            {member.designation || member.title}
          </p>
        </div>

        {/* Card Footer: Barcode + Social Links */}
        <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between px-1">
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
