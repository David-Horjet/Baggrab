import express from "express";

const router = express.Router();

router.get("/", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "BagGrab backend is healthy 🟢",
  });
});

export default router;
