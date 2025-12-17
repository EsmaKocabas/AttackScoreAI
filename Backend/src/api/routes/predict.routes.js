import express from "express";
import { createPrediction, getPredictionHistoryForPlayer,getAllPredictions,getAllPredictionsFiltered } from "../controllers/prediction.controller.js";

const router = express.Router();
router.post("/", createPrediction);
router.get("/player/:playerId", getPredictionHistoryForPlayer);
router.get("/history/player/:playerId", getPredictionHistoryForPlayer);
router.get("/admin/all", getAllPredictions);
router.get("/admin/filtered", getAllPredictionsFiltered);
export default router;