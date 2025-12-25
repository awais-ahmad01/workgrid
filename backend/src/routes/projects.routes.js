import express from "express";
import {
  createProject,
  updateProject,
  deleteProject,
  listProjects,
  addProjectMembers,
  removeProjectMember,
  getProjectMembers
} from "../controllers/projects.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/project", authMiddleware, createProject);
router.get("/project", authMiddleware, listProjects);
router.put("/project/:projectId", authMiddleware, updateProject);
router.delete("/project", authMiddleware, deleteProject);
router.post("/project/:projectId/members", authMiddleware, addProjectMembers);
router.delete("/project/:projectId/members/:memberId", authMiddleware, removeProjectMember);
router.get(
  "/project/:projectId/members",
  authMiddleware,
  getProjectMembers
)


export default router;
