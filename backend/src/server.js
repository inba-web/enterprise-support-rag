import dotenv from "dotenv";

// ✅ Load environment variables FIRST before any other imports.
// In ESM, static `import` statements are hoisted and evaluated before
// any code runs, so `dotenv.config()` must execute before other modules
// (which read process.env at module-load time) are imported.
dotenv.config();

// Now safe to dynamically import modules that read process.env at load time
const { default: app } = await import("./app.js");
const { default: connectDB } = await import("./config/db.js");
const { initializePineconeIndex } = await import("./services/pinecone.service.js");

// Connect to MongoDB
await connectDB();

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
