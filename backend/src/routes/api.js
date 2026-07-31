import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// @desc    Check API Health & DB Connection
// @route   GET /api/health
// @access  Public
router.get("/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const statusMapping = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting"
  };

  res.status(200).json({
    status: "OK",
    timestamp: new Date(),
    uptime: process.uptime(),
    database: {
      status: statusMapping[dbStatus] || "unknown",
      code: dbStatus
    }
  });
});

export default router;
