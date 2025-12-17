import PredictionService from "../../services/prediction.service.js";

export const createPrediction = async (req, res) => {
    try{
        const { oyuncuid } = req.body;

        if(!oyuncuid){
            return res.status(400).json({ error: "Oyuncu ID zorunludur" });
        }

        const prediction = await PredictionService.predictForPlayer(oyuncuid);
        return res.status(201).json(prediction);
        
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }

};

export const getPredictionHistoryForPlayer = async (req, res) => {
  try {
    const { playerId } = req.params;

    if (!playerId) {
      return res.status(400).json({
        success: false,
        error: "Oyuncu ID zorunludur",
      });
    }

    const history =
      await PredictionService.getPredictionHistoryForPlayer(playerId);

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

export const getAllPredictions = async (req, res) => {
  try {
    const predictions = await PredictionService.getAllPredictions();
    return res.status(200).json(predictions);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
