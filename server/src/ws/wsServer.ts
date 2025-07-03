// src/ws/wsServer.ts
import WebSocket from "ws";
import http from "http";
import Score from "../models/Score";
import mongoose from "mongoose";

let wss: WebSocket.Server;

export const setupWebSocket = (server: http.Server) => {
  wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    console.log("🔌 New client connected to WS");

    ws.on("message", async (message: string) => {
      const { type, seasonId } = JSON.parse(message);

      if (type === "subscribe_leaderboard") {
        const scores = await Score.aggregate([
          { $match: { seasonId: new mongoose.Types.ObjectId(seasonId) } },
          { $sort: { score: -1 } },
          { $group: { _id: "$wallet", score: { $first: "$score" } } },
          { $sort: { score: -1 } },
          { $limit: 10 },
        ]);

        ws.send(JSON.stringify({ type: "leaderboard_update", data: scores }));
      }
    });

    ws.on("close", () => {
      console.log("❌ Client disconnected from WS");
    });
  });

  console.log("✅ WebSocket server running");
};

export const broadcastLeaderboardUpdate = async (seasonId: string) => {
  const scores = await Score.aggregate([
    { $match: { seasonId: new mongoose.Types.ObjectId(seasonId) } },
    { $sort: { score: -1 } },
    { $group: { _id: "$wallet", score: { $first: "$score" } } },
    { $sort: { score: -1 } },
    { $limit: 10 },
  ]);

  const message = JSON.stringify({ type: "leaderboard_update", data: scores });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};
