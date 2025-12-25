import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { postComment, getComments } from "../controllers/commentController.js";

const router = Router();

router.post("/:id/comments", requireAuth, postComment);
router.get("/:id/comments", requireAuth, getComments);

export default router;

