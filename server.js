import express from "express";
import cors from "cors";
import "./config/env.js";
import connectDB from "./config/db.js";



const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors(
    {
      origin: [
        "http://localhost:5173",
      ],
      credentials: true
    }
  )
);

connectDB();

app.get("/", (req, res) => {
  res.send('Boilerplates API Running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Boilersplates Server running on port ${PORT}`);
});
