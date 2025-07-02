import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import scoreRoutes from "./src/routes/scoreRoutes";
import healthRoutes from "./src/routes/healthRoute";
import { errorHandler } from "./src/utils/errorHandler";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/health", healthRoutes);
app.use("/api", scoreRoutes);
app.use(errorHandler);

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 5000, () => {
      console.log("Server running at http://locahost:5000");
    });
  })
  .catch((err) => console.error("DB Error:", err));
