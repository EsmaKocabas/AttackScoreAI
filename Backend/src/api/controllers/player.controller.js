import playerService from "../../services/player.service.js";
import analyticsService from "../../services/analytics.service.js";

export const getPlayers = async (req, res) => {
  const players = await playerService.getAllPlayers();
  res.json(players);
};

export const getPlayer = async (req, res) => {
  const player = await playerService.getPlayerById(req.params.id);
  res.json(player);
};

// Yeni: oyuncu verimlilik skoru
export const getPlayerEfficiency = async (req, res) => {
  try {
    const oyuncuId = Number(req.params.id);
    const sezonId = Number(req.query.sezonId);

    if (!oyuncuId || !sezonId) {
      return res.status(400).json({
        error: "oyuncuId (param) ve sezonId (query) zorunludur",
      });
    }

    const efficiency =
      await analyticsService.getEfficiencyForPlayerSeason(
        oyuncuId,
        sezonId
      );

    return res.status(200).json({ oyuncuId, sezonId, efficiency });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Yeni: oyuncu bitiricilik oranı
export const getPlayerFinishingRate = async (req, res) => {
  try {
    const oyuncuId = Number(req.params.id);
    const sezonId = Number(req.query.sezonId);

    if (!oyuncuId || !sezonId) {
      return res.status(400).json({
        error: "oyuncuId (param) ve sezonId (query) zorunludur",
      });
    }

    const finishingRate =
      await analyticsService.getFinishingRateForPlayerSeason(
        oyuncuId,
        sezonId
      );

    return res
      .status(200)
      .json({ oyuncuId, sezonId, finishingRate });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

