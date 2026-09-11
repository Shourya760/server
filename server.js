import express from "express";
import cors from "cors";
import "./config/env.js";
import connectDB from "./config/db.js";
import registerRoutes from "./src/routes/index.js";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const allowedOrigins = [
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman)
      if (!origin) return callback(null, true);

      // Allow any localhost or 127.0.0.1 port (standard for local frontend dev)
      if (/^http:\/\/localhost(:\d+)?$/.test(origin) || /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }

      // Check configured CLIENT_URL
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // In production reject unlisted origins
      if (process.env.NODE_ENV === "production") {
        return callback(new Error(`CORS blocked for origin: ${origin}`));
      }

      return callback(null, true);
    },
    credentials: true,
  })
);

// Register API routes
registerRoutes(app);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled Server Error:", err?.message || err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Boilerplate Server running on port ${PORT}`);
  });
};

startServer();
