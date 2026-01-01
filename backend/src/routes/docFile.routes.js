import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  docFileHandshake,
  confirmDocFileUpload,
  getDocFiles,
  deleteDocFile,
} from "../controllers/docFile.controller.js";

const router = Router();

router.post(
  "/:projectId/docs/:docId/files/handshake",
  authMiddleware,
  docFileHandshake
);
router.post(
  "/:projectId/docs/:docId/files/confirm",
  authMiddleware,
  confirmDocFileUpload
);
router.get(
  "/:projectId/docs/:docId/files",
  authMiddleware,
  getDocFiles
);
router.delete(
  "/docs/files/:fileId",
  authMiddleware,
  deleteDocFile
);

export default router;
