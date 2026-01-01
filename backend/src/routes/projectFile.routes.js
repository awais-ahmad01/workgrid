import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  projectFileHandshake,
  confirmProjectFileUpload,
  getProjectFiles,
  deleteProjectFile,
} from "../controllers/projectFile.controller.js";

const router = Router();

router.post("/:projectId/files/handshake", authMiddleware, projectFileHandshake);
router.post("/:projectId/files/confirm", authMiddleware, confirmProjectFileUpload);
router.get("/:projectId/files", authMiddleware, getProjectFiles);
router.delete("/:projectId/files/:fileId", authMiddleware, deleteProjectFile);

export default router;
