import express from "express";

import {
  getPlayers,
  getPlayer,
  getPlayerEfficiency,
  getPlayerFinishingRate,
} from "../controllers/player.controller.js";

const router = express.Router();

router.get("/", getPlayers);
router.get("/:id", getPlayer);

// SQL fonksiyonlarını kullanan analytics endpoint'leri
router.get("/:id/efficiency", getPlayerEfficiency);
router.get("/:id/finishing-rate", getPlayerFinishingRate);

export default router;