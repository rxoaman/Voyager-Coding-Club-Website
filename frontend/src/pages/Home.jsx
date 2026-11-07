import React, { useEffect, useState } from 'react';
import HeroScroll from '../components/HeroScroll';
import EventsGrid from '../components/EventsGrid';
import TeamGrid from '../components/TeamGrid';
import { fetchEvents, fetchTeam } from '../services/api';
import { EVENTS, TEAM_MEMBERS, SUB_TEAMS } from '../data/clubData';

export default function Home({ navLogoTargetRef }) {
  const [events, setEvents] = useState(() => EVENTS);
  const [teamData, setTeamData] = useState(() => ({
    members: TEAM_MEMBERS,
    subTeams: SUB_TEAMS
  }));

  useEffect(() => {
    let isMounted = true;

    async function syncData() {
      try {
        const [eventsRes, teamRes] = await Promise.all([
          fetchEvents(),
          fetchTeam()
        ]);

        if (isMounted) {
          if (eventsRes && Array.isArray(eventsRes) && eventsRes.length > 0) {
            setEvents(eventsRes);
          }
          if (teamRes && teamRes.members && teamRes.members.length > 0) {
            setTeamData(teamRes);
          }
        }
      } catch (err) {
        console.warn('Syncing with API failed, using embedded data:', err);
      }
    }

    syncData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Smoothly scroll to initial hash on mount (e.g. #events, #teams, #team)
  useEffect(() => {
    if (window.location.hash) {
      const rawHash = window.location.hash.slice(1).toLowerCase();
      const targetId = (rawHash === 'teams' || rawHash.startsWith('teams-')) ? 'teams' : (rawHash.startsWith('team-') ? 'team' : rawHash);
      const timer = setTimeout(() => {
        const el = document.getElementById(targetId) || document.getElementById(rawHash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 350);
      return () => clearTimeout(timer);
    }
  }, []);

  // Dynamic Scroll-Spy: Synchronize URL hash with visible section as user scrolls
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPos = window.scrollY;
          const windowHeight = window.innerHeight;

          // Hero threshold: Near top of page, clear hash
          if (scrollPos < 280) {
            if (window.location.hash !== '') {
              window.history.replaceState(null, '', window.location.pathname);
            }
            ticking = false;
            return;
          }

          const eventsEl = document.getElementById('events');
          const teamEl = document.getElementById('team') || document.getElementById('teams');

          if (eventsEl && teamEl) {
            const eventsRect = eventsEl.getBoundingClientRect();
            const teamRect = teamEl.getBoundingClientRect();
            const viewportCenter = windowHeight / 2;

            if (teamRect.top <= viewportCenter && teamRect.bottom >= viewportCenter) {
              // Inside Team section: keep active sub-team route or default to #teams
              const currentHash = window.location.hash;
              if (!currentHash.includes('team')) {
                window.history.replaceState(null, '', '#teams');
              }
            } else if (eventsRect.top <= viewportCenter && eventsRect.bottom >= viewportCenter) {
              if (window.location.hash !== '#events') {
                window.history.replaceState(null, '', '#events');
              }
            }
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative">
      {/* Hero with Logo on Left and Info on Right + Flight Animation */}
      <HeroScroll navLogoTargetRef={navLogoTargetRef} />

      {/* Flagship Events Section with Anime.js v4 Pinned Horizontal Scroll */}
      <EventsGrid events={events} />

      {/* Team Section with Anime.js v4 Pinned Horizontal Scroll */}
      <TeamGrid members={teamData.members} subTeams={teamData.subTeams} />
    </div>
  );
}
