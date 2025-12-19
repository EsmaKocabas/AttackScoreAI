import PredictionService from "../../services/prediction.service.js";

//POST /api/predictions
export const createPrediction = async (req, res) => {
  try {
    const { playerId } = req.body;

    if (!playerId) {
      return res.status(400).json({
        success: false,
        error: "Oyuncu ID zorunludur",
      });
    }

    const prediction = await PredictionService.predictForPlayer(playerId);

    return res.status(201).json({
      success: true,
      data: prediction,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// GET /api/predictions/player/:playerId
export const getPredictionForPlayer = async (req, res) => {
  try {
    const { playerId } = req.params;

    if (!playerId) {
      return res.status(400).json({
        success: false,
        error: "Oyuncu ID zorunludur",
      });
    }

    const prediction = await PredictionService.predictForPlayer(playerId);

    return res.status(200).json({
      success: true,
      data: prediction,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

//GET /api/predictions/history/player/:playerId
export const getPredictionHistoryForPlayer = async (req, res) => {
  try {
    const { playerId } = req.params;

    if (!playerId) {
      return res.status(400).json({
        success: false,
        error: "Oyuncu ID zorunludur",
      });
    }

    const history = await PredictionService.getPredictionHistoryForPlayer(
      playerId
    );

    return res.status(200).json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

//GET /api/predictions/admin/all
export const getAllPredictions = async (req, res) => {
  try {
    const predictions = await PredictionService.getAllPredictions();

    return res.status(200).json({
      success: true,
      count: predictions.length,
      data: predictions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

//GET /api/predictions/admin/filtered
export const getAllPredictionsFiltered = async (req, res) => {
  try {
    const { oyuncuAdi, startDate, endDate } = req.query;

    const predictions = await PredictionService.getAllPredictionsFiltered({
      oyuncuAdi,
      startDate,
      endDate,
    });

    return res.status(200).json({
      success: true,
      count: predictions.length,
      data: predictions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

//POST /api/predictions/manual
export const predictManual = async (req, res) => {
  try {
    const { mac, dakika, xg, sut90, isabetliSut90, oyuncuAdi, oyuncuId } = req.body;

    if (mac === undefined || dakika === undefined || xg === undefined || 
        sut90 === undefined || isabetliSut90 === undefined) {
      return res.status(400).json({
        success: false,
        error: "Tüm alanlar zorunludur: mac, dakika, xg, sut90, isabetliSut90",
      });
    }

    const prediction = await PredictionService.predictManual({
      mac,
      dakika,
      xg,
      sut90,
      isabetliSut90,
      oyuncuAdi,
      oyuncuId, 
    });

    return res.status(200).json({
      success: true,
      data: prediction,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
