import express from "express";
import { 
  createPrediction, 
  getPredictionForPlayer,
  getPredictionHistoryForPlayer,
  getAllPredictions,
  getAllPredictionsFiltered 
} from "../controllers/prediction.controller.js";

const router = express.Router();
router.post("/", createPrediction);
router.get("/player/:playerId", getPredictionForPlayer); // Yeni rating oluştur
router.get("/history/player/:playerId", getPredictionHistoryForPlayer); // Geçmişi getir
router.get("/admin/all", getAllPredictions);
router.get("/admin/filtered", getAllPredictionsFiltered);
export default router;