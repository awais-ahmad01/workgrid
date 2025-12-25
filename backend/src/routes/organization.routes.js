import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { listOrganizationMembers } from "../controllers/organization.controller.js";

const router = express.Router();

router.get("/members", authMiddleware, listOrganizationMembers);

export default router;
