import db from "../database/index.js";

class AnalyticsRepository {
  /**
   * fn_VerimlilikHesapla kullanarak bir oyuncunun ilgili sezondaki
   * 90 dakika başına skor katkısını hesaplar.
   */
  async getEfficiencyForPlayerSeason(oyuncuId, sezonId) {
    const { rows } = await db.query(
      `
      SELECT 
        fn_VerimlilikHesapla(t.gol, t.asist, t.dakika) AS verimlilik
      FROM performans_temel t
      WHERE t.oyuncuid = $1 AND t.sezonid = $2
      `,
      [oyuncuId, sezonId]
    );
    return rows[0]?.verimlilik ?? null;
  }

  /**
   * fn_BitiricilikOrani kullanarak bir oyuncunun bitiricilik oranını hesaplar.
   * Basit bir örnek: mevcut tablolardan toplam şut için sut_per90 * mac_sayisi kullanılır.
   */
  async getFinishingRateForPlayerSeason(oyuncuId, sezonId) {
    const { rows } = await db.query(
      `
      SELECT 
        fn_BitiricilikOrani(
          t.gol,
          d.sut_per90,
          t.macsayisi
        ) AS bitiricilik_orani
      FROM performans_temel t
      JOIN performans_detay d 
        ON d.oyuncuid = t.oyuncuid AND d.sezonid = t.sezonid
      WHERE t.oyuncuid = $1 AND t.sezonid = $2
      `,
      [oyuncuId, sezonId]
    );
    return rows[0]?.bitiricilik_orani ?? null;
  }
}

export default new AnalyticsRepository();


