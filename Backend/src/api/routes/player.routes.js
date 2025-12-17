import express from "express";

import {
  getPlayers,
  getPlayer,
  getPlayerEfficiency,
  getPlayerFinishingRate,
} from "../controllers/player.controller.js";

const router = express.Router();

router.get("/", getPlayers);

// SQL fonksiyonlarını kullanan analytics endpoint'leri (önce spesifik route'lar)
router.get("/:id/efficiency", getPlayerEfficiency);
router.get("/:id/finishing-rate", getPlayerFinishingRate);

// Genel oyuncu detay route'u (en son)
router.get("/:id", getPlayer);

export default router;