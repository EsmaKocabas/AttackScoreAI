import axios from "axios";

const api = axios.create({
  baseURL: "https://fantasy.premierleague.com",
});

async function getExternalTeams() {
  try {
    const response = await api.get("/api/bootstrap-static/");
    const teams = response.data.teams;
    
    return teams.map((team) => ({
      id: team.id,
      name: team.name,
      short_name: team.short_name,
    }));
  } catch (error) {
    console.error("FPL Teams API Error:", error.message);
    throw new Error(`FPL teams alınamadı: ${error.message}`);
  }
}

export default {
  getExternalTeams,
};

