import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  getSetupStatus,
  getProjectOverview
} from "../controllers/overview.controller.js";

const router = Router();

router.get("/setup-status", authMiddleware, getSetupStatus);
router.get("/projects/:projectId/overview", authMiddleware, getProjectOverview);

export default router;
