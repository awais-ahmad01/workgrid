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

const router = Router();

// All task routes require authentication
router.post("/", requireAuth, createTaskHandler);
router.get("/", requireAuth, listTasksHandler);
// More specific routes first
router.get("/:id/activity", requireAuth, getTaskActivityHandler);
router.get("/:id", requireAuth, getTaskHandler);
router.patch("/:id", requireAuth, updateTaskHandler);
router.delete("/:id", requireAuth, deleteTaskHandler);

export default router;
