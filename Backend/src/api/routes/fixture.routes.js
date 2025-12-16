import express from "express";
import { getUpcomingFplFixtures } from "../controllers/fixture.controller.js";

const router = express.Router();
router.get(
    "/external/fpl/upcoming",
    getUpcomingFplFixtures
  );
  export default router;