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
    async getAllUsers() {
        // Güvenli view kullanarak maskelenmiş kullanıcı bilgilerini getir
        const { rows } = await db.query(
            `SELECT 
                AppUserID AS appuserid,
                KullaniciAdi AS kullaniciadi,
                Rol AS rol,
                MaskeliEmail AS email,
                SifreDurumu AS sifredurumu
            FROM vw_GuvenliKullaniciListesi
            ORDER BY AppUserID`
        );
        return rows;
    }
}

export default new AuthRepository();    