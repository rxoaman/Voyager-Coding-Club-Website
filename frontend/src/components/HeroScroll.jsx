import React, { useEffect, useRef } from 'react';
import { ArrowDown, Calendar, Users, Terminal } from 'lucide-react';
import { initHeroScrollAnimation } from '../animations/heroFlight';

export default function HeroScroll({ navLogoTargetRef }) {
  const heroLogoRef = useRef(null);
  const heroTextRef = useRef(null);
  const heroPillRef = useRef(null);
  const heroSectionRef = useRef(null);

  useEffect(() => {
    if (!heroLogoRef.current || !heroTextRef.current || !navLogoTargetRef?.current) return;

    const cleanup = initHeroScrollAnimation({
      heroLogoRef: heroLogoRef.current,
      navLogoTargetRef: navLogoTargetRef.current,
      heroTextRef: heroTextRef.current,
      heroPillRef: heroPillRef.current,
      scrollThreshold: 450
    });

    return cleanup;
  }, [navLogoTargetRef]);

  return (
    <section
      ref={heroSectionRef}
      className="relative min-h-0 sm:min-h-screen flex items-center justify-center pt-20 sm:pt-24 pb-6 sm:pb-16 px-4 sm:px-6 lg:px-8 canvas-grid"
    >
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
        
        {/* LEFT COLUMN: Large Voyager Binary Cube Emblem */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center order-1">
          <div
            ref={heroLogoRef}
            className="relative z-20 w-64 h-64 sm:w-80 sm:h-80 xl:w-96 xl:h-96 flex items-center justify-center p-4 will-change-transform select-none"
          >
            {/* The Voyager Binary Isometric Cube Logo */}
            <img
              src="/assets/Logo_Cube.png"
              alt="Voyager Coding Club Emblem"
              className="w-full h-full object-contain filter drop-shadow-[0_4px_24px_rgba(16,185,129,0.3)] transition-transform duration-300"
            />
          </div>

          <div ref={heroPillRef} className="mt-3 flex items-center gap-2 font-mono text-xs text-zinc-200 bg-zinc-950/80 px-3.5 py-1 rounded-full border border-white/10 transition-opacity duration-150">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>VOYAGER CODING CLUB</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Info & Copy */}
        <div
          ref={heroTextRef}
          className="lg:col-span-7 flex flex-col space-y-6 text-left origin-top order-2"
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/10 w-fit">
            <span className="font-mono text-xs text-emerald-400 uppercase tracking-widest">
              Student Event Organizing Club
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="font-display font-extrabold text-4xl sm:text-6xl text-white tracking-tight leading-none">
              Voyager <br />
              <span className="text-emerald-400">Coding Club</span>
            </h1>

            <p className="font-mono text-sm sm:text-base text-zinc-300 tracking-wider">
              Grow | Collaborate | Connect
            </p>
          </div>

          {/* Plain, un-slopped copy */}
          <p className="text-zinc-300 text-base sm:text-lg leading-relaxed max-w-xl font-normal">
            The student coding organization at KCC Institute of Technology & Management. We organize hackathons, run code reviews, and build open projects across software development, algorithms, and applied machine learning.
          </p>

          {/* Action links */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a
              href="#events"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs tracking-wider transition-colors shadow-sm"
            >
              <Calendar className="w-4 h-4" />
              <span>EXPLORE EVENTS</span>
            </a>

            <a
              href="#team"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white border border-white/10 font-mono text-xs tracking-wider transition-colors"
            >
              <Users className="w-4 h-4 text-emerald-400" />
              <span>TEAM DIRECTORY</span>
            </a>
          </div>

          {/* Key metrics */}
          <div className="pt-6 border-t border-zinc-800/80 grid grid-cols-3 gap-6 max-w-md">
            <div>
              <div className="font-mono text-2xl font-bold text-white">4</div>
              <div className="text-xs font-mono text-zinc-400">Flagship events</div>
            </div>
            <div>
              <div className="font-mono text-2xl font-bold text-emerald-400">14</div>
              <div className="text-xs font-mono text-zinc-400">Core badges</div>
            </div>
            <div>
              <div className="font-mono text-2xl font-bold text-white">750+</div>
              <div className="text-xs font-mono text-zinc-400">Participants</div>
            </div>
          </div>
        </div>

      </div>

      {/* Scroll indicator prompt - hidden on mobile to prevent dead vertical void */}
      <div className="hidden sm:flex absolute bottom-5 left-1/2 -translate-x-1/2 items-center gap-2 text-zinc-500 text-xs font-mono select-none pointer-events-none">
        <span>Scroll to explore</span>
        <ArrowDown className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
      </div>
    </section>
  );
}
