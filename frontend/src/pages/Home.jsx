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

  return (
    <div className="relative">
      {/* Hero with Logo on Left and Info on Right + Flight Animation */}
      <HeroScroll navLogoTargetRef={navLogoTargetRef} />

      {/* SINGLE UNIFIED SECTION: Club Events and Team Members together */}
      <div
        id="club-portal"
        className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12 relative z-10"
      >
        {/* Flagship Events Section with clean snap-in */}
        <EventsGrid events={events} />

        {/* Team Section with clean snap-in where the entire section fits in view */}
        <TeamGrid members={teamData.members} subTeams={teamData.subTeams} />
      </div>
    </div>
  );
}
