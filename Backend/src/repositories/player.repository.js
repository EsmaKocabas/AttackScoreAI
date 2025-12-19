import db from "../database/index.js";

class PlayerRepository {
  async findAll() {
    const { rows } = await db.query(`
      SELECT 
        o.oyuncuid,
        o.adsoyad,
        o.takimid,
        t.takimadi AS takimadi,
        o.kayittarihi
      FROM oyuncular o
      LEFT JOIN takimlar t ON t.takimid = o.takimid
      ORDER BY o.oyuncuid
    `);
    return rows;
  }

  async findById(id) {
    const { rows } = await db.query(
      `
      SELECT 
        o.oyuncuid,
        o.adsoyad,
        o.takimid,
        t.takimadi AS takimadi,
        o.kayittarihi
      FROM oyuncular o
      LEFT JOIN takimlar t ON t.takimid = o.takimid
      WHERE o.oyuncuid = $1
      `,
      [id]
    );
    return rows[0];
  }

  async findByName(adsoyad) {
    const { rows } = await db.query(
      `
      SELECT 
        o.oyuncuid,
        o.adsoyad,
        o.takimid,
        t.takimadi AS takimadi,
        o.kayittarihi
      FROM oyuncular o
      LEFT JOIN takimlar t ON t.takimid = o.takimid
      WHERE LOWER(TRIM(o.adsoyad)) = LOWER(TRIM($1))
      LIMIT 1
      `,
      [adsoyad]
    );
    return rows[0];
  }
}

export default new PlayerRepository();
