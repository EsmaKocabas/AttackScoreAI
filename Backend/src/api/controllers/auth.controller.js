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

