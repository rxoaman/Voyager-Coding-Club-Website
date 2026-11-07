import React, { useEffect, useRef } from 'react';

/**
 * InteractiveGridBackground
 * Renders a subtle, non-distracting sci-fi grid background on PC
 * that softly illuminates under and around the cursor.
 * Only activates pointer tracking on devices with a fine pointer (desktop / mouse).
 */
export default function InteractiveGridBackground() {
  const containerRef = useRef(null);
  const posRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000 });

  useEffect(() => {
    // Only enable cursor-reactive animation on devices with a mouse / fine pointer
    const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isDesktop) return;

    const el = containerRef.current;
    if (!el) return;

    let rafId;

    const handlePointerMove = (e) => {
      posRef.current.targetX = e.clientX;
      posRef.current.targetY = e.clientY;
    };

    const handleMouseLeave = () => {
      posRef.current.targetX = -1000;
      posRef.current.targetY = -1000;
    };

    // Smooth lerp loop for buttery fluid cursor illumination
    const animate = () => {
      const { x, y, targetX, targetY } = posRef.current;
      const nextX = x + (targetX - x) * 0.12;
      const nextY = y + (targetY - y) * 0.12;
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
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{
        '--cursor-x': '-1000px',
        '--cursor-y': '-1000px',
      }}
    >
      {/* 1. Base subtle ambient dark grid */}
      <div className="absolute inset-0 interactive-grid-base opacity-30" />

      {/* 2. Cursor illumination: subtle emerald spotlight on grid lines */}
      <div className="absolute inset-0 interactive-grid-glow opacity-75" />
    </div>
  );
}
