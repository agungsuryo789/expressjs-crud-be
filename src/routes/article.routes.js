import { Router } from "express";
import { createArticle, getArticlesBySlug, getAllArticles, deleteArticle, updateArticle } from "../controllers/article.controller.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

router.post("/articles", authMiddleware, createArticle);
router.get("/articles", getAllArticles);
router.get("/articles/:slug", getArticlesBySlug);
router.delete("/articles/:id", authMiddleware, deleteArticle);
router.put("/articles/:id", authMiddleware, updateArticle);

export default router;
