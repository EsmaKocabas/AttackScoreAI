import db from "../database/index.js";

class AuthRepository {
    async findByUsername(kullaniciadi) {
        const { rows } = await db.query(
            `SELECT * FROM appkullanicilar WHERE kullaniciadi = $1`,
            [kullaniciadi]
        );
        return rows[0];
    }

    async findByEmail(email) {
        const { rows } = await db.query(
            `SELECT * FROM appkullanicilar WHERE email = $1`,
            [email]
        );
        return rows[0];
    }

    async createUser(user) {
        const { rows } = await db.query(
            `INSERT INTO appkullanicilar (kullaniciadi, sifrehash, rol, email) 
            VALUES ($1, $2, $3, $4) 
            RETURNING *`,
            [user.kullaniciadi, user.sifrehash, user.rol, user.email]
        );
        return rows[0];
    }

}

export default new AuthRepository();    