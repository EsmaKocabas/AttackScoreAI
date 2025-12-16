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
      grpcClient.PredictGoalKing({ oyuncuId }, (err, response) => {
        if (err) return reject(err);
        resolve(response);
      });
    });

    // DB’ye kaydet
    const prediction = await predictionRepository.savePrediction(oyuncuId, grpcResult.golKraliOlasiligi);
    return prediction;
  }
}

export default new PredictionService();
