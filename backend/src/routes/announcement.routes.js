import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  createAnnouncementController,
  getAnnouncements,
  markRead,
  pinAnnouncement,
  deleteAnnouncementController,
} from "../controllers/announcement.controller.js";

const router = Router();

/* CREATE */
router.post("/", authMiddleware, createAnnouncementController);

/* LIST */
router.get("/", authMiddleware, getAnnouncements);

/* MARK READ */
router.post("/:id/read", authMiddleware, markRead);

/* PIN / UNPIN */
router.patch("/:id/pin", authMiddleware, pinAnnouncement);

/* DELETE */
router.delete("/:id", authMiddleware, deleteAnnouncementController);

export default router;
