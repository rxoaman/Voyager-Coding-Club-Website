import React from 'react';
import { Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-900 bg-black text-zinc-400 py-12 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-white/10 p-1 flex items-center justify-center">
            <img src="/assets/Logo_Cube.png" alt="Voyager" className="w-full h-full object-contain" />
          </div>
          <span className="font-display font-bold text-sm text-white tracking-wider">
            VOYAGER CODING CLUB
          </span>
          <span className="text-zinc-600">/</span>
          <span className="font-mono text-xs text-zinc-400">
            KCC Institute of Technology & Management
          </span>
        </div>

        {/* Socials */}
        <div className="flex items-center gap-3">
          <a
            href="https://www.linkedin.com/company/voyager-kccitm/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-zinc-950 border border-white/10 hover:border-emerald-500 text-zinc-300 hover:text-white transition-colors"
            title="LinkedIn"
          >
            <Linkedin className="w-4 h-4 text-emerald-400" />
          </a>

          <a
            href="https://www.instagram.com/voyager.kccitm/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-zinc-950 border border-white/10 hover:border-emerald-500 text-zinc-300 hover:text-white transition-colors"
            title="Instagram"
          >
            <Instagram className="w-4 h-4" />
          </a>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-6 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-zinc-500 gap-2">
        <div>
          © {new Date().getFullYear()} Voyager Coding Club, KCCITM.
        </div>
        <div>
          <a target="_blank" href="mailto:voyager.codingclub@gmail.com">Contact Us</a>
        </div>
      </div>
    </footer>
  );
}
