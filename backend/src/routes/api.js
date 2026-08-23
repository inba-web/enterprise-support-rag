import express from "express";
import mongoose from "mongoose";
import Document from "../models/Document.js";

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
      status: global.useLocalDB ? "local_fallback" : (statusMapping[dbStatus] || "unknown"),
      code: dbStatus
    }
  });
});

// @desc    Get dynamic workspace ingestion quotas & storage metrics
// @route   GET /api/workspace/limits
// @access  Public
router.get("/workspace/limits", async (req, res, next) => {
  try {
    const documents = await Document.find({});
    const totalSize = documents.reduce((acc, doc) => acc + doc.size, 0);
    const limitBytes = 50 * 1024 * 1024; // 50MB Workspace storage limit
    const limitDocs = 10;

    res.status(200).json({
      success: true,
      totalSize,
      limitBytes,
      documentCount: documents.length,
      limitDocs,
      percentUsed: parseFloat(((totalSize / limitBytes) * 100).toFixed(2))
    });
  } catch (error) {
    next(error);
  }
});

export default router;
