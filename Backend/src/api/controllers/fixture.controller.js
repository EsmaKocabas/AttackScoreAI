import fixtureService from "../../services/fixture.service.js";

export const getUpcomingFplFixtures = async (req, res) => {
  try {
    const fixtures = await fixtureService.getUpcomingFplFixtures();
    return res.status(200).json(fixtures);
  } catch (error) {
    console.error("FPL fixtures error:", error.message);
    return res.status(500).json({ error: error.message || "FPL fixtures error" });
  }
};
