import fplFixtureApi from "../integrations/external/fplFixture.api.js";
    
class FixtureService {
  async getUpcomingFplFixtures() {
    return await fplFixtureApi.getExternalUpcomingFixtures();
  }
}

export default new FixtureService();