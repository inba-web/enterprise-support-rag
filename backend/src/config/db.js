import mongoose from "mongoose";

global.useLocalDB = false;

const connectDB = async () => {
  try {
    console.log("🔌 Attempting to connect to MongoDB...");
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      connectTimeoutMS: 5000,
    });
    console.log(`✨ MongoDB Connected: ${conn.connection.host}`);
    global.useLocalDB = false;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn("⚠️ Falling back to local JSON database (documents.json) for storage.");
    global.useLocalDB = true;
  }
};

// Set up connection event listeners for robustness (only active if not in fallback mode)
mongoose.connection.on("disconnected", () => {
  if (!global.useLocalDB) {
    console.log("⚠️ MongoDB disconnected. Retrying...");
  }
});

mongoose.connection.on("error", (err) => {
  if (!global.useLocalDB) {
    console.error(`❌ MongoDB connection event error: ${err.message}`);
  }
});

export default connectDB;
