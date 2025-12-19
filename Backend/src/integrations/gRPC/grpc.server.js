import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import axios from "axios";
import db from "../../database/index.js";
import 'dotenv/config'; 

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROTO_PATH = path.join(__dirname, "prediction.proto");
const PORT = process.env.GRPC_PORT || 8001;
const ATTACK_SCORE_API_URL = process.env.ATTACK_SCORE_API_URL || "http://localhost:5001";

const packageDef = protoLoader.loadSync(PROTO_PATH);
const grpcObject = grpc.loadPackageDefinition(packageDef);
const predictionPackage = grpcObject.prediction;

/**
 * Oyuncunun en son sezon performans verilerini alır
 */
async function getPlayerPerformanceData(oyuncuId) {
  const { rows } = await db.query(
    `
    SELECT 
      t.macsayisi AS mac,
      t.dakika,
      COALESCE(d.xg, 0) AS xg,
      COALESCE(d.sut_per90, 0) AS "Sut/90",
      COALESCE(d.isabetli_sut_per90, 0) AS "Isabetli_Sut/90"
    FROM performans_temel t
    LEFT JOIN performans_detay d 
      ON d.oyuncuid = t.oyuncuid AND d.sezonid = t.sezonid
    WHERE t.oyuncuid = $1
    ORDER BY t.sezonid DESC
    LIMIT 1
    `,
    [oyuncuId]
  );
  return rows[0];
}

/**
 * Attack Score API'ye istek gönderir
 */
async function callAttackScoreAPI(performanceData) {
  try {
    const response = await axios.post(`${ATTACK_SCORE_API_URL}/predict`, {
      Mac: parseFloat(performanceData.mac) || 0,
      Dakika: parseFloat(performanceData.dakika) || 0,
      xG: parseFloat(performanceData.xg) || 0,
      "Sut/90": parseFloat(performanceData["Sut/90"]) || 0,
      "Isabetli_Sut/90": parseFloat(performanceData["Isabetli_Sut/90"]) || 0,
    });

    return response.data.attack_score;
  } catch (error) {
    console.error("Attack Score API hatası:", error.message);
    throw new Error(`Attack Score API çağrısı başarısız: ${error.message}`);
  }
}

/**
 * Attack score'u 0-100 aralığına sınırlar
 * Attack score zaten 0-100 arasında olduğu için sadece güvenlik kontrolü yapıyoruz
 */
function clampToRating(attackScore) {
  // 0-100 aralığına sınırla ve 1 ondalık basamağa yuvarla
  return Math.max(0, Math.min(100, Math.round(parseFloat(attackScore) * 10) / 10));
}

async function CalculatePlayerRating(call, callback) {
  const { oyuncuId } = call.request;

  try {
    // Oyuncu performans verilerini al
    const performanceData = await getPlayerPerformanceData(oyuncuId);

    if (!performanceData) {
      return callback({
        code: grpc.status.NOT_FOUND,
        message: `Oyuncu ${oyuncuId} için performans verisi bulunamadı`,
      });
    }

    // Attack Score API'yi çağır
    const attackScore = await callAttackScoreAPI(performanceData);

    // Attack score zaten 0-100 arasında, sadece güvenlik kontrolü yap
    const rating = clampToRating(attackScore);

    callback(null, {
      rating: rating,
      model: "ATTACK_SCORE_MODEL_V1",
    });
  } catch (error) {
    console.error("CalculatePlayerRating hatası:", error);
    callback({
      code: grpc.status.INTERNAL,
      message: error.message || "Rating hesaplanırken bir hata oluştu",
    });
  }
}

function startServer() {
  const server = new grpc.Server();

  server.addService(
    predictionPackage.PredictionService.service,
    { CalculatePlayerRating }
  );    

  server.bindAsync(
    `0.0.0.0:${PORT}`,
    grpc.ServerCredentials.createInsecure(),
    () => {
      console.log(`🚀 gRPC ML Server running on port ${PORT}`);
      server.start();
    }
  );
}

startServer();
