import express from "express";
import { 
  createPrediction, 
  getPredictionForPlayer,
  getPredictionHistoryForPlayer,
  getAllPredictions,
  getAllPredictionsFiltered,
  // 🆕 YENİ: predictManual eklendi
  predictManual
} from "../controllers/prediction.controller.js";

const router = express.Router();
router.post("/", createPrediction);
// 🆕 YENİ: Manuel rating tahmini endpoint'i eklendi
router.post("/manual", predictManual); // Manuel rating tahmini
router.get("/player/:playerId", getPredictionForPlayer); // Yeni rating oluştur
router.get("/history/player/:playerId", getPredictionHistoryForPlayer); // Geçmişi getir
router.get("/admin/all", getAllPredictions);
router.get("/admin/filtered", getAllPredictionsFiltered);
export default router;