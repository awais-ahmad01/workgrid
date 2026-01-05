import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  getProgressDashboard,
  getWorkloadBreakdown,
} from "../controllers/progressController.js";

const router = Router();

// All progress routes require authentication
router.get("/dashboard", authMiddleware, getProgressDashboard);
router.get("/workload", authMiddleware, getWorkloadBreakdown);

export default router;

