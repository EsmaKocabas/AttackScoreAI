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

