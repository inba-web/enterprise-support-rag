import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import { initializePineconeIndex } from "./services/pinecone.service.js";

// Load environment variables (from backend/.env if available)
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Pinecone Vector DB Index
initializePineconeIndex();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(`💥 Unhandled Rejection Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
