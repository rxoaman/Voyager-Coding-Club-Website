import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 pt-24 pb-16">
      <div className="max-w-md w-full bg-[#0D1524] border border-cyber-border rounded-2xl p-8 text-center shadow-badge">
        <div className="w-14 h-14 rounded-2xl bg-[#00FF88]/10 border border-[#00FF88]/30 flex items-center justify-center mx-auto mb-4 text-[#00FF88]">
          <Terminal className="w-7 h-7" />
        </div>

        <h1 className="font-display font-extrabold text-4xl text-white mb-2">404</h1>
        <p className="font-mono text-sm text-[#00FF88] mb-4">SECTOR_NOT_FOUND</p>
        <p className="font-sans text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
          The requested coordinate does not exist in the Voyager telemetry system.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00FF88] to-[#10B981] text-black font-mono font-bold text-xs shadow-glow-green hover:brightness-110 transition-all"
        >
          <Home className="w-4 h-4" />
          <span>RETURN TO ORBIT (HOME)</span>
        </Link>
      </div>
    </div>
  );
}
