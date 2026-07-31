import fs from "fs";
import Document from "../models/Document.js";
import { processDocumentBackground, deleteDocumentVectors } from "../services/rag.service.js";

// @desc    Upload new document file
// @route   POST /api/documents/upload
// @access  Public (Admin console simulated)
export const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error("Please select a file to upload.");
    }

    const doc = await Document.create({
      originalName: req.file.originalname,
      fileName: req.file.filename,
      mimeType: req.file.mimetype,
      path: req.file.path,
      size: req.file.size,
      status: "uploaded"
    });

    // Start background processing (PDF parse -> Chunking -> Embedding -> Pinecone indexing)
    processDocumentBackground(doc._id);

    res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      documentId: doc._id,
      document: doc
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all uploaded documents list
// @route   GET /api/documents
// @access  Public
export const getDocuments = async (req, res, next) => {
  try {
    const documents = await Document.find({}).sort({ createdAt: -1 });
    res.status(200).json(documents);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete document (disk unlinking & database deletion)
// @route   DELETE /api/documents/:id
// @access  Public (Admin console simulated)
export const deleteDocument = async (req, res, next) => {
  try {
    const doc = await Document.findById(req.params.id);

    if (!doc) {
      res.status(404);
      throw new Error("Document not found");
    }

    // Delete indexed vectors from Pinecone
    await deleteDocumentVectors(doc._id);

    // Try unlinking local file
    try {
      if (fs.existsSync(doc.path)) {
        await fs.promises.unlink(doc.path);
        console.log(`🗑️ Unlinked file from disk: ${doc.path}`);
      } else {
        console.warn(`⚠️ File not found on disk during deletion: ${doc.path}`);
      }
    } catch (fsError) {
      console.error(`❌ Error unlinking file: ${fsError.message}`);
    }

    // Remove from MongoDB
    await doc.deleteOne();

    res.status(200).json({
      success: true,
      message: "Document deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};
