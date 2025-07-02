import express from "express";
import { submitScore, getLeaderboard } from "../controllers/scoreController";

const router = express.Router();

router.post("/submit-score", submitScore);
router.get("/leaderboard", getLeaderboard);

export default router;
