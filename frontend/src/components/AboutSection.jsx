import React from 'react';
import { Terminal, Code, Cpu, Shield, Palette, Sparkles, Building2, Layers } from 'lucide-react';

export default function AboutSection() {
  const domains = [
    {
      title: 'Software Development',
      icon: Code,
      color: 'text-[#00FF88]',
      borderColor: 'border-[#00FF88]/30',
      bgColor: 'bg-[#00FF88]/5',
      desc: 'Architecting scalable web applications, cross-platform mobile apps, cloud microservices, and high-impact open source repositories.'
    },
    {
      title: 'Competitive Programming',
      icon: Terminal,
      color: 'text-[#EF4444]',
      borderColor: 'border-[#EF4444]/30',
      bgColor: 'bg-[#EF4444]/5',
      desc: 'Mastering data structures, dynamic programming algorithms, graph heuristics, and competing in global ICPC, Codeforces, and LeetCode contests.'
    },
    {
      title: 'Machine Learning',
      icon: Cpu,
      color: 'text-[#A855F7]',
      borderColor: 'border-[#A855F7]/30',
      bgColor: 'bg-[#A855F7]/5',
      desc: 'Exploring applied AI, deep neural networks, computer vision, natural language transformers, and intelligent automated agents.'
    },
    {
      title: 'Cybersecurity',
      icon: Shield,
      color: 'text-[#06B6D4]',
      borderColor: 'border-[#06B6D4]/30',
      bgColor: 'bg-[#06B6D4]/5',
      desc: 'Investigating vulnerability vectors, ethical hacking methodologies, cryptography fundamentals, and competing in nationwide CTF challenges.'
    },
    {
      title: 'Design & Creative',
      icon: Palette,
      color: 'text-[#F97316]',
      borderColor: 'border-[#F97316]/30',
      bgColor: 'bg-[#F97316]/5',
      desc: 'Crafting intuitive UI/UX journeys, tactile physical badge designs, 3D vector emblems, typography hierarchies, and brand identities.'
    }
  ];

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 border-t border-slate-800/80">
      
      {/* Header */}
      <div className="max-w-3xl mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 mb-3">
          <Layers className="w-3.5 h-3.5 text-[#10B981]" />
          <span className="font-mono text-xs font-semibold text-[#10B981] uppercase tracking-wider">
            MISSION & FIVE PILLARS
          </span>
        </div>

        <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
          Engineering The Future at <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF88] to-cyan-400">KCCITM</span>
        </h2>

        <p className="font-sans text-slate-300 text-base sm:text-lg mt-3 leading-relaxed">
          Voyager Coding Club is the premier student-governed technology community at KCC Institute of Technology & Management, Greater Noida. We bridge the gap between classroom theory and real-world tech systems through five core specializations.
        </p>
      </div>

      {/* Domain Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {domains.map((dom, i) => {
          const Icon = dom.icon;
          return (
            <div
              key={i}
              className={`p-6 rounded-2xl border ${dom.borderColor} ${dom.bgColor} backdrop-blur-sm hover:border-[#00FF88]/50 hover:shadow-glow-green/10 transition-all duration-300 flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-[#090E18] border border-cyber-border ${dom.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-xs text-slate-500">0{i + 1}</span>
                </div>

                <h3 className="font-display font-bold text-xl text-white mb-2">
                  {dom.title}
                </h3>

                <p className="font-sans text-sm text-slate-300 leading-relaxed">
                  {dom.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center gap-1.5 text-xs font-mono text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88]" />
                <span>ACTIVE DOMAIN TRACK</span>
              </div>
            </div>
          );
        })}

        {/* Sixth Card: Club Philosophy */}
        <div className="p-6 rounded-2xl border border-cyber-border/80 bg-gradient-to-br from-[#0F182A] to-[#080D18] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/30">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="font-mono text-xs text-slate-500">06</span>
            </div>

            <h3 className="font-display font-bold text-xl text-white mb-2">
              Our Core Creed
            </h3>

            <p className="font-sans text-sm text-slate-300 leading-relaxed">
              "We believe great engineers are forged by shipping code, not just reading tutorials. No gatekeeping, no pedigree filters — only passion and execution."
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono text-[#00FF88]">
            <span>VOYAGER CODING CLUB</span>
            <span>EST. KCCITM</span>
          </div>
        </div>

      </div>

    </section>
  );
}
