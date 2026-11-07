import React, { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Users,
  Linkedin, 
  Mail, 
  Github, 
  ExternalLink, 
  Terminal,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import ResilientImage from './ResilientImage';
import { animateDetailEnter, animateDetailExit } from '../animations/cardTransition';
import { TEAM_MEMBERS, SUB_TEAMS } from '../data/clubData';

export default function MemberDetail({ member }) {
  const navigate = useNavigate();
  const heroImageRef = useRef(null);
  const detailPanelRef = useRef(null);
  const containerRef = useRef(null);

  // Compute Current, Prev, and Next Team Member (cyclic navigation across 14 members)
  const totalMembers = TEAM_MEMBERS.length;
  const currentMemberIndex = member
    ? TEAM_MEMBERS.findIndex(
        (m) => m.id === member.id || m.badgeId === member.badgeId || String(m.badgeNumber) === String(member.badgeNumber)
      )
    : -1;

  const prevMember = currentMemberIndex >= 0
    ? TEAM_MEMBERS[(currentMemberIndex - 1 + totalMembers) % totalMembers]
    : TEAM_MEMBERS[totalMembers - 1];

  const nextMember = currentMemberIndex >= 0
    ? TEAM_MEMBERS[(currentMemberIndex + 1) % totalMembers]
    : TEAM_MEMBERS[0];

  // Compute Current, Prev, and Next Team (cyclic navigation across 4 core teams)
  const totalTeams = SUB_TEAMS.length;
  const currentTeamIndex = member
    ? SUB_TEAMS.findIndex(
        (t) => t.id === member.subTeamId || t.name.toLowerCase() === member.subTeam?.toLowerCase()
      )
    : -1;

  const prevTeam = currentTeamIndex >= 0
    ? SUB_TEAMS[(currentTeamIndex - 1 + totalTeams) % totalTeams]
    : SUB_TEAMS[totalTeams - 1];

  const nextTeam = currentTeamIndex >= 0
    ? SUB_TEAMS[(currentTeamIndex + 1) % totalTeams]
    : SUB_TEAMS[0];

  // First member / lead of prev and next team for fast team jumping
  const prevTeamLead = TEAM_MEMBERS.find(
    (m) => m.subTeamId === prevTeam.id || m.subTeam.toLowerCase() === prevTeam.name.toLowerCase()
  ) || TEAM_MEMBERS[0];

  const nextTeamLead = TEAM_MEMBERS.find(
    (m) => m.subTeamId === nextTeam.id || m.subTeam.toLowerCase() === nextTeam.name.toLowerCase()
  ) || TEAM_MEMBERS[0];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    animateDetailEnter({
      heroImageRef: heroImageRef.current,
      detailPanelRef: detailPanelRef.current
    });
  }, [member?.id]);

  const handleBack = () => {
    animateDetailExit({
      containerRef: containerRef.current,
      onComplete: () => {
        navigate('/#team');
      }
    });
  };

  const goToMember = useCallback((targetMember) => {
    if (!targetMember) return;
    navigate(`/team/${targetMember.id}`);
  }, [navigate]);

  const goToTeam = useCallback((targetLead) => {
    if (!targetLead) return;
    navigate(`/team/${targetLead.id}`);
  }, [navigate]);

  // Keyboard navigation: ArrowLeft (prev member), ArrowRight (next member), Escape (back)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowLeft') {
        goToMember(prevMember);
      } else if (e.key === 'ArrowRight') {
        goToMember(nextMember);
      } else if (e.key === 'Escape') {
        handleBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevMember, nextMember, goToMember]);

  if (!member) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center">
        <Terminal className="w-12 h-12 text-zinc-600 mb-4" />
        <h2 className="text-xl font-display font-bold text-white">Member not found</h2>
        <p className="font-mono text-xs text-zinc-400 mt-2">
          The requested badge identifier does not correspond to an active member record.
        </p>
        <button
          onClick={() => navigate('/#team')}
          className="mt-6 px-4 py-2 rounded-lg bg-emerald-500 text-black font-mono font-semibold text-xs"
        >
          Return to directory
        </button>
      </div>
    );
  }

  // Use the background-removed cutout portrait photo (from Google Drive folder)
  const cutoutPhoto = member.photoUrl || member.gdrivePhotoUrl || member.cardImage;

  return (
    <div
      ref={containerRef}
      className="member-detail-container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 relative z-10 select-none"
    >
      {/* Top Navigation Bar: Back to Team + Team Switcher + Member Switcher */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        
        {/* Left: Back to Team Directory */}
        <button
          onClick={handleBack}
          className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl liquid-glass-button text-zinc-200 hover:text-white font-mono text-xs select-none w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-emerald-400 group-hover:-translate-x-1 transition-transform" />
          <span>Back to team directory</span>
        </button>

        {/* Right: Quick Switch Controls for Team & Member */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Team Switcher Controls */}
          <div className="inline-flex items-center gap-1 bg-zinc-950/80 p-1 rounded-xl border border-white/10 font-mono text-xs">
            <button
              onClick={() => goToTeam(prevTeamLead)}
              title={`Switch to ${prevTeam.name}`}
              className="px-2.5 py-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">{prevTeam.name.replace(' Team', '')}</span>
              <span className="sm:hidden">Prev Team</span>
            </button>

            <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-400 font-bold border border-emerald-500/30 text-[11px]">
              {member.subTeam}
            </span>

            <button
              onClick={() => goToTeam(nextTeamLead)}
              title={`Switch to ${nextTeam.name}`}
              className="px-2.5 py-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="hidden sm:inline">{nextTeam.name.replace(' Team', '')}</span>
              <span className="sm:hidden">Next Team</span>
              <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
            </button>
          </div>

          {/* Member Switcher Controls */}
          <div className="inline-flex items-center gap-1 bg-zinc-950/80 p-1 rounded-xl border border-white/10 font-mono text-xs">
            <button
              onClick={() => goToMember(prevMember)}
              title={`Previous Member: ${prevMember.name}`}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              aria-label="Previous Team Member"
            >
              <ChevronLeft className="w-4 h-4 text-emerald-400" />
            </button>

            <span className="px-2 font-mono text-xs text-zinc-400 whitespace-nowrap">
              {currentMemberIndex >= 0 ? `${currentMemberIndex + 1} / ${totalMembers}` : 'MEMBER'}
            </span>

            <button
              onClick={() => goToMember(nextMember)}
              title={`Next Member: ${nextMember.name}`}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              aria-label="Next Team Member"
            >
              <ChevronRight className="w-4 h-4 text-emerald-400" />
            </button>
          </div>

        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        
        {/* LEFT: ONLY THE PHOTO OF THE PERSON EXTRACTED FROM THE ID CARD ONTO LIQUID GLASS PEDESTAL */}
        <div
          ref={heroImageRef}
          className="lg:col-span-5 flex flex-col items-center justify-center relative select-none"
        >
          {/* Frosted Liquid Glass Plinth / Backdrop Pedestal */}
          <div className="glass-pedestal relative w-full max-w-[390px] h-[480px] sm:h-[550px] rounded-3xl flex flex-col items-center justify-end p-6 overflow-hidden">
            
            {/* Top Badge Telemetry Tag */}
            <div className="absolute top-4 left-5 right-5 flex items-center justify-between z-20">
              <span className="font-mono text-xs font-bold text-white tracking-widest bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10">
                {member.badgeId || `VYR-${member.badgeNumber}`}
              </span>
              <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/70 backdrop-blur-md px-2.5 py-1 rounded-md border border-emerald-500/40 font-semibold uppercase">
                ACTIVE MEMBER
              </span>
            </div>

            {/* Ambient emerald backlight behind the cutout figure */}
            <div className="absolute inset-x-8 bottom-12 h-64 bg-emerald-500/15 rounded-full filter blur-3xl pointer-events-none" />

            {/* THE BACKGROUND-REMOVED CUTOUT PHOTO OF THE PERSON */}
            <div className="relative z-10 w-full h-[400px] sm:h-[460px] flex items-end justify-center">
              <ResilientImage
                src={cutoutPhoto}
                alt={member.name}
                name={member.name}
                className="w-full h-full flex items-end justify-center"
                imageClassName="w-auto h-full max-h-[460px] object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)]"
              />
            </div>

            {/* Bottom Floating Glass Identifier */}
            <div className="relative z-20 w-full mt-2 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-zinc-300">
              <span className="text-emerald-400 font-semibold">{member.subTeam}</span>
              <span className="text-zinc-500">VOYAGER // KCCITM</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Detailed Dossier inside Frosted Liquid-Glass Panel */}
        <div
          ref={detailPanelRef}
          className="lg:col-span-7 flex flex-col space-y-6 text-left liquid-glass rounded-3xl p-6 sm:p-8 relative"
        >
          {/* Eyebrow & Badge ID */}
          <div className="animate-item inline-flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30">
              {member.subTeam}
            </span>
            <span className="text-zinc-500">•</span>
            <span className="font-mono text-xs text-zinc-400">
              Card #{member.badgeNumber}
            </span>
          </div>

          {/* Member Name & Role */}
          <div className="animate-item space-y-1">
            <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
              {member.name}
            </h1>
            <p className="font-mono text-base sm:text-lg text-emerald-400 font-medium">
              {member.designation} {member.title && `— ${member.title}`}
            </p>
          </div>

          {/* Bio Overview */}
          {member.bio && (
            <div className="animate-item space-y-2 pt-2">
              <h3 className="font-mono text-xs uppercase tracking-wider text-zinc-400 font-semibold">
                Overview & Responsibilities
              </h3>
              <p className="font-sans text-zinc-200 text-sm sm:text-base leading-relaxed">
                {member.bio}
              </p>
            </div>
          )}

          {/* Technical Skills / Focus Areas */}
          {member.skills && member.skills.length > 0 && (
            <div className="animate-item space-y-2 pt-1">
              <h3 className="font-mono text-xs uppercase tracking-wider text-zinc-400 font-semibold">
                Core Specializations
              </h3>
              <div className="flex flex-wrap gap-2">
                {member.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-lg liquid-glass-button text-xs font-mono text-zinc-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Contact & Social Channels with Liquid Glass Buttons */}
          <div className="animate-item pt-4 border-t border-white/10 space-y-3">
            <h3 className="font-mono text-xs uppercase tracking-wider text-zinc-400 font-semibold">
              Direct Channels
            </h3>

            <div className="flex flex-wrap items-center gap-3">
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl liquid-glass-button text-zinc-200 hover:text-white font-mono text-xs"
                >
                  <Linkedin className="w-4 h-4 text-emerald-400" />
                  <span>LinkedIn profile</span>
                  <ExternalLink className="w-3 h-3 text-zinc-500" />
                </a>
              )}

              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl liquid-glass-button text-zinc-200 hover:text-white font-mono text-xs"
                >
                  <Mail className="w-4 h-4 text-emerald-400" />
                  <span>{member.email}</span>
                </a>
              )}

              {member.github && (
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl liquid-glass-button text-zinc-200 hover:text-white font-mono text-xs"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                  <ExternalLink className="w-3 h-3 text-zinc-500" />
                </a>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* BOTTOM QUICK-NAVIGATION DOCK: Full Prev / Next Member Cards & Team Switcher */}
      <div className="mt-12 liquid-glass rounded-3xl p-5 sm:p-7 border border-white/10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-5">
        
        {/* Previous Member Card */}
        <button
          type="button"
          onClick={() => goToMember(prevMember)}
          className="group w-full md:w-5/12 flex items-center gap-3.5 p-3 sm:p-4 rounded-2xl bg-black/40 hover:bg-zinc-900 border border-white/10 hover:border-emerald-500/40 transition-all text-left cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-emerald-400 group-hover:-translate-x-1 transition-transform shrink-0">
            <ChevronLeft className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-mono text-[10px] uppercase text-zinc-500 tracking-wider">
              Previous Member
            </div>
            <div className="font-display font-bold text-sm sm:text-base text-white group-hover:text-emerald-400 transition-colors truncate">
              {prevMember.name}
            </div>
            <div className="font-mono text-xs text-zinc-400 truncate">
              {prevMember.designation || prevMember.title} • <span className="text-emerald-400/80">{prevMember.subTeam}</span>
            </div>
          </div>
        </button>

        {/* Center Team Jump Bar */}
        <div className="flex flex-col items-center gap-2 shrink-0">
          <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">
            Change Team
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => goToTeam(prevTeamLead)}
              className="px-3 py-1.5 rounded-lg liquid-glass-button text-xs font-mono text-zinc-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
              title={`Jump to ${prevTeam.name}`}
            >
              <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" />
              <span>{prevTeam.name.replace(' Team', '')}</span>
            </button>
            <button
              type="button"
              onClick={() => goToTeam(nextTeamLead)}
              className="px-3 py-1.5 rounded-lg liquid-glass-button text-xs font-mono text-zinc-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
              title={`Jump to ${nextTeam.name}`}
            >
              <span>{nextTeam.name.replace(' Team', '')}</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
            </button>
          </div>
        </div>

        {/* Next Member Card */}
        <button
          type="button"
          onClick={() => goToMember(nextMember)}
          className="group w-full md:w-5/12 flex items-center justify-between gap-3.5 p-3 sm:p-4 rounded-2xl bg-black/40 hover:bg-zinc-900 border border-white/10 hover:border-emerald-500/40 transition-all text-right cursor-pointer"
        >
          <div className="min-w-0 flex-1">
            <div className="font-mono text-[10px] uppercase text-zinc-500 tracking-wider">
              Next Member
            </div>
            <div className="font-display font-bold text-sm sm:text-base text-white group-hover:text-emerald-400 transition-colors truncate">
              {nextMember.name}
            </div>
            <div className="font-mono text-xs text-zinc-400 truncate">
              {nextMember.designation || nextMember.title} • <span className="text-emerald-400/80">{nextMember.subTeam}</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-emerald-400 group-hover:translate-x-1 transition-transform shrink-0">
            <ChevronRight className="w-5 h-5" />
          </div>
        </button>

      </div>
    </div>
  );
}
