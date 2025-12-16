import externalFixtureApi from "../integrations/external/fplFixture.api.js";
    
class FixtureService {
  async getUpcomingFplFixtures() {
    return await externalFixtureApi.getExternalUpcomingFixtures();
  }
}

export default new FixtureService();