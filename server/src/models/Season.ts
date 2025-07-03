import mongoose from "mongoose";

const seasonSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["open", "closed"],
    default: "open",
  },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  entryFee: { type: Number, default: 1 }, // 1 GOR
  participants: [
    {
      wallet: { type: String, required: true },
      joinedAt: { type: Date, default: Date.now },
      txSignature: String,
    },
  ],
  totalPool: { type: Number, default: 0 },
  winners: [
    {
      wallet: { type: String, default: null },
      score: { type: Number, default: null },
      reward: { type: Number, default: null },
      txSignature: { type: String, default: null },
    },
  ],
}, { timestamps: true });

export default mongoose.model("Season", seasonSchema);
