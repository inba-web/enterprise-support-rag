import express from "express";
import upload from "../middleware/upload.middleware.js";
import {
  uploadDocument,
  getDocuments,
  deleteDocument
} from "../controllers/document.controller.js";

const router = express.Router();

// Document Endpoints
router.post("/upload", upload.single("file"), uploadDocument);
router.get("/", getDocuments);
router.delete("/:id", deleteDocument);

export default router;
