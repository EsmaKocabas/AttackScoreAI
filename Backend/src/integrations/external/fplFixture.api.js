import axios from "axios";

const api = axios.create({
  baseURL: "https://fantasy.premierleague.com",
});

async function getExternalUpcomingFixtures() {
  const response = await api.get("/api/fixtures/");
  const fixtures = response.data;

  const now = new Date();

  // SADECE GELECEK MAÇLAR
  const upcoming = fixtures.filter(
    (f) => f.kickoff_time && new Date(f.kickoff_time) > now
  );

  return upcoming;
}

export default {
  getExternalUpcomingFixtures,
};
