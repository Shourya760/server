import express from "express";
import { register_user, login_user, get_user, update_user } from "../controllers/user_controller.js";
import multer from "multer";
import { authenticate } from "../middleware/authmiddleware.js"

const router = express.Router();


const upload = multer({
    storage: multer.memoryStorage(),
});

router.post("/create_user", upload.single("profile"), register_user);
router.post("/login_user", login_user);

router.get("/get_user", authenticate, get_user);
router.put("/update_user", upload.single("profile"), authenticate, update_user)

export default router;