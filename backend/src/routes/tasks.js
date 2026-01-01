import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import {
  createTaskHandler,
  listTasksHandler,
  getTaskHandler,
  updateTaskHandler,
  getTaskActivityHandler,
  deleteTaskHandler,
} from "../controllers/tasksController.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// All task routes require authentication
router.post("/", authMiddleware, createTaskHandler);
router.get("/", authMiddleware, listTasksHandler);
// More specific routes first
router.get("/:id/activity", authMiddleware, getTaskActivityHandler);
router.get("/:id", authMiddleware, getTaskHandler);
router.patch("/:id", authMiddleware, updateTaskHandler);
router.delete("/:id", authMiddleware, deleteTaskHandler);

export default router;
