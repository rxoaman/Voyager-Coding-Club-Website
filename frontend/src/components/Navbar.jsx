import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Linkedin, ExternalLink } from 'lucide-react';

export default function Navbar({ navLogoTargetRef }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/', hash: '' },
    { name: 'Events', path: '/#events', hash: 'events' },
    { name: 'Team', path: '/#teams', hash: 'teams' },
  ];

  const handleScrollTo = (hash) => {
    setMobileMenuOpen(false);
    const newHash = hash ? '#' + hash : '';
    const newUrl = window.location.pathname + newHash;
    if (window.location.hash !== newHash) {
      window.history.pushState(null, '', newUrl);
    }

    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(hash) || (hash === 'teams' ? document.getElementById('team') : null);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'liquid-glass border-b border-white/10'
          : 'bg-black/30 backdrop-blur-sm border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 min-h-[4.25rem] sm:min-h-[5rem] flex items-center justify-between">
        
        {/* Left: Brand & Clean Unboxed Voyager Logo */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            onClick={() => handleScrollTo('')}
            className="flex items-center gap-2.5 group select-none"
          >
            {/* The Target Container: Clean Unboxed Logo matching text height */}
            <div
              ref={navLogoTargetRef}
              className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center transition-all duration-300 overflow-visible ${
                isHomePage ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
              }`}
              title="Voyager Logo"
            >
              <img
                src="/assets/Logo_Cube.png"
                alt="Voyager Logo"
                className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(16,185,129,0.4)]"
              />
            </div>

            <div className="flex flex-col">
              <span className="font-display font-extrabold text-lg sm:text-xl tracking-wider text-white group-hover:text-emerald-400 transition-colors leading-none">
                VOYAGER
              </span>
              <span className="font-mono text-[9px] sm:text-[10px] text-zinc-400 tracking-widest uppercase mt-0.5">
                CODING CLUB
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.path}
              onClick={(e) => {
                if (isHomePage) {
                  e.preventDefault();
                  handleScrollTo(link.hash);
                }
              }}
              className="px-4 py-2 rounded-lg font-mono text-xs tracking-wider text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right: Top right LinkedIn Link */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href="https://www.linkedin.com/company/voyager-kccitm/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-white/15 bg-zinc-950 text-xs font-mono text-zinc-200 hover:text-white hover:border-emerald-500 hover:bg-zinc-900 transition-all"
            title="Voyager Coding Club on LinkedIn"
          >
            <Linkedin className="w-3.5 h-3.5 text-emerald-400" />
            <span>LinkedIn</span>
            <ExternalLink className="w-3 h-3 text-zinc-500" />
          </a>
        </div>

        {/* Mobile 2-line menu toggle button with smooth morph animation into cross */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden relative w-10 h-10 rounded-lg bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white flex flex-col items-center justify-center gap-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-colors"
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileMenuOpen}
        >
          <span
            className={`w-5 h-0.5 bg-current rounded-full transition-all duration-300 ease-in-out ${
              mobileMenuOpen ? "rotate-45 translate-y-[4px]" : "rotate-0 translate-y-0"
            }`}
          />
          <span
            className={`w-5 h-0.5 bg-current rounded-full transition-all duration-300 ease-in-out ${
              mobileMenuOpen ? "-rotate-45 -translate-y-[4px]" : "rotate-0 translate-y-0"
            }`}
          />
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 border-b border-white/10 px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.path}
              onClick={(e) => {
                if (isHomePage) {
                  e.preventDefault();
                  handleScrollTo(link.hash);
                } else {
                  setMobileMenuOpen(false);
                }
              }}
              className="block px-3 py-2 rounded-lg font-mono text-sm text-zinc-200 hover:text-white hover:bg-zinc-900"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-3 border-t border-zinc-800">
            <a
              href="https://www.linkedin.com/company/voyager-kccitm/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-zinc-900 text-xs font-mono text-zinc-200 hover:text-white"
            >
              <div className="flex items-center gap-2">
                <Linkedin className="w-3.5 h-3.5 text-emerald-400" />
                <span>LinkedIn</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
