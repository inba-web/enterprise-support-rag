import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema(
  {
    originalName: {
      type: String,
      required: true,
      trim: true
    },
    fileName: {
      type: String,
      required: true,
      unique: true
    },
    mimeType: {
      type: String,
      required: true,
      enum: ["application/pdf"]
    },
    path: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true // file size in bytes
    },
    status: {
      type: String,
      required: true,
      enum: ["uploaded", "processed", "failed"],
      default: "uploaded"
    }
  },
  {
    timestamps: true
  }
);

const Document = mongoose.model("Document", DocumentSchema);

export default Document;
