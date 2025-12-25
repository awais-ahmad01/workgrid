import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getSessionUser, getSessionModules } from "../controllers/sessionController.js";

const router = Router();

router.get("/user", authMiddleware, getSessionUser);
router.get("/modules", authMiddleware, getSessionModules);



export default router;
