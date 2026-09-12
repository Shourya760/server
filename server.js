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

app.use(cors(
  {
    origin: [
      "http://localhost:5173",
    ],
    credentials: true
  }));

// Register API routes
registerRoutes(app);


const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Boilerplate Server running on port ${PORT}`);
  });
};

startServer();
