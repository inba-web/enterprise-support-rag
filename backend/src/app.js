import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import apiRoutes from "./routes/api.js";
import documentRoutes from "./routes/document.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: "*", // Adjust as necessary for production security
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Request Logger (Development mode check)
app.use(morgan("dev"));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root landing route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the AI Support Assistant API Service." });
});

// Primary API Routes
app.use("/api", apiRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/chat", chatRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

export default app;
