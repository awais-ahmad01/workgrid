import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { postComment, getComments } from "../controllers/commentController.js";

const router = Router();

router.post("/:id/comments", authMiddleware, postComment);
router.get("/:id/comments", authMiddleware, getComments);

export default router;

