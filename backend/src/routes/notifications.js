import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { getNotifications, markRead, markAllReadController } from "../controllers/notificationController.js";

const router = Router();

router.get("/", requireAuth, getNotifications);
router.post("/:id/read", requireAuth, markRead);
router.post("/read-all", requireAuth, markAllReadController);

export default router;

