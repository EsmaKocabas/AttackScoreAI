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

    async findById(appUserId) {
        const { rows } = await db.query(
            `SELECT * FROM appkullanicilar WHERE AppUserID = $1`,
            [appUserId]
        );
        return rows[0];
    }

    async updateUser(appUserId, updateData) {
        const updates = [];
        const values = [];
        let paramIndex = 1;

        if (updateData.kullaniciadi !== undefined) {
            updates.push(`KullaniciAdi = $${paramIndex++}`);
            values.push(updateData.kullaniciadi);
        }
        if (updateData.email !== undefined) {
            updates.push(`Email = $${paramIndex++}`);
            values.push(updateData.email);
        }
        if (updateData.rol !== undefined) {
            updates.push(`Rol = $${paramIndex++}`);
            values.push(updateData.rol);
        }
        if (updateData.sifrehash !== undefined) {
            updates.push(`SifreHash = $${paramIndex++}`);
            values.push(updateData.sifrehash);
        }

        if (updates.length === 0) {
            throw new Error("Güncellenecek alan bulunamadı");
        }

        values.push(appUserId);
        const { rows } = await db.query(
            `UPDATE appkullanicilar 
             SET ${updates.join(", ")} 
             WHERE AppUserID = $${paramIndex} 
             RETURNING *`,
            values
        );
        return rows[0];
    }

    async deleteUser(appUserId) {
        const { rows } = await db.query(
            `DELETE FROM appkullanicilar 
             WHERE AppUserID = $1 
             RETURNING *`,
            [appUserId]
        );
        return rows[0];
    }
}

export default new AuthRepository();    