import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";

import scoreRoutes from "./src/routes/scoreRoutes";
import healthRoutes from "./src/routes/healthRoute";
import arenaRoutes from "./src/routes/arenaRoutes";
import { errorHandler } from "./src/utils/errorHandler";
import { setupWebSocket } from "./src/ws/wsServer";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/health", healthRoutes);
app.use("/api", scoreRoutes);
app.use("/api/arena", arenaRoutes);

// Error handler
app.use(errorHandler);

// Create HTTP server and setup WebSocket
const server = http.createServer(app);
setupWebSocket(server);

// Connect to MongoDB and start the server
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    console.log("MongoDB connected");
    server.listen(PORT, () => {
      console.log(`✅ WebSocket server running`);
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("DB Error:", err));
