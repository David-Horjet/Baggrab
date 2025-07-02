import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema(
  {
    wallet: { type: String, required: true },
    score: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Score", scoreSchema);
