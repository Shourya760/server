import express from "express";
import { authenticate } from "../middleware/authmiddleware.js";
import { create_comment, delete_comment, get_comments, update_comment } from "../controllers/comment_controller.js";




const router = express.Router();




router.post("/create_comment", authenticate, create_comment);
router.get("/get_comments", get_comments);
router.put("/update_comment", authenticate, update_comment);
router.delete("/delete_comment", authenticate, delete_comment)

export default router;