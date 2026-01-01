// import { Router } from "express";
// import { authMiddleware } from "../middlewares/auth.middleware.js";
// import { handshakeFile, confirmFileUpload, getFiles, deleteFileController } from "../controllers/fileController.js";

// const router = Router();

// router.post("/:id/files/handshake", authMiddleware, handshakeFile);
// router.post("/:id/files/confirm", authMiddleware, confirmFileUpload);
// router.get("/:id/files", authMiddleware, getFiles);
// router.delete("/:id/files/:fileId", authMiddleware, deleteFileController);


// export default router;









import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  taskFileHandshake,
  confirmTaskFileUpload,
  getTaskFiles,
  deleteTaskFile,
} from "../controllers/fileController.js";

const router = Router();

router.post("/:taskId/files/handshake", authMiddleware, taskFileHandshake);
router.post("/:taskId/files/confirm", authMiddleware, confirmTaskFileUpload);
router.get("/:taskId/files", authMiddleware, getTaskFiles);
router.delete("/:taskId/files/:fileId", authMiddleware, deleteTaskFile);

export default router;
