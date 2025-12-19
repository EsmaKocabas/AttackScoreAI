import express from "express";
import { 
  createPrediction, 
  getPredictionForPlayer,
  getPredictionHistoryForPlayer,
  getAllPredictions,
  getAllPredictionsFiltered,
  predictManual
} from "../controllers/prediction.controller.js";

const router = express.Router();
router.post("/", createPrediction);
router.post("/manual", predictManual);
router.get("/player/:playerId", getPredictionForPlayer);
router.get("/history/player/:playerId", getPredictionHistoryForPlayer);
router.get("/admin/all", getAllPredictions);
router.get("/admin/filtered", getAllPredictionsFiltered);
export default router;