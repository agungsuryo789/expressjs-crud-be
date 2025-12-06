import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.js";
import { createProject, getProjectById, getAllProjects, deleteProject } from "../controllers/project.controller.js";

const router = Router();

router.post("/projects", authMiddleware, createProject);
router.get("/projects", getAllProjects);
router.get("/projects/:id", getProjectById);
router.delete("/projects/:id", authMiddleware, deleteProject);

export default router;