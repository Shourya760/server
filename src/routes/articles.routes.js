import multer from "multer";

import express from "express";
import { article_details, create_article, delete_article, my_articles, update_article } from "../controllers/article_controller.js";
import { authenticate } from "../middleware/authmiddleware.js";


const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
})

router.post("/create_article", upload.single("banner"), authenticate, create_article);
router.get("/article_details", article_details);
router.get("/my_articles", authenticate, my_articles)
router.put("/update_article", authenticate, update_article)
router.delete("/delete_article", authenticate, delete_article)

export default router;