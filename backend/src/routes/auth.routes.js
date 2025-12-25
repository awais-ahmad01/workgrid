// routes/auth.routes.js
import express from "express";
import {
  signupAdmin,
  verifyEmail,
  login,
  signupViaInvite,
    sendInvite,
  verifyInvite,
} from "../controllers/auth.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup-admin", signupAdmin);
router.get("/verify-email/:token", verifyEmail);
router.post("/login", login);
router.post("/signup-invite", signupViaInvite);

router.post("/send-invite", authMiddleware, sendInvite);
router.get("/verify-invite/:token", verifyInvite);



export default router;
