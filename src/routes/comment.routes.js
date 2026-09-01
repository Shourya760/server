import express from "express";
import { authenticate } from "../middleware/authmiddleware.js";
import { create_comment, get_comments } from "../controllers/comment_controller.js";




const router = express.Router();




router.post("/create_comment", authenticate, create_comment);
router.get("/get_comments", get_comments)


export default router;