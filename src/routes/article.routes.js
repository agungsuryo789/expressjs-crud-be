import { Router } from "express";
import { createArticle, getArticlesBySlug, getAllArticles, deleteArticle } from "../controllers/article.controller.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

router.post("/articles", authMiddleware, createArticle);
router.get("/articles", getAllArticles);
router.get("/articles/:slug", getArticlesBySlug);
router.delete("/articles/:id", authMiddleware, deleteArticle);

export default router;
