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

    async getAllUsers(){
        return await authRepository.getAllUsers();
    }

    async findById(appUserId){
        return await authRepository.findById(appUserId);
    }

    async updateUser(appUserId, updateData){
        return await authRepository.updateUser(appUserId, updateData);
    }

    async deleteUser(appUserId){
        return await authRepository.deleteUser(appUserId);
    }
}

export default new AuthService();