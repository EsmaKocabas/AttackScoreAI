import grpcClient from "../integrations/gRPC/prediction.client.js";
import playerRepository from "../repositories/player.repository.js";
import predictionRepository from "../repositories/prediction.repository.js";

class PredictionService {
  async predictForPlayer(oyuncuId) {
    const oyuncu = await playerRepository.findById(oyuncuId);
    if (!oyuncu) {
      throw new Error("Oyuncu bulunamadı");
    }

    // gRPC ÇAĞRISI
    const grpcResult = await new Promise((resolve, reject) => {
      grpcClient.CalculatePlayerRating({ oyuncuId }, (err, response) => {
        if (err) return reject(err);
        resolve(response);
      });
    });

    // DB'ye kaydet (rating 0-100 arası, veritabanında 0-1 aralığına normalize ediyoruz)
    const normalizedRating = grpcResult.rating / 100;
    const prediction = await predictionRepository.savePrediction(oyuncuId, normalizedRating);
    return { ...prediction, rating: grpcResult.rating, source: grpcResult.model };
  }

  async getPredictionHistoryForPlayer(oyuncuId) {
    return await predictionRepository.getPredictionsByPlayerId(oyuncuId);
  }

  async getAllPredictions() {
    return await predictionRepository.getAllPredictions();
  }
  async getAllPredictionsFiltered(filters) {
    return await predictionRepository.getAllPredictionsFiltered(filters);
  }
  
}

export default new PredictionService();
