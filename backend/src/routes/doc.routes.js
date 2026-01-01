import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  createProjectDoc,
  getProjectDocs,
  getDoc,
  updateProjectDoc,
  deleteProjectDoc,
} from "../controllers/doc.controller.js";

const router = Router();

router.post("/:projectId/docs", authMiddleware, createProjectDoc);
router.get("/:projectId/docs", authMiddleware, getProjectDocs);
router.get("/docs/:docId", authMiddleware, getDoc);
router.put("/docs/:docId", authMiddleware, updateProjectDoc);
router.delete("/docs/:docId", authMiddleware, deleteProjectDoc);

export default router;
