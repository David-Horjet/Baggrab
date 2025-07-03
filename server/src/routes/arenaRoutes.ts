import express from "express";
import { joinArena, submitArenaScore, getCurrentLeaderboard, closeSeason, getArenaStatus } from "../controllers/arenaController";

const router = express.Router();

router.post("/join", joinArena);
router.get("/status", getArenaStatus);
router.post("/submit-score", submitArenaScore);
router.get("/leaderboard/:seasonId", getCurrentLeaderboard);
router.post("/close-season/:seasonId", closeSeason); // can later automate this

export default router;
