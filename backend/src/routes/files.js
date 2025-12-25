import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { handshakeFile, confirmFileUpload, getFiles, deleteFileController } from "../controllers/fileController.js";

const router = Router();

router.post("/:id/files/handshake", requireAuth, handshakeFile);
router.post("/:id/files/confirm", requireAuth, confirmFileUpload);
router.get("/:id/files", requireAuth, getFiles);
router.delete("/:id/files/:fileId", requireAuth, deleteFileController);

export default router;

