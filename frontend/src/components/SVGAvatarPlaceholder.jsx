import React from 'react';

export default function SVGAvatarPlaceholder({ name = 'Member', className = '', alt = '' }) {
  const initials = name
    ? name
        .split(' ')
        .map(w => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'VY';

  return (
    <div className={`relative flex flex-col items-center justify-center bg-zinc-950 border border-white/10 rounded-lg overflow-hidden select-none ${className}`}>
      <div className="relative z-10 flex flex-col items-center text-center p-4">
        <div className="w-14 h-14 rounded-full border border-emerald-500/40 bg-black flex items-center justify-center mb-2">
          <span className="font-mono font-bold text-base text-emerald-400 tracking-wider">{initials}</span>
        </div>
        <p className="font-display font-semibold text-xs text-zinc-200 tracking-wide line-clamp-1 max-w-[140px]">
          {name}
        </p>
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-1">
          {alt || 'VOYAGER'}
        </span>
      </div>
    </div>
  );
}
