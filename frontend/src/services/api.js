// Client service for fetching Events, Team, and Member data

// Embedded fallback data for seamless zero-config local frontend development & static preview
import { CLUB_INFO, EVENTS, SUB_TEAMS, TEAM_MEMBERS, getTeamMemberById } from '../data/clubData.js';

const API_BASE = '/api';

export async function fetchEvents(category = '', status = '') {
  try {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (status) params.append('status', status);

    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_BASE}/events${query}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.data || json;
  } catch (err) {
    console.warn('API /api/events offline or unreachable, using local data fallback.', err);
    let result = [...EVENTS];
    if (category) result = result.filter(e => e.category.toLowerCase() === category.toLowerCase());
    if (status) result = result.filter(e => e.status.toLowerCase() === status.toLowerCase());
    return result;
  }
}

export async function fetchTeam(subTeam = '') {
  try {
    const query = subTeam ? `?subTeam=${encodeURIComponent(subTeam)}` : '';
    const res = await fetch(`${API_BASE}/team${query}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return {
      club: json.club || CLUB_INFO,
      subTeams: json.subTeams || SUB_TEAMS,
      members: json.data || []
    };
  } catch (err) {
    console.warn('API /api/team offline or unreachable, using local data fallback.', err);
    let members = [...TEAM_MEMBERS];
    if (subTeam) {
      members = members.filter(m => m.subTeamId === subTeam || m.subTeam.toLowerCase() === subTeam.toLowerCase());
    }
    return {
      club: CLUB_INFO,
      subTeams: SUB_TEAMS,
      members
    };
  }
}

export async function fetchMemberById(id) {
  try {
    const res = await fetch(`${API_BASE}/team/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn(`API /api/team/${id} offline or unreachable, using local data fallback.`, err);
    return getTeamMemberById(id);
  }
}
