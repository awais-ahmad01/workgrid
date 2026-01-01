import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getNotifications, markRead, markAllReadController } from "../controllers/notificationController.js";

const router = Router();

router.get("/", authMiddleware, getNotifications);
router.post("/:id/read", authMiddleware, markRead);
router.post("/read-all", authMiddleware, markAllReadController);

export default router;

