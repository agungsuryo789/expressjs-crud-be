import { prisma } from "../config/prisma.js";

export const createArticle = async (req, res) => {
  try {
    const { title, slug, excerpt, content, published } = req.body;

    if (!title || !slug || !content)
      return res
        .status(400)
        .json({ message: "title, slug and content are required" });

    const existing = await prisma.article.findUnique({ where: { slug } });
    if (existing)
      return res.status(409).json({ message: "Slug already in use" });

    const data = {
      title,
      slug,
      excerpt: excerpt ?? null,
      content,
      published: Boolean(published),
      publishedAt: published ? new Date() : null,
      author: { connect: { id: req.user.id } },
    };

    const article = await prisma.article.create({ data });

    return res.status(201).json({ success: true, article });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

export const getArticlesBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug) return res.status(400).json({ message: 'Slug is required' });

    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        author: {
          select: { id: true, email: true, name: true, role: true },
        },
      },
    });

    if (!article) return res.status(404).json({ message: 'Article not found' });

    return res.json({ success: true, article });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllArticles = async (req, res) => {
  try {
    const { published } = req.query;

    const where = {};
    if (published !== undefined) {
      where.published = String(published).toLowerCase() === "true";
    }

    const articles = await prisma.article.findMany({
      where,
      include: {
        author: { select: { id: true, email: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ success: true, articles });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};
