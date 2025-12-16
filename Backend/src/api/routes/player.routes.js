import express from "express";

import { getPlayers, getPlayer } from "../controllers/player.controller.js"; 

const router = express.Router();
router.get("/", getPlayers);
router.get("/:id", getPlayer);

export default router;