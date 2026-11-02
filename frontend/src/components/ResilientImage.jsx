import React, { useState } from 'react';
import SVGAvatarPlaceholder from './SVGAvatarPlaceholder';

export default function ResilientImage({
  src,
  alt = 'Voyager Asset',
  name = '',
  className = '',
  imageClassName = 'w-full h-full object-cover',
  fallbackType = 'avatar',
  ...props
}) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  if (!src || hasError) {
    if (fallbackType === 'avatar') {
      return (
        <SVGAvatarPlaceholder
          name={name || alt}
          alt={alt}
          className={className}
        />
      );
    }

    // Banner fallback
    return (
      <div className={`relative flex flex-col items-center justify-center bg-zinc-950 border border-white/10 text-zinc-400 p-6 text-center select-none ${className}`}>
        <div className="w-8 h-8 rounded-lg border border-emerald-500/30 bg-black flex items-center justify-center mb-2">
          <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="font-display font-medium text-xs text-zinc-200">{alt}</p>
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-1">VOYAGER EVENT</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-zinc-950 flex items-center justify-center">
          <span className="font-mono text-[10px] text-zinc-500 tracking-wider">LOADING...</span>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${imageClassName} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        {...props}
      />
    </div>
  );
}
