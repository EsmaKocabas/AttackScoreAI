import db from "../database/index.js";

class PlayerRepository {
  async findAll() {
    const { rows } = await db.query("SELECT * FROM oyuncular");
    return rows;
  }

  async findById(id) {
    const { rows } = await db.query(
      "SELECT * FROM oyuncular WHERE oyuncuid = $1",
      [id]
    );
    return rows[0];
  }
}

export default new PlayerRepository();
