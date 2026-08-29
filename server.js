import express from "express";
import cors from "cors";
import "./config/env.js";
import connectDB from "./config/db.js";
import registerRoutes from "./src/routes/index.js";



const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors(
    {
      origin: [
        "http://localhost:3000",
      ],
      credentials: true
    }
  )
);

connectDB();

registerRoutes(app);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Boilersplates Server running on port ${PORT}`);
});
