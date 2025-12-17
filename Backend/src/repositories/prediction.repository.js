import db from "../database/index.js";

class PredictionRepository {
  /**
   * Tahmini veritabanına kaydeder.
   * Artık doğrudan INSERT yerine sp_TahminKaydet prosedürünü kullanıyoruz.
   */
  async savePrediction(oyuncuId, golKraliOlasiligi) {
    // Stored procedure ile upsert
    await db.query("CALL sp_TahminKaydet($1, $2)", [
      oyuncuId,
      golKraliOlasiligi,
    ]);

    // Son kaydı geri döndür (servis/frontende uyum için)
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
      LIMIT 1
      `,
      [oyuncuId]
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
  

  async getAllPredictionsFiltered({ oyuncuAdi, startDate, endDate }) {
    let query = `
      SELECT 
        t.tahminid,
        t.oyuncuid,
        o.adsoyad,
        t.golkraliolasiligi,
        t.tahmintarihi
      FROM tahminler t
      JOIN oyuncular o ON o.oyuncuid = t.oyuncuid
      WHERE 1=1
    `;
  
    const values = [];
    let index = 1;
  
    if (oyuncuAdi) {
      query += ` AND LOWER(o.adsoyad) LIKE $${index++}`;
      values.push(`%${oyuncuAdi.toLowerCase()}%`);
    }
  
    if (startDate) {
      query += ` AND t.tahmintarihi >= $${index++}`;
      values.push(startDate);
    }
  
    if (endDate) {
      query += ` AND t.tahmintarihi <= $${index++}`;
      values.push(endDate);
    }
  
    query += ` ORDER BY t.tahmintarihi DESC`;
  
    const { rows } = await db.query(query, values);
    return rows;
  }
  
}


export default new PredictionRepository();
