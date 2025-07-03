import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Season from "../models/Season";
import Score from "../models/Score";
import { sendGorToWallet } from "../services/rewardService";
import mongoose from "mongoose";

// POST /api/arena/join
export const joinArena = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { wallet, txSignature } = req.body;

  let season = await Season.findOne({ status: "open" });

  if (!season) {
    season = await Season.create({
      startTime: new Date(),
      endTime: new Date(Date.now() + 5 * 60 * 1000), // 5 mins default
    });
  }

  const alreadyJoined = season.participants.find((p) => p.wallet === wallet);
  if (alreadyJoined) {
    res.status(400).json({ status: "error", message: "Already joined this season." });
    return;
  }

  season.participants.push({ wallet, txSignature });
  season.totalPool += season.entryFee;
  await season.save();

  res.status(200).json({ status: "success", message: "Joined arena", seasonId: season._id });
});

export const getArenaStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { wallet } = req.query;

  // Fetch the currently open season
  const season = await Season.findOne({ status: "open" });

  // ✅ Exit early if no open season
  if (!season) {
    res.status(200).json({
      status: "success",
      data: {
        currentSeason: null,
        hasJoined: false,
        playerCount: 0,
        totalPool: 0,
      },
    });
    return;
  }

  // ✅ TypeScript now knows 'season' is not null from here on
  const hasJoined = wallet
    ? season.participants.some((p) => p.wallet === wallet)
    : false;

  res.status(200).json({
    status: "success",
    data: {
      currentSeason: season._id,
      hasJoined,
      playerCount: season.participants.length,
      totalPool: season.totalPool,
    },
  });
});

// POST /api/arena/submit-score
export const submitArenaScore = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { wallet, score, seasonId } = req.body;

  const season = await Season.findById(seasonId);
  if (!season || season.status !== "open") {
    res.status(400).json({ status: "error", message: "Season is not open or invalid." });
    return;
  }

  await Score.create({ wallet, score, seasonId });

  res.status(200).json({ status: "success", message: "Score submitted" });
});

// GET /api/arena/leaderboard/:seasonId
export const getCurrentLeaderboard = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { seasonId } = req.params;

  const scores = await Score.aggregate([
    { $match: { seasonId } }, // no ObjectId casting
    { $sort: { score: -1 } },
    { $group: { _id: "$wallet", score: { $first: "$score" } } },
    { $sort: { score: -1 } },
    { $limit: 10 },
  ]);

  res.status(200).json({ status: "success", data: scores });
});

// POST /api/arena/close-season/:seasonId
export const closeSeason = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { seasonId } = req.params;

  const season = await Season.findById(seasonId);
  if (!season || season.status !== "open") {
    res.status(400).json({ status: "error", message: "Season already closed or invalid." });
    return;
  }

  const scores = await Score.aggregate([
    { $match: { seasonId: new mongoose.Types.ObjectId(seasonId) } },
    { $sort: { score: -1 } },
    { $group: { _id: "$wallet", score: { $first: "$score" } } },
    { $sort: { score: -1 } },
    { $limit: 3 },
  ]);

  const pool = season.totalPool;
  const rewardPercents = [0.6, 0.3, 0.1];

  const winners: {
    wallet: string;
    score: number;
    reward: number;
    txSignature: string;
  }[] = [];

  for (let i = 0; i < scores.length; i++) {
    const rewardAmount = pool * rewardPercents[i];
    const txSignature = await sendGorToWallet(scores[i]._id, rewardAmount);
    winners.push({
      wallet: scores[i]._id,
      score: scores[i].score,
      reward: rewardAmount,
      txSignature,
    });
  }

  season.status = "closed";
  season.set("winners", winners);
  await season.save();

  res.status(200).json({
    status: "success",
    message: "Season closed and rewards distributed",
    winners,
  });
});
