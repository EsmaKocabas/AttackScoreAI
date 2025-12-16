import playerService from "../../services/player.service.js";

export const getPlayers = async (req, res) => {
  const players = await playerService.getAllPlayers();
  res.json(players);
};

export const getPlayer = async (req, res) => {
  const player = await playerService.getPlayerById(req.params.id);
  res.json(player);
};
