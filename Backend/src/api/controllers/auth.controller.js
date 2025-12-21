import AuthService from "../../services/auth.service.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const createUser = async (req, res) => {
    try{
        const { kullaniciadi, sifrehash, rol, email } = req.body;

        if(!kullaniciadi || !sifrehash || !rol || !email){
            return res.status(400).json({ error: "Tüm alanlar zorunludur" });
        }

        if(!process.env.JWT_SECRET){
            return res.status(500).json({ error: "JWT_SECRET environment variable tanımlı değil" });
        }

        // Kullanıcı adı kontrolü
        const existingUser = await AuthService.findByUsername(kullaniciadi);
        if(existingUser){
            return res.status(409).json({ error: "Bu kullanıcı adı zaten kullanılıyor" });
        }

        // Email kontrolü
        const existingEmail = await AuthService.findByEmail(email);
        if(existingEmail){
            return res.status(409).json({ error: "Bu e-posta adresi zaten kayıtlı" });
        }

        const hashedPassword = await bcrypt.hash(sifrehash, 10);
        const user = await AuthService.createUser({ kullaniciadi, sifrehash: hashedPassword, rol, email });
        const token = jwt.sign({ userId: user.appuserid }, process.env.JWT_SECRET, { expiresIn: "1h" });
        return res.status(201).json({ user, token });
    }
    catch(error){
        // Duplicate key hatası kontrolü
        if(error.code === '23505' || error.message.includes('duplicate key') || error.message.includes('unique constraint')){
            if(error.message.includes('kullaniciadi')){
                return res.status(409).json({ error: "Bu kullanıcı adı zaten kullanılıyor" });
            }
            if(error.message.includes('email')){
                return res.status(409).json({ error: "Bu e-posta adresi zaten kayıtlı" });
            }
            return res.status(409).json({ error: "Bu kayıt zaten mevcut" });
        }
        return res.status(500).json({ error: error.message });
    }
};


export const login = async (req, res) => {
    try{
        const { email, sifrehash } = req.body;

        if(!email || !sifrehash){
            return res.status(400).json({ error: "Email ve şifre zorunludur" });
        }

        if(!process.env.JWT_SECRET){
            return res.status(500).json({ error: "JWT_SECRET environment variable tanımlı değil" });
        }

        // Email ile kullanıcıyı bul
        const user = await AuthService.findByEmail(email);
        if(!user){
            return res.status(401).json({ error: "Email veya şifre hatalı" });
        }

        // Şifreyi kontrol et
        const passwordMatch = await bcrypt.compare(sifrehash, user.sifrehash);
        if(!passwordMatch){
            return res.status(401).json({ error: "Email veya şifre hatalı" });
        }

        const token = jwt.sign({ userId: user.appuserid }, process.env.JWT_SECRET, { expiresIn: "1h" });
        return res.status(200).json({ user, token });    
    }
    catch(error){
        return res.status(500).json({ error: error.message });
    }
};

export const getAllUsers = async (req, res) => {
    try{
        const users = await AuthService.getAllUsers();
        return res.status(200).json(users);
    }
    catch(error){
        return res.status(500).json({ error: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { kullaniciadi, email, rol, sifrehash } = req.body;

        if (!id) {
            return res.status(400).json({ error: "Kullanıcı ID zorunludur" });
        }

        // Kullanıcının var olup olmadığını kontrol et
        const existingUser = await AuthService.findById(id);
        if (!existingUser) {
            return res.status(404).json({ error: "Kullanıcı bulunamadı" });
        }

        const updateData = {};

        // Kullanıcı adı güncelleme kontrolü
        if (kullaniciadi !== undefined) {
            if (kullaniciadi !== existingUser.kullaniciadi) {
                const userWithSameUsername = await AuthService.findByUsername(kullaniciadi);
                if (userWithSameUsername && userWithSameUsername.appuserid !== parseInt(id)) {
                    return res.status(409).json({ error: "Bu kullanıcı adı zaten kullanılıyor" });
                }
            }
            updateData.kullaniciadi = kullaniciadi;
        }

        // Email güncelleme kontrolü
        if (email !== undefined) {
            if (email !== existingUser.email) {
                const userWithSameEmail = await AuthService.findByEmail(email);
                if (userWithSameEmail && userWithSameEmail.appuserid !== parseInt(id)) {
                    return res.status(409).json({ error: "Bu e-posta adresi zaten kayıtlı" });
                }
            }
            updateData.email = email;
        }

        // Rol kontrolü
        if (rol !== undefined) {
            if (rol !== 'admin' && rol !== 'user') {
                return res.status(400).json({ error: "Rol 'admin' veya 'user' olmalıdır" });
            }
            updateData.rol = rol;
        }

        // Şifre güncelleme
        if (sifrehash !== undefined) {
            if (sifrehash.length < 6) {
                return res.status(400).json({ error: "Şifre en az 6 karakter olmalıdır" });
            }
            const hashedPassword = await bcrypt.hash(sifrehash, 10);
            updateData.sifrehash = hashedPassword;
        }

        // En az bir alan güncellenmeli
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ error: "Güncellenecek en az bir alan belirtilmelidir" });
        }

        const updatedUser = await AuthService.updateUser(id, updateData);
        return res.status(200).json({ 
            success: true,
            message: "Kullanıcı başarıyla güncellendi",
            user: updatedUser 
        });
    } catch (error) {
        // Duplicate key hatası kontrolü
        if (error.code === '23505' || error.message.includes('duplicate key') || error.message.includes('unique constraint')) {
            if (error.message.includes('kullaniciadi')) {
                return res.status(409).json({ error: "Bu kullanıcı adı zaten kullanılıyor" });
            }
            if (error.message.includes('email')) {
                return res.status(409).json({ error: "Bu e-posta adresi zaten kayıtlı" });
            }
            return res.status(409).json({ error: "Bu kayıt zaten mevcut" });
        }
        return res.status(500).json({ error: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "Kullanıcı ID zorunludur" });
        }

        // Kullanıcının var olup olmadığını kontrol et
        const existingUser = await AuthService.findById(id);
        if (!existingUser) {
            return res.status(404).json({ error: "Kullanıcı bulunamadı" });
        }

        // Kendi hesabını silmeyi engelle (opsiyonel - gerekirse kaldırılabilir)
        // if (req.user && req.user.userId === parseInt(id)) {
        //     return res.status(403).json({ error: "Kendi hesabınızı silemezsiniz" });
        // }

        await AuthService.deleteUser(id);
        return res.status(200).json({ 
            success: true,
            message: "Kullanıcı başarıyla silindi" 
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};