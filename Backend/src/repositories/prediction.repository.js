import db from "../database/index.js";

class PredictionRepository {
    async savePrediction(oyuncuid, golkraliolasiligi) {
        const { rows } = await db.query(
            `INSERT INTO tahminler (oyuncuid, golkraliolasiligi)
            VALUES ($1, $2)
            RETURNING *`,
            [oyuncuid, golkraliolasiligi]
        );
        return rows[0];
    }
}

export default new PredictionRepository();