import db from "../database/index.js";

class PerformanceRepository {
  /**
   * Python veya başka ETL süreçlerinden gelen performans verisini
   * sp_PerformansKaydet prosedürü ile upsert eder.
   */
  async upsertPerformance({
    oyuncuId,
    sezonId,
    takimId,
    mac,
    gol,
    asist,
    dakika,
    xg,
    gol90,
    asist90,
    sut90,
    isabetSut90,
    golSutOran,
    skorKatki,
  }) {
    await db.query(
      "CALL sp_PerformansKaydet($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)",
      [
        oyuncuId,
        sezonId,
        takimId,
        mac,
        gol,
        asist,
        dakika,
        xg,
        gol90,
        asist90,
        sut90,
        isabetSut90,
        golSutOran,
        skorKatki,
      ]
    );
  }
}

export default new PerformanceRepository();


