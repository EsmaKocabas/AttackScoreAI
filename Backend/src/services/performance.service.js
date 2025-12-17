import performanceRepository from "../repositories/performance.repository.js";

class PerformanceService {
  /**
   * Performans verisini stored procedure üzerinden upsert eder.
   * Bu servis, ileride API veya batch job'lar tarafından çağrılabilir.
   */
  async upsertPerformance(data) {
    await performanceRepository.upsertPerformance(data);
  }
}

export default new PerformanceService();


