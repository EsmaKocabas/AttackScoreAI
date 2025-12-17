import analyticsRepository from "../repositories/analytics.repository.js";

class AnalyticsService {
  async getEfficiencyForPlayerSeason(oyuncuId, sezonId) {
    return await analyticsRepository.getEfficiencyForPlayerSeason(
      oyuncuId,
      sezonId
    );
  }

  async getFinishingRateForPlayerSeason(oyuncuId, sezonId) {
    return await analyticsRepository.getFinishingRateForPlayerSeason(
      oyuncuId,
      sezonId
    );
  }
}

export default new AnalyticsService();


