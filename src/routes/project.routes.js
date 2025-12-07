import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.js";
import { createProject, getProjectById, getAllProjects, deleteProject, updateProject } from "../controllers/project.controller.js";

const router = Router();

router.post("/projects", authMiddleware, createProject);
router.get("/projects", getAllProjects);
router.get("/projects/:slug", getProjectById);
router.delete("/projects/:id", authMiddleware, deleteProject);
router.put("/projects/:id", authMiddleware, updateProject);

export default router;