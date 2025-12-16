import playerRepository from "../repositories/player.repository.js";


class PlayerService {
  async getAllPlayers() {
    return await playerRepository.findAll();
  }

  async getPlayerById(id) {
    return await playerRepository.findById(id);
  }
}

export default new PlayerService();
