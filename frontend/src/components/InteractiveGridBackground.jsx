import React, { useEffect, useRef, useState } from 'react';

/**
 * InteractiveGridBackground
 * Renders a subtle, non-distracting sci-fi grid background on PC
 * with little green dots on the crossed sections, vignette fading
 * between corners, and a rotating green-tinted star following the mouse cursor.
 */
export default function InteractiveGridBackground() {
  const containerRef = useRef(null);
  const posRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000 });
  const [hasCursor, setHasCursor] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Only enable cursor-reactive animation on devices with a mouse / fine pointer
    const desktopQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    setIsDesktop(desktopQuery.matches);

    if (!desktopQuery.matches) return;

    const el = containerRef.current;
    if (!el) return;

    let rafId;

    const handlePointerMove = (e) => {
      posRef.current.targetX = e.clientX;
      posRef.current.targetY = e.clientY;
      setHasCursor(true);
    };

    const handleMouseLeave = () => {
      posRef.current.targetX = -1000;
      posRef.current.targetY = -1000;
      setHasCursor(false);
    };

    // Smooth lerp loop for buttery fluid cursor illumination & star follower
    const animate = () => {
      const { x, y, targetX, targetY } = posRef.current;
      const nextX = x + (targetX - x) * 0.15;
      const nextY = y + (targetY - y) * 0.15;
      posRef.current.x = nextX;
      posRef.current.y = nextY;

      if (el) {
        el.style.setProperty('--cursor-x', `${nextX.toFixed(1)}px`);
        el.style.setProperty('--cursor-y', `${nextY.toFixed(1)}px`);
      }

      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      style={{
        '--cursor-x': '-1000px',
        '--cursor-y': '-1000px',
      }}
    >
      {/* 1. Base subtle ambient grid lines with vignette mask (lines disappear towards corners) */}
      <div className="absolute inset-0 interactive-grid-base opacity-40" />

      {/* 2. Little glowing green dots on the crossed section of the grids */}
      <div className="absolute inset-0 interactive-grid-dots opacity-70" />

      {/* 3. Cursor illumination spotlight on grid lines */}
      <div className="absolute inset-0 interactive-grid-glow opacity-60" />

      {/* 4. Cursor illumination on intersection dots */}
      <div className="absolute inset-0 interactive-grid-dots-glow opacity-80" />

      {/* 5. Rotating green-tinted star following the mouse cursor */}
      {isDesktop && (
        <div
          className="fixed pointer-events-none z-50 transition-opacity duration-300 will-change-transform"
          style={{
            left: 0,
            top: 0,
            transform: 'translate3d(calc(var(--cursor-x) - 14px), calc(var(--cursor-y) - 14px), 0)',
            opacity: hasCursor ? 1 : 0,
          }}
        >
          <div className="relative w-7 h-7 flex items-center justify-center animate-star-spin">
            {/* Ambient green aura glow behind star */}
            <div className="absolute inset-0 rounded-full bg-emerald-400/35 blur-[6px] animate-pulse" />

            {/* 4-point sci-fi SVG Star */}
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 text-emerald-400 fill-emerald-400 filter drop-shadow-[0_0_8px_rgba(0,255,136,0.9)]"
            >
              <path d="M12 0 C12 6.627 6.627 12 0 12 C6.627 12 12 17.373 12 24 C12 17.373 17.373 12 24 12 C17.373 12 12 6.627 12 0 Z" />
            </svg>

            {/* Center bright core spark */}
            <div className="absolute w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#00FF88]" />
          </div>
        </div>
      )}
    </div>
  );
}
