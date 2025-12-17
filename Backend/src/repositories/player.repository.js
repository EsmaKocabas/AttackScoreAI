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
}

export default new PlayerRepository();
