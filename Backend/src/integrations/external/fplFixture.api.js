import axios from "axios";
import fplTeamsApi from "./fplTeams.api.js";

const api = axios.create({
  baseURL: "https://fantasy.premierleague.com",
});

async function getExternalUpcomingFixtures() {
  const [fixturesRes, teams] = await Promise.all([
    api.get("/api/fixtures/"),
    fplTeamsApi.getExternalTeams(),
  ]);

  const fixtures = fixturesRes.data;

  // teamId -> teamName map
  const teamMap = {};
  teams.forEach((team) => {
    teamMap[team.id] = team.name;
  });

  const now = new Date();

  const upcoming = fixtures
    .filter(
      (f) => f.kickoff_time && new Date(f.kickoff_time) > now
    )
    .sort(
      (a, b) =>
        new Date(a.kickoff_time) -
        new Date(b.kickoff_time)
    )
    .slice(0, 10)
    .map((f) => ({
      kickoff_time: f.kickoff_time,
      homeTeam: teamMap[f.team_h],
      awayTeam: teamMap[f.team_a],
      gameweek: f.event,
    }));

  return upcoming;
}

export default {
  getExternalUpcomingFixtures,
};
