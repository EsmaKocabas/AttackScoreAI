import authRepository from "../repositories/auth.repository.js";

class AuthService{
    async findByUsername(kullaniciadi){
        return await authRepository.findByUsername(kullaniciadi);
    }

    async findByEmail(email){
        return await authRepository.findByEmail(email);
    }

    async createUser(user){
        return await authRepository.createUser(user);
    }

}

export default new AuthService();