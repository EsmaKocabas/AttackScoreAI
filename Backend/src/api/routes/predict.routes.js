import express from "express";
import { createPrediction } from "../controllers/prediction.controller.js";

const router = express.Router();
router.post("/", createPrediction);

export default router;