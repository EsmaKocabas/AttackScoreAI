import db from "../database/index.js";

class PredictionRepository {
  async savePrediction(oyuncuId, golKraliOlasiligi) {
    const { rows } = await db.query(
      `
      INSERT INTO tahminler (oyuncuid, golkraliolasiligi, tahmintarihi)
      VALUES ($1, $2, NOW())
      RETURNING *
      `,
      [oyuncuId, golKraliOlasiligi]
    );
    return rows[0];
  }

  async getPredictionsByPlayerId(oyuncuId) {
    const { rows } = await db.query(
      `
      SELECT 
        tahminid,
        oyuncuid,
        golkraliolasiligi,
        tahmintarihi
      FROM tahminler
      WHERE oyuncuid = $1
      ORDER BY tahmintarihi DESC
      `,
      [oyuncuId]
    );
    return rows;
  }

  async getAllPredictions() {
    const { rows } = await db.query(`
      SELECT 
        t.tahminid,
        t.oyuncuid,
        o.adsoyad,
        t.golkraliolasiligi,
        t.tahmintarihi
      FROM tahminler t
      JOIN oyuncular o ON o.oyuncuid = t.oyuncuid
      ORDER BY t.tahmintarihi DESC
    `);
    return rows;
  }
  
}


export default new PredictionRepository();
