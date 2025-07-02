import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Score from "../models/Score";
import { scoreSchema } from "../validators/scoreValidator";
import { sendTestTokens } from "../services/tokenService";

export const submitScore = asyncHandler(async (req: Request, res: Response) => {
  const { error } = scoreSchema.validate(req.body);
  if (error) {
    res.status(400).json({
      status: "error",
      message: "Invalid request body",
      details: error.details.map((d) => d.message),
    });
    return;
  }

  const { wallet, score } = req.body;

  if (score < 0 || score > 1000) {
    res.status(400).json({
      status: "error",
      message: "Invalid score: must be between 0 and 1000",
    });
    return;
  }

  try {
    const newScore = await Score.create({ wallet, score });

    // === Reward Logic ===
    let rewardTx: string | null = null;

    if (score >= 70) {
      rewardTx = await sendTestTokens(wallet, 1_000_000);
    } else if (score >= 50) {
      rewardTx = await sendTestTokens(wallet, 500_000);
    } else if (score >= 30) {
      rewardTx = await sendTestTokens(wallet, 200_000);
    }

    res.status(200).json({
      status: "success",
      message: "Score submitted",
      data: {
        score: newScore,
        rewardTx,
      },
    });
  } catch (err) {
    console.error("Score submission error:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to submit score",
      error: err instanceof Error ? err.message : String(err),
    });
  }
});

export const getLeaderboard = asyncHandler(async (_req: Request, res: Response) => {
  try {
    const topScores = await Score.aggregate([
      {
        $sort: { score: -1 }
      },
      {
        $group: {
          _id: "$wallet",
          highestScore: { $first: "$score" },
          createdAt: { $first: "$createdAt" }
        }
      },
      {
        $sort: { highestScore: -1 }
      },
      {
        $limit: 50
      }
    ]);

    res.status(200).json({
      status: "success",
      data: topScores
    });
  } catch (err) {
    console.error("Leaderboard error:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch leaderboard",
      error: err instanceof Error ? err.message : String(err)
    });
  }
});

