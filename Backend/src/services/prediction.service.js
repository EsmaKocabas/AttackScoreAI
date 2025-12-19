import grpcClient from "../integrations/gRPC/prediction.client.js";
import playerRepository from "../repositories/player.repository.js";
import predictionRepository from "../repositories/prediction.repository.js";
// 🆕 YENİ: axios ve dotenv eklendi (Attack Score API çağrısı için)
import axios from "axios";
import "dotenv/config";

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

  // 🆕 YENİ: Manuel prediction metodu eklendi
  /**
   * Manuel olarak girilen verilerle attack score tahmini yapar
   * Database'e kaydetmez, sadece tahmin döner
   */
  async predictManual({ mac, dakika, xg, sut90, isabetliSut90 }) {
    const ATTACK_SCORE_API_URL = process.env.ATTACK_SCORE_API_URL || "http://localhost:5000";
    
    // 🆕 YENİ: Timeout ayarı eklendi
    const axiosConfig = {
      timeout: 10000, // 10 saniye timeout
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      // 🔄 DEĞİŞTİRİLDİ: axios.post çağrısına axiosConfig parametresi eklendi
      const response = await axios.post(
        `${ATTACK_SCORE_API_URL}/predict`, 
        {
          Mac: parseFloat(mac) || 0,
          Dakika: parseFloat(dakika) || 0,
          xG: parseFloat(xg) || 0,
          "Sut/90": parseFloat(sut90) || 0,
          "Isabetli_Sut/90": parseFloat(isabetliSut90) || 0,
        },
        axiosConfig
      );
      // ❌ ESKİ KOD - SİLİNEBİLİR (Yorum satırına alındı):
      // const response = await axios.post(`${ATTACK_SCORE_API_URL}/predict`, {
      //   Mac: parseFloat(mac) || 0,
      //   Dakika: parseFloat(dakika) || 0,
      //   xG: parseFloat(xg) || 0,
      //   "Sut/90": parseFloat(sut90) || 0,
      //   "Isabetli_Sut/90": parseFloat(isabetliSut90) || 0,
      // });

      const attackScore = response.data.attack_score;
      
      // Attack score zaten 0-100 arasında, sadece güvenlik kontrolü yap
      const rating = Math.max(0, Math.min(100, Math.round(parseFloat(attackScore) * 10) / 10));

      return {
        rating: rating,
        attackScore: attackScore,
        model: "ATTACK_SCORE_MODEL_V1",
      };
    } catch (error) {
      console.error("Attack Score API hatası:", error);
      // 🔄 DEĞİŞTİRİLDİ: Hata yönetimi detaylandırıldı - connection error'ları için özel mesajlar eklendi
      
      // 🆕 YENİ: Bağlantı hatası kontrolü (ECONNREFUSED, ENOTFOUND, vs.)
      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        throw new Error(
          `Attack Score API'ye bağlanılamıyor. Lütfen Flask API'nin çalıştığından emin olun (${ATTACK_SCORE_API_URL}). ` +
          `Hata: ${error.message}`
        );
      }
      
      // 🆕 YENİ: Timeout hatası kontrolü
      if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
        throw new Error(`Attack Score API çağrısı zaman aşımına uğradı (${ATTACK_SCORE_API_URL})`);
      }
      
      // 🔄 DEĞİŞTİRİLDİ: HTTP response hatası kontrolü iyileştirildi
      if (error.response) {
        const errorMessage = error.response.data?.error || error.message || "Bilinmeyen hata";
        const statusCode = error.response.status;
        throw new Error(`Attack Score API çağrısı başarısız (${statusCode}): ${errorMessage}`);
      }
      
      // 🔄 DEĞİŞTİRİLDİ: Diğer hatalar için genel mesaj
      throw new Error(`Attack Score API çağrısı başarısız: ${error.message || "Bilinmeyen hata"}`);
      
      // ❌ ESKİ KOD - SİLİNEBİLİR (Yorum satırına alındı):
      // const errorMessage = error.response?.data?.error || error.message || "Bilinmeyen hata";
      // const statusCode = error.response?.status || 500;
      // throw new Error(`Attack Score API çağrısı başarısız (${statusCode}): ${errorMessage}`);
    }
  }
  
}

export default new PredictionService();
