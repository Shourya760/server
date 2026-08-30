import multer from "multer";

import express from "express";
import { create_article } from "../controllers/article_controller.js";
import { authenticate } from "../middleware/authmiddleware.js";


const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
})

router.post("/create_article", upload.single("banner"), authenticate, create_article);



export default router;