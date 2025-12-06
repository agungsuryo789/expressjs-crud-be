import { Router } from "express";
import { login, me, resetPassword } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

router.post("/login", login);
router.get("/me", authMiddleware, me);
router.post("/reset-password", authMiddleware, resetPassword);

export default router;
